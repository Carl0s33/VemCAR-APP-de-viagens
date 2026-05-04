import React, { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import "./style/TelaLogin.css";

export default function TelaLogin({ aoContinuar, aoLoginMotorista, aoCadastrar }) {
  const [tipoUsuario, setTipoUsuario] = useState("passageiro");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const lidarComLogin = () => {
    if (tipoUsuario === "motorista") {
      aoLoginMotorista();
    } else {
      aoContinuar();
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo-secao">
        <motion.div 
          className="login-marca"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="login-marca-vem">VEM</span>
          <span className="login-marca-car">CAR</span>
        </motion.div>
        <p className="login-subtitulo-cidade">Nova Cruz • RN</p>
      </div>

      <div className="login-abas">
        {["passageiro", "motorista"].map((tipo) => (
          <button 
            key={tipo}
            className="login-aba-item"
            onClick={() => setTipoUsuario(tipo)}
          >
            <span className={`login-aba-texto ${tipoUsuario === tipo ? "ativo" : ""}`}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </span>
            {tipoUsuario === tipo && (
              <motion.div layoutId="abaAtiva" className="login-aba-indicador" />
            )}
          </button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        key={tipoUsuario}
      >
        <h2 style={{ color: "#FFF", fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
          Bem-vindo de volta
        </h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>
          {tipoUsuario === "passageiro" ? "Entre para viajar agora." : "Entre para gerenciar suas corridas."}
        </p>

        <div className="login-campo-grupo">
          <label className="login-label">Telefone ou E-mail</label>
          <input type="text" placeholder="(84) 99999-9999" className="login-input" />
        </div>

        <div className="login-campo-grupo">
          <label className="login-label">Senha</label>
          <div style={{ position: "relative" }}>
            <input 
              type={mostrarSenha ? "text" : "password"} 
              placeholder="Sua senha" 
              className="login-input" 
            />
            <button 
              onClick={() => setMostrarSenha(!mostrarSenha)}
              style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}
            >
              {mostrarSenha ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
            </button>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="login-botao-entrar"
          onClick={lidarComLogin}
        >
          <span>Entrar</span>
          <ArrowRight size={20} color="#000" strokeWidth={3} />
        </motion.button>

        <div className="login-rodape">
          <p>
            Novo por aqui?{" "}
            <span className="login-link-cadastro" onClick={aoCadastrar}>
              Criar conta grátis
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}