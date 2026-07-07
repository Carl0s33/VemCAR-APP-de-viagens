import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, ChevronRight, ArrowLeft, CarFront, Banknote, CircleUserRound, BadgeCheck
} from "lucide-react";

import {
  TelaInfo, TelaSeguranca, TelaVeiculo, TelaGanhos
} from "./SubtelasPerfilMotorista";
import { useTheme } from "../../../hooks/useTheme";
import "./FluxoPerfilMotorista.css";
import { LogOut } from "lucide-react";
import imgMotorista from "../../../assets/motorista-selfie.png";

export default function FluxoPerfilMotorista({ onBack, aoSair }) {
  const [telaAtiva, setTelaAtiva] = useState("menu");
  const [modalAtivo, setModalAtivo] = useState(null);
  const { isLight } = useTheme();

  const AVATAR_URL = imgMotorista;

  const menuMotorista = [
    { id: "veiculo", label: "Meu Veículo", desc: "Fiat Argo Branco • QWE-9999", icon: CarFront, cor: "#00E5FF" },
    { id: "ganhos", label: "Painel de Ganhos", desc: "Extrato e saques", icon: Banknote, cor: "#34C759" },
    { id: "info", label: "Informações Pessoais", desc: "Meus dados cadastrais", icon: CircleUserRound, cor: "#FFF" },
    { id: "seguranca", label: "Privacidade e Segurança", desc: "Senhas e contatos", icon: BadgeCheck, cor: "#FFF" },
  ];

  const renderTelaAtiva = () => {
    switch (telaAtiva) {
      case "info": return <TelaInfo onSave={() => setTelaAtiva("menu")} />;
      case "seguranca": return <TelaSeguranca onSave={() => setTelaAtiva("menu")} />;
      case "veiculo": return <TelaVeiculo onSave={() => setTelaAtiva("menu")} />;
      case "ganhos": return <TelaGanhos />;
      default: return null;
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <button className="perfil-botao-voltar" onClick={() => telaAtiva === "menu" ? onBack() : setTelaAtiva("menu")}>
          <ArrowLeft size={24} color="#FFF" strokeWidth={2.5} />
        </button>
        <h1 className="perfil-titulo-header">{telaAtiva === "menu" ? "Meu Perfil" : "Voltar"}</h1>
      </div>

      <AnimatePresence mode="wait">
        {telaAtiva === "menu" ? (
          <motion.div key="menu" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="menu-principal-wrapper">

            <div className="perfil-info-principal">
              <div className="avatar-wrapper-matte">
                <img src={AVATAR_URL} alt="Avatar" />
                <div className="badge-edicao"><Settings size={14} color="#000" strokeWidth={2.5} /></div>
              </div>
              <h2 className="perfil-nome-usuario">Seu Antônio</h2>
              <span className="badge-motorista-info">Motorista Parceiro • 4.9</span>
            </div>

            <div className="perfil-menu-lista">
              {menuMotorista.map((item) => {
                const Icone = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    className="perfil-menu-item"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTelaAtiva(item.id)}
                  >
                    <div className="perfil-item-esquerda">
                      <div className="perfil-icone-caixa" style={{ color: item.cor }}>
                        <Icone size={20} strokeWidth={2.2} />
                      </div>
                      <div className="perfil-textos-caixa">
                        <span className="perfil-item-label">{item.label}</span>
                        <span className="perfil-item-desc">{item.desc}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="chevron-icon" strokeWidth={2.5} />
                  </motion.button>
                );
              })}

              <motion.button
                className="perfil-menu-item btn-sair"
                whileTap={{ scale: 0.98 }}
                onClick={aoSair}
                style={{ marginTop: 24, justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                <LogOut size={20} color="#EF4444" strokeWidth={2.5} />
                <span style={{ color: '#EF4444', fontWeight: 800, fontSize: 16 }}>Sair da Conta</span>
              </motion.button>
            </div>

          </motion.div>
        ) : (
          <motion.div key="subtela" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
            {renderTelaAtiva()}
          </motion.div>
        )}
      </AnimatePresence>

      
      {modalAtivo && (
        <div className="perfil-modal-overlay">
          <div className="perfil-modal-card">
            <h3>Sucesso</h3>
            <p>Configuração atualizada com sucesso.</p>
            <button onClick={() => setModalAtivo(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
