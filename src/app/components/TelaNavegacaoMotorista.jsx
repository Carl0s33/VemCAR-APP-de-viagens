import { motion } from "motion/react";
import { Phone, User, ArrowRight, Settings } from "lucide-react";
import { MapaCidade } from "./MapaCidade";
import "./style/TelaNavegacaoMotorista.css";

export default function TelaNavegacaoMotorista({ aoChegar }) {
  return (
    <div className="tela-navegacao-motorista-container">
      {/* Mapa com Rota */}
      <div className="tela-navegacao-motorista-mapa-wrapper">
        <MapaCidade mostrarRota mostrarCarro />
      </div>

      {/* Card de Endereço - Topo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="tela-navegacao-motorista-endereco"
      >
        <p>R. Santo Antônio, 42 - Nova Cruz, RN, 59215-000</p>
      </motion.div>

      {/* Barra de Status Média */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="tela-navegacao-motorista-barra-status"
      >
        <Settings size={20} color="#888888" strokeWidth={2} />
        <div className="tela-navegacao-motorista-tempo">
          <div className="tela-navegacao-motorista-bolinha-verde" />
          <span>2 min</span>
        </div>
        <div className="tela-navegacao-motorista-distancia">
          <User size={18} color="#888888" strokeWidth={2} />
          <span>1,0 km</span>
        </div>
      </motion.div>

      {/* Painel Inferior de Controle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="tela-navegacao-motorista-painel-inferior"
      >
        {/* Linha 1: Botões de Ação */}
        <div className="tela-navegacao-motorista-acoes">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="tela-navegacao-motorista-botao-acao"
          >
            <Phone size={24} color="#FFFFFF" strokeWidth={2.5} />
          </motion.button>
          <h2 className="tela-navegacao-motorista-nome-passageiro">Ana</h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="tela-navegacao-motorista-botao-acao"
          >
            <User size={24} color="#FFFFFF" strokeWidth={2.5} />
          </motion.button>
        </div>
        {/* Linha 2: Botão Iniciar VEM CAR */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={aoChegar}
          className="tela-navegacao-motorista-botao-iniciar"
        >
          <ArrowRight size={24} color="#000000" strokeWidth={3} />
          <span>Iniciar VEM CAR</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
