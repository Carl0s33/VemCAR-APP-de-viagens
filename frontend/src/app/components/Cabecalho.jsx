import React from "react";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import "./style/Cabecalho.css";

export default function Cabecalho({ urlAvatar, aoClicarMenu, aoClicarAvatar }) {
  return (
    <motion.div
      className="cabecalho-container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <motion.button 
        whileTap={{ scale: 0.9 }} 
        className="cabecalho-botao-menu" 
        onClick={aoClicarMenu}
      >
        <Menu size={18} color="#FFFFFF" strokeWidth={2.5} />
      </motion.button>

      <div className="cabecalho-logo">
        <span className="cabecalho-logo-vem">VEM </span>
        <span className="cabecalho-logo-car">CAR</span>
      </div>

      <motion.button 
        whileTap={{ scale: 0.9 }} 
        className="cabecalho-avatar" 
        onClick={aoClicarAvatar}
      >
        <img src={urlAvatar} alt="Perfil" />
      </motion.button>
    </motion.div>
  );
}