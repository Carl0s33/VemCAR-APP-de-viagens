import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import "./style/Cabecalho.css";

export default function Cabecalho({ tipoServico = "viagens", aoClicarMenu, aoClicarAvatar }) {
  const [avatar, setAvatar] = useState(null);

  // monitora o localStorage para atualizar a foto em tempo real
  useEffect(() => {
    const carregarAvatar = () => {
      const fotoSalva = localStorage.getItem("vem_app_avatar");
      setAvatar(fotoSalva);
    };

    carregarAvatar();

    // escuta mudanças no cache caso o usuario mude a foto sem deslogar
    window.addEventListener("storage", carregarAvatar);
    return () => window.removeEventListener("storage", carregarAvatar);
  }, []);

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

        {/* muda o nome da logo baseado no servico ativo */}
        <div className="cabecalho-logo">
          <span className="cabecalho-logo-vem">VEM </span>
          <span className="cabecalho-logo-car">
          {tipoServico === "entregas" ? "EXPRESS" : "CAR"}
        </span>
        </div>

        <motion.button
            whileTap={{ scale: 0.9 }}
            className="cabecalho-avatar"
            onClick={aoClicarAvatar}
            style={{
              background: avatar ? "transparent" : "#DFE5E7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "50%",
              width: "36px",
              height: "36px"
            }}
        >
          {avatar ? (
              <img src={avatar} alt="Perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
              /* vetor svg do boneco padrao estilo whatsapp */
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "4px" }}>
                <circle cx="50" cy="38" r="18" fill="#FFFFFF" />
                <path d="M18 80C18 64.536 30.536 52 46 52H54C69.464 52 82 64.536 82 80V84H18V80Z" fill="#FFFFFF" />
              </svg>
          )}
        </motion.button>
      </motion.div>
  );
}