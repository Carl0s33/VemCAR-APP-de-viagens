import React from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Send, ArrowLeft, MapPin, Plus } from "lucide-react";
import "../perfil/FluxoPerfilCliente.css";
import "../perfil/SubtelasPerfilCliente.css";

export default function FluxoServicosAdicionais({ servico, onBack }) {
  const renderConteudo = () => {
    switch (servico) {
      case "mercado":
        return (
          <div className="subtela-container">
            <h2 className="subtela-titulo" style={{fontSize: 28, marginBottom: 8}}>VEM Mercado</h2>
            <p className="subtela-desc" style={{marginBottom: 24}}>Faça suas compras sem sair de casa.</p>
            <div className="card-item-salvo" style={{ background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '24px', borderRadius: '24px', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, background: '#00E5FF', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <ShoppingBag size={24} color="#000" />
              </div>
              <h3 style={{ fontSize: 18, color: '#FFF', margin: '0 0 4px 0' }}>Supermercado Ideal</h3>
              <p style={{ color: '#00E5FF', margin: 0, fontWeight: 700 }}>Entrega em até 40 min</p>
            </div>
            <button className="btn-principal ativo" style={{ background: '#00E5FF' }}>Ver Produtos</button>
          </div>
        );

      case "envios":
        return (
          <div className="subtela-container">
            <h2 className="subtela-titulo" style={{fontSize: 28, marginBottom: 8}}>Envios Rápidos</h2>
            <p className="subtela-desc" style={{marginBottom: 24}}>Mande pacotes para qualquer lugar de Nova Cruz.</p>
            <div className="card-item-salvo" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(0, 0, 0, 0) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '24px', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, background: '#F59E0B', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Send size={24} color="#000" />
              </div>
              <h3 style={{ fontSize: 18, color: '#FFF', margin: '0 0 4px 0' }}>Nova Entrega</h3>
              <p style={{ color: '#F59E0B', margin: 0, fontWeight: 700 }}>Retirada imediata disponível</p>
            </div>
            <button className="btn-principal ativo" style={{ background: '#F59E0B' }}>Configurar Envio</button>
          </div>
        );
      default:
        return (
          <div className="subtela-container">
            <h2 className="subtela-titulo">Nenhum Serviço</h2>
            <p className="subtela-desc">Selecione um serviço na tela inicial.</p>
          </div>
        );
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