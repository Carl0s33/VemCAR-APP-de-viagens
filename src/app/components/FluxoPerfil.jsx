import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Settings, CreditCard, MapPin, LogOut, ChevronRight,
  ShieldCheck, ArrowLeft, CarFront, Banknote, CircleUserRound, BadgeCheck, X, GraduationCap,
  Sun, Moon
} from "lucide-react";

import {
  TelaInfo, TelaPagamentos, TelaEnderecos, TelaSeguranca,
  TelaVeiculo, TelaGanhos, TelaVemIFRN
} from "./SubtelasPerfil";
import { useTheme } from "../hooks/useTheme";
import "./style/FluxoPerfil.css";

export default function FluxoPerfil({ onBack, tipoUsuario = "passageiro" }) {
  const [telaAtiva, setTelaAtiva] = useState("menu");
  const [modalAtivo, setModalAtivo] = useState(null);
  const { isLight, toggleTheme } = useTheme();

  const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";
  const isMotorista = tipoUsuario === "motorista";

  // O item "Carona Uni" foi removido daqui para virar um banner exclusivo
  const menuPassageiro = [
    { id: "info", label: "Informações Pessoais", desc: "Meus dados, CPF e telefone", icon: User, cor: "#FFF" },
    { id: "pagamentos", label: "Formas de Pagamento", desc: "Dinheiro e Pix", icon: CreditCard, cor: "#FFF" },
    { id: "enderecos", label: "Endereços Salvos", desc: "Casa, IFRN e Trabalho", icon: MapPin, cor: "#FFF" },
    { id: "seguranca", label: "Privacidade e Segurança", desc: "Senhas e contatos", icon: ShieldCheck, cor: "#FFF" },
  ];

  const menuMotorista = [
    { id: "veiculo", label: "Meu Veículo", desc: "Fiat Argo Branco • QWE-9999", icon: CarFront, cor: "#00E5FF" },
    { id: "ganhos", label: "Painel de Ganhos", desc: "Extrato e saques", icon: Banknote, cor: "#34C759" },
    { id: "info", label: "Informações Pessoais", desc: "Meus dados cadastrais", icon: CircleUserRound, cor: "#FFF" },
    { id: "seguranca", label: "Privacidade e Segurança", desc: "Senhas e contatos", icon: BadgeCheck, cor: "#FFF" },
  ];

  const itensMenu = isMotorista ? menuMotorista : menuPassageiro;

  const renderTelaAtiva = () => {
    switch (telaAtiva) {
      case "info": return <TelaInfo onSave={() => setTelaAtiva("menu")} />;
      case "pagamentos": return <TelaPagamentos onAddCartao={() => setModalAtivo("add_cartao")} />;
      case "enderecos": return <TelaEnderecos onAddEndereco={() => setModalAtivo("add_endereco")} />;
      case "ifrn": return <TelaVemIFRN />;
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
                  <h2 className="perfil-nome-usuario">Carlos Eduardo</h2>
                  {isMotorista ? (
                      <span className="badge-motorista-info">Motorista Parceiro • 4.9</span>
                  ) : (
                      <p className="perfil-email-usuario">carlos.eduardo@ifrn.edu.br</p>
                  )}
                </div>

                {/* BANNER DESTACADO VEM IFRN (Exclusivo Passageiro) */}
                {!isMotorista && (
                    <motion.div
                        className="perfil-banner-ifrn"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setTelaAtiva("ifrn")}
                    >
                      <div className="banner-ifrn-conteudo">
                        <div className="banner-ifrn-icone">
                          <GraduationCap size={28} color="#000" strokeWidth={2.5} />
                        </div>
                        <div className="banner-ifrn-textos">
                          <h3>VEM IFRN</h3>
                          <p>Benefício Estudantil Ativo</p>
                        </div>
                      </div>
                      <ChevronRight size={24} color="#000" strokeWidth={2.5} />
                    </motion.div>
                )}

                <div className="perfil-menu-lista">
                  {itensMenu.map((item) => (
                      <motion.div key={item.id} className="perfil-menu-item" whileTap={{ scale: 0.98 }} onClick={() => setTelaAtiva(item.id)}>
                        <div className="perfil-item-esquerda">
                          <div className="perfil-icone-caixa"><item.icon size={22} color={item.cor} strokeWidth={2.5} /></div>
                          <div className="perfil-textos-caixa">
                            <span className="perfil-item-label">{item.label}</span>
                            <span className="perfil-item-desc">{item.desc}</span>
                          </div>
                        </div>
                        <ChevronRight size={20} color="#444" strokeWidth={2.5} />
                      </motion.div>
                  ))}
                </div>

                <motion.button
                  className="perfil-toggle-tema"
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleTheme}
                  aria-label={isLight ? "Mudar para modo escuro" : "Mudar para modo claro"}
                >
                  <div className="perfil-item-esquerda">
                    <div className="perfil-icone-caixa">
                      {isLight
                        ? <Moon size={22} color="#111827" strokeWidth={2.5} />
                        : <Sun size={22} color="#FFD60A" strokeWidth={2.5} />}
                    </div>
                    <div className="perfil-textos-caixa">
                      <span className="perfil-item-label">Aparência</span>
                      <span className="perfil-item-desc">
                        {isLight ? "Modo claro ativo" : "Modo escuro ativo"}
                      </span>
                    </div>
                  </div>
                  <div className={`perfil-switch ${isLight ? "ativo" : ""}`}>
                    <div className="perfil-switch-bolinha" />
                  </div>
                </motion.button>

                <motion.button className="perfil-botao-sair" whileTap={{ scale: 0.95 }} onClick={() => setModalAtivo("sair")}>
                  <LogOut size={20} color="#000" strokeWidth={2.5} />
                  <span>Sair da Conta</span>
                </motion.button>
              </motion.div>
          ) : (
              <motion.div key={telaAtiva} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="subtela-animada">
                {renderTelaAtiva()}
              </motion.div>
          )}
        </AnimatePresence>

        {/* Modais de Ação omitidos por brevidade (Mantenha os que já estavam no arquivo original) */}
      </div>
  );
}