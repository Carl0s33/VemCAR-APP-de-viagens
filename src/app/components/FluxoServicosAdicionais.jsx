import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package, ShoppingBag, Send, ArrowLeft, MapPin,
    Box, CreditCard, Search, CheckCircle, Navigation
} from "lucide-react";
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./style/FluxoServicosAdicionais.css";

const PONTO_INICIAL = [-35.433504, -6.480733]; // IFRN Nova Cruz

export default function FluxoServicosAdicionais({ servico, onBack }) {
    // Etapas Entregas: definir_coleta -> definir_destino -> detalhes -> orcamento -> buscando -> finalizado
    const [etapa, setEtapa] = useState(servico === "entregas" ? "definir_coleta" : "formulario");

    // Estados para o Mapa (Exclusivo do fluxo de Entregas)
    const mapRef = useRef(null);
    const [viewState, setViewState] = useState({
        longitude: PONTO_INICIAL[0],
        latitude: PONTO_INICIAL[1],
        zoom: 16.5
    });
    const [pontoColeta, setPontoColeta] = useState(null);
    const [pontoDestino, setPontoDestino] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [rota, setRota] = useState([]);

    // Conteúdo do pacote
    const [conteudo, setConteudo] = useState("");

    // Simulação de busca do entregador
    useEffect(() => {
        let timer;
        if (etapa === "buscando") {
            timer = setTimeout(() => {
                setEtapa("finalizado");
            }, 4000);
        }
        return () => clearTimeout(timer);
    }, [etapa]);

    const fetchRoute = async (start, end) => {
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.routes && data.routes[0]) {
                const coordenadas = data.routes[0].geometry.coordinates;
                setRota(coordenadas);

                // Ajusta a câmera para centralizar a rota
                const midLng = (start[0] + end[0]) / 2;
                const midLat = (start[1] + end[1]) / 2;
                if (mapRef.current) {
                    mapRef.current.getMap().flyTo({
                        center: [midLng, midLat],
                        zoom: 14.5,
                        duration: 1000
                    });
                }
            }
        } catch (e) {
            console.error("Erro rota:", e);
        }
    };

    const renderConteudoNormal = () => {
        if (servico === "mercado") {
            return (
                <div className="servico-extra-conteudo">
                    <h2 className="servico-extra-titulo">VEM Mercado</h2>
                    <p className="servico-extra-desc">Faça suas compras sem sair de casa.</p>
                    <div className="card-item-destaque">
                        <ShoppingBag size={24} color="#00BCD4" />
                        <div>
                            <h3 className="titulo-destaque">Supermercado Ideal</h3>
                            <p className="desc-destaque">Entrega em até 40 min</p>
                        </div>
                    </div>
                    <button className="btn-servico-principal mt-auto" onClick={onBack}>Voltar ao Início</button>
                </div>
            );
        }

        if (servico === "envios") {
            return (
                <div className="servico-extra-conteudo">
                    <h2 className="servico-extra-titulo">Envios</h2>
                    <p className="servico-extra-desc">Mande pacotes para qualquer lugar de Nova Cruz.</p>
                    <div className="card-item-destaque">
                        <Send size={24} color="#00BCD4" />
                        <div>
                            <h3 className="titulo-destaque">Ponto de Coleta</h3>
                            <p className="desc-destaque">Defina onde retirar o pacote</p>
                        </div>
                    </div>
                    <button className="btn-servico-principal mt-auto" onClick={onBack}>Voltar ao Início</button>
                </div>
            );
        }
        return null;
    };

    const renderBottomSheetEntregas = () => {
        switch(etapa) {
            case "definir_coleta":
                return (
                    <div className="bottom-sheet-content">
                        <h2 className="servico-extra-titulo">Onde vamos coletar?</h2>
                        <p className="servico-extra-desc">Mova o mapa para o ponto exato de retirada.</p>
                        <button
                            className="btn-servico-principal"
                            onClick={() => {
                                setPontoColeta([viewState.longitude, viewState.latitude]);
                                setEtapa("definir_destino");
                            }}
                        >
                            Confirmar Coleta
                        </button>
                    </div>
                );

            case "definir_destino":
                return (
                    <div className="bottom-sheet-content">
                        <h2 className="servico-extra-titulo">Onde vamos entregar?</h2>
                        <p className="servico-extra-desc">Mova o mapa para o destino final.</p>
                        <button
                            className="btn-servico-principal"
                            onClick={() => {
                                const destino = [viewState.longitude, viewState.latitude];
                                setPontoDestino(destino);
                                setEtapa("detalhes");
                                fetchRoute(pontoColeta, destino);
                            }}
                        >
                            Confirmar Destino
                        </button>
                    </div>
                );

            case "detalhes":
                return (
                    <div className="bottom-sheet-content">
                        <h2 className="servico-extra-titulo">Detalhes do Pacote</h2>
                        <p className="servico-extra-desc">O que o motorista vai transportar?</p>

                        <div className="entrega-form-group">
                            <input
                                autoFocus
                                className="entrega-input"
                                placeholder="Ex: Documentos, Chaves, Roupas..."
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn-servico-principal"
                            disabled={!conteudo}
                            onClick={() => setEtapa("orcamento")}
                        >
                            Ver Orçamento
                        </button>
                    </div>
                );

            case "orcamento":
                return (
                    <div className="bottom-sheet-content">
                        <h2 className="servico-extra-titulo">Resumo da Entrega</h2>
                        <div className="entrega-resumo-card">
                            <div className="resumo-linha">
                                <Box size={18} color="#888" />
                                <span><strong>Item:</strong> {conteudo}</span>
                            </div>
                        </div>

                        <div className="card-orcamento-entrega">
                            <div className="icone-orcamento-entrega"><Package size={28} color="#000" /></div>
                            <div className="info-orcamento-entrega">
                                <h3>VEM Entrega MOTO</h3>
                                <p>Até 10kg • Rápido</p>
                            </div>
                            <h2 className="preco-orcamento-entrega">R$ 8,00</h2>
                        </div>

                        <button className="btn-servico-principal" onClick={() => setEtapa("buscando")}>
                            Confirmar Pedido
                        </button>
                    </div>
                );

            case "buscando":
                return (
                    <div className="bottom-sheet-content centralizado">
                        <div className="search-pulse-container-entrega">
                            <Search size={40} color="#00BCD4" />
                        </div>
                        <h2 className="servico-extra-titulo" style={{ marginTop: 24, textAlign: "center" }}>Buscando entregador...</h2>
                        <button className="btn-servico-secundario" style={{ marginTop: 24 }} onClick={() => setEtapa("definir_coleta")}>
                            Cancelar Pedido
                        </button>
                    </div>
                );

            case "finalizado":
                return (
                    <div className="bottom-sheet-content centralizado">
                        <CheckCircle size={64} color="#10B981" style={{ marginBottom: 16 }} />
                        <h2 className="servico-extra-titulo" style={{ textAlign: "center" }}>Entregador a caminho!</h2>
                        <p className="servico-extra-desc" style={{ textAlign: "center", marginBottom: 32 }}>
                            O parceiro está a caminho do ponto de coleta.
                        </p>
                        <button className="btn-servico-principal" onClick={onBack}>Voltar ao Início</button>
                    </div>
                );

            default:
                return null;
        }
    };

    const isMapMode = servico === "entregas";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`servicos-adicionais-container ${isMapMode ? 'map-mode' : ''}`}
        >
            {/* MODO MAPA (ENTREGAS) */}
            {isMapMode && (
                <div className="mapa-layer">
                    <Map
                        ref={mapRef}
                        {...viewState}
                        onMove={evt => setViewState(evt.viewState)}
                        onMoveStart={() => setIsDragging(true)}
                        onMoveEnd={() => setIsDragging(false)}
                        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                        interactive={['definir_coleta', 'definir_destino'].includes(etapa)}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {/* Rota (Exibe do Orçamento em diante) */}
                        {rota.length > 0 && ['detalhes', 'orcamento', 'buscando', 'finalizado'].includes(etapa) && (
                            <Source id="rotaEntrega" type="geojson" data={{ type: 'Feature', geometry: { type: 'LineString', coordinates: rota } }}>
                                <Layer id="rotaLayer" type="line" paint={{ 'line-color': '#00BCD4', 'line-width': 4, 'line-dasharray': [2, 2], 'line-opacity': 0.8 }} />
                            </Source>
                        )}

                        {/* PINO DINÂMICO DE COLETA */}
                        {etapa === 'definir_coleta' && (
                            <Marker longitude={viewState.longitude} latitude={viewState.latitude} anchor="bottom">
                                <div className={`pino-selecao-dinamico ${isDragging ? 'arrastando' : ''}`}>
                                    <div className="balao-pino" style={{ color: "#10B981" }}>Ponto de Coleta</div>
                                    <MapPin size={48} color="#000" fill="#10B981" strokeWidth={1.5} />
                                </div>
                            </Marker>
                        )}

                        {/* PINO FIXO DE COLETA (Verde) */}
                        {pontoColeta && etapa !== 'definir_coleta' && (
                            <Marker longitude={pontoColeta[0]} latitude={pontoColeta[1]} anchor="bottom">
                                <MapPin size={40} color="#000" fill="#10B981" strokeWidth={1.5} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }} />
                            </Marker>
                        )}

                        {/* PINO DINÂMICO DE DESTINO */}
                        {etapa === 'definir_destino' && (
                            <Marker longitude={viewState.longitude} latitude={viewState.latitude} anchor="bottom">
                                <div className={`pino-selecao-dinamico ${isDragging ? 'arrastando' : ''}`}>
                                    <div className="balao-pino" style={{ color: "#00BCD4" }}>Destino</div>
                                    <MapPin size={48} color="#000" fill="#00BCD4" strokeWidth={1.5} />
                                </div>
                            </Marker>
                        )}

                        {/* PINO FIXO DE DESTINO (Ciano) */}
                        {pontoDestino && ['detalhes', 'orcamento', 'buscando', 'finalizado'].includes(etapa) && (
                            <Marker longitude={pontoDestino[0]} latitude={pontoDestino[1]} anchor="bottom">
                                <MapPin size={40} color="#000" fill="#00BCD4" strokeWidth={1.5} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }} />
                            </Marker>
                        )}
                    </Map>
                </div>
            )}

            {/* HEADER (Transparente no mapa, Sólido nas outras telas) */}
            <div className="header-servicos">
                <button
                    className="btn-voltar-servicos"
                    onClick={() => {
                        if (!isMapMode) return onBack();
                        if (etapa === "definir_coleta") return onBack();
                        if (etapa === "definir_destino") return setEtapa("definir_coleta");
                        if (etapa === "detalhes") return setEtapa("definir_destino");
                        if (etapa === "orcamento") return setEtapa("detalhes");
                        onBack();
                    }}
                >
                    <ArrowLeft size={24} color="#FFF" />
                </button>
                <h1 className="titulo-header-servicos">
                    {servico === "entregas" ? "" : servico === "mercado" ? "Mercado" : "Envios"}
                </h1>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={etapa + servico}
                    initial={{ opacity: 0, y: isMapMode ? "100%" : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: isMapMode ? "100%" : -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className={isMapMode ? "bottom-sheet-entregas" : "animacao-wrapper"}
                >
                    {isMapMode && <div className="sheet-drag" />}
                    {isMapMode ? renderBottomSheetEntregas() : renderConteudoNormal()}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}