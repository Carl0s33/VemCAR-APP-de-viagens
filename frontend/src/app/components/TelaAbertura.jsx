import React, { useEffect } from "react";
import { motion } from "motion/react";
import "./style/TelaAbertura.css";

export default function TelaAbertura({ aoFinalizar }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (aoFinalizar) aoFinalizar();
    }, 2800);
    return () => clearTimeout(timer);
  }, [aoFinalizar]);

  return (
    <div className="abertura-container">
      <motion.div 
        className="abertura-logo-wrapper"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
      >
        <motion.div 
          className="abertura-icone-v"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>V</span>
        </motion.div>

        <motion.h1 
          className="abertura-texto-marca"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          VEM CAR
        </motion.h1>

        <motion.p 
          className="abertura-slogan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Nova Cruz
        </motion.p>
      </motion.div>

      <div className="abertura-carregamento">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="abertura-ponto"
            animate={{ 
              scale: [1, 1.5, 1], 
              opacity: [0.3, 1, 0.3] 
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
          />
        ))}
      </div>
    </div>
  );
}