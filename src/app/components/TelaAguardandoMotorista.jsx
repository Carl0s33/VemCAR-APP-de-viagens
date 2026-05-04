import React from "react";
import { motion } from "motion/react";
import { User, Phone, MessageCircle, Home } from "lucide-react";
import { MapaCidade } from "./MapaCidade";
import "./style/TelaAguardandoMotorista.css";

export default function TelaAguardandoMotorista({ onHome }) {
  return (
    <div className="aguardando-container">
      {/* Botão de voltar para Home no topo */}
      <button 
        onClick={onHome}
        style={{ position: "absolute", top: 50, left: 20, zIndex: 40, width: 44, height: 44, borderRadius: 22, background: "#000", border: "1px solid #1E1E1E", display: "flex", alignItems: "center", justifyCenter: "center", cursor: "pointer" }}
      >
        <Home size={20} color="#FFF" />
      </button>

      <div className="mapa-background">
        <MapaCidade mostrarRota={true} mostrarCarro={true} />
        
        <motion.div 
          className="card-motorista-flutuante"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="status-ao-vivo">
            <motion.div 
              className="ponto-pulso"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span className="texto-ao-vivo">Ao Vivo</span>
          </div>

          <h2 style={{ color: "#FFF", fontWeight: 900, fontSize: 22 }}>Chega em 2 min</h2>

          <div className="info-motorista-grid">
            <div className="foto-perfil-wrapper">
              <User size={32} color="#00E5FF" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ color: "#FFF", fontWeight: 800, fontSize: 18 }}>João Pedro</p>
              <p style={{ color: "#888", fontSize: 13, fontWeight: 500 }}>Fiat Argo Branco • QWE-9999</p>
            </div>
          </div>

          <div className="acoes-motorista">
            <motion.button whileTap={{ scale: 0.96 }} className="botao-contato">
              <Phone size={20} color="#00E5FF" />
              <span>Ligar</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} className="botao-contato">
              <MessageCircle size={20} color="#00E5FF" />
              <span>Mensagem</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}