import React, { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Phone, AlertTriangle, Home, Star, Navigation } from "lucide-react";
// CORREÇÃO: Importando com chaves porque MapaCidade usa named export
import { MapaCidade } from "./MapaCidade"; 
import "./style/TelaViagem.css";

const DRIVER_PHOTO = "https://images.unsplash.com/photo-1536548665027-b96d34a005ae?fit=max&fm=jpg&q=80&w=400";

// Componente Interno da Placa
function MercosulPlate({ plate }) {
  return (
    <div className="mercosul-plate">
      <div className="mercosul-plate-banner">
        <div className="mercosul-plate-banner-left">
          <svg width="14" height="10" viewBox="0 0 14 10">
            <rect width="14" height="10" fill="#009C3B" />
            <polygon points="7,1 13,5 7,9 1,5" fill="#FEDF00" />
            <circle cx="7" cy="5" r="2.2" fill="#002776" />
          </svg>
          <span className="mercosul-plate-country">BRASIL</span>
        </div>
        <span className="mercosul-plate-region">MERCOSUL</span>
      </div>
      <div className="mercosul-plate-chars">
        <p>{plate}</p>
      </div>
    </div>
  );
}

// Componente Principal da Tela
export default function TelaViagem({ onFinish, onBack }) {
  return (
    <div className="tela-viagem-container">
      <div className="mapa-viagem-background">
        <MapaCidade mostrarRota={true} mostrarCarro={true} />
      </div>

      <button className="botao-voltar-viagem" onClick={onBack}>
        <Home size={20} color="#FFF" />
      </button>

      <motion.div 
        className="card-viagem-status"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="status-tempo-chegada">
          <Navigation size={16} color="#00E5FF" />
          <span>Chegada prevista: 14:35</span>
        </div>

        <div className="perfil-motorista-viagem">
          <div className="foto-motorista-container">
            <img src={DRIVER_PHOTO} alt="Motorista" />
            <div className="badge-nota">
              <Star size={10} fill="#000" color="#000" />
              <span>4.9</span>
            </div>
          </div>
          
          <div className="info-veiculo-viagem">
            <p className="nome-motorista-v">João Pedro</p>
            <p className="modelo-veiculo-v">Fiat Argo • Branco</p>
            <MercosulPlate plate="ABC1C34" />
          </div>
        </div>

        <div className="botoes-acao-viagem">
          <button className="acao-v-botao chat">
            <MessageCircle size={22} color="#00E5FF" />
            <span>Mensagem</span>
          </button>
          <button className="acao-v-botao ligar">
            <Phone size={22} color="#00E5FF" />
            <span>Ligar</span>
          </button>
          <button className="acao-v-botao perigo" onClick={onFinish}>
            <AlertTriangle size={22} color="#FF3B30" />
            <span>SOS</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}