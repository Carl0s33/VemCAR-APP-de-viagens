import { motion } from "motion/react";
import { ArrowLeft, Upload, Car } from "lucide-react";
import { useState } from "react";
import "./style/TelaCadastroMotorista.css";

export default function TelaCadastroMotorista({ onContinue, onBack }) {
  const [cnhUploaded, setCnhUploaded] = useState(false);
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");

  return (
    <div className="tela-cadastro-motorista">
      <div className="header-cadastro-motorista">
        <button onClick={onBack} className="botao-voltar-cadastro-motorista">
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
        </button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="titulo-cadastro-motorista">Documentação</h1>
          <p className="subtitulo-cadastro-motorista">Envie seus documentos para análise</p>
        </motion.div>
      </div>
      <div className="conteudo-cadastro-motorista">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="upload-cnh-cadastro-motorista">
          <label className="label-cnh">CNH (Carteira Nacional de Habilitação)</label>
          <button onClick={() => setCnhUploaded(!cnhUploaded)} className={`botao-upload-cnh ${cnhUploaded ? "enviado" : ""}`}>
            <div className="icone-upload-cnh" style={{ background: cnhUploaded ? "#00E5FF" : "#1E1E1E" }}>
              <Upload size={28} color={cnhUploaded ? "#000000" : "#FFFFFF"} strokeWidth={2.5} />
            </div>
            <div className="texto-upload-cnh">
              <p className="titulo-upload-cnh" style={{ color: cnhUploaded ? "#00E5FF" : "#FFFFFF" }}>
                {cnhUploaded ? "CNH enviada com sucesso" : "Enviar foto da CNH"}
              </p>
              <p className="subtitulo-upload-cnh">{cnhUploaded ? "Toque para alterar" : "Formato JPG ou PNG"}</p>
            </div>
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="veiculo-cadastro-motorista">
          <div className="info-veiculo-cadastro-motorista">
            <div className="icone-veiculo-cadastro-motorista">
              <Car size={24} color="#000000" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="titulo-veiculo-cadastro-motorista">Informações do veículo</h3>
              <p className="subtitulo-veiculo-cadastro-motorista">Dados do carro que você vai usar</p>
            </div>
          </div>
          <div className="campo-cadastro-motorista">
            <label className="label-campo-cadastro-motorista">Placa</label>
            <input type="text" placeholder="ABC-1234" value={plate} onChange={e => setPlate(e.target.value)} className="input-campo-cadastro-motorista" style={{ textTransform: "uppercase" }} onFocus={e => e.target.style.borderColor = "#00E5FF"} onBlur={e => e.target.style.borderColor = "#1E1E1E"} />
          </div>
          <div className="campo-cadastro-motorista">
            <label className="label-campo-cadastro-motorista">Modelo</label>
            <input type="text" placeholder="Fiat Argo" value={model} onChange={e => setModel(e.target.value)} className="input-campo-cadastro-motorista" onFocus={e => e.target.style.borderColor = "#00E5FF"} onBlur={e => e.target.style.borderColor = "#1E1E1E"} />
          </div>
          <div className="campo-cadastro-motorista">
            <label className="label-campo-cadastro-motorista">Cor</label>
            <input type="text" placeholder="Branco" value={color} onChange={e => setColor(e.target.value)} className="input-campo-cadastro-motorista" onFocus={e => e.target.style.borderColor = "#00E5FF"} onBlur={e => e.target.style.borderColor = "#1E1E1E"} />
          </div>
        </motion.div>
      </div>
      <div className="footer-cadastro-motorista">
        <motion.button whileTap={{ scale: 0.98 }} onClick={onContinue} className="botao-enviar-cadastro-motorista">
          Enviar para Análise
        </motion.button>
      </div>
    </div>
  );
}
