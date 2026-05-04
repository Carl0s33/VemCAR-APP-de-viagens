import React from "react";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import "./style/TelaVerificacaoCodigo.css";

export default function TelaVerificacaoCodigo({ aoConcluir }) {
  return (
    <div className="otp-container">
      <div style={{ width: 80, height: 80, background: "#00E5FF", borderRadius: 24, display: "flex", alignItems: "center", justifyCenter: "center", marginBottom: 32 }}>
        <CheckCircle size={40} color="#000" />
      </div>

      <h1 style={{ color: "#FFF", fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Verifique seu celular</h1>
      <p style={{ color: "#888", textAlign: "center", marginBottom: 40 }}>Digit o código que enviamos para o seu número.</p>

      <div className="grade-inputs-otp">
        {[1, 2, 3, 4].map(i => (
          <input key={i} className="input-otp-matte" maxLength={1} type="tel" />
        ))}
      </div>

      <motion.button whileTap={{ scale: 0.98 }} onClick={aoConcluir} style={{ width: "100%", height: 56, background: "#00E5FF", borderRadius: 16, border: "none", color: "#000", fontWeight: 800 }}>
        Concluir e Iniciar
      </motion.button>
    </div>
  );
}