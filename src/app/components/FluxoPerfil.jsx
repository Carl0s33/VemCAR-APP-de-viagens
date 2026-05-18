import React, { useState, useEffect, useRef } from "react";
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
  const [avatar, setAvatar] = useState(null); // inicia nulo pra mostrar o padrao do whatsapp
  const fileInputRef = useRef(null);
  const { isLight, toggleTheme } = useTheme();

  const isMotorista = tipoUsuario === "motorista";

  // carrega a foto do cache se existir
  useEffect(() => {
    const fotoSalva = localStorage.getItem("vem_app_avatar");
    if (fotoSalva) {
      setAvatar(fotoSalva);
    }
  }, []);

  // muda a foto e salva no localstorage
  const handleTrocarFoto = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatar(base64String);
        localStorage.setItem("vem_app_avatar", base64String);
      };
      reader.readAsDataURL(arquivo);
    }
  };

  const handleSairDaConta = () => {
    setModalAtivo(null);
    onBack();
  };

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
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleTrocarFoto}
                      accept="image/*"
                      style={{ display: "none" }}
                  />

                  <div className="avatar-wrapper-matte" onClick={() => fileInputRef.current.click()} style={{ cursor: "pointer", position: "relative", background: "#DFE5E7", width: 100, height: 100, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {avatar ? (
                        <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        /* boneco padrao do whatsapp em branco/cinza vetorial */
                        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "12px" }}>
                          <circle cx="50" cy="38" r="18" fill="#FFFFFF" />
                          <path d="M18 80C18 64.536 30.536 52 46 52H54C69.464 52 82 64.536 82 80V84H18V80Z" fill="#FFFFFF" />
                        </svg>
                    )}
                    <div className="badge-edicao" style={{ zIndex: 10 }}><Settings size={14} color="#000" strokeWidth={2.5} /></div>
                  </div>

                  <h2 className="perfil-nome-usuario">Carlos Eduardo</h2>
                  {isMotorista ? (
                      <span className="badge-motorista-info">Motorista Parceiro • 4.9</span>
                  ) : (
                      <p className="perfil-email-usuario">carlos.eduardo@ifrn.edu.br</p>
                  )}
                </div>

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

        <AnimatePresence>
          {modalAtivo === "sair" && (
              <div className="perfil-modal-overlay" style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="perfil-modal-box"
                    style={{ background: "#121212", border: "1px solid #1e1e1e", borderRadius: 20, padding: 24, width: "100%", maxWidth: 340, textAlign: "center" }}
                >
                  <h3 style={{ color: "#FFF", fontSize: 18, fontWeight: 800, margin: "0 0 8px 0" }}>Sair da Conta?</h3>
                  <p style={{ color: "#888", fontSize: 14, margin: "0 0 24px 0" }}>Você precisará digitar suas credenciais para entrar novamente.</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => setModalAtivo(null)} style={{ flex: 1, height: 48, background: "#1e1e1e", border: "none", color: "#FFF", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
                    <button onClick={handleSairDaConta} style={{ flex: 1, height: 48, background: "#EF4444", border: "none", color: "#FFF", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Sair</button>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>
      </div>
  );
}