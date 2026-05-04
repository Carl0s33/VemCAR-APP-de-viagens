import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  MapPin, 
  Clock, 
  ChevronLeft, 
  Wallet, 
  Car, 
  Bike, 
  GraduationCap, 
  Zap 
} from "lucide-react";
import { MapaCidade } from "./MapaCidade";
import "./style/TelaPagamento.css";

const CATEGORIAS = [
  { id: "carro", nome: "VEM Carro", preco: "R$ 15,50", tempo: "4 min", icone: Car },
  { id: "moto", nome: "VEM Moto", preco: "R$ 8,00", tempo: "2 min", icone: Bike },
  { id: "uni", nome: "Carona Uni", preco: "R$ 6,00", tempo: "8 min", icone: GraduationCap }
];

// AJUSTE: export default para o App.jsx reconhecer
export default function TelaPagamento({ aoVoltar, aoConfirmar }) {
  const [selecionado, setSelecionado] = useState("carro");
  const categoriaAtiva = CATEGORIAS.find(c => c.id === selecionado);

  return (
    <div className="checkout-container">
      <div className="checkout-mapa-wrapper">
        <MapaCidade mostrarRota={true} />
      </div>

      <motion.button 
        whileTap={{ scale: 0.93 }}
        onClick={aoVoltar}
        className="checkout-botao-voltar"
      >
        <ChevronLeft size={20} color="#1F2937" strokeWidth={2.2} />
      </motion.button>

      <motion.div 
        className="checkout-sheet"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="checkout-drag-handle" />

        <div className="checkout-info-row">
          <div className="checkout-info-card">
            <MapPin size={16} color="#00E5FF" />
            <div>
              <p style={{ color: "#6B7280", fontSize: 10, fontWeight: 500 }}>Distância</p>
              <p style={{ color: "#F9FAFB", fontSize: 15, fontWeight: 800 }}>4.5 km</p>
            </div>
          </div>
          <div className="checkout-info-card">
            <Clock size={16} color="#00E5FF" />
            <div>
              <p style={{ color: "#6B7280", fontSize: 10, fontWeight: 500 }}>Tempo</p>
              <p style={{ color: "#F9FAFB", fontSize: 15, fontWeight: 800 }}>12 min</p>
            </div>
          </div>
        </div>

        <div className="checkout-lista-categorias no-scrollbar">
          {CATEGORIAS.map((cat) => (
            <motion.div
              key={cat.id}
              className={`checkout-card-categoria ${selecionado === cat.id ? 'ativo' : ''}`}
              onClick={() => setSelecionado(cat.id)}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{ padding: 10, background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
                <cat.icone size={24} color={selecionado === cat.id ? "#00E5FF" : "#9CA3AF"} />
              </div>
              <p style={{ color: "#FFF", fontSize: 12, fontWeight: 700 }}>{cat.nome}</p>
              <p style={{ color: "#00E5FF", fontSize: 14, fontWeight: 800 }}>{cat.preco}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ padding: "0 22px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1F2937", padding: "14px 16px", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Wallet size={20} color="#9CA3AF" />
              <span style={{ color: "#FFF", fontWeight: 700 }}>Dinheiro</span>
            </div>
            <span style={{ color: "#00E5FF", fontWeight: 800 }}>{categoriaAtiva.preco}</span>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="checkout-botao-confirmar"
          onClick={aoConfirmar}
        >
          <Zap size={20} fill="#061520" color="#061520" />
          <span>Solicitar {categoriaAtiva.nome.toUpperCase()}</span>
        </motion.button>
      </motion.div>
    </div>
  );
}