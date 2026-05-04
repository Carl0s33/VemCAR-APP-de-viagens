import React, { useState } from "react";
import { MapaCidade } from "./MapaCidade";
import { MapPin, User, Star, X, Check, ChevronRight, Navigation, CircleDot } from "lucide-react";
import { motion } from "framer-motion";
import "./style/TelaAlertaCorrida.css";

export default function TelaAlertaCorrida({ aoAceitar, aoRejeitar, aoIniciarCorrida }) {
  const [corridaAceita, setCorridaAceita] = useState(false);

  const handleAceitar = () => {
    setCorridaAceita(true);
    if (aoAceitar) aoAceitar();
  };

  return (
    <div className="tela-alerta-wrapper" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden", zIndex: 9999 }}>
      
      {/* O mapa de fundo já está configurado para mostrar a rota tracejada */}
      <div className="mapa-background" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}>
        <MapaCidade mostrarRota={true} mostrarCarro={false} />
      </div>

      <div className="alerta-container-flutuante">
        <motion.div 
          className="alerta-card-inferior" 
          layout /* Faz a transição de altura ser animada automaticamente */
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          
          {/* SE A CORRIDA AINDA NÃO FOI ACEITA: Mostra tudo */}
          {!corridaAceita ? (
            <>
              <motion.div layout="position" className="alerta-header-card">
                <div className="alerta-badge-servico">
                  <div className="alerta-icone-usuario">
                    <User size={14} color="#000" strokeWidth={3} />
                  </div>
                  <span className="badge-texto">VEM CAR</span>
                </div>
                <h1 className="alerta-distancia-texto">3 min de distância</h1>
              </motion.div>
              
              <motion.div layout="position" className="alerta-info-passageiro">
                <div className="info-rating">
                  <Star size={16} fill="#F59E0B" color="#F59E0B" strokeWidth={2} />
                  <span>5,0</span>
                </div>
                <div className="divisor-ponto"></div>
                <span className="distancia-km">1,0 km (R$ 12,50)</span>
                <div className="divisor-ponto"></div>
                <span className="pagamento-tipo">Pix</span>
              </motion.div>

              <motion.div layout="position" className="nome-passageiro-destaque">
                <p>Passageiro: <strong>Carlos E.</strong></p>
              </motion.div>
              
              <motion.div layout="position" className="alerta-locais-container">
                <div className="local-item">
                  <CircleDot size={20} color="#34C759" strokeWidth={2.5} />
                  <div className="destino-texto">
                    <p className="nome-destino">R. São José, Centro</p>
                    <p className="cidade-destino">Santo Antônio - RN</p>
                  </div>
                </div>
                <div className="local-linha-conexao" />
                <div className="local-item">
                  <MapPin size={20} color="#00E5FF" strokeWidth={2.5} />
                  <div className="destino-texto">
                    <p className="nome-destino">IFRN Campus Nova Cruz</p>
                    <p className="cidade-destino">Nova Cruz - RN</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div layout="position" className="alerta-botoes-container">
                <button className="botao-acao-uber rejeitar" onClick={aoRejeitar}>
                  <X size={28} color="#FFF" strokeWidth={2} />
                </button>
                <button className="botao-acao-uber aceitar" onClick={handleAceitar}>
                  <Check size={28} color="#FFF" strokeWidth={2} />
                  <span>ACEITAR</span>
                </button>
              </motion.div>
            </>
          ) : (
            /* SE A CORRIDA FOI ACEITA: Interface minimalista estilo Uber */
            <motion.div 
              className="estado-a-caminho"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="info-compacta-topo">
                <div className="info-textos">
                  <h2 className="titulo-a-caminho">A caminho do passageiro</h2>
                  <p className="subtitulo-passageiro">Carlos E. • 1,0 km de distância</p>
                </div>
                <div className="icone-navegacao-redondo">
                  <Navigation size={20} color="#34C759" fill="#34C759" />
                </div>
              </div>

              <div className="swipe-container">
                <div className="swipe-setas">
                  <ChevronRight size={24} />
                  <ChevronRight size={24} />
                  <ChevronRight size={24} />
                </div>
                <span className="swipe-texto">INICIAR CORRIDA</span>
                
                <motion.div 
                  className="swipe-thumb"
                  drag="x"
                  dragConstraints={{ left: 0, right: 230 }}
                  dragElastic={0.1}
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 150) {
                      if (aoIniciarCorrida) aoIniciarCorrida();
                      console.log("Corrida iniciada!");
                    }
                  }}
                >
                  <Navigation size={24} color="#FFF" fill="#FFF" />
                </motion.div>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}