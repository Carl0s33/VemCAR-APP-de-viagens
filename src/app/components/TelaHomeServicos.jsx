import React from "react";
import { motion } from "motion/react";
import { Car, Package, ShoppingBag, Send, Search } from "lucide-react";
import "./style/TelaHomeServicos.css";

export default function TelaHomeServicos({ onSelectService }) {
  const servicos = [
    { id: "viagens", nome: "Viagens", icone: Car },
    { id: "entregas", nome: "Entregas", icone: Package },
    { id: "mercado", nome: "Mercado", icone: ShoppingBag },
    { id: "envios", nome: "Envios", icone: Send },
  ];

  return (
    <div className="home-servicos-container">
      <div className="home-servicos-header">
        <h1 className="home-servicos-saudacao">O que você precisa hoje?</h1>
      </div>

      <div className="home-servicos-grid">
        {servicos.map((s) => (
          <motion.button
            key={s.id}
            className="card-servico-matte"
            onClick={() => onSelectService(s.id)}
            whileTap={{ scale: 0.96 }}
          >
            <div className="icone-servico-wrapper">
              <s.icone size={28} color="#000000" strokeWidth={2.5} />
            </div>
            <span className="nome-servico-texto">{s.nome}</span>
          </motion.button>
        ))}
      </div>

      <div className="home-servicos-busca-secao">
        <div 
          className="barra-busca-falsa"
          onClick={() => onSelectService("viagens")}
        >
          <Search size={20} color="#00E5FF" />
          <span>Para onde vamos?</span>
        </div>
      </div>
    </div>
  );
}