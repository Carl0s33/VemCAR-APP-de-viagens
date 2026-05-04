import React from "react";
import { motion } from "motion/react";
import { User, MapPin, Star } from "lucide-react";
import { MapaCidade } from "./MapaCidade";
import "./style/TelaPrecoCategoria.css";

export default function TelaPrecoCategoria({ aoConfirmar }) {
  return (
    <div className="preco-categoria-container">
      <MapaCidade mostrarRota={true} />

      <motion.div 
        className="preco-card-oferta"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={aoConfirmar}
      >
        <div className="preco-badge-categoria">
          <div style={{ width: 20, height: 20, borderRadius: 10, background: "#00E5FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={12} color="#000" />
          </div>
          <span className="preco-badge-texto">VEM CAR</span>
        </div>

        <h1 className="preco-titulo-tempo">3 minutos de distância</h1>

        <div className="preco-info-viagem">
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <span style={{ color: "#FFF", fontWeight: 700 }}>5,0</span>
          </div>
          <div style={{ width: 4, height: 4, borderRadius: 2, background: "#666" }} />
          <span className="preco-texto-secundario">1,0 km de distância</span>
        </div>

        <div className="preco-card-destino">
          <MapPin size={20} color="#00E5FF" />
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#888", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Destino</p>
            <p style={{ color: "#FFF", fontSize: 14, fontWeight: 700 }}>IFRN Campus Nova Cruz</p>
          </div>
        </div>

        <p style={{ color: "#666", fontSize: 12, marginTop: 20, fontWeight: 500 }}>Toque para aceitar</p>
      </motion.div>
    </div>
  );
}