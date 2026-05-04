import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, GraduationCap, CreditCard, Smartphone, Banknote } from "lucide-react";
import "./style/TelaCadastroPassageiro.css";

export default function TelaCadastroPassageiro({ aoContinuar, aoVoltar }) {
  const [eEstudante, setEEstudante] = useState(false);
  const [pagamento, setPagamento] = useState("pix");

  return (
    <div className="cadastro-p-container">
      <button onClick={aoVoltar} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 }}>
        <ArrowLeft size={24} color="#FFF" />
      </button>

      <h1 style={{ color: "#FFF", fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Perfil de Passageiro</h1>
      <p style={{ color: "#888", marginBottom: 32 }}>Configure como você quer viajar.</p>

      <div className={`cartao-estudante-if ${eEstudante ? 'ativo' : ''}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#00E5FF", display: "flex", alignItems: "center", justifyCenter: "center" }}>
            <GraduationCap size={24} color="#000" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: "#FFF", fontWeight: 700 }}>Estuda no IFRN?</h3>
            <p style={{ color: "#888", fontSize: 12 }}>Libera a categoria Carona Uni</p>
          </div>
          <input type="checkbox" checked={eEstudante} onChange={() => setEEstudante(!eEstudante)} />
        </div>
      </div>

      <h3 style={{ color: "#FFF", fontWeight: 700, marginBottom: 16 }}>Pagamento preferido</h3>
      <div className="metodo-pagamento-lista">
        {[{id: "pix", n: "PIX", i: Smartphone}, {id: "cartao", n: "Cartão", i: CreditCard}, {id: "dinheiro", n: "Dinheiro", i: Banknote}].map(m => (
          <div key={m.id} className={`botao-pagamento-matte ${pagamento === m.id ? 'ativo' : ''}`} onClick={() => setPagamento(m.id)}>
            <m.i size={20} color={pagamento === m.id ? "#00E5FF" : "#888"} />
            <span style={{ color: pagamento === m.id ? "#FFF" : "#888", fontWeight: 600 }}>{m.n}</span>
          </div>
        ))}
      </div>

      <motion.button whileTap={{ scale: 0.98 }} onClick={aoContinuar} style={{ width: "100%", height: 56, background: "#00E5FF", borderRadius: 16, border: "none", color: "#000", fontWeight: 800, marginTop: "auto" }}>
        Continuar
      </motion.button>
    </div>
  );
}