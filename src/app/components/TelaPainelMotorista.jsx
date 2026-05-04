import React from "react";
import { motion } from "motion/react";
import { Menu, Search, Shield, MessageCircle, Settings, List } from "lucide-react";
// CORREÇÃO: Importando com chaves {} porque MapaCidade não é default export
import { MapaCidade } from "./MapaCidade"; 
import "./style/TelaPainelMotorista.css";

// Mudei para export default para bater com o padrão que usamos no App.jsx
export default function TelaPainelMotorista({ aoPerfil, aoIniciarCorrida }) {
  return (
    <div className="tela-painel-motorista">
      <div className="mapa">
        <MapaCidade showDriverMode />
      </div>

      <motion.div 
        className="cabecalho-flutuante"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button className="botao-menu" onClick={aoPerfil}>
          <Menu size={24} color="#FFF" />
        </button>
        
        <div className="status-online">
          <div className="ponto-verde" />
          <span>Online</span>
        </div>
      </motion.div>

      <motion.div 
        className="card-inferior-motorista"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="alça-drag" />
        <div className="info-ganhos-dia">
          <p>Ganhos de hoje</p>
          <h2>R$ 142,50</h2>
        </div>

        <button className="botao-ficar-offline" onClick={aoIniciarCorrida}>
          <span>Simular Alerta</span>
        </button>
      </motion.div>
    </div>
  );
}