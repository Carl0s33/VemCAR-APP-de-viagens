import { motion } from "motion/react";
import { Clock, Search, ArrowLeft } from "lucide-react";
import "./style/TelaSelecaoDestino.css";

export default function TelaSelecaoDestino({ onSelectDestination, onBack }) {
  const atalhos = [
    { id: "casa", rotulo: "Casa", subtitulo: "Santo Antônio" },
    { id: "trabalho", rotulo: "Trabalho", subtitulo: "IFRN Campus Nova Cruz" },
  ];

  return (
    <div className="tela-selecao-destino-container">
      {/* Botão Voltar */}
      <div className="tela-selecao-destino-voltar-wrapper">
        <button
          onClick={onBack}
          className="tela-selecao-destino-botao-voltar"
        >
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
        </button>
      </div>

      {/* Busca */}
      <div className="tela-selecao-destino-header-busca">
        <div className="tela-selecao-destino-input-wrapper">
          <Search size={20} color="#888888" className="tela-selecao-destino-icone-busca" />
          <input
            type="text"
            placeholder="Para onde você vai?"
            className="tela-selecao-destino-input"
            autoFocus
          />
        </div>
      </div>

      {/* Atalhos */}
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
                <Clock size={22} color="#00E5FF" strokeWidth={2.5} />
              </div>
              <div className="tela-selecao-destino-info-atalho">
                <div className="tela-selecao-destino-nome-atalho">{atalho.rotulo}</div>
                <div className="tela-selecao-destino-subtitulo-atalho">{atalho.subtitulo}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}