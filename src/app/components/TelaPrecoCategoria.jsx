import React from "react";
import { motion } from "framer-motion";
import { Car, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { MapaCidade } from "./MapaCidade";
import "./style/TelaPrecoCategoria.css";

export default function TelaPrecoCategoria({ aoConfirmar }) {
  return (
    <div className="preco-categoria-container">
      <MapaCidade mostrarRota={true} mostrarCarro={false} />

      <motion.div 
        className="preco-card-cliente-matte"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
      >
        {/* Puxadorzinho do card (visual moderno) */}
        <div className="drag-handle"></div>

        {/* Bloco do carro escolhido (Matte) */}
        <div className="opcao-carro-matte">
          <div className="icone-carro-fosco">
            <Car size={26} color="#000" strokeWidth={2.5} />
          </div>
          <div className="info-opcao-carro">
            <h2 className="nome-categoria">Vem Car</h2>
            <p className="tempo-chegada">3 min • 1,0 km</p>
          </div>
          <div className="preco-estimado-bloco">
            <span className="moeda-matte">R$</span>12,50
          </div>
        </div>

        {/* Bloco de Detalhes (Destino + Pagamento agrupados e preenchidos) */}
        <div className="detalhes-viagem-matte">
          <div className="linha-detalhe">
            <div className="icone-detalhe fosco-azul">
              <MapPin size={18} color="#00E5FF" strokeWidth={2.5} />
            </div>
            <div className="texto-detalhe">
              <p className="titulo-detalhe">IFRN Campus Nova Cruz</p>
              <p className="subtitulo-detalhe">Destino final</p>
            </div>
          </div>
          
          <div className="divisor-matte"></div>

          <div className="linha-detalhe">
            <div className="icone-detalhe fosco-verde">
              <CreditCard size={18} color="#34C759" strokeWidth={2.5} />
            </div>
            <div className="texto-detalhe">
              <p className="titulo-detalhe">Pix</p>
              <p className="subtitulo-detalhe">Pagamento online</p>
            </div>
            <ChevronRight size={20} color="#666" />
          </div>
        </div>

        {/* Botãozão Flat/Matte */}
        <button className="botao-confirmar-matte" onClick={aoConfirmar}>
          Confirmar Vem Car
        </button>
      </motion.div>
    </div>
  );
}