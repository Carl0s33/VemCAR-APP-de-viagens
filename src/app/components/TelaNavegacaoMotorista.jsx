import React, { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Phone, User, CheckCircle, Navigation, Star, MapPin, CornerUpRight, CornerUpLeft, ArrowUp } from 'lucide-react';
import './style/TelaNavegacaoMotorista.css';

// Calcula a rotação (yaw) do carro com base em 2 coordenadas
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

export default function TelaNavegacaoMotorista({ aoFinalizar }) {
  // Coordenadas originais do Leaflet [Lat, Lng] agora convertidas para [Lng, Lat] para MapLibre
  const PONTO_CARRO = [-35.43287109072976, -6.478766136858235];
  const PONTO_PASSAGEIRA = [-35.43350494820496, -6.480733831089614];
  const PONTO_DESTINO = [-35.44523200903737, -6.470226792030399];

  const mapRef = useRef(null);

  const [fase, setFase] = useState('a_caminho'); // a_caminho, aguardando, em_corrida, finalizada, avaliacao, livre
  const [rota, setRota] = useState([]);
  const [passos, setPassos] = useState([]);
  const [instrucaoAtual, setInstrucaoAtual] = useState(null);
  const [posicaoCarro, setPosicaoCarro] = useState(PONTO_CARRO);
  const [rotacaoCarro, setRotacaoCarro] = useState(0);
  const [nota, setNota] = useState(0); // Nota da avaliação

  // Controle da câmera (visão 3ª pessoa)
  const [viewState, setViewState] = useState({
    longitude: PONTO_CARRO[0],
    latitude: PONTO_CARRO[1],
    zoom: 17,
    pitch: 60, // Bastante inclinado para dar a sensação 3D atrás do carro
    bearing: 0
  });

  const fetchRoute = async (start, end) => {
    try {
      // OSRM: lon,lat
      const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&steps=true&overview=full`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        const coordenadas = data.routes[0].geometry.coordinates; // MapLibre usa [Lng, Lat] nativamente!
        const steps = data.routes[0].legs[0].steps;
        
        setRota(coordenadas);
        setPassos(steps);
        setPosicaoCarro(coordenadas[0]);
        let initialBearing = 0;
        if (coordenadas.length > 1) {
          initialBearing = getBearing(coordenadas[0], coordenadas[1]);
          setRotacaoCarro(initialBearing);
        }
        
        // Em 3ª pessoa, mantemos a câmera focada no carro logo de cara
        setViewState((prev) => ({
          ...prev,
          longitude: coordenadas[0][0],
          latitude: coordenadas[0][1],
          bearing: initialBearing
        }));

        if (steps && steps.length > 0) {
          atualizarInstrucao(0, steps);
        }
      }
    } catch (e) {
      console.error("Erro ao buscar rota:", e);
    }
  };

  const atualizarInstrucao = (distPercorrida, rotaPassos = passos) => {
    let distAcumulada = 0;
    for (let passo of rotaPassos) {
      distAcumulada += passo.distance;
      if (distAcumulada > distPercorrida) {
        setInstrucaoAtual({
          distancia: Math.round(distAcumulada - distPercorrida),
          nomeRua: passo.name || "Rota desconhecida",
          tipoCurva: passo.maneuver.modifier
        });
        break;
      }
    }
  };

  // Fase inicial
  useEffect(() => {
    if (fase === 'a_caminho') {
      fetchRoute(PONTO_CARRO, PONTO_PASSAGEIRA);
    }
  }, [fase]);

  // Animação Contínua Fluida a 60fps (Sem parecer slide)
  useEffect(() => {
    if (rota.length < 2 || fase === 'aguardando' || fase === 'finalizada' || fase === 'avaliacao' || fase === 'livre') return;

    let animationFrameId;
    let currentIdx = 0;
    let progress = 0;
    let lastTime = performance.now();

    // Velocidade escalar contínua (graus no mapa por milissegundo)
    // Esse valor deixa o carro devagar, seguindo a rota suavemente
    const VELOCIDADE = 0.000015;

    const animate = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      // Chegou ao fim do array
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

      // Se a distância for minúscula (nós colados duplicados do OSRM), salta o index
      if (dist < 0.000001) {
        currentIdx++;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const passo = (VELOCIDADE * dt) / dist;
      progress += passo;

      if (progress >= 1) {
        // Passou pro próximo segmento da rua
        progress = 0;
        currentIdx++;
      } else {
        // Interpola a coordenada exata
        const currentLng = p1[0] + dx * progress;
        const currentLat = p1[1] + dy * progress;
        const newBearing = getBearing(p1, p2);

        setPosicaoCarro([currentLng, currentLat]);
        
        // Calcular a distância do percurso para atualizar as manobras
        let distPercorrida = 0;
        for (let i = 0; i < currentIdx; i++) {
          const pt1 = rota[i];
          const pt2 = rota[i+1];
          // Aproximação de distância em metros simplificada (Haversine é melhor mas isso basta pra UI local)
          distPercorrida += Math.sqrt(Math.pow(pt2[0]-pt1[0], 2) + Math.pow(pt2[1]-pt1[1], 2)) * 111000;
        }
        if (passos.length > 0) {
          atualizarInstrucao(distPercorrida, passos);
        }
        
        // Atualiza a câmera frame a frame
        setViewState((prev) => ({
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

  const handleIniciarCorrida = () => {
    setRota([]); // limpa rota atual
    setFase('em_corrida');
    fetchRoute(PONTO_PASSAGEIRA, PONTO_DESTINO);
  };

  const handleConcluir = () => {
    setFase('avaliacao');
  };

  const handleEnviarAvaliacao = () => {
    setFase('livre');
    setRota([]);
    setPassos([]);
    setInstrucaoAtual(null);
    // Retorna a câmera para uma visão mais ampla no local onde terminou
    setViewState(prev => ({
      ...prev,
      pitch: 45,
      zoom: 16
    }));
  };

  const getIconeManeobra = (modificador) => {
    if (!modificador) return <ArrowUp size={32} color="#FFFFFF" />;
    if (modificador.includes('left')) return <CornerUpLeft size={32} color="#FFFFFF" />;
    if (modificador.includes('right')) return <CornerUpRight size={32} color="#FFFFFF" />;
    return <ArrowUp size={32} color="#FFFFFF" />;
  };

  // Layer da linha da Rota
  const rotaGeojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: rota
    }
  };

  return (
    <div className="navegacao-tela-container">
      <div className="navegacao-mapa">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          interactive={false}
          style={{ width: '100%', height: '100%' }}
        >
          {rota.length > 0 && (
            <Source id="rotaSource" type="geojson" data={rotaGeojson}>
              <Layer
                id="rotaLayer"
                type="line"
                paint={{
                  'line-color': '#00BCD4',
                  'line-width': 6,
                  'line-opacity': 0.8
                }}
              />
            </Source>
          )}

          {/* Marcador do Carro */}
          <Marker 
            longitude={posicaoCarro[0]} 
            latitude={posicaoCarro[1]} 
            anchor="center"
          >
            <div 
              style={{
                // Removidas as transições CSS. O requestAnimationFrame
                // atualiza a localização a 60 frames por segundo nativamente!
              }}
              className="car-marker-3d"
            >
              {/* Ícone vetorizado de carro super estiloso */}
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))' }}>
                <rect x="30" y="15" width="40" height="70" rx="12" fill="#00BCD4" />
                <path d="M34 35 Q50 28 66 35 L62 45 Q50 42 38 45 Z" fill="#0F172A" />
                <path d="M36 65 Q50 72 64 65 L60 55 Q50 58 40 55 Z" fill="#0F172A" />
                <rect x="26" y="40" width="4" height="10" rx="2" fill="#0F172A" />
                <rect x="70" y="40" width="4" height="10" rx="2" fill="#0F172A" />
                <path d="M 40 90 L 45 100 L 55 100 L 60 90 Z" fill="rgba(0,188,212,0.3)" /> {/* Rasto simples de velocidade */}
              </svg>
            </div>
          </Marker>

          {/* Pino do Destino/Passageira */}
          {(fase === 'a_caminho' || fase === 'aguardando') && (
            <Marker longitude={PONTO_PASSAGEIRA[0]} latitude={PONTO_PASSAGEIRA[1]} anchor="bottom">
              <MapPin size={32} color="#FFFFFF" fill="#0F172A" strokeWidth={2} />
            </Marker>
          )}

          {(fase === 'em_corrida' || fase === 'finalizada') && (
            <Marker longitude={PONTO_DESTINO[0]} latitude={PONTO_DESTINO[1]} anchor="bottom">
              <MapPin size={32} color="#FFFFFF" fill="#00BCD4" strokeWidth={2} />
            </Marker>
          )}
        </Map>
      </div>

      {instrucaoAtual && (fase === 'a_caminho' || fase === 'em_corrida') && (
        <div className="painel-curva-topo">
          <div className="curva-icone-container">
            {getIconeManeobra(instrucaoAtual.tipoCurva)}
          </div>
          <div className="curva-infos">
            <div className="curva-distancia">A {instrucaoAtual.distancia}m vire à {instrucaoAtual.tipoCurva?.includes('left') ? 'esquerda' : instrucaoAtual.tipoCurva?.includes('right') ? 'direita' : 'frente'} na</div>
            <div className="curva-rua">{instrucaoAtual.nomeRua ? instrucaoAtual.nomeRua : 'Rua principal'}</div>
          </div>
        </div>
      )}

      <div className="navegacao-painel-flutuante">
        {fase === 'a_caminho' && (
          <div className="painel-conteudo">
            <div className="painel-flex">
              <div className="avatar-icon"><User size={24} color="#00BCD4" /></div>
              <div className="painel-textos">
                <span className="texto-destaque">Buscando Ana</span>
                <span className="texto-secundario">
                  <Star size={14} className="star-icon" /> 5.0
                </span>
              </div>
              <Phone size={24} color="#00BCD4" className="icone-acao" />
            </div>
            <div className="aviso-simulacao">Viajando até a passageira...</div>
          </div>
        )}

        {fase === 'aguardando' && (
          <div className="painel-conteudo painel-centralizado">
            <CheckCircle size={48} color="#00BCD4" className="icone-central" />
            <h3 className="titulo-chegada">Motorista Chegou!</h3>
            <p className="texto-aviso">Passageira Ana está aguardando no local de embarque.</p>
            <button className="botao-ciano" onClick={handleIniciarCorrida}>
              Iniciar Corrida
            </button>
          </div>
        )}

        {fase === 'em_corrida' && (
          <div className="painel-conteudo">
            <div className="painel-flex">
              <div className="avatar-icon"><MapPin size={24} color="#00BCD4" /></div>
              <div className="painel-textos">
                <span className="texto-destaque">A caminho do Destino</span>
                <span className="texto-secundario">Direção: Centro</span>
              </div>
            </div>
            <div className="aviso-simulacao">Simulando trajeto da corrida...</div>
          </div>
        )}

        {fase === 'finalizada' && (
          <div className="painel-conteudo painel-centralizado">
            <CheckCircle size={56} color="#00BCD4" className="icone-central" />
            <div className="titulo-chegada">Corrida Finalizada</div>
            <div className="texto-secundario">Pagamento pendente na plataforma</div>
            <div className="valor-corrida">R$ 14,50</div>
            <button className="botao-ciano" onClick={handleConcluir}>
              Avaliar Passageira
            </button>
          </div>
        )}

        {fase === 'avaliacao' && (
          <div className="painel-conteudo painel-centralizado">
            <div className="titulo-chegada">Como foi a viagem?</div>
            <div className="texto-secundario">Avalie a passageira Ana</div>
            
            <div className="avaliacao-estrelas">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  className="botao-estrela"
                  onClick={() => setNota(star)}
                >
                  <Star 
                    size={40} 
                    fill={star <= nota ? "#00BCD4" : "transparent"} 
                    color={star <= nota ? "#00BCD4" : "#CBD5E1"} 
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <button 
              className="botao-ciano" 
              onClick={handleEnviarAvaliacao}
              disabled={nota === 0}
              style={{ opacity: nota === 0 ? 0.5 : 1 }}
            >
              Enviar e Ficar Online
            </button>
          </div>
        )}

        {fase === 'livre' && (
          <div className="painel-conteudo">
            <div className="painel-flex">
              <div className="avatar-icon" style={{ backgroundColor: '#E2E8F0' }}>
                <div className="ponto-pulsante" />
              </div>
              <div className="painel-textos">
                <span className="texto-destaque">Você está Online</span>
                <span className="texto-secundario">Aguardando novas viagens no centro...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}