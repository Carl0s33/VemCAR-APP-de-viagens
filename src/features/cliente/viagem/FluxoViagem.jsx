import React, { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, ArrowLeft, CreditCard, CarFront, Bike, GraduationCap,
  AlertTriangle, Star, CheckCircle, Search, User, QrCode,
  Clock, Zap, Phone, X, Navigation2, MessageSquare, Shield, Locate
} from "lucide-react";
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./FluxoViagem.css";

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
const PONTO_PASSAGEIRA = [-35.445337, -6.471490];

const LOCAIS_MOCK = [
  { nome: "IFRN Campus Nova Cruz", endereco: "RN-120, Nova Cruz - RN", coords: [-35.445337, -6.471490] },
  { nome: "Prefeitura Municipal", endereco: "Rua Luiz José Moreira, Centro", coords: [-35.433500, -6.476000] },
  { nome: "Igreja Matriz", endereco: "Praça Barão do Rio Branco, Centro", coords: [-35.433000, -6.477000] },
  { nome: "Supermercado Rede Mais", endereco: "R. Pres. Getúlio Vargas, Centro", coords: [-35.434000, -6.478000] },
  { nome: "Terminal Rodoviário", endereco: "Av. Pres. Castelo Branco", coords: [-35.428000, -6.481000] },
  { nome: "Posto São Miguel", endereco: "BR-304, Nova Cruz - RN", coords: [-35.440000, -6.468000] },
];

const CarroIconeSVG = ({ cor = "#00BCD4" }) => (
  <svg width="52" height="80" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
    
    <polygon points="26,45 -8,0 88,0 54,45" fill="rgba(255,255,255,0.25)" />
    
    <rect x="20" y="36" width="40" height="50" rx="10" fill={cor} />
    
    <rect x="26" y="42" width="28" height="26" rx="5" fill="rgba(0,0,0,0.55)" />
    
    <path d="M 28 44 Q 40 38 52 44 L 51 48 Q 40 44 29 48 Z" fill="rgba(255,255,255,0.6)" />
    
    <line x1="40" y1="42" x2="40" y2="68" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
    
    <rect x="22" y="36" width="10" height="5" rx="2.5" fill="#FEF08A" />
    <rect x="48" y="36" width="10" height="5" rx="2.5" fill="#FEF08A" />
    
    <rect x="22" y="83" width="10" height="4" rx="2" fill="#EF4444" />
    <rect x="48" y="83" width="10" height="4" rx="2" fill="#EF4444" />
    
    <rect x="14" y="55" width="8" height="18" rx="4" fill="rgba(0,0,0,0.4)" />
    <rect x="58" y="55" width="8" height="18" rx="4" fill="rgba(0,0,0,0.4)" />
  </svg>
);

const MotoIconeSVG = ({ cor = "#FFD500" }) => (
  <svg width="38" height="80" viewBox="0 0 60 120" xmlns="http://www.w3.org/2000/svg">
    
    <polygon points="26,40 16,0 44,0 34,40" fill="rgba(255,255,255,0.22)" />
    
    <rect x="20" y="40" width="20" height="4" rx="2" fill="#999" />
    
    <path d="M 24 44 L 36 44 L 38 75 L 22 75 Z" fill={cor} />
    
    <ellipse cx="30" cy="80" rx="10" ry="5" fill="#1A1A1A" />
    
    <rect x="27" y="75" width="6" height="28" rx="3" fill="#333" />
    
    <rect x="26" y="101" width="8" height="4" rx="2" fill="#EF4444" />
  </svg>
);

const PassageiroMarcador = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
    <div style={{
      width: 40, height: 40, borderRadius: '50% 50% 50% 0', background: '#10B981',
      transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', border: '2px solid #000'
    }}>
      <User size={18} color="#000" style={{ transform: 'rotate(45deg)' }} />
    </div>
  </div>
);

const DestinoPino = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.7))' }}>
    <MapPin size={48} color="#000" fill="#00BCD4" strokeWidth={1.5} />
  </div>
);

const FluxoViagem = memo(({ aoSair, categoriaInicial = "VEM CAR", onFaseChange }) => {
  const [etapa, setEtapa] = useState("selecao_destino");
  const [categoria, setCategoria] = useState(categoriaInicial);
  const [metodoPagamento, setMetodoPagamento] = useState("dinheiro");
  const [precisaTroco, setPrecisaTroco] = useState(false);
  const [valorTroco, setValorTroco] = useState("");
  const [nota, setNota] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [destinoValido, setDestinoValido] = useState(false);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const [pontoDestino, setPontoDestino] = useState(null);

  const [rota, setRota] = useState([]);
  const [posicaoCarro, setPosicaoCarro] = useState(PONTO_CARRO);
  const [rotacaoCarro, setRotacaoCarro] = useState(-135);
  const [etaSegundos, setEtaSegundos] = useState(180); 

  const [viewState, setViewState] = useState({
    longitude: PONTO_PASSAGEIRA[0],
    latitude: PONTO_PASSAGEIRA[1],
    zoom: 16.5,
    pitch: 40,
    bearing: 0
  });

  const modalidades = [
    {
      id: "VEM MOTO", preco: "R$ 6,00", desc: "Mais rápido • 2 rodas",
      taxa: "Taxa: R$ 1,00", 
      icone: <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
               
               <ellipse cx="30" cy="30" rx="20" ry="6" fill="rgba(0,0,0,0.2)" />
               
               <rect x="12" y="18" width="8" height="12" rx="2" fill="#1A1A1A" />
               <rect x="40" y="18" width="8" height="12" rx="2" fill="#1A1A1A" />
               
               <path d="M 16 16 C 16 10, 44 10, 44 16 L 46 24 C 46 26, 42 28, 30 28 C 18 28, 14 26, 14 24 Z" fill="#F59E0B" />
               
               <path d="M 22 14 L 38 14 L 36 22 L 24 22 Z" fill="#333" />
             </svg>,
      capacidade: "1", eta: "4 min"
    },
    {
      id: "VEM CAR", preco: "R$ 10,00", desc: "Conforto no trajeto • 4 rodas",
      taxa: "Taxa: R$ 1,50", 
      icone: <svg width="70" height="40" viewBox="0 0 70 40" fill="none" xmlns="http://www.w3.org/2000/svg">
               
               <ellipse cx="35" cy="32" rx="26" ry="8" fill="rgba(0,0,0,0.15)" />
               
               <rect x="14" y="24" width="8" height="10" rx="3" fill="#111" />
               <rect x="48" y="24" width="8" height="10" rx="3" fill="#111" />
               
               <path d="M 10 18 Q 10 12 18 12 L 52 12 Q 60 12 60 18 L 62 26 Q 62 30 52 30 L 18 30 Q 8 30 8 26 Z" fill="#000" />
               
               <path d="M 20 14 L 50 14 L 46 8 C 44 6, 26 6, 24 8 Z" fill="#333" />
               
               <rect x="56" y="16" width="6" height="4" rx="2" fill="#FFF" opacity="0.8" />
               <rect x="8" y="16" width="6" height="4" rx="2" fill="#EF4444" opacity="0.8" />
               
               <path d="M 12 16 L 58 16" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
             </svg>,
      capacidade: "4", eta: "6 min"
    }
  ];

  const modalidadeEscolhida = modalidades.find(m => m.id === categoria);

  useEffect(() => {
    if (onFaseChange) {
      onFaseChange(etapa);
    }
  }, [etapa, onFaseChange]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.length > 1) {
        const filtrados = LOCAIS_MOCK.filter(l =>
          l.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.endereco.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSugestoes(filtrados);
        setShowSugestoes(filtrados.length > 0);
      } else {
        setSugestoes([]);
        setShowSugestoes(false);
      }
    }, 280);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleSelecionarLocal = (local) => {
    setSearchQuery(local.nome);
    setLocalSelecionado(local);
    setDestinoValido(true);
    setShowSugestoes(false);
    setSearchFocused(false);
    setPontoDestino(local.coords);

    setViewState(prev => ({
      ...prev,
      longitude: local.coords[0],
      latitude: local.coords[1],
      zoom: 15.5,
      pitch: 45,
      bearing: -10,
    }));

    setTimeout(() => {
      setEtapa("orcamento");
      setViewState(prev => ({
        ...prev,
        longitude: (PONTO_PASSAGEIRA[0] + local.coords[0]) / 2,
        latitude: (PONTO_PASSAGEIRA[1] + local.coords[1]) / 2,
        zoom: 13,
        pitch: 0,
      }));
    }, 450);
  };

  const fetchRoute = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates;
        setRota(coords);
        setPosicaoCarro(coords[0]);
        if (coords.length > 1) setRotacaoCarro(getBearing(coords[0], coords[1]));
        setViewState(prev => ({
          ...prev,
          longitude: (start[0] + end[0]) / 2,
          latitude: (start[1] + end[1]) / 2,
          zoom: 14.5,
          pitch: 50,
        }));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    let timer;
    if (etapa === "buscando") {
      timer = setTimeout(() => {
        setEtapa("a_caminho");
        fetchRoute(PONTO_CARRO, PONTO_PASSAGEIRA);
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [etapa]);

  useEffect(() => {
    let timer;
    if (etapa === "a_caminho" && etaSegundos > 0) {
      timer = setInterval(() => setEtaSegundos(s => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [etapa, etaSegundos]);

  useEffect(() => {
    if (rota.length < 2 || !['a_caminho', 'em_corrida'].includes(etapa)) return;
    let animId;
    let idx = 0, progress = 0, lastTime = performance.now();
    const SPEED = 0.000005; 

    const animate = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      if (idx >= rota.length - 1) {
        if (etapa === 'a_caminho') setEtapa('aguardando_embarque');
        else if (etapa === 'em_corrida') setEtapa('finalizada');
        return;
      }

      const p1 = rota[idx], p2 = rota[idx + 1];
      const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.000001) { idx++; animId = requestAnimationFrame(animate); return; }

      progress += (SPEED * dt) / dist;
      if (progress >= 1) { progress = 0; idx++; }
      else {
        const lng = p1[0] + dx * progress;
        const lat = p1[1] + dy * progress;
        setPosicaoCarro([lng, lat]);
        setRotacaoCarro(getBearing(p1, p2));
        setViewState(prev => ({ ...prev, longitude: lng, latitude: lat }));
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [rota, etapa]);

  const iniciarCorrida = () => {
    setRota([]);
    setEtapa("em_corrida");
    fetchRoute(PONTO_PASSAGEIRA, pontoDestino || LOCAIS_MOCK[0].coords);
  };

  const etaMinutos = Math.ceil(etaSegundos / 60);

  const finalizarCorrida = () => {
    setEtapa("selecao_destino");
    setSearchQuery("");
    setLocalSelecionado(null);
    setDestinoValido(false);
    setShowSugestoes(false);
    setPontoDestino(null);
    setRota([]);
    setNota(0);
    setViewState(prev => ({
      ...prev,
      longitude: PONTO_PASSAGEIRA[0],
      latitude: PONTO_PASSAGEIRA[1],
      zoom: 16,
      pitch: 0
    }));
  };



  const RenderSheet = () => {
    switch (etapa) {

      case "selecao_destino":
        return null;

      case "orcamento":
        return (
          <>
            <p className="sheet-subtitle">Modalidade</p>
            <div className="modalidades-grid">
              {modalidades.map((mod) => (
                <div key={mod.id}
                  className={`card-orcamento ${categoria === mod.id ? 'selecionado' : ''}`}
                  onClick={() => setCategoria(mod.id)}>
                  <div className="icone-orcamento">{mod.icone}</div>
                  <div className="info-orcamento">
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      <h3>{mod.id}</h3>
                      <span style={{fontSize: 10, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#FFF', fontWeight: 600}}>
                        <User size={10} /> {mod.capacidade}
                      </span>
                    </div>
                    <p>{mod.desc}</p>
                    <small style={{color: categoria === mod.id ? '#00BCD4' : '#888', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4}}>
                        <Clock size={12} /> {mod.eta}
                    </small>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <h2 className="preco-orcamento">{mod.preco}</h2>
                      <span style={{ fontSize: 10, color: '#888', marginTop: 4 }}>{mod.taxa}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="sheet-subtitle">Pagamento</p>
            <div className="metodos-pagamento-grid">
              <button className={`btn-pagamento ${metodoPagamento === 'dinheiro' ? 'ativo' : ''}`}
                onClick={() => setMetodoPagamento("dinheiro")}>
                <CreditCard size={18} /><span>Dinheiro</span>
              </button>
              <button className={`btn-pagamento ${metodoPagamento === 'pix' ? 'ativo' : ''}`}
                onClick={() => { setMetodoPagamento("pix"); setPrecisaTroco(false); }}>
                <QrCode size={18} /><span>PIX</span>
              </button>
              <button className={`btn-pagamento ${metodoPagamento === 'cartao' ? 'ativo' : ''}`}
                onClick={() => { setMetodoPagamento("cartao"); setPrecisaTroco(false); }}>
                <CreditCard size={18} /><span>Cartão</span>
              </button>
            </div>

            {metodoPagamento === "dinheiro" && (
              <div className="card-pagamento-opcoes">
                <label className="checkbox-troco">
                  <input type="checkbox" checked={precisaTroco} onChange={() => setPrecisaTroco(!precisaTroco)} />
                  <span>Precisa de troco?</span>
                </label>
                <AnimatePresence>
                  {precisaTroco && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} className="troco-input-wrapper">
                      <input type="text" placeholder="Troco para quanto? Ex: R$ 50"
                        value={valorTroco} onChange={(e) => setValorTroco(e.target.value)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button className="btn-viagem principal" onClick={() => setEtapa("buscando")}
              style={{ marginTop: 8 }}>
              <Zap size={18} /> Solicitar {categoria}
            </button>
          </>
        );

      case "buscando":
        return (
          <div className="sheet-centralizado">
            <motion.div className="search-pulse-container"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}>
              <Search size={36} color="#00BCD4" />
            </motion.div>
            <h2 className="sheet-title" style={{ marginTop: 20 }}>Localizando motorista...</h2>
            <p className="sheet-desc">Conectando com parceiros VEM CAR mais próximos.</p>
            <button className="btn-viagem secundario" style={{ marginTop: 28 }}
              onClick={() => setEtapa("selecao_destino")}>
              <X size={16} /> Cancelar Solicitação
            </button>
          </div>
        );

      case "a_caminho":
      case "aguardando_embarque":
      case "em_corrida": {
        const cores = { a_caminho: "#00BCD4", aguardando_embarque: "#10B981", em_corrida: "#8B5CF6" };
        const labels = { a_caminho: "Motorista a caminho", aguardando_embarque: "Motorista chegou!", em_corrida: "Em corrida" };
        const cor = cores[etapa];
        return (
          <>
            
            <div className="status-corrida-label" style={{ color: cor }}>
              <div className="status-dot-piscante" style={{ background: cor }} />
              {labels[etapa]}
            </div>

            
            {etapa === "a_caminho" && (
              <div className="eta-badge-row">
                <div className="eta-chip">
                  <Clock size={13} /> {etaMinutos} min
                </div>
                <div className="eta-chip verde">
                  <MapPin size={13} /> 1,2 km
                </div>
              </div>
            )}

            
            <div className="perfil-motorista">
              <div className="avatar-motorista">
                <User size={24} color={cor} />
              </div>
              <div className="info-motorista">
                <h2>{categoria === "VEM MOTO" ? "Lucas Ferreira" : "João Pedro"}</h2>
                <p>{categoria === "VEM MOTO" ? "Honda CG 160 • Preta" : "Fiat Argo • Branco • QWE-9999"}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 38, height: 38, background: '#1A1A1A', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <MessageSquare size={17} color="#FFF" />
                </div>
                <div style={{ width: 38, height: 38, background: '#1A1A1A', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Phone size={17} color="#FFF" />
                </div>
              </div>
            </div>

            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div className="badge-placa">{categoria === "VEM MOTO" ? "NCR-5841" : "QWE-9999"}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontSize: 13, fontWeight: 700 }}>
                <Star size={13} fill="#F59E0B" color="#F59E0B" /> 5.0
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 13, color: '#666', fontWeight: 600 }}>
                {metodoPagamento.toUpperCase()}
              </div>
            </div>

            
            {etapa === "aguardando_embarque" ? (
              <button className="btn-viagem principal" onClick={iniciarCorrida}>
                <CheckCircle size={18} /> Iniciar Corrida
              </button>
            ) : etapa === "em_corrida" ? (
              <button className="btn-viagem secundario" style={{ pointerEvents: 'none', opacity: 0.7 }}>
                Acompanhando trajeto...
              </button>
            ) : (

              <button className="btn-viagem secundario"
                style={{ color: '#EF4444', borderColor: '#EF4444' }}
                onClick={() => setEtapa("selecao_destino")}>
                <X size={16} /> Cancelar
              </button>
            )}
          </>
        );
      }

      case "finalizada":
        return (
          <div className="sheet-centralizado">
            <CheckCircle size={56} color="#00BCD4" style={{ marginBottom: 12 }} />
            <h2 className="sheet-title">Destino Alcançado!</h2>
            <p className="sheet-desc">Corrida concluída com sucesso</p>
            <h1 className="preco-final">{modalidadeEscolhida?.preco}</h1>
            <p className="sheet-desc" style={{ marginBottom: 12 }}>
              {metodoPagamento.toUpperCase()} • {categoria}
            </p>
            {metodoPagamento === "dinheiro" && precisaTroco && (
              <p className="sheet-desc" style={{ color: "#10B981", marginBottom: 12 }}>
                Troco para R$ {valorTroco}
              </p>
            )}
            {metodoPagamento === "pix" && (
              <div style={{ background: '#111', padding: '14px', borderRadius: '14px', marginBottom: 16, width: '100%', textAlign: 'center', border: '1px solid #1A1A1A' }}>
                <p style={{ margin: '0 0 8px', color: '#666', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Chave PIX Dinâmica</p>
                <div style={{ background: '#000', padding: '10px', borderRadius: '8px', wordBreak: 'break-all', fontSize: '11px', color: '#00BCD4', fontFamily: 'monospace' }}>
                  00020101021126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456...
                </div>
                <button style={{ background: 'transparent', border: '1px dashed #333', color: '#FFF', padding: '6px 14px', borderRadius: '8px', marginTop: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Copiar Chave
                </button>
              </div>
            )}
            <button className="btn-viagem principal" onClick={() => setEtapa("avaliacao")}>
              Confirmar e Avaliar
            </button>
          </div>
        );

      case "avaliacao":
        return (
          <div className="sheet-centralizado">
            <h2 className="sheet-title">Como foi a viagem?</h2>
            <p className="sheet-desc" style={{ marginBottom: 28 }}>Sua avaliação ajuda a manter a qualidade VEM CAR</p>
            <div className="avaliacao-estrelas">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div key={i} whileTap={{ scale: 0.8 }} className="botao-estrela" onClick={() => setNota(i)}>
                  <Star size={46} fill={i <= nota ? "#00BCD4" : "transparent"} color="#00BCD4" strokeWidth={1.5} />
                </motion.div>
              ))}
            </div>
            <button className="btn-viagem principal" onClick={finalizarCorrida} disabled={nota === 0}
              style={{ opacity: nota === 0 ? 0.4 : 1 }}>
              Enviar Avaliação
            </button>
          </div>
        );

      default: return null;
    }
  };

  const mostrarSearchBar = ['selecao_destino'].includes(etapa);
  const mostrarBtnVoltar = ['selecao_destino', 'orcamento'].includes(etapa);

  return (
    <div className="viagem-container">
      
      <div style={{ position: 'absolute', inset: 0 }}>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          interactive={['a_caminho', 'aguardando_embarque', 'em_corrida'].includes(etapa)}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          
          {rota.length > 0 && (
            <Source id="rota" type="geojson" data={{ type: 'Feature', geometry: { type: 'LineString', coordinates: rota } }}>
              <Layer id="rota-glow" type="line" paint={{ 'line-color': '#00BCD4', 'line-width': 10, 'line-opacity': 0.15 }} />
              <Layer id="rota-linha" type="line" paint={{ 'line-color': '#00BCD4', 'line-width': 4, 'line-opacity': 0.9 }} />
            </Source>
          )}

          
          {['selecao_destino', 'orcamento', 'buscando', 'a_caminho', 'aguardando_embarque'].includes(etapa) && (
            <Marker longitude={PONTO_PASSAGEIRA[0]} latitude={PONTO_PASSAGEIRA[1]} anchor="center">
              <PassageiroMarcador />
            </Marker>
          )}

          
          {pontoDestino && ['orcamento', 'buscando', 'a_caminho', 'aguardando_embarque', 'em_corrida'].includes(etapa) && (
            <Marker longitude={pontoDestino[0]} latitude={pontoDestino[1]} anchor="bottom">
              <DestinoPino />
            </Marker>
          )}

          
          {['a_caminho', 'aguardando_embarque', 'em_corrida'].includes(etapa) && (
            <Marker longitude={posicaoCarro[0]} latitude={posicaoCarro[1]}
              anchor="center" pitchAlignment="map" rotationAlignment="map" rotation={rotacaoCarro}>
              {categoria === "VEM MOTO"
                ? <MotoIconeSVG cor="#FFD500" />
                : <CarroIconeSVG cor="#00BCD4" />
              }
            </Marker>
          )}
        </Map>
      </div>

      
      {etapa === 'selecao_destino' && !searchFocused && (
        <button 
          onClick={() => setViewState(prev => ({...prev, longitude: PONTO_PASSAGEIRA[0], latitude: PONTO_PASSAGEIRA[1], zoom: 16}))}
          style={{ position: 'absolute', bottom: 'max(100px, 12dvh)', right: 16, width: 44, height: 44, background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1A1A1A', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', cursor: 'pointer', zIndex: 10 }}
        >
          <Locate size={20} color="#FFF" />
        </button>
      )}

      {['a_caminho', 'em_corrida'].includes(etapa) && (
        <button 
          style={{ position: 'absolute', bottom: '40dvh', right: 16, width: 44, height: 44, background: '#1A1A1A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #3B82F6', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', cursor: 'pointer', zIndex: 10 }}
        >
          <Shield size={20} color="#3B82F6" />
        </button>
      )}

      
      <AnimatePresence>
        {etapa === 'selecao_destino' && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            style={{ position: 'absolute', top: 'max(48px, env(safe-area-inset-top))', left: 16, right: 16, zIndex: 100 }}
          >
            
            <div style={{ background: '#111', padding: '16px', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <button onClick={aoSair} style={{ background: '#1A1A1A', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF' }}>
                  <ArrowLeft size={18} />
                </button>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', margin: 0 }}>Para onde?</h2>
              </div>

              
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#888' }} />
                      <div style={{ width: 2, height: 26, background: '#333', margin: '4px 0' }} />
                      <div style={{ width: 8, height: 8, background: '#00BCD4' }} />
                   </div>
                   
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ background: '#1A1A1A', padding: '12px', borderRadius: 10, fontSize: 13, color: '#FFF', fontWeight: 600 }}>
                        Localização atual
                      </div>
                      <div style={{ background: '#1A1A1A', borderRadius: 10, display: 'flex', alignItems: 'center', paddingRight: 8 }}>
                        <input
                          className="viagem-search-input"
                          autoFocus
                          placeholder="Busque o destino..."
                          value={searchQuery}
                          onChange={e => {
                            setSearchQuery(e.target.value);
                            setDestinoValido(false);
                            setLocalSelecionado(null);
                            setPontoDestino(null);
                          }}
                          onFocus={() => setSearchFocused(true)}
                          style={{ padding: '12px', background: 'transparent', width: '100%', color: '#FFF', border: 'none', outline: 'none', fontSize: 14 }}
                        />
                        {searchQuery.length > 0 && (
                          <button onClick={() => { setSearchQuery(''); setDestinoValido(false); }}
                            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 4 }}>
                            <X size={16} />
                          </button>
                        )}
                      </div>
                   </div>
                </div>
              </div>

              
              {showSugestoes && sugestoes.length > 0 && (
                <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                  {sugestoes.map((s, i) => (
                    <div key={i} onClick={() => handleSelecionarLocal(s)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', cursor: 'pointer' }}>
                      <div style={{ width: 36, height: 36, background: 'rgba(0,188,212,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={16} color="#00BCD4" />
                      </div>
                      <div>
                        <div style={{ color: '#FFF', fontSize: 14, fontWeight: 700 }}>{s.nome}</div>
                        <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{s.endereco}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      {mostrarBtnVoltar && (
        <button className="btn-voltar-flutuante" onClick={aoSair}>
          <ArrowLeft size={20} />
        </button>
      )}

      
      <AnimatePresence mode="wait">
        {etapa !== 'selecao_destino' && (
          <motion.div
            key={etapa}
            className={`bottom-sheet-viagem ${etapa === 'selecao_destino' ? 'has-menu' : ''}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
          >
            <div className="sheet-drag" />
            {RenderSheet()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default FluxoViagem;