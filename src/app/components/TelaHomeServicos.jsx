import React from "react";
import { motion } from "framer-motion";
import { CarFront, Package, ShoppingBag, Send, Search, Clock, MapPin, Star } from "lucide-react";
import "./style/TelaHomeServicos.css";

export default function TelaHomeServicos({ onSelectService }) {
  const servicos = [
    { id: "viagens", nome: "Viagens", icone: CarFront, cor: "#00E5FF" },
    { id: "entregas", nome: "Entregas", icone: Package, cor: "#FFF" },
    { id: "mercado", nome: "Mercado", icone: ShoppingBag, cor: "#FFF" },
    { id: "envios", nome: "Envios", icone: Send, cor: "#FFF" },
  ];

  const recentes = [
    { id: 1, local: "IFRN Campus Nova Cruz", endereco: "RN-120, Nova Cruz" },
    { id: 2, local: "Shopping Natal", endereco: "Av. Sen. Salgado Filho" },
  ];

  return (
    <div className="home-servicos-container">
      {/* HEADER E BUSCA */}
      <div className="home-servicos-header">
        <h1 className="home-servicos-saudacao">Olá, Carlos!</h1>
        <div className="home-servicos-busca-secao">
          <div className="barra-busca-falsa" onClick={() => onSelectService("viagens")}>
            <Search size={20} color="#00E5FF" strokeWidth={3} />
            <span>Para onde vamos?</span>
          </div>
        </div>
      </div>

      {/* GRID DE SERVIÇOS PRINCIPAIS */}
      <div className="home-servicos-grid">
        {servicos.map((s) => (
          <motion.button
            key={s.id}
            className="card-servico-matte"
            onClick={() => onSelectService(s.id)}
            whileTap={{ scale: 0.96 }}
          >
            <div className="icone-servico-wrapper" style={{ background: s.cor }}>
              <s.icone size={26} color="#000" strokeWidth={2.5} />
            </div>
            <span className="nome-servico-texto">{s.nome}</span>
          </motion.button>
        ))}
      </div>

      {/* BANNER PROMOCIONAL */}
      <motion.div 
        className="banner-promo-matte"
        whileTap={{ scale: 0.98 }}
      >
        <div className="promo-texto">
          <h3>Ganhe 20% de desconto</h3>
          <p>Na sua primeira carona para o IFRN usando o cupom <strong>VEMIFRN</strong></p>
        </div>
        <div className="promo-badge">PROMO</div>
      </motion.div>

      {/* DESTINOS RECENTES */}
      <div className="secao-destinos-recentes">
        <div className="secao-titulo-area">
          <h2 className="secao-titulo">Sugestões para você</h2>
          <button className="btn-ver-todos">Ver todos</button>
        </div>

        {recentes.map((r) => (
          <motion.div 
            key={r.id} 
            className="card-destino-recente"
            whileTap={{ backgroundColor: "#1A1A1A" }}
            onClick={() => onSelectService("viagens")}
          >
            <div className="icone-recente-circulo">
              <Clock size={18} color="#888" />
            </div>
            <div className="recente-textos">
              <p className="recente-local">{r.local}</p>
              <p className="recente-endereco">{r.endereco}</p>
            </div>
            <ChevronRight size={18} color="#333" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Pequeno ajuste auxiliar para o ícone
function ChevronRight({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}