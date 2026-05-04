import React from "react";
import { motion } from "motion/react";
import { User, Car, ArrowLeft } from "lucide-react";
import "./style/TelaEscolhaCadastro.css";

// ajuste aqui: export default pra o App.jsx reconhecer
export default function TelaEscolhaCadastro({ onSelectPassenger, onSelectDriver, onBack }) {
  return (
    <div className="escolha-container">
      <button className="botao-voltar-fixo" onClick={onBack}>
        <ArrowLeft size={24} color="#FFF" />
      </button>

      <div className="escolha-conteudo">
        <h1 className="escolha-titulo">Como você quer usar o Vem Car?</h1>
        <p className="escolha-subtitulo">Escolha seu perfil para continuar o cadastro.</p>

        <div className="opcoes-grade">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="opcao-card-matte"
            onClick={onSelectPassenger}
          >
            <div className="icone-circulo-p">
              <User size={32} color="#000" />
            </div>
            <div className="opcao-texto">
              <h3>Passageiro</h3>
              <p>Quero pedir viagens e economizar.</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="opcao-card-matte"
            onClick={onSelectDriver}
          >
            <div className="icone-circulo-m">
              <Car size={32} color="#000" />
            </div>
            <div className="opcao-texto">
              <h3>Motorista</h3>
              <p>Quero dirigir e aumentar minha renda.</p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}