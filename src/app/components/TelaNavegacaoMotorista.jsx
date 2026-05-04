import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, User, ArrowRight, Settings, MapPin, Navigation, CheckSquare, Star } from "lucide-react";
import { MapaCidade } from "./MapaCidade";
import "./style/TelaNavegacaoMotorista.css";

export default function TelaNavegacaoMotorista({ aoChegar }) {
  // Fases: "indo_embarque" -> "aguardando" -> "em_corrida"
  const [fase, setFase] = useState("indo_embarque");
  const [mostrarAvaliacao, setMostrarAvaliacao] = useState(false);
  const [nota, setNota] = useState(0);

  const lidarComSwipe = (e, info) => {
    // Se arrastar mais que 150px, ativa a ação
    if (info.offset.x > 150) {
      if (fase === "aguardando") {
        setFase("em_corrida");
      } else if (fase === "em_corrida") {
        setMostrarAvaliacao(true); // Abre a avaliação ao invés de sair direto
      }
    }
  };

  return (
    <div className="tela-navegacao-motorista-container">
      {/* Mapa com Rota */}
      <div className="tela-navegacao-motorista-mapa-wrapper">
        <MapaCidade mostrarRota mostrarCarro />
      </div>

      {/* Card de Endereço - Topo */}
      <motion.div
        key={fase}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="tela-navegacao-motorista-endereco"
      >
        <div className="endereco-info">
          {fase === "indo_embarque" && <User size={20} color="#00E5FF" />}
          {fase === "aguardando" && <CheckSquare size={20} color="#34C759" />}
          {fase === "em_corrida" && <MapPin size={20} color="#EF4444" />}
          
          <div>
            <p className="endereco-titulo">
              {fase === "indo_embarque" ? "Buscar Ana" : 
               fase === "aguardando" ? "Aguardando Ana..." : 
               "Deixar Ana"}
            </p>
            <p className="endereco-subtitulo">
              {fase === "indo_embarque" || fase === "aguardando" 
                ? "R. Santo Antônio, 42 - Centro" 
                : "IFRN Campus Nova Cruz"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Barra de Status Média */}
      <motion.div
        className="tela-navegacao-motorista-barra-status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Settings size={20} color="#888888" strokeWidth={2} />
        
        <div className="tela-navegacao-motorista-tempo">
          <div className="tela-navegacao-motorista-bolinha-verde" style={{ background: fase === "em_corrida" ? "#00E5FF" : "#34C759" }} />
          <span>{fase === "em_corrida" ? "12 min" : "2 min"}</span>
        </div>
        
        <div className="tela-navegacao-motorista-distancia">
          <Navigation size={18} color="#888888" strokeWidth={2} />
          <span>{fase === "em_corrida" ? "4,5 km" : "1,0 km"}</span>
        </div>
      </motion.div>

      {/* Painel Inferior de Controle */}
      <motion.div
        className="tela-navegacao-motorista-painel-inferior"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Linha 1: Info Passageiro */}
        <div className="tela-navegacao-motorista-acoes">
          <motion.button whileTap={{ scale: 0.95 }} className="tela-navegacao-motorista-botao-acao">
            <Phone size={24} color="#FFFFFF" strokeWidth={2.5} />
          </motion.button>
          
          <div style={{ textAlign: "center" }}>
            <h2 className="tela-navegacao-motorista-nome-passageiro">Ana</h2>
            <div className="rating-passageiro">⭐ 5.0</div>
          </div>
          
          <motion.button whileTap={{ scale: 0.95 }} className="tela-navegacao-motorista-botao-acao">
            <User size={24} color="#FFFFFF" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Linha 2: Ação Dinâmica (Botão ou Swipe) */}
        {fase === "indo_embarque" ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setFase("aguardando")}
            className="btn-cheguei-matte"
          >
            CHEGUEI AO LOCAL
          </motion.button>
        ) : (
          <div className={`swipe-container-matte ${fase === "em_corrida" ? "encerrar" : "iniciar"}`}>
            <span className="swipe-texto">
              {fase === "aguardando" ? "DESLIZE PARA INICIAR" : "DESLIZE PARA ENCERRAR"}
            </span>
            <motion.div
              className="swipe-thumb-matte"
              drag="x"
              dragConstraints={{ left: 0, right: 240 }}
              dragElastic={0.1}
              onDragEnd={lidarComSwipe}
            >
              <ArrowRight size={24} color={fase === "aguardando" ? "#000" : "#FFF"} strokeWidth={3} />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* MODAL DE AVALIAÇÃO DA CORRIDA */}
      <AnimatePresence>
        {mostrarAvaliacao && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="modal-conteudo-matte"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="alca-drag" style={{ width: 48, height: 6, background: "#2A2A2A", borderRadius: 10, margin: "0 auto 24px" }} />
              
              <h2 className="modal-titulo-avaliacao">Recebimento e Avaliação</h2>
              <p className="modal-desc-avaliacao">Confirme o recebimento em dinheiro e avalie a passageira Ana.</p>

              <div style={{ background: "#1A1A1A", padding: "16px", borderRadius: "16px", marginBottom: "24px", width: "100%"}}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "#888", fontWeight: 800 }}>Vou Pago?</span>
                  <span style={{ color: "#FFF", fontWeight: 900 }}>Sim, Dinheiro vivo</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888", fontWeight: 800 }}>Total</span>
                  <span style={{ color: "#34C759", fontWeight: 900, fontSize: "18px" }}>R$ 12,50</span>
                </div>
              </div>

              <div className="estrelas-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    className="estrela-btn"
                    onClick={() => setNota(star)}
                  >
                    <Star 
                      size={40} 
                      color={star <= nota ? "#34C759" : "#333"} 
                      fill={star <= nota ? "#34C759" : "transparent"}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>

              <motion.button 
                className="btn-enviar-avaliacao"
                whileTap={{ scale: 0.95 }}
                disabled={nota === 0}
                style={{ 
                  opacity: nota === 0 ? 0.5 : 1,
                  width: "100%",
                  height: "64px",
                  borderRadius: "20px",
                  background: "#34C759", /* VERDE */
                  border: "none",
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#000",
                  cursor: "pointer",
                  marginTop: "24px"
                }}
                onClick={() => {
                  setMostrarAvaliacao(false);
                  setTimeout(aoChegar, 300); // Aguarda fechar o modal e chama onChegar
                }}
              >
                CONFIRMAR E AVALIAR
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}