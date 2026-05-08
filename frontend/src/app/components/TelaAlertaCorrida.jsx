import React, { useState, useEffect } from "react";
import { MapaCidade } from "./MapaCidade";
import { MapPin, User, Star, X, CircleDot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./style/TelaAlertaCorrida.css";

export default function TelaAlertaCorrida({ aoAceitar, aoRejeitar }) {
  const [tempo, setTempo] = useState(15); // Minimundo: 15 segundos!

  // Som de notificação padrão do navegador (usando um Beep sintetizado para evitar bloqueios de autoplay de MP3)
  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    
    const tocarBeep = (freq, tempoInicio, duracao) => {
      const osc = context.createOscillator();
      const ganho = context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, context.currentTime + tempoInicio);
      ganho.gain.setValueAtTime(0.1, context.currentTime + tempoInicio);
      ganho.gain.exponentialRampToValueAtTime(0.001, context.currentTime + tempoInicio + duracao);
      osc.connect(ganho);
      ganho.connect(context.destination);
      osc.start(context.currentTime + tempoInicio);
      osc.stop(context.currentTime + tempoInicio + duracao);
    };

    // Toca o som triplo clássico de alerta (Bi-Bi-Bip)
    tocarBeep(600, 0, 0.2);
    tocarBeep(600, 0.3, 0.2);
    tocarBeep(800, 0.6, 0.4);
    
    return () => context.close();
  }, []);

  // Temporizador de 15 segundos do Minimundo
  useEffect(() => {
    if (tempo > 0) {
      const timer = setTimeout(() => setTempo(tempo - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      aoRejeitar(); // Se o motorista perder o tempo... Fim da chamada.
    }
  }, [tempo, aoRejeitar]);

  const progressoX = (tempo / 15) * 100;

  return (
    <div className="tela-alerta-wrapper">
      
      {/* Mapa Fundo */}
      <div className="mapa-background">
        <MapaCidade mostrarRota={true} mostrarCarro={false} />
      </div>

      <div className="alerta-container-flutuante">
        <motion.div 
          className="alerta-card-matte" 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Efeito de Radar/Pulsar na Borda */}
          <div className="borda-pulsante" />

          {/* Barra de Progresso do Minimundo Visual */}
          <div style={{ width: "100%", height: "4px", backgroundColor: "#333", position: "absolute", top: 0, left: 0, overflow: "hidden", borderRadius: "32px 32px 0 0" }}>
            <motion.div 
               style={{ height: "100%", backgroundColor: tempo <= 5 ? "#EF4444" : "#00E5FF" }}
               animate={{ width: `${progressoX}%` }}
               transition={{ duration: 1, ease: "linear" }}
            />
          </div>

          {/* CABEÇALHO DO ALERTA */}
          <div className="alerta-header">
            <div className="alerta-tempo-preco">
              <h1 className="tempo-destaque">3 min</h1>
              <p className="distancia-destaque">1,2 km</p>
            </div>
            
            <div className="preco-estimado">
              <h2>R$ 14,50</h2>
              <p>Dinheiro</p>
            </div>
          </div>
          
          <div className="divisor-linha" />

          {/* INFO PASSAGEIRO */}
          <div className="alerta-info-passageiro">
            <div className="info-rating">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span>5.0</span>
            </div>
            <div className="divisor-ponto" />
            <span className="nome-passageiro"><User size={14} style={{marginRight: 4}}/> Carlos Eduardo</span>
            <div className="divisor-ponto" />
            <span className="categoria-carro">VEM CAR</span>
          </div>
          
          {/* LOCAIS DE ORIGEM E DESTINO */}
          <div className="alerta-locais">
            <div className="local-linha">
              <CircleDot size={18} color="#34C759" />
              <p>R. Santo Antônio, 42 - Centro</p>
            </div>
            <div className="traco-conexao" />
            <div className="local-linha">
              <MapPin size={18} color="#00E5FF" />
              <p>IFRN Campus Nova Cruz</p>
            </div>
          </div>
          
          {/* BOTÕES DE AÇÃO */}
          <div className="alerta-botoes">
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              className="btn-rejeitar-circular" 
              onClick={aoRejeitar}
            >
              <X size={28} color="#FFF" strokeWidth={2.5} />
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.95 }} 
              className="btn-aceitar-grande" 
              onClick={aoAceitar} /* O clique aqui já manda pro driver-navigation direto */
            >
              TOCAR PARA ACEITAR
            </motion.button>
          </div>

          <div className="barra-tempo-esgotando">
            <motion.div 
              className="barra-progresso"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 15, ease: "linear" }}
              onAnimationComplete={aoRejeitar} // Auto rejeita se o tempo acabar
            />
          </div>

        </motion.div>
      </div>
    </div>
  );
}