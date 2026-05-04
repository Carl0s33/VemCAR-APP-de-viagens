import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Search } from "lucide-react";
import "./style/TelaRadar.css";

// AJUSTE: export default para o App.jsx reconhecer e parar de dar erro
export default function TelaRadar({ aoCancelar, aoMotoristaEncontrado }) {
  // Simulação para teste: encontra um motorista após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (aoMotoristaEncontrado) aoMotoristaEncontrado();
    }, 5000);
    return () => clearTimeout(timer);
  }, [aoMotoristaEncontrado]);

  return (
    <div className="radar-container">
      <div className="radar-background">
        <div className="radar-circulo-externo">
          <motion.div 
            className="radar-pulso"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <div className="radar-linha-varredura" />
        </div>
      </div>

      <div className="radar-conteudo">
        <div className="radar-cabecalho">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="radar-icone-busca"
          >
            <Search size={32} color="#00E5FF" />
          </motion.div>
          <h1 className="radar-titulo">Procurando motoristas...</h1>
          <p className="radar-subtitulo">Isso pode levar alguns segundos, boy.</p>
        </div>

        <div className="radar-status-cards">
          <div className="radar-mini-card">
            <Shield size={16} color="#00E5FF" />
            <span>Viagem Protegida</span>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="radar-botao-cancelar"
          onClick={aoCancelar}
        >
          <X size={20} color="#FFF" />
          <span>Cancelar Solicitação</span>
        </motion.button>
      </div>
    </div>
  );
}