import React from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Send, ArrowLeft, MapPin, Plus } from "lucide-react";
import "./style/FluxoPerfil.css";
import "./style/SubtelasPerfil.css";

export default function FluxoServicosAdicionais({ servico, onBack }) {
  const renderConteudo = () => {
    switch (servico) {
      case "mercado":
        return (
          <div className="subtela-container">
            <h2 className="subtela-titulo">VEM Mercado</h2>
            <p className="subtela-desc">Faça suas compras sem sair de casa.</p>
            <div className="card-item-salvo">
              <ShoppingBag size={24} color="#00E5FF" />
              <div>
                <h3 className="titulo-item-salvo">Supermercado Ideal</h3>
                <p className="desc-item-salvo">Entrega em até 40 min</p>
              </div>
            </div>
            <button className="btn-salvar-matte">Ver Produtos</button>
          </div>
        );
      case "entregas":
        return (
          <div className="subtela-container">
            <h2 className="subtela-titulo">Entregas Rápidas</h2>
            <p className="subtela-desc">Peça para buscar algo para você.</p>
            <div className="input-group-matte">
              <label className="label-solid">O que vamos buscar?</label>
              <input className="input-solid" placeholder="Ex: Chave, Documento..." />
            </div>
            <button className="btn-salvar-matte">Solicitar Entregador</button>
          </div>
        );
      case "envios":
        return (
          <div className="subtela-container">
            <h2 className="subtela-titulo">Envios</h2>
            <p className="subtela-desc">Mande pacotes para qualquer lugar de Nova Cruz.</p>
            <div className="card-item-salvo">
              <MapPin size={24} color="#00E5FF" />
              <div>
                <h3 className="titulo-item-salvo">Ponto de Coleta</h3>
                <p className="desc-item-salvo">Defina onde retirar o pacote</p>
              </div>
            </div>
            <button className="btn-salvar-matte">Configurar Envio</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="perfil-container"
    >
      <div className="perfil-header">
        <button className="perfil-botao-voltar" onClick={onBack}>
          <ArrowLeft size={24} color="#FFF" />
        </button>
        <h1 className="perfil-titulo-header">Serviços</h1>
      </div>
      {renderConteudo()}
    </motion.div>
  );
}