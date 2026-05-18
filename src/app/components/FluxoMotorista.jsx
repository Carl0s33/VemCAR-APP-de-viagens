import React, { useState, useEffect, useRef, memo } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, User, CheckCircle, Star, MapPin, CornerUpRight, CornerUpLeft, ArrowUp,
    Menu, Power, Bell, Wallet, Route, Clock, Target, MessageSquare, X, CircleDot, ShieldAlert
} from 'lucide-react';
import './style/TelaPainelMotorista.css';

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

// botao de arrastar recalcula o tamanho real na tela do celular de forma responsiva
const BotaoDeslizante = ({ texto, corFundo, aoCompletar }) => {
    const containerRef = useRef(null);
    const [larguraArrastavel, setLarguraArrastavel] = useState(200);

    const recalcularLargura = () => {
        if (containerRef.current) {
            setLarguraArrastavel(containerRef.current.offsetWidth - 56);
        }
    };

    useEffect(() => {
        recalcularLargura();
        window.addEventListener('resize', recalcularLargura);
        return () => window.removeEventListener('resize', recalcularLargura);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: 'relative', width: '100%', height: '56px', backgroundColor: '#1E293B', borderRadius: '28px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}
        >
            <span style={{ color: '#94A3B8', fontWeight: '700', zIndex: 1, userSelect: 'none', fontSize: 13 }}>{texto}</span>
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: larguraArrastavel }}
                dragElastic={{ left: 0, right: 0.1 }}
                dragSnapToOrigin
                onDrag={(e, info) => {
                    // ativa direto ao encostar no fim da linha baseado no container real
                    if (info.offset.x >= larguraArrastavel - 5) {
                        aoCompletar();
                    }
                }}
                onDragEnd={(e, info) => {
                    if (info.offset.x > larguraArrastavel * 0.8) {
                        aoCompletar();
                    }
                }}
                style={{ position: 'absolute', left: 4, top: 4, width: '48px', height: '48px', backgroundColor: corFundo, borderRadius: '24px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'grab' }}
            >
                <ArrowUp size={24} style={{ transform: 'rotate(90deg)' }} color="#FFF" />
            </motion.div>
        </div>
    );
};

export default function FluxoMotorista({ aoPerfil }) {
    const mapRef = useRef(null);
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

    const metaDiaria = 200.00;
    const gananciasHoje = 142.50;
    const progressoMeta = (gananciasHoje / metaDiaria) * 100;

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
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const tocarBeep = (freq, tempoInicio, duracao) => {
                const osc = context.createOscillator();
                const ganho = context.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, context.currentTime + tempoInicio);
                ganho.gain.setValueAtTime(0.1, context.currentTime + tempoInicio);
                ganho.gain.exponentialRampToValueAtTime(0.001, context.currentTime + tempoInicio + duracao);
                osc.connect(ganho);
                ganho.connect(context.destination);
                osc.start(context.currentTime + tempoInicio);
                osc.stop(context.currentTime + tempoInicio + duracao);
            };
            tocarBeep(600, 0, 0.2);
            tocarBeep(600, 0.3, 0.2);
            tocarBeep(800, 0.6, 0.4);
            return () => context.close();
        }
    }, [fase]);

    useEffect(() => {
        if (fase === 'alerta') {
            if (tempoAlerta > 0) {
                const timer = setTimeout(() => setTempoAlerta(tempoAlerta - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setFase('online');
            }
        }
    }, [fase, tempoAlerta]);

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

                setViewState((prev) => ({
                    ...prev,
                    longitude: coordenadas[0][0],
                    latitude: coordenadas[0][1],
                    bearing: initialBearing,
                    pitch: ['a_caminho', 'em_corrida'].includes(fase) ? 60 : 0,
                    zoom: 18
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
        const VELOCIDADE = 0.000015;

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
                    const pt2 = rota[i + 1];
                    distPercorrida += Math.sqrt(Math.pow(pt2[0] - pt1[0], 2) + Math.pow(pt2[1] - pt1[1], 2)) * 111000;
                }
                if (passos.length > 0) atualizarInstrucao(distPercorrida, passos);

                if (mapRef.current) {
                    mapRef.current.getMap().jumpTo({
                        center: [currentLng, currentLat],
                        bearing: newBearing,
                        pitch: 55
                    });
                }
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
        setViewState(prev => ({ ...prev, bearing: 0, pitch: 0, zoom: 16.5, longitude: PONTO_DESTINO[0], latitude: PONTO_DESTINO[1] }));
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
        <div className="tela-painel-motorista" style={{ background: "#000" }}>
            <div className="mapa-wrapper" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
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
                            <svg width="80" height="120" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="headlightGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                                        <stop offset="0%" stopColor="#FFF" stopOpacity={['online', 'alerta', 'a_caminho', 'em_corrida'].includes(fase) ? "0.6" : "0.1"} />
                                        <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                                    </linearGradient>
                                    <radialGradient id="shadowPainel" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#00E5FF" stopOpacity={fase === 'online' ? "0.5" : "0"} />
                                        <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                                    </radialGradient>
                                    <linearGradient id="bodyGradPainel" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#0EA5E9" />
                                        <stop offset="40%" stopColor="#00BCD4" />
                                        <stop offset="100%" stopColor="#0369A1" />
                                    </linearGradient>
                                    <linearGradient id="roofGradPainel" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#E0F2FE" />
                                        <stop offset="100%" stopColor="#7DD3FC" />
                                    </linearGradient>
                                </defs>
                                <polygon points="26,45 -10,0 90,0 54,45" fill="url(#headlightGlow)" />
                                <ellipse cx="40" cy="72" rx="30" ry="15" fill="url(#shadowPainel)" />
                                <rect x="24" y="37" width="32" height="46" rx="8" fill="url(#bodyGradPainel)" />
                                <rect x="28" y="45" width="24" height="24" rx="4" fill="url(#roofGradPainel)" />
                                <path d="M 29 47 Q 40 41 51 47 L 50 51 Q 40 47 30 51 Z" fill="rgba(255,255,255,0.8)" />
                                <path d="M 30 63 Q 40 67 50 63 L 49 61 Q 40 64 31 61 Z" fill="#0C4A6E" opacity="0.8" />
                                <rect x="27" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
                                <rect x="45" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
                                <rect x="26" y="80" width="8" height="4" rx="2" fill="#EF4444" />
                                <rect x="46" y="80" width="8" height="4" rx="2" fill="#EF4444" />
                                <ellipse cx="24" cy="45" rx="4" ry="5" fill="#1E293B" />
                                <ellipse cx="56" cy="45" rx="4" ry="5" fill="#1E293B" />
                                <ellipse cx="24" cy="73" rx="4" ry="5" fill="#1E293B" />
                                <ellipse cx="56" cy="73" rx="4" ry="5" fill="#1E293B" />
                            </svg>
                        </div>
                    </Marker>

                    {['a_caminho', 'aguardando'].includes(fase) && (
                        <Marker longitude={PONTO_PASSAGEIRA[0]} latitude={PONTO_PASSAGEIRA[1]} anchor="bottom">
                            <MapPin size={36} color="#000" fill="#34C759" strokeWidth={1.5} />
                        </Marker>
                    )}
                    {['em_corrida', 'finalizada'].includes(fase) && (
                        <Marker longitude={PONTO_DESTINO[0]} latitude={PONTO_DESTINO[1]} anchor="bottom">
                            <MapPin size={36} color="#000" fill="#00BCD4" strokeWidth={1.5} />
                        </Marker>
                    )}
                </Map>
            </div>

            <AnimatePresence>
                {instrucaoAtual && ['a_caminho', 'em_corrida'].includes(fase) && (
                    <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="painel-curva-topo" style={{ zIndex: 100 }}>
                        <div className="curva-icone-container">{getIconeManeobra(instrucaoAtual.tipoCurva)}</div>
                        <div className="curva-infos">
                            <div className="curva-distancia">A {instrucaoAtual.distancia}m vire à {instrucaoAtual.tipoCurva?.includes('left') ? 'esquerda' : instrucaoAtual.tipoCurva?.includes('right') ? 'direita' : 'frente'} na</div>
                            <div className="curva-rua">{instrucaoAtual.nomeRua}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {['offline', 'online'].includes(fase) && (
                    <motion.div className="cabecalho-flutuante" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
                        <button className="botao-menu" onClick={aoPerfil}><Menu size={20} color="#FFF" /></button>
                        <div className="relogio-flutuante"><Clock size={16} color="#888" /><span style={{color: '#FFF'}}>{horaAtual}</span></div>
                        <button className="botao-menu" style={{ position: 'relative' }}>
                            <MessageSquare size={20} color="#FFF" />
                            <span className="notificacao-dot" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {['offline', 'online'].includes(fase) && (
                    <motion.div key="painel" className="card-inferior-motorista" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
                        <div className="alca-drag" />
                        <div className="painel-ganhos-grid">
                            <div className="info-box">
                                <div className="info-box-header"><Wallet size={16} color="#10B981" /><p>Ganhos Hoje</p></div>
                                <h2 className="info-box-valor">R$ {gananciasHoje.toFixed(2).replace('.', ',')}</h2>
                            </div>
                            <div className="info-box">
                                <div className="info-box-header"><Route size={14} color="#00BCD4" /><p>Corridas</p></div>
                                <h2 className="info-box-valor">8</h2>
                            </div>
                        </div>

                        <div className="progresso-container">
                            <div className="progresso-header">
                                <span><Target size={12} color="#00BCD4" /> Meta Diária</span>
                                <span>{Math.round(progressoMeta)}%</span>
                            </div>
                            <div className="progresso-barra-fundo">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progressoMeta}%` }} className="progresso-barra-preenchimento" />
                            </div>
                        </div>

                        <button className={`btn-power ${fase === 'online' ? 'online' : 'offline'}`} onClick={() => setFase(fase === 'online' ? 'offline' : 'online')}>
                            <Power size={20} /><span>{fase === 'online' ? 'Ficar Offline' : 'Ficar Online'}</span>
                        </button>

                        <AnimatePresence>
                            {fase === 'online' && (
                                <motion.button initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "50px", marginTop: "12px" }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="btn-simular" onClick={iniciarAlerta}>
                                    <Bell size={18} /><span>Simular Chamada</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {fase === 'alerta' && (
                    <motion.div key="alerta" className="alerta-container-flutuante">
                        <motion.div className="alerta-card-matte" initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
                            <div className="barra-tempo-fundo">
                                <motion.div className="barra-tempo-preenchimento" style={{ backgroundColor: tempoAlerta <= 5 ? "#EF4444" : "#00BCD4" }} animate={{ width: `${(tempoAlerta / 15) * 100}%` }} transition={{ duration: 1, ease: "linear" }} />
                            </div>
                            <div className="alerta-header">
                                <div className="alerta-tempo-preco"><h1 className="tempo-destaque">3 min</h1><p className="distancia-destaque">1,2 km de distância</p></div>
                                <div className="preco-estimado"><h2>R$ 14,50</h2><p>Dinheiro</p></div>
                            </div>
                            <div className="divisor-linha" />
                            <div className="alerta-info-passageiro">
                                <div className="info-rating"><Star size={16} fill="#F59E0B" color="#F59E0B" /><span>5.0</span></div>
                                <div className="divisor-ponto" /><span className="nome-passageiro"><User size={14} style={{marginRight: 4}}/> Ana</span>
                                <div className="divisor-ponto" /><span className="categoria-carro">VEM CAR</span>
                            </div>
                            <div className="alerta-locais">
                                <div className="local-linha"><CircleDot size={16} color="#34C759" /><p>R. Primeiro de Maio, 42</p></div>
                                <div className="traco-conexao" />
                                <div className="local-linha"><MapPin size={16} color="#00BCD4" /><p>IFRN Campus Nova Cruz</p></div>
                            </div>
                            <div className="alerta-botoes">
                                <motion.button whileTap={{ scale: 0.9 }} className="btn-rejeitar-circular" onClick={() => setFase('online')}><X size={24} color="#FFF" /></motion.button>
                                <motion.button whileTap={{ scale: 0.95 }} className="btn-aceitar-grande" onClick={aceitarCorrida}>ACEITAR CORRIDA</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {['a_caminho', 'aguardando', 'em_corrida', 'finalizada', 'avaliacao'].includes(fase) && (
                    <motion.div
                        key="navegacao"
                        className="navegacao-painel-flutuante"
                        style={{ zIndex: 60 }}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        onLayoutAnimationComplete={() => window.dispatchEvent(new Event('resize'))} // Força o recalculo do slide assim que a gaveta abre
                    >
                        {fase === 'a_caminho' && (
                            <div className="painel-conteudo">
                                <div className="painel-flex">
                                    <div className="avatar-icon"><User size={20} color="#00BCD4" /></div>
                                    <div className="painel-textos">
                                        <span className="texto-destaque">Buscando Ana</span>
                                        <span className="texto-secundario"><Star size={14} className="star-icon" fill="#00BCD4" color="#00BCD4" /> 5.0</span>
                                    </div>
                                    <div className="icone-acao"><Phone size={20} color="#FFF" /></div>
                                </div>
                                <div className="aviso-simulacao">Dirigindo até o ponto de embarque...</div>
                            </div>
                        )}

                        {fase === 'aguardando' && (
                            <div className="painel-conteudo painel-centralizado">
                                <h3 className="titulo-chegada">Você Chegou!</h3>
                                <p className="texto-aviso">Passageira Ana notificada.</p>
                                <BotaoDeslizante texto="DESLIZE PARA INICIAR" corFundo="#10B981" aoCompletar={iniciarCorrida} />
                            </div>
                        )}

                        {fase === 'em_corrida' && (
                            <div className="painel-conteudo">
                                <div className="painel-flex">
                                    <div className="avatar-icon"><MapPin size={20} color="#00BCD4" /></div>
                                    <div className="painel-textos">
                                        <span className="texto-destaque">A caminho do Destino</span>
                                        <span className="texto-secundario">IFRN Campus Nova Cruz</span>
                                    </div>
                                </div>
                                <div className="aviso-simulacao">Simulando trajeto da viagem...</div>
                            </div>
                        )}

                        {fase === 'finalizada' && (
                            <div className="painel-conteudo painel-centralizado">
                                <div className="titulo-chegada">Corrida Finalizada</div>
                                <div className="valor-corrida">R$ 14,50</div>
                                <p className="texto-aviso">Receber em Dinheiro</p>
                                <BotaoDeslizante texto="DESLIZE P/ FINALIZAR" corFundo="#EF4444" aoCompletar={() => setFase('avaliacao')} />
                            </div>
                        )}

                        {fase === 'avaliacao' && (
                            <div className="painel-conteudo painel-centralizado">
                                <div className="titulo-chegada">Como foi a viagem?</div>
                                <div className="texto-secundario">Avalie a passageira Ana</div>
                                <div className="avaliacao-estrelas">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} className="botao-estrela" onClick={() => setNota(star)}>
                                            <Star
                                                size={40}
                                                fill={star <= nota ? "#00BCD4" : "transparent"}
                                                color="#00BCD4"
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <button className="botao-ciano" onClick={finalizarAvaliacao} disabled={nota === 0} style={{ opacity: nota === 0 ? 0.5 : 1 }}>
                                    Enviar e Ficar Online
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}