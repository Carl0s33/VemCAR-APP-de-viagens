import React from "react";
import { motion } from "motion/react";
import { 
  User, 
  Settings, 
  CreditCard, 
  MapPin, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import "./style/TelaPerfil.css";

// AJUSTE CRÍTICO: export default para o App.jsx parar de reclamar
export default function TelaPerfil({ onBack }) {
  const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";

  const itensMenu = [
    { id: 1, label: "Informações Pessoais", icon: User, cor: "#FFF" },
    { id: 2, label: "Pagamentos", icon: CreditCard, cor: "#FFF" },
    { id: 3, label: "Endereços Salvos", icon: MapPin, cor: "#FFF" },
    { id: 4, label: "Segurança", icon: ShieldCheck, cor: "#00E5FF" },
    { id: 5, label: "Configurações", icon: Settings, cor: "#FFF" },
  ];

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <button className="perfil-botao-voltar" onClick={onBack}>
          <ArrowLeft size={24} color="#FFF" />
        </button>
        <h1 className="perfil-titulo-header">Perfil</h1>
      </div>

      <div className="perfil-info-principal">
        <div className="avatar-wrapper-matte">
          <img src={AVATAR_URL} alt="Foto de Perfil" />
          <div className="badge-edicao">
            <Settings size={12} color="#000" />
          </div>
        </div>
        <h2 className="perfil-nome-usuario">Carlos Eduardo</h2>
        <p className="perfil-email-usuario">carlos.eduardo@ifrn.edu.br</p>
      </div>

      <div className="perfil-menu-lista">
        {itensMenu.map((item) => (
          <motion.div 
            key={item.id}
            className="perfil-menu-item"
            whileTap={{ backgroundColor: "#1a1a1a", scale: 0.98 }}
          >
            <div className="perfil-item-esquerda">
              <div className="perfil-icone-caixa">
                <item.icon size={20} color={item.cor} />
              </div>
              <span className="perfil-item-label">{item.label}</span>
            </div>
            <ChevronRight size={18} color="#444" />
          </motion.div>
        ))}
      </div>

      <motion.button 
        className="perfil-botao-sair"
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
      >
        <LogOut size={20} color="#FF3B30" />
        <span>Sair da Conta</span>
      </motion.button>
    </div>
  );
}