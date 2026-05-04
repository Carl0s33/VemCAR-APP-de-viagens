import React, { useState } from "react";
import { motion } from "motion/react";
import { Star, MessageSquare, Send } from "lucide-react";
import "./style/TelaAvaliacao.css";

// mudei pra export default pro App.jsx parar de reclamar
export default function TelaAvaliacao({ aoEnviar }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  return (
    <div className="avaliacao-container">
      <motion.div 
        className="avaliacao-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="avaliacao-titulo">Como foi sua viagem?</h2>
        <p className="avaliacao-subtitulo">Sua avaliação ajuda o João Pedro a melhorar.</p>

        <div className="estrelas-grade">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <motion.button
              key={estrela}
              whileTap={{ scale: 0.8 }}
              onClick={() => setNota(estrela)}
              className="estrela-botao"
            >
              <Star 
                size={40} 
                fill={estrela <= nota ? "#00E5FF" : "none"} 
                color={estrela <= nota ? "#00E5FF" : "#333"} 
              />
            </motion.button>
          ))}
        </div>

        <div className="campo-comentario">
          <MessageSquare size={18} color="#666" />
          <textarea 
            placeholder="Escreva um elogio ou sugestão..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>

        <motion.button 
          className="botao-enviar-avaliacao"
          whileTap={{ scale: 0.95 }}
          onClick={() => aoEnviar({ nota, comentario })}
          disabled={nota === 0}
          style={{ opacity: nota === 0 ? 0.5 : 1 }}
        >
          <span>Enviar Avaliação</span>
          <Send size={18} color="#000" />
        </motion.button>
      </motion.div>
    </div>
  );
}