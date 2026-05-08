import React from "react";
import { motion } from "motion/react";
import { Compass, Clock, User } from "lucide-react";
import "./style/MenuInferior.css";

const abas = [
  { id: "home", label: "Início", Icon: Compass },
  { id: "trips", label: "Viagens", Icon: Clock },
  { id: "profile", label: "Perfil", Icon: User },
];

// mudei de 'export function' para 'export default function'
export default function MenuInferior({ abaAtiva, aoNavegar }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="menu-inferior-container"
    >
      {abas.map(({ id, label, Icon }) => {
        const ativo = abaAtiva === id;
        return (
          <motion.button
            key={id}
            whileTap={{ scale: 0.88 }}
            onClick={() => aoNavegar(id)}
            className="menu-inferior-botao"
          >
            {ativo && (
              <motion.div
                layoutId="navDot"
                className="menu-inferior-indicador"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}

            <motion.div
              animate={ativo ? { scale: 1.08 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className={`menu-inferior-icone-container ${ativo ? 'menu-inferior-icone-ativo' : ''}`}
            >
              <Icon
                size={20}
                color={ativo ? "#00E5FF" : "#666666"}
                strokeWidth={ativo ? 2.3 : 1.8}
              />
            </motion.div>

            <span className={`menu-inferior-texto ${ativo ? 'menu-inferior-texto-ativo' : 'menu-inferior-texto-inativo'}`}>
              {label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}