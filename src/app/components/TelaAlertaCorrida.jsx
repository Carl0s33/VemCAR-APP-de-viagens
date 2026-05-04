import React from "react";
import { motion } from "motion/react";
import { User, Star, MapPin, X, Check } from "lucide-react";
import "./style/TelaAlertaCorrida.css";

export default function TelaAlertaCorrida({ aoAceitar, aoRejeitar }) {
  return (
    <div className="alerta-container-flutuante">
      <motion.div 
        className="alerta-card-inferior"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="alerta-header-card">
           <div className="alerta-badge-servico">
            <div className="alerta-icone-usuario">
              <User size={14} strokeWidth={3} color="#000" />
            </div>
            <span className="badge-texto">VEM CAR</span>
          </div>
          <h1 className="alerta-distancia-texto">3 min de distância</h1>
        </div>

        <div className="alerta-info-passageiro">
          <div className="info-rating">
            <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
            <span>5,0</span>
          </div>
          <div className="divisor-ponto" />
          <span className="distancia-km">1,0 km (R$ 12,50)</span>
        </div>

        <div className="alerta-card-destino">
          <MapPin size={18} color="#00E5FF" strokeWidth={2.5} />
          <div className="destino-texto">
            <p className="nome-destino">IFRN Campus Nova Cruz</p>
          </div>
        </div>

        <div className="alerta-botoes-container">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="botao-acao-uber rejeitar" 
            onClick={aoRejeitar}
          >
            <X size={28} color="#FFF" />
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="botao-acao-uber aceitar" 
            onClick={aoAceitar}
          >
            <Check size={28} color="#FFF" />
            <span>ACEITAR</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}