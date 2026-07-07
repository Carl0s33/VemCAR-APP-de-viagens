import React, { useState, useEffect, useRef, memo } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, User, CheckCircle, Star, MapPin, CornerUpRight, CornerUpLeft, ArrowUp,
    Menu, Power, Bell, Wallet, Route, Clock, Target, MessageSquare, X, CircleDot, ShieldAlert, Navigation
} from 'lucide-react';
import './FluxoMotorista.css';
import './TelaPainelMotorista.css';
import './TelaAlertaCorrida.css';
import './TelaNavegacaoMotorista.css';

function getBearing(start, end) {
    const [lng1, lat1] = start;
    const [lng2, lat2] = end;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

const PONTO_CARRO = [-35.43762226387801, -6.475483074012976];
const PONTO_PASSAGEIRA = [-35.43350494820496, -6.480733831089614];
const PONTO_DESTINO = [-35.44523200903737, -6.470226792030399];
const ROTACAO_CARRO_PARADO = -135;

const BotaoDeslizante = memo(({ texto, corFundo, aoCompletar }) => {
    return (
        <div className="swipe-container-matte">
            <span className="swipe-texto">{texto}</span>
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: window.innerWidth - 64 }}
                dragSnapToOrigin
                onDragEnd={(e, info) => { if (info.offset.x > 150) aoCompletar(); }}
                className="swipe-thumb-matte"
                style={{ backgroundColor: corFundo }}
            >
                <ArrowUp size={24} style={{ transform: 'rotate(90deg)' }} color="#FFF" />
            </motion.div>
        </div>
    );
});

export default function FluxoMotorista({ aoPerfil }) {
    const mapRef = useRef(null);
    const audioRef = useRef(null);
    const [fase, setFase] = useState('offline');

    const [viewState, setViewState] = useState({
        longitude: PONTO_CARRO[0],
        latitude: PONTO_CARRO[1],
        zoom: 17.5,
        pitch: 0,
        bearing: 0
    });

    const [rota, setRota] = useState([]);
    const [passos, setPassos] = useState([]);
    const [instrucaoAtual, setInstrucaoAtual] = useState(null);
    const [posicaoCarro, setPosicaoCarro] = useState(PONTO_CARRO);

    const [horaAtual, setHoraAtual] = useState("");
    const [tempoAlerta, setTempoAlerta] = useState(15);
    const [nota, setNota] = useState(0);
    const [erroOnline, setErroOnline] = useState("");

    const CADASTRO_APROVADO = false; 
    const LIMITE_INADIMPLENCIA = -20.00; 
    const saldoDevedor = -3.00; 

    const metaDiaria = 200.00;
    const ganhosHoje = 142.50;
    const progressoMeta = (ganhosHoje / metaDiaria) * 100;

    useEffect(() => {
        const atualizarHora = () => {
            const data = new Date();
            setHoraAtual(data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        };
        atualizarHora();
        const intervalo = setInterval(atualizarHora, 60000);
        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        if (fase === 'alerta') {
            if (audioRef.current) audioRef.current.play().catch(() => {});
            if (tempoAlerta > 0) {
                const timer = setTimeout(() => setTempoAlerta(tempoAlerta - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setFase('repassada'); 
                setTimeout(() => setFase('online'), 3000);
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [fase, tempoAlerta]);

    const tentarFicarOnline = () => {

        if (saldoDevedor <= LIMITE_INADIMPLENCIA) {
            setErroOnline("Conta bloqueada: O limite de taxa retida foi excedido. Faça o repasse.");
            setTimeout(() => setErroOnline(""), 4000);
            return;
        }
        setFase(fase === 'online' ? 'offline' : 'online');
    };

    const fetchRoute = async (start, end) => {
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&steps=true&overview=full`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.routes && data.routes[0]) {
                const coordenadas = data.routes[0].geometry.coordinates;
                const steps = data.routes[0].legs[0].steps;
                setRota(coordenadas);
                setPassos(steps);
                setPosicaoCarro(coordenadas[0]);
                let initialBearing = 0;
                if (coordenadas.length > 1) {
                    initialBearing = getBearing(coordenadas[0], coordenadas[1]);
                }
                setViewState(prev => ({
                    ...prev,
                    longitude: coordenadas[0][0],
                    latitude: coordenadas[0][1],
                    bearing: initialBearing
                }));
                if (steps && steps.length > 0) atualizarInstrucao(0, steps);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const atualizarInstrucao = (distPercorrida, rotaPassos = passos) => {
        let distAcumulada = 0;
        for (let passo of rotaPassos) {
            distAcumulada += passo.distance;
            if (distAcumulada > distPercorrida) {
                setInstrucaoAtual({
                    distancia: Math.round(distAcumulada - distPercorrida),
                    nomeRua: passo.name || "Rota principal",
                    tipoCurva: passo.maneuver.modifier
                });
                break;
            }
        }
    };

    useEffect(() => {
        if (rota.length < 2 || !['a_caminho', 'em_corrida'].includes(fase)) return;

        let animationFrameId;
        let currentIdx = 0;
        let progress = 0;
        let lastTime = performance.now();
        const VELOCIDADE = 0.000005; 

        const animate = (time) => {
            const dt = time - lastTime;
            lastTime = time;

            if (currentIdx >= rota.length - 1) {
                if (fase === 'a_caminho') setFase('aguardando');
                else if (fase === 'em_corrida') setFase('finalizada');
                return;
            }

            const p1 = rota[currentIdx];
            const p2 = rota[currentIdx + 1];
            const dx = p2[0] - p1[0];
            const dy = p2[1] - p1[1];
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.000001) {
                currentIdx++;
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            const passo = (VELOCIDADE * dt) / dist;
            progress += passo;

            if (progress >= 1) {
                progress = 0;
                currentIdx++;
            } else {
                const currentLng = p1[0] + dx * progress;
                const currentLat = p1[1] + dy * progress;
                const newBearing = getBearing(p1, p2);

                setPosicaoCarro([currentLng, currentLat]);

                let distPercorrida = 0;
                for (let i = 0; i < currentIdx; i++) {
                    const pt1 = rota[i];
                    const pt2 = rota[i+1];
                    distPercorrida += Math.sqrt(Math.pow(pt2[0]-pt1[0], 2) + Math.pow(pt2[1]-pt1[1], 2)) * 111000;
                }
                if (passos.length > 0) atualizarInstrucao(distPercorrida, passos);

                setViewState(prev => ({
                    ...prev,
                    longitude: currentLng,
                    latitude: currentLat,
                    bearing: newBearing
                }));
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [rota, fase]);

    const iniciarAlerta = () => { setTempoAlerta(15); setFase('alerta'); };
    const aceitarCorrida = () => { setFase('a_caminho'); fetchRoute(PONTO_CARRO, PONTO_PASSAGEIRA); };
    const iniciarCorrida = () => { setRota([]); setFase('em_corrida'); fetchRoute(PONTO_PASSAGEIRA, PONTO_DESTINO); };
    const finalizarAvaliacao = () => {
        setRota([]); setPassos([]); setInstrucaoAtual(null); setNota(0);
        setViewState(prev => ({ ...prev, bearing: 0, longitude: PONTO_DESTINO[0], latitude: PONTO_DESTINO[1] }));
        setPosicaoCarro(PONTO_DESTINO);
        setFase('online');
    };

    const getIconeManeobra = (modificador) => {
        if (!modificador) return <ArrowUp size={24} color="#00BCD4" />;
        if (modificador.includes('left')) return <CornerUpLeft size={24} color="#00BCD4" />;
        if (modificador.includes('right')) return <CornerUpRight size={24} color="#00BCD4" />;
        return <ArrowUp size={24} color="#00BCD4" />;
    };

    return (
        <div className="tela-painel-motorista">
            <div className="mapa-wrapper">
                <Map
                    ref={mapRef}
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                    interactive={false}
                    style={{ width: '100%', height: '100%' }}
                >
                    {rota.length > 0 && (
                        <Source id="rotaSource" type="geojson" data={{ type: 'Feature', geometry: { type: 'LineString', coordinates: rota } }}>
                            <Layer id="rotaLayer" type="line" paint={{ 'line-color': '#00BCD4', 'line-width': 5, 'line-opacity': 0.8 }} />
                        </Source>
                    )}

                    <Marker
                        longitude={posicaoCarro[0]}
                        latitude={posicaoCarro[1]}
                        anchor="center"
                        pitchAlignment="map"
                        rotationAlignment="map"
                        rotation={['offline', 'online', 'alerta'].includes(fase) ? ROTACAO_CARRO_PARADO : viewState.bearing}
                    >
                        <div className={`carro-marcador-container ${fase === 'online' ? 'carro-buscando' : ''}`}>
                            <svg width="60" height="90" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="26,45 -10,0 90,0 54,45" fill="rgba(255,255,255,0.4)" />
                                
                                <rect x="24" y="37" width="32" height="46" rx="8" fill="#000" />
                                <rect x="28" y="45" width="24" height="24" rx="4" fill="#333" />
                                
                                <path d="M 29 47 Q 40 41 51 47 L 50 51 Q 40 47 30 51 Z" fill="rgba(255,255,255,0.4)" />
                                <rect x="27" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
                                <rect x="45" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
                                <rect x="26" y="80" width="8" height="4" rx="2" fill="#EF4444" />
                                <rect x="46" y="80" width="8" height="4" rx="2" fill="#EF4444" />
                            </svg>
                        </div>
                    </Marker>

                    {(fase === 'a_caminho' || fase === 'aguardando') && (
                        <Marker longitude={PONTO_PASSAGEIRA[0]} latitude={PONTO_PASSAGEIRA[1]} anchor="bottom">
                            <MapPin size={32} color="#000" fill="#FFF" strokeWidth={1.5} />
                        </Marker>
                    )}
                    {(fase === 'em_corrida' || fase === 'finalizada') && (
                        <Marker longitude={PONTO_DESTINO[0]} latitude={PONTO_DESTINO[1]} anchor="bottom">
                            <MapPin size={32} color="#000" fill="#00BCD4" strokeWidth={1.5} />
                        </Marker>
                    )}
                </Map>
            </div>

            <AnimatePresence>
                {instrucaoAtual && (fase === 'a_caminho' || fase === 'em_corrida') && (
                    <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className={`painel-curva-topo ${fase === 'em_corrida' ? 'em-corrida' : ''}`}>
                        <div className="curva-icone-container">{getIconeManeobra(instrucaoAtual.tipoCurva)}</div>
                        <div className="curva-infos">
                            <div className="curva-distancia">A {instrucaoAtual.distancia}m vire à {instrucaoAtual.tipoCurva?.includes('left') ? 'esquerda' : instrucaoAtual.tipoCurva?.includes('right') ? 'direita' : 'frente'}</div>
                            <div className="curva-rua">{instrucaoAtual.nomeRua}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {['offline', 'online'].includes(fase) && (
                    <motion.div className="cabecalho-flutuante" style={{ pointerEvents: 'none' }} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
                        <button className="botao-menu" style={{ pointerEvents: 'auto' }} onClick={aoPerfil}><Menu size={20} color="#FFF" /></button>
                        
                        <div className="pilula-ganhos-topo" style={{ pointerEvents: 'auto' }}>
                            <span style={{ color: '#888', fontSize: 13, fontWeight: 700 }}>Hoje</span>
                            R$ {ganhosHoje.toFixed(2).replace('.', ',')}
                        </div>

                        <button className="botao-menu" style={{ pointerEvents: 'auto', position: 'relative' }}>
                            <MessageSquare size={20} color="#FFF" />
                            <span className="notificacao-dot" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                
                {fase === 'offline' && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}>
                        <div className="status-pill-offline">Você está offline</div>
                        <button className="btn-iniciar-gigante" onClick={tentarFicarOnline}>
                            INICIAR
                        </button>
                    </motion.div>
                )}
                
                {fase === 'online' && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}>
                        <div className="status-pill-offline" style={{ background: '#111', color: '#FFF', border: '1px solid #333' }}>
                            Procurando viagens...
                        </div>
                        <button className="btn-ficar-offline" onClick={tentarFicarOnline}>
                            <Power size={24} color="#EF4444" />
                        </button>
                        <button className="btn-simular" style={{ position: 'absolute', bottom: 120, right: 16, width: 'auto', padding: '10px 16px', background: '#1A1A1A', color: '#00BCD4', borderRadius: 20 }} onClick={iniciarAlerta}>
                            <Bell size={18} /><span>Simular Corrida</span>
                        </button>
                    </motion.div>
                )}
                {erroOnline && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'absolute', bottom: 120, left: 16, right: 16, padding: 12, background: 'rgba(239, 68, 68, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 12, color: '#FFF', fontSize: 13, textAlign: 'center', display: 'flex', alignItems: 'center', gap: 8, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.4)'}}>
                        <ShieldAlert size={18} style={{flexShrink: 0}} />
                        <span>{erroOnline}</span>
                    </motion.div>
                )}


                {fase === 'alerta' && (
                    <motion.div key="alerta" className="alerta-container-flutuante" style={{ padding: 0 }}>
                        <motion.div className="alerta-card-matte" onClick={aceitarCorrida} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
                            <button className="btn-rejeitar-discreto" onClick={(e) => { e.stopPropagation(); setFase('online'); }}><X size={20} color="#FFF" /></button>
                            
                            <div className="barra-tempo-fundo">
                                <motion.div className="barra-tempo-preenchimento" style={{ backgroundColor: tempoAlerta <= 5 ? "#EF4444" : "#00BCD4" }} animate={{ width: `${(tempoAlerta / 15) * 100}%` }} transition={{ duration: 1, ease: "linear" }} />
                            </div>
                            <div className="alerta-header">
                                <div className="alerta-tempo-preco">
                                    <h1 className="tempo-destaque" style={{ fontSize: '48px', margin: 0, fontWeight: 900 }}>3 min</h1>
                                    <p className="distancia-destaque" style={{ fontSize: '16px', color: '#888', marginTop: 4 }}>1,2 km de distância</p>
                                </div>
                                <div className="preco-estimado">
                                    <h2 style={{ fontSize: '28px', color: '#00BCD4', margin: 0 }}>R$ 14,50</h2>
                                    <p style={{ fontSize: '14px', margin: 0 }}>Dinheiro</p>
                                </div>
                            </div>
                            <div className="divisor-linha" />
                            <div className="alerta-info-passageiro">
                                <div className="info-rating"><Star size={18} fill="#F59E0B" color="#F59E0B" /><span style={{ fontSize: '14px' }}>5.0</span></div>
                                <div className="divisor-ponto" /><span className="nome-passageiro" style={{ fontSize: '16px' }}><User size={16} style={{marginRight: 6}}/> Joao Pedro</span>
                                <div className="divisor-ponto" /><span className="categoria-carro" style={{ fontSize: '14px' }}>VEM CAR</span>
                            </div>
                            <div className="alerta-locais">
                                <div className="local-linha" style={{ fontSize: '16px' }}><CircleDot size={20} color="#34C759" /><p style={{ margin: 0 }}>R. Primeiro de Maio, 42</p></div>
                                <div className="traco-conexao" style={{ marginLeft: 9, height: 16 }} />
                                <div className="local-linha" style={{ fontSize: '16px' }}><MapPin size={20} color="#00BCD4" /><p style={{ margin: 0 }}>IFRN Campus Nova Cruz</p></div>
                            </div>
                            
                            <div className="alerta-tap-texto">Tocar para aceitar</div>
                        </motion.div>
                    </motion.div>
                )}

                {fase === 'repassada' && (
                    <motion.div key="repassada" className="alerta-container-flutuante">
                        <motion.div className="alerta-card-matte" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="alerta-header" style={{flexDirection: 'column', textAlign: 'center', padding: '32px 16px'}}>
                                <ShieldAlert size={48} color="#EF4444" style={{margin: '0 auto 16px'}} />
                                <h2>Tempo Esgotado</h2>
                                <p style={{color: '#888', marginTop: 8}}>A corrida foi repassada para o próximo motorista.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {['a_caminho', 'aguardando', 'em_corrida', 'finalizada', 'avaliacao'].includes(fase) && (
                    <motion.div key="navegacao" className="navegacao-painel-flutuante" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
                        {fase === 'a_caminho' && (
                            <div className="painel-conteudo painel-centralizado" style={{ padding: '24px', background: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)' }}>
                                <div className="painel-flex" style={{ width: '100%', marginBottom: 24, justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                        <div className="avatar-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}><User size={24} color="#10B981" /></div>
                                        <div className="painel-textos" style={{ textAlign: 'left' }}>
                                            <span className="texto-destaque" style={{ fontSize: 20 }}>Buscando Joao Pedro</span>
                                            <span className="texto-secundario" style={{ color: '#10B981', fontWeight: 700 }}><Star size={14} fill="#10B981" color="#10B981" /> 5.0</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <div className="icone-acao" style={{ background: '#222', borderRadius: '50%', padding: 12 }}><Phone size={20} color="#FFF" /></div>
                                        <div className="icone-acao" style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', padding: 12 }} onClick={() => setFase('online')}><X size={20} color="#EF4444" /></div>
                                    </div>
                                </div>
                                <BotaoDeslizante texto="DESLIZE SE CHEGOU" corFundo="#10B981" aoCompletar={() => setFase('aguardando')} />
                            </div>
                        )}

                        {fase === 'aguardando' && (
                            <div className="painel-conteudo painel-centralizado" style={{ padding: '32px 24px', background: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)' }}>
                                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <MapPin size={32} color="#10B981" />
                                </div>
                                <h3 className="titulo-chegada" style={{ fontSize: '28px', marginBottom: 8, color: '#FFF' }}>Você Chegou!</h3>
                                <p className="texto-aviso" style={{ fontSize: '15px', color: '#A1A1AA', marginBottom: 24 }}>Passageiro notificado. O tempo de espera iniciou.</p>
                                <BotaoDeslizante texto="DESLIZE P/ INICIAR A VIAGEM" corFundo="#10B981" aoCompletar={iniciarCorrida} />
                                <button style={{marginTop: 24, background: 'rgba(239, 68, 68, 0.1)', padding: '12px 24px', borderRadius: 20, border: 'none', color: '#EF4444', fontWeight: 700, fontSize: 14, cursor: 'pointer'}} onClick={() => setFase('online')}>Cancelar Corrida</button>
                            </div>
                        )}

                        {fase === 'em_corrida' && (
                            <div className="painel-conteudo painel-centralizado" style={{ padding: '24px', background: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)' }}>
                                <div className="painel-flex" style={{ width: '100%', marginBottom: 24 }}>
                                    <div className="avatar-icon" style={{ background: 'rgba(0, 188, 212, 0.1)', border: '1px solid rgba(0, 188, 212, 0.2)' }}><MapPin size={24} color="#00BCD4" /></div>
                                    <div className="painel-textos" style={{ textAlign: 'left' }}>
                                        <span className="texto-destaque" style={{ fontSize: 20 }}>A caminho do Destino</span>
                                        <span className="texto-secundario" style={{ fontSize: 14 }}>IFRN Campus Nova Cruz</span>
                                    </div>
                                </div>
                                <BotaoDeslizante texto="DESLIZE P/ FINALIZAR" corFundo="#EF4444" aoCompletar={() => setFase('finalizada')} />
                            </div>
                        )}

                        {fase === 'finalizada' && (
                            <div className="painel-conteudo painel-centralizado" style={{ padding: '32px 24px', background: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)' }}>
                                <div className="titulo-chegada" style={{ fontSize: '24px', color: '#FFF' }}>Corrida Finalizada</div>
                                <div className="valor-corrida" style={{ fontSize: '48px', fontWeight: 900, color: '#00BCD4', margin: '16px 0 8px' }}>R$ 14,50</div>
                                <p className="texto-aviso" style={{ fontSize: '14px', background: 'rgba(0, 188, 212, 0.1)', color: '#00BCD4', padding: '6px 12px', borderRadius: 12, display: 'inline-block', marginBottom: 24 }}>Receber em Dinheiro do passageiro</p>
                                
                                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', background: '#111', padding: '20px', borderRadius: '20px', width: '100%', textAlign: 'left', border: '1px solid #222'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', color: '#A1A1AA', fontSize: '14px', fontWeight: 500}}><span>Valor Pago pelo Cliente</span><span style={{color: '#FFF'}}>R$ 14,50</span></div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', color: '#A1A1AA', fontSize: '14px', fontWeight: 500}}><span>Taxa VEM CAR (Fixa)</span><span style={{color: '#EF4444'}}>- R$ 1,50</span></div>
                                    <div style={{ borderTop: '1px dashed #333', margin: '4px 0' }} />
                                    <div style={{display: 'flex', justifyContent: 'space-between', color: '#FFF', fontSize: '18px', fontWeight: 800}}><span>Seus Ganhos</span><span style={{color: '#10B981'}}>R$ 13,00</span></div>
                                </div>
                                <BotaoDeslizante texto="DESLIZE P/ FINALIZAR" corFundo="#EF4444" aoCompletar={() => setFase('avaliacao')} />
                            </div>
                        )}

                        {fase === 'avaliacao' && (
                            <div className="painel-conteudo painel-centralizado" style={{ padding: '32px 24px', background: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)' }}>
                                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'rgba(0, 188, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <Star size={32} color="#00BCD4" fill="#00BCD4" />
                                </div>
                                <div className="titulo-chegada" style={{ fontSize: '24px', color: '#FFF', marginBottom: 24 }}>Como foi a viagem?</div>
                                <div className="avaliacao-estrelas" style={{ gap: 12, marginBottom: 32, justifyContent: 'center' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} className="botao-estrela" onClick={() => setNota(star)}>
                                            <Star size={40} fill={star <= nota ? "#F59E0B" : "transparent"} color={star <= nota ? "#F59E0B" : "#444"} strokeWidth={1.5} style={{ transition: 'all 0.2s' }} />
                                        </button>
                                    ))}
                                </div>
                                <button className="botao-ciano" onClick={finalizarAvaliacao} disabled={nota === 0} style={{ opacity: nota === 0 ? 0.3 : 1, background: nota === 0 ? '#333' : '#00BCD4', color: nota === 0 ? '#888' : '#FFF' }}>
                                    {nota === 0 ? 'Selecione uma nota' : 'Enviar Avaliação'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            
            
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3" loop preload="auto" />
        </div>
    );
}