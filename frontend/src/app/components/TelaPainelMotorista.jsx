import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Power, Bell, Wallet, Route } from "lucide-react";
import { MapaCidade } from "./MapaCidade"; 
import "./style/TelaPainelMotorista.css";

export default function TelaPainelMotorista({ aoPerfil, aoIniciarCorrida }) {
  const [online, setOnline] = useState(false);

  return (
    <div className="tela-painel-motorista">
      <div className="mapa">
        <MapaCidade showDriverMode={online} />
      </div>

      {/* --- CABEÇALHO --- */}
      <motion.div 
        className="cabecalho-flutuante"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button className="botao-menu-matte" onClick={aoPerfil}>
          <Menu size={24} color="#FFF" />
        </button>
        
        <div className={`status-online-matte ${online ? 'ativo' : ''}`}>
          <div className="ponto-status" />
          <span>{online ? 'Você está Online' : 'Você está Offline'}</span>
        </div>
      </motion.div>

      {/* --- PAINEL INFERIOR --- */}
      <motion.div 
        className="card-inferior-motorista-matte"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="alca-drag" />
        
        {/* Ganhos do Dia com Ícones Coloridos */}
        <div className="painel-ganhos-grid">
          <div className="info-box-matte">
            <p><Wallet size={16} color="#10B981" /> Ganhos hoje</p>
            <h2>R$ 142,50</h2>
          </div>
          <div className="info-box-matte">
            <p><Route size={16} color="#00E5FF" /> Corridas</p>
            <h2>8</h2>
          </div>
        </div>

        {/* Botão Principal de Ligar/Desligar Sessão (Verde/Vermelho) */}
        <button 
          className={`btn-power-matte ${online ? 'offline' : 'online'}`} 
          onClick={() => setOnline(!online)}
        >
          <Power size={24} />
          <span>{online ? 'FICAR OFFLINE' : 'FICAR ONLINE'}</span>
        </button>

        {/* Botão Simular Chamada */}
        <AnimatePresence>
          {online && (
            <motion.button 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "56px", marginTop: "16px" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="btn-simular-matte" 
              onClick={aoIniciarCorrida}
            >
              <Bell size={20} />
              <span>Simular Nova Chamada</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}