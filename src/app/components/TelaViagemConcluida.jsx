import React from "react";
import { motion } from "motion/react";
import { CheckCircle, DollarSign, Banknote } from "lucide-react";
import "./style/TelaViagemConcluida.css";

export default function TelaViagemConcluida({ aoFinalizar }) {
  return (
    <div className="viagem-concluida-container">
      <motion.div 
        className="icone-sucesso-wrapper"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle size={56} color="#000" strokeWidth={2.5} />
      </motion.div>

      <div className="cabecalho-concluido">
        <h1>Viagem Concluída!</h1>
        <p>Santo Antônio • IFRN Nova Cruz</p>
      </div>

      <motion.div 
        className="card-ganhos-matte"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="label-valor-final">
          <DollarSign size={20} color="#00E5FF" />
          <span>Valor Final</span>
        </div>
        <p className="valor-final-texto">R$ 15,50</p>

        <div className="detalhe-pagamento-concluido">
          <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(0,229,255,0.1)", border: "1px solid #00E5FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Banknote size={20} color="#00E5FF" />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#FFF", fontWeight: 700, fontSize: 14 }}>Pagamento em Dinheiro</p>
            <p style={{ color: "#888", fontSize: 12 }}>Receber do passageiro</p>
          </div>
        </div>
      </motion.div>

      <div className="grade-estatisticas-concluido">
        <div className="item-estatistica-concluido">
          <p style={{ color: "#888", fontSize: 10, marginBottom: 4 }}>Distância</p>
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: 14 }}>4.2 km</p>
        </div>
        <div className="item-estatistica-concluido">
          <p style={{ color: "#888", fontSize: 10, marginBottom: 4 }}>Duração</p>
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: 14 }}>12 min</p>
        </div>
        <div className="item-estatistica-concluido">
          <p style={{ color: "#888", fontSize: 10, marginBottom: 4 }}>Comissão</p>
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: 14 }}>R$ 3,10</p>
        </div>
      </div>

      <motion.button 
        whileTap={{ scale: 0.98 }}
        onClick={aoFinalizar}
        className="botao-finalizar-fluxo"
      >
        Receber Pagamento
      </motion.button>
    </div>
  );
}