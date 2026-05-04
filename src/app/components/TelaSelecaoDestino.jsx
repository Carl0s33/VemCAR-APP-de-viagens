import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Search, ArrowLeft, MapPin, CircleDot, Map, CreditCard, ChevronRight, Banknote, Check } from "lucide-react";
import "./style/TelaSelecaoDestino.css";

export default function TelaSelecaoDestino({ onSelectDestination, onBack, onEscolherNoMapa }) {
  const [pagamento, setPagamento] = useState("Pix");
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false); // controla o modal

  const atalhos = [
    { id: "casa", rotulo: "Casa", subtitulo: "Santo Antônio" },
    { id: "trabalho", rotulo: "Trabalho", subtitulo: "IFRN Campus Nova Cruz" },
  ];

  const selecionarPagamento = (metodo) => {
    setPagamento(metodo);
    setModalPagamentoAberto(false); // fecha o modal logo depois de escolher
  };

  return (
    <div className="tela-selecao-destino-container">
      {/* botão voltar */}
      <div className="tela-selecao-destino-voltar-wrapper">
        <button onClick={onBack} className="tela-selecao-destino-botao-voltar">
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
        </button>
        <span className="titulo-tela-busca">Sua rota</span>
      </div>

      {/* caixa dupla estilo Uber (Matte) */}
      <div className="tela-selecao-destino-caixa-dupla matte-box">
        <div className="indicadores-rota">
          <CircleDot size={18} color="#34C759" strokeWidth={3} />
          <div className="linha-pontilhada-rota" />
          <MapPin size={20} color="#00E5FF" strokeWidth={2.5} />
        </div>

        <div className="inputs-rota">
          <div className="input-origem-box">
            <input
              type="text"
              placeholder="Localização atual"
              className="input-rota-texto"
              defaultValue="Localização atual"
            />
            <button className="botao-abrir-mapa" onClick={onEscolherNoMapa}>
              <Map size={16} color="#fafafa" strokeWidth={2.5} />
              <span>Mapa</span>
            </button>
          </div>
          <div className="divisor-inputs" />
          <div className="input-destino-box">
            <input
              type="text"
              placeholder="Para onde vamos?"
              className="input-rota-texto destaque"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Seletor que agora ABRE O MODAL */}
      <div className="seletor-pagamento-wrapper">
        <button className="botao-pagamento-matte" onClick={() => setModalPagamentoAberto(true)}>
          <div className="icone-pagamento-wrapper">
            {pagamento === "Pix" ? (
              <CreditCard size={20} color="#34C759" strokeWidth={2.5} />
            ) : (
              <Banknote size={20} color="#F59E0B" strokeWidth={2.5} />
            )}
          </div>
          <div className="info-pagamento">
            <span className="pagamento-titulo">Forma de pagamento</span>
            <span className="pagamento-valor">{pagamento}</span>
          </div>
          <ChevronRight size={20} color="#666" />
        </button>
      </div>

      {/* atalhos frequentes */}
      <div className="tela-selecao-destino-conteudo">
        <h2 className="tela-selecao-destino-titulo-secao">DESTINOS FREQUENTES</h2>
        <div className="tela-selecao-destino-lista-atalhos">
          {atalhos.map((atalho, index) => (
            <motion.button
              key={atalho.id}
              onClick={() => onSelectDestination(atalho.id)}
              className="tela-selecao-destino-card-atalho"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="tela-selecao-destino-icone-relogio">
                <Clock size={20} color="#00E5FF" strokeWidth={2.5} />
              </div>
              <div className="tela-selecao-destino-info-atalho">
                <div className="tela-selecao-destino-nome-atalho">{atalho.rotulo}</div>
                <div className="tela-selecao-destino-subtitulo-atalho">{atalho.subtitulo}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* =========================================
          MODAL DE PAGAMENTO (BOTTOM SHEET)
          ========================================= */}
      <AnimatePresence>
        {modalPagamentoAberto && (
          <>
            {/* Fundo escuro clicável pra fechar */}
            <motion.div 
              className="modal-overlay-matte"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalPagamentoAberto(false)}
            />
            
            {/* O Modal subindo do rodapé */}
            <motion.div 
              className="modal-bottom-sheet-matte"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
            >
              <div className="drag-handle" />
              <h3 className="modal-titulo-matte">Opções de pagamento</h3>

              <div className="lista-opcoes-pagamento">
                {/* Opção PIX */}
                <button 
                  className={`opcao-pagamento-item ${pagamento === "Pix" ? "selecionado" : ""}`}
                  onClick={() => selecionarPagamento("Pix")}
                >
                  <div className="icone-pagamento-wrapper">
                    <CreditCard size={20} color="#34C759" strokeWidth={2.5} />
                  </div>
                  <span className="texto-opcao-pagamento">Pix</span>
                  {pagamento === "Pix" && <Check size={20} color="#00E5FF" strokeWidth={3} />}
                </button>

                <div className="divisor-modal-matte" />

                {/* Opção DINHEIRO */}
                <button 
                  className={`opcao-pagamento-item ${pagamento === "Dinheiro" ? "selecionado" : ""}`}
                  onClick={() => selecionarPagamento("Dinheiro")}
                >
                  <div className="icone-pagamento-wrapper">
                    <Banknote size={20} color="#F59E0B" strokeWidth={2.5} />
                  </div>
                  <span className="texto-opcao-pagamento">Dinheiro</span>
                  {pagamento === "Dinheiro" && <Check size={20} color="#00E5FF" strokeWidth={3} />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}