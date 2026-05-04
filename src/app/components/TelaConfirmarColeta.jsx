import { motion } from "motion/react";
import { MapPin, ArrowLeft } from "lucide-react";
import "./style/TelaConfirmarColeta.css";

export default function TelaConfirmarColeta({ onConfirm, onBack }) {
  return (
    <div className="tela-confirmar-coleta">
      <div className="botao-voltar">
        <button onClick={onBack} className="botao-voltar-icone">
                <div style={{ textAlign: "center", marginTop: 32 }}>
                  <button onClick={onConfirm} className="botao-confirmar-coleta">
                    Confirmar Coleta
                  </button>
                </div>
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
        </button>
      </div>

      <div className="area-mapa">
        <div className="mapa-fundo">
          <svg className="mapa-grade">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="pino-centro">
          <motion.div className="pino-glow">
            <div className="pino"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}