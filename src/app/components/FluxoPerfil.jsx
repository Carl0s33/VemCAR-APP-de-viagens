import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Settings, CreditCard, MapPin, LogOut, ChevronRight,
  ShieldCheck, ArrowLeft, CarFront, Banknote, CircleUserRound, BadgeCheck, X
} from "lucide-react";

// Importando as páginas que quebramos no outro arquivo
import { TelaInfo, TelaPagamentos, TelaEnderecos, TelaSeguranca, TelaVeiculo, TelaGanhos } from "./SubtelasPerfil";
import "./style/FluxoPerfil.css";

export default function FluxoPerfil({ onBack, tipoUsuario = "passageiro" }) {
  const [telaAtiva, setTelaAtiva] = useState("menu"); 
  const [modalAtivo, setModalAtivo] = useState(null); // 'sair', 'add_cartao', 'add_endereco'
  
  const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";
  const isMotorista = tipoUsuario === "motorista";

  // Menus Dinâmicos
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

  // Lógica de Renderização das Subtelas
  const renderTelaAtiva = () => {
    switch (telaAtiva) {
      case "info": return <TelaInfo onSave={() => setTelaAtiva("menu")} />;
      case "pagamentos": return <TelaPagamentos onAddCartao={() => setModalAtivo("add_cartao")} />;
      case "enderecos": return <TelaEnderecos onAddEndereco={() => setModalAtivo("add_endereco")} />;
      case "seguranca": return <TelaSeguranca onSave={() => setTelaAtiva("menu")} />;
      case "veiculo": return <TelaVeiculo onSave={() => setTelaAtiva("menu")} />;
      case "ganhos": return <TelaGanhos />;
      default: return null;
    }
  };

  return (
    <div className="perfil-container">
      {/* HEADER FIXO */}
      <div className="perfil-header">
        <button className="perfil-botao-voltar" onClick={() => telaAtiva === "menu" ? onBack() : setTelaAtiva("menu")}>
          <ArrowLeft size={24} color="#FFF" strokeWidth={2.5} />
        </button>
        <h1 className="perfil-titulo-header">{telaAtiva === "menu" ? "Meu Perfil" : "Voltar"}</h1>
      </div>

      {/* ÁREA PRINCIPAL COM ANIMAÇÃO */}
      <AnimatePresence mode="wait">
        {telaAtiva === "menu" ? (
          <motion.div key="menu" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="menu-principal-wrapper">
            
            {/* Info do Usuário */}
            <div className="perfil-info-principal">
              <div className="avatar-wrapper-matte">
                <img src={AVATAR_URL} alt="Avatar" />
                <div className="badge-edicao"><Settings size={14} color="#000" strokeWidth={2.5} /></div>
              </div>
              <h2 className="perfil-nome-usuario">Carlos Eduardo</h2>
              {isMotorista ? (
                <span className="badge-motorista-info">Motorista Parceiro • ⭐ 4.9</span>
              ) : (
                <p className="perfil-email-usuario">carlos.eduardo@ifrn.edu.br</p>
              )}
            </div>

            {/* Lista de Menus */}
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

      {/* ================= MODAIS FLUTUANTES ================= */}
      <AnimatePresence>
        {modalAtivo && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-backdrop" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setModalAtivo(null)} 
            />
            <motion.div 
              className="modal-conteudo-matte"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="alca-drag" />
              <button className="btn-fechar-modal" onClick={() => setModalAtivo(null)}><X size={24} color="#FFF" /></button>

              {modalAtivo === "sair" && (
                <div style={{ textAlign: "center", paddingTop: 20 }}>
                  <LogOut size={48} color="#EF4444" style={{ marginBottom: 16 }} />
                  <h2 className="subtela-titulo">Deseja realmente sair?</h2>
                  <p className="subtela-desc">Você precisará fazer login novamente para acessar o VEM CAR.</p>
                  <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
                    <button className="btn-secundario-matte" style={{flex: 1}} onClick={() => setModalAtivo(null)}>Cancelar</button>
                    <button className="btn-salvar-matte" style={{flex: 1, background: "#EF4444", boxShadow: "0 4px 0px #B91C1C", marginTop: 0}} onClick={onBack}>Sim, Sair</button>
                  </div>
                </div>
              )}

              {modalAtivo === "add_cartao" && (
                <div>
                  <h2 className="subtela-titulo">Adicionar Cartão</h2>
                  <div className="input-group-matte" style={{marginTop: 24}}>
                    <label className="label-solid">Número do Cartão</label>
                    <input className="input-solid" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div className="input-group-matte" style={{flex: 1}}>
                      <label className="label-solid">Validade</label>
                      <input className="input-solid" placeholder="MM/AA" />
                    </div>
                    <div className="input-group-matte" style={{flex: 1}}>
                      <label className="label-solid">CVV</label>
                      <input className="input-solid" placeholder="123" />
                    </div>
                  </div>
                  <button className="btn-salvar-matte" onClick={() => setModalAtivo(null)}>Salvar Cartão</button>
                </div>
              )}

              {modalAtivo === "add_endereco" && (
                <div>
                  <h2 className="subtela-titulo">Novo Endereço</h2>
                  <div className="input-group-matte" style={{marginTop: 24}}>
                    <label className="label-solid">CEP</label>
                    <input className="input-solid" placeholder="59215-000" />
                  </div>
                  <div className="input-group-matte">
                    <label className="label-solid">Rua / Logradouro</label>
                    <input className="input-solid" placeholder="Ex: Rua Santo Antônio" />
                  </div>
                  <button className="btn-salvar-matte" onClick={() => setModalAtivo(null)}>Salvar Endereço</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}