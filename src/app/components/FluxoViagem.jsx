import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, ArrowLeft, CreditCard, CarFront, Bike, GraduationCap, 
  AlertTriangle, Star, CheckCircle, Search, User, Navigation, QrCode 
} from "lucide-react";
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./style/FluxoViagem.css";

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

const LOCAIS_MOCK = [
  { nome: "IFRN Campus Nova Cruz", endereco: "RN-120, Nova Cruz - RN", coords: [-35.433504, -6.480733] },
  { nome: "Prefeitura Municipal", endereco: "Centro, Santo Antônio - RN", coords: [-35.478310, -6.310520] },
  { nome: "Igreja Matriz", endereco: "Praça Central, Santo Antônio - RN", coords: [-35.475000, -6.312000] },
  { nome: "Supermercado Nordestão", endereco: "Av. Principal, Nova Cruz - RN", coords: [-35.440000, -6.470000] },
  { nome: "Shopping Natal", endereco: "Av. Sen. Salgado Filho, Natal - RN", coords: [-35.205600, -5.832400] }
];

const FluxoViagem = memo(({ aoSair, categoriaInicial = "VEM CAR" }) => { 
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

  const [pontoDestino, setPontoDestino] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [rota, setRota] = useState([]);
  const [posicaoCarro, setPosicaoCarro] = useState(PONTO_CARRO);
  const [rotacaoCarro, setRotacaoCarro] = useState(0);

  const [viewState, setViewState] = useState({
    longitude: PONTO_PASSAGEIRA[0],
    latitude: PONTO_PASSAGEIRA[1],
    zoom: 16.5,
    pitch: 0,
    bearing: 0
  });

  const modalidades = [
    { id: "VEM MOTO", preco: "R$ 6,00", desc: "Viagem rápida", icone: <Bike size={24} color="currentColor" /> },
    { id: "VEM CAR", preco: "R$ 10,00", desc: "Conforto no trajeto", icone: <CarFront size={24} color="currentColor" /> },
    { id: "VEM CAR FEMININO", preco: "R$ 12,00", desc: "Motoristas mulheres", icone: <CarFront size={24} color="currentColor" /> },
    { id: "VEM IFRN", preco: "R$ 15,00", desc: "Viagem intermunicipal", icone: <GraduationCap size={24} color="currentColor" /> }
  ];

  const modalidadeEscolhida = modalidades.find(m => m.id === categoria);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length > 1) {
        const filtrados = LOCAIS_MOCK.filter(l => l.nome.toLowerCase().includes(searchQuery.toLowerCase()));
        setSugestoes(filtrados);
        setShowSugestoes(true);
      } else {
        setSugestoes([]);
        setShowSugestoes(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleBusca = (e) => {
    setSearchQuery(e.target.value);
    setDestinoValido(false);
  };

  const handleSelecionarLocal = (local) => {
    setSearchQuery(local.nome);
    setDestinoValido(true);
    setShowSugestoes(false);
    setViewState(prev => ({
      ...prev,
      longitude: local.coords[0],
      latitude: local.coords[1],
      zoom: 17
    }));
  };

  const fetchRoute = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        const coordenadas = data.routes[0].geometry.coordinates;
        setRota(coordenadas);
        setPosicaoCarro(coordenadas[0]);
        if (coordenadas.length > 1) {
          setRotacaoCarro(getBearing(coordenadas[0], coordenadas[1]));
        }
        setViewState(prev => ({
          ...prev,
          longitude: coordenadas[0][0],
          latitude: coordenadas[0][1],
          zoom: 17
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let timer;
    if (etapa === "buscando") {
      timer = setTimeout(() => {
        setEtapa("a_caminho");
        fetchRoute(PONTO_CARRO, PONTO_PASSAGEIRA);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [etapa]);

  useEffect(() => {
    if (rota.length < 2 || !['a_caminho', 'em_corrida'].includes(etapa)) return;

    let animationFrameId;
    let currentIdx = 0;
    let progress = 0;
    let lastTime = performance.now();
    const VELOCIDADE = 0.000015;

    const animate = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      if (currentIdx >= rota.length - 1) {
        if (etapa === 'a_caminho') setEtapa('aguardando_embarque');
        else if (etapa === 'em_corrida') setEtapa('finalizada');
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
        setPosicaoCarro([currentLng, currentLat]);
        setRotacaoCarro(getBearing(p1, p2));

        setViewState((prev) => ({
          ...prev,
          longitude: currentLng,
          latitude: currentLat
        }));
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [rota, etapa]);

  const iniciarCorrida = () => {
    setRota([]);
    setEtapa("em_corrida");
    fetchRoute(PONTO_PASSAGEIRA, pontoDestino);
  };

  const confirmarDestino = () => {
    setPontoDestino([viewState.longitude, viewState.latitude]);
    setEtapa("orcamento");
  };

  const RenderBottomSheet = () => {
    switch (etapa) {
      case "selecao_destino":
        return (
          <>
            <h2 className="sheet-title">Para onde vamos?</h2>
            <div style={{ position: "relative" }}>
              <div className="input-viagem-wrapper">
                <Search color="#00BCD4" size={20} />
                <input
                  autoFocus
                  placeholder="Digite o destino (Ex: IFRN)"
                  value={searchQuery}
                  onChange={handleBusca}
                />
              </div>

              <AnimatePresence>
                {showSugestoes && sugestoes.length > 0 && (
                  <motion.div
                    className="dropdown-sugestoes"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {sugestoes.map((s, i) => (
                      <div key={i} className="item-sugestao" onClick={() => handleSelecionarLocal(s)}>
                        <div className="icone-sugestao"><MapPin size={18} color="#A1A1AA" /></div>
                        <div className="textos-sugestao">
                          <h4>{s.nome}</h4>
                          <p>{s.endereco}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, marginTop: 8 }}>
              <Navigation size={18} color="#64748B" />
              <p className="sheet-desc" style={{ fontSize: 13 }}>
                Arraste o mapa ou use a busca acima.
              </p>
            </div>

            <button 
              className="btn-viagem principal" 
              onClick={confirmarDestino}
              disabled={!destinoValido}
              style={{ opacity: destinoValido ? 1 : 0.5 }}
            >
              Confirmar Destino
            </button>
          </>
        );

      case "orcamento":
        return (
          <>
            <h3 className="sheet-subtitle">Escolha a Modalidade</h3>
            <div className="modalidades-grid">
              {modalidades.map((mod) => {
                const ehRosa = mod.id === "VEM CAR FEMININO";
                const selecionado = categoria === mod.id;
                return (
                  <div
                    key={mod.id}
                    className={`card-orcamento ${selecionado ? 'selecionado' : ''} ${ehRosa && selecionado ? 'sel-rosa' : ''}`}
                    onClick={() => setCategoria(mod.id)}
                  >
                    <div className={`icone-orcamento ${ehRosa ? 'icon-rosa' : ''}`}>
                      {mod.icone}
                    </div>
                    <div className="info-orcamento">
                      <h3>{mod.id === "VEM CAR FEMININO" ? "VEMCAR FEMINO" : mod.id}</h3>
                      <p>{mod.desc}</p>
                    </div>
                    <h2 className="preco-orcamento">{mod.preco}</h2>
                  </div>
                );
              })}
            </div>

            <h3 className="sheet-subtitle">Forma de Pagamento</h3>
            <div className="metodos-pagamento-grid">
              <button className={`btn-pagamento ${metodoPagamento === 'dinheiro' ? 'ativo' : ''}`} onClick={() => setMetodoPagamento("dinheiro")}>
                <CreditCard size={18} /> <span>Dinheiro</span>
              </button>
              <button className={`btn-pagamento ${metodoPagamento === 'pix' ? 'ativo' : ''}`} onClick={() => { setMetodoPagamento("pix"); setPrecisaTroco(false); }}>
                <QrCode size={18} /> <span>PIX</span>
              </button>
              <button className={`btn-pagamento ${metodoPagamento === 'cartao' ? 'ativo' : ''}`} onClick={() => { setMetodoPagamento("cartao"); setPrecisaTroco(false); }}>
                <CreditCard size={18} /> <span>Cartão</span>
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
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="troco-input-wrapper">
                      <input 
                        type="text" 
                        placeholder="Troco para quanto? (Ex: 50)" 
                        value={valorTroco} 
                        onChange={(e) => setValorTroco(e.target.value)} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button 
              className="btn-viagem principal" 
              onClick={() => setEtapa("buscando")}
              style={categoria === "VEM CAR FEMININO" ? { background: "#EC4899", color: "#FFF" } : {}}
            >
              Solicitar {categoria === "VEM CAR FEMININO" ? "VEMCAR FEMINO" : categoria}
            </button>
          </>
        );

      case "buscando":
        return (
          <div className="sheet-centralizado">
            <div className={`search-pulse-container ${categoria === "VEM CAR FEMININO" ? "rosa" : ""}`}>
              <Search size={40} color={categoria === "VEM CAR FEMININO" ? "#EC4899" : "#00BCD4"} />
            </div>
            <h2 className="sheet-title" style={{ marginTop: 24 }}>Localizando motorista...</h2>
            <p className="sheet-desc">Conectando com parceiros mais próximos.</p>
            <button className="btn-viagem secundario" onClick={() => setEtapa("selecao_destino")} style={{ marginTop: 32 }}>
              Cancelar Solicitação
            </button>
          </div>
        );

      case "a_caminho":
      case "aguardando_embarque":
      case "em_corrida":
        const ehVemFeminino = categoria === "VEM CAR FEMININO";
        const corDestaque = ehVemFeminino ? "#EC4899" : "#00BCD4";
        
        return (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ color: corDestaque, textTransform: "uppercase", fontSize: 13, fontWeight: 900, margin: 0 }}>
                {etapa === "a_caminho" ? "Motorista a caminho" : etapa === "aguardando_embarque" ? "A Motorista Chegou" : "Em corrida para o destino"}
              </h3>
            </div>

            <div className="perfil-motorista">
              <div className="avatar-motorista"><User size={32} color={corDestaque} /></div>
              <div className="info-motorista">
                <h2>{categoria === "VEM MOTO" ? "Lucas" : ehVemFeminino ? "Amanda" : "João Pedro"}</h2>
                <p>{categoria === "VEM MOTO" ? "Honda CG 160 Preta" : ehVemFeminino ? "Renault Kwid Rosa" : "Fiat Argo Branco"}</p>
              </div>
              <div className="badge-placa">QWE-9999</div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              {etapa === "aguardando_embarque" ? (
                <button className="btn-viagem principal" style={{ flex: 1, background: corDestaque, color: "#FFF" }} onClick={iniciarCorrida}>Embarcar (Iniciar)</button>
              ) : (
                <button className="btn-viagem secundario" style={{ flex: 1, pointerEvents: 'none' }}>Acompanhando trajeto...</button>
              )}
            </div>
          </>
        );

      case "finalizada":
        return (
          <div className="sheet-centralizado">
            <CheckCircle size={56} color={categoria === "VEM CAR FEMININO" ? "#EC4899" : "#00BCD4"} style={{ marginBottom: 16 }} />
            <h2 className="sheet-title">Destino Alcançado!</h2>
            <p className="sheet-desc">Valor final da sua corrida</p>
            <h1 className="preco-final" style={categoria === "VEM CAR FEMININO" ? { color: "#EC4899" } : {}}>{modalidadeEscolhida?.preco}</h1>
            <p className="sheet-desc" style={{ marginBottom: 12 }}>Forma escolhida: {metodoPagamento.toUpperCase()}</p>
            {metodoPagamento === "dinheiro" && precisaTroco && <p className="sheet-desc" style={{ marginBottom: 24, color: "#10B981" }}>Levar troco para R$ {valorTroco}</p>}
            <button className="btn-viagem principal" style={categoria === "VEM CAR FEMININO" ? { background: "#EC4899", color: "#FFF" } : {}} onClick={() => setEtapa("avaliacao")}>Confirmar Pagamento</button>
          </div>
        );

      case "avaliacao":
        return (
          <div className="sheet-centralizado">
            <h2 className="sheet-title">Avalie a viagem</h2>
            <p className="sheet-desc" style={{ marginBottom: 32 }}>Sua avaliação ajuda a manter a qualidade VEM.</p>
            <div className="avaliacao-estrelas">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div key={i} whileTap={{ scale: 0.8 }} className="botao-estrela" onClick={() => setNota(i)}>
                  <Star 
                    size={44} 
                    fill={i <= nota ? (categoria === "VEM CAR FEMININO" ? "#EC4899" : "#00BCD4") : "transparent"} 
                    color={categoria === "VEM CAR FEMININO" ? "#EC4899" : "#00BCD4"} 
                    strokeWidth={1.5} 
                  />
                </motion.div>
              ))}
            </div>
            <button className="btn-viagem principal" style={categoria === "VEM CAR FEMININO" ? { background: "#EC4899", color: "#FFF" } : {}} onClick={aoSair} disabled={nota === 0}>
              Enviar Avaliação
            </button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="viagem-container">
      <div className="mapa-layer" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onMoveStart={() => setIsDragging(true)}
          onMoveEnd={() => setIsDragging(false)}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          interactive={['selecao_destino', 'orcamento'].includes(etapa)}
          style={{ width: '100%', height: '100%' }}
        >
          {rota.length > 0 && (
            <Source id="rotaSource" type="geojson" data={{ type: 'Feature', geometry: { type: 'LineString', coordinates: rota } }}>
              <Layer id="rotaLayer" type="line" paint={{ 'line-color': categoria === 'VEM CAR FEMININO' ? '#EC4899' : '#00BCD4', 'line-width': 5, 'line-opacity': 0.8 }} />
            </Source>
          )}

          {['selecao_destino', 'orcamento', 'buscando', 'a_caminho', 'aguardando_embarque'].includes(etapa) && (
            <Marker longitude={PONTO_PASSAGEIRA[0]} latitude={PONTO_PASSAGEIRA[1]} anchor="center">
              <div className="ponto-embarque-verde"></div>
            </Marker>
          )}

          {etapa === 'selecao_destino' && (
            <Marker longitude={viewState.longitude} latitude={viewState.latitude} anchor="bottom">
              <div className={`pino-selecao-dinamico ${isDragging ? 'arrastando' : ''}`}>
                <div className="balao-pino">Definir Destino</div>
                <MapPin size={48} color="#000" fill="#00BCD4" strokeWidth={1.5} />
              </div>
            </Marker>
          )}

          {pontoDestino && ['orcamento', 'buscando', 'a_caminho', 'aguardando_embarque', 'em_corrida'].includes(etapa) && (
            <Marker longitude={pontoDestino[0]} latitude={pontoDestino[1]} anchor="bottom">
              <MapPin size={40} color="#000" fill={categoria === "VEM CAR FEMININO" ? "#EC4899" : "#00BCD4"} strokeWidth={1.5} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }} />
            </Marker>
          )}

          {['a_caminho', 'aguardando_embarque', 'em_corrida', 'finalizada'].includes(etapa) && (
            <Marker longitude={posicaoCarro[0]} latitude={posicaoCarro[1]} anchor="center" pitchAlignment="map" rotationAlignment="map" rotation={rotacaoCarro}>
              <div>
                {categoria === "VEM MOTO" ? (
                  <svg width="50" height="90" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="headlightGlowMoto" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon points="36,45 20,0 60,0 44,45" fill="url(#headlightGlowMoto)" />
                    <rect x="36" y="30" width="8" height="20" rx="4" fill="#1E293B" />
                    <rect x="24" y="45" width="32" height="4" rx="2" fill="#94A3B8" />
                    <path d="M 32 45 L 48 45 L 44 85 L 36 85 Z" fill="#00BCD4" />
                    <circle cx="40" cy="65" r="9" fill="#0F172A" stroke="#333" strokeWidth="2" />
                    <rect x="36" y="80" width="8" height="22" rx="4" fill="#1E293B" />
                    <rect x="36" y="100" width="8" height="4" rx="2" fill="#EF4444" />
                  </svg>
                ) : categoria === "VEM CAR FEMININO" ? (
                  <svg width="60" height="90" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="headlightGlowRosa" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#FFF" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="bodyGradRosa" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F43F5E" />
                        <stop offset="40%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#BE185D" />
                      </linearGradient>
                    </defs>
                    <polygon points="26,45 -10,0 90,0 54,45" fill="url(#headlightGlowRosa)" />
                    <rect x="24" y="37" width="32" height="46" rx="8" fill="url(#bodyGradRosa)" />
                    <path d="M 29 47 Q 40 41 51 47 L 50 51 Q 40 47 30 51 Z" fill="rgba(255,255,255,0.8)" />
                    <path d="M 30 63 Q 40 67 50 63 L 49 61 Q 40 64 31 61 Z" fill="#4C1D95" opacity="0.8" />
                    <rect x="27" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
                    <rect x="45" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
                    <rect x="26" y="80" width="8" height="4" rx="2" fill="#EF4444" />
                    <rect x="46" y="80" width="8" height="4" rx="2" fill="#EF4444" />
                  </svg>
                ) : (
                  <svg width="60" height="90" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="headlightGlowPassageiro" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#FFF" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="bodyGradPainelPassageiro" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0EA5E9" />
                        <stop offset="40%" stopColor="#00BCD4" />
                        <stop offset="100%" stopColor="#0369A1" />
                      </linearGradient>
                    </defs>
                    <polygon points="26,45 -10,0 90,0 54,45" fill="url(#headlightGlowPassageiro)" />
                    <rect x="24" y="37" width="32" height="46" rx="8" fill="url(#bodyGradPainelPassageiro)" />
                    <path d="M 29 47 Q 40 41 51 47 L 50 51 Q 40 47 30 51 Z" fill="rgba(255,255,255,0.8)" />
                    <path d="M 30 63 Q 40 67 50 63 L 49 61 Q 40 64 31 61 Z" fill="#0C4A6E" opacity="0.8" />
                    <rect x="27" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
                    <rect x="45" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
                    <rect x="26" y="80" width="8" height="4" rx="2" fill="#EF4444" />
                    <rect x="46" y="80" width="8" height="4" rx="2" fill="#EF4444" />
                  </svg>
                )}
              </div>
            </Marker>
          )}
        </Map>
      </div>

      {['selecao_destino', 'orcamento'].includes(etapa) && (
        <div className="header-viagem">
          <button className="btn-voltar" onClick={aoSair}>
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={etapa}
          className="bottom-sheet-viagem"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          style={{ zIndex: 100 }}
        >
          <div className="sheet-drag" />
          {RenderBottomSheet()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default FluxoViagem;