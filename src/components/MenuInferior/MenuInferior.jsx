import React, { memo } from "react";
import { motion } from "framer-motion";
import { Home, Map as MapIcon, User } from "lucide-react";
import "./MenuInferior.css";
const MenuInferior = memo(({ abaAtiva, aoNavegar }) => {
  const tabs = [
    { id: "home", label: "Início", icone: Home },
    { id: "trips", label: "Viagens", icone: MapIcon },
    { id: "profile", label: "Perfil", icone: User }
  ];

  return (
    <div className="menu-inferior-container">
      {tabs.map((tab) => {
        const ativo = abaAtiva === tab.id;
        return (
          <motion.button
            key={tab.id}
            className={`menu-item ${ativo ? "ativo" : ""}`}
            onTap={() => aoNavegar(tab.id)}
            whileTap={{ scale: 0.9 }}
            aria-label={`Ir para ${tab.label}`}
          >
            <div className="menu-icon-container">
              <tab.icone size={24} color={ativo ? "currentColor" : "#64748B"} strokeWidth={ativo ? 2.5 : 2} />
              
              {ativo && (
                <motion.div layoutId="indicador-menu" className="indicador-ativo" />
              )}
            </div>
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
});

export default MenuInferior;