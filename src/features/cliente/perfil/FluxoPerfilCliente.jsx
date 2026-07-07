import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Settings, CreditCard, MapPin, ChevronRight,
  ShieldCheck, ArrowLeft, GraduationCap
} from "lucide-react";

import {
  TelaInfo, TelaPagamentos, TelaEnderecos, TelaSeguranca
} from "./SubtelasPerfilCliente";
import { useTheme } from "../../../hooks/useTheme";
import "./FluxoPerfilCliente.css";
import { LogOut } from "lucide-react";

export default function FluxoPerfilCliente({ onBack, aoSair }) {
  const [telaAtiva, setTelaAtiva] = useState("menu");
  const [modalAtivo, setModalAtivo] = useState(null);
  const { isLight } = useTheme();

  const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";

  const menuPassageiro = [
    { id: "info", label: "Informações Pessoais", desc: "Meus dados, CPF e telefone", icon: User, cor: "#FFF" },
    { id: "pagamentos", label: "Formas de Pagamento", desc: "Dinheiro e Pix", icon: CreditCard, cor: "#FFF" },
    { id: "enderecos", label: "Endereços Salvos", desc: "Casa, IFRN e Trabalho", icon: MapPin, cor: "#FFF" },
    { id: "seguranca", label: "Privacidade e Segurança", desc: "Senhas e contatos", icon: ShieldCheck, cor: "#FFF" },
  ];

  const renderTelaAtiva = () => {
    switch (telaAtiva) {
      case "info": return <TelaInfo onSave={() => setTelaAtiva("menu")} />;
      case "pagamentos": return <TelaPagamentos onAddCartao={() => setModalAtivo("add_cartao")} />;
      case "enderecos": return <TelaEnderecos onAddEndereco={() => setModalAtivo("add_endereco")} />;
      case "seguranca": return <TelaSeguranca onSave={() => setTelaAtiva("menu")} />;
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
              <h2 className="perfil-nome-usuario">Carlos Eduardo</h2>
              <p className="perfil-email-usuario">carlos.eduardo@ifrn.edu.br</p>
            </div>

            <div className="perfil-menu-lista">
              {menuPassageiro.map((item) => {
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
