import React, { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowRight, Phone, Lock } from "lucide-react";
import "./TelaLogin.css";

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
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <span className="login-marca-vem">VEM</span>
          <span className="login-marca-car">CAR</span>
        </motion.div>
        <motion.p 
          className="login-subtitulo-cidade"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Nova Cruz • RN
        </motion.p>
      </div>

      <motion.div className="login-abas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        key={tipoUsuario}
        className="login-form-area"
      >
        <h2 className="login-title">Bem-vindo de volta</h2>
        <p className="login-subtitle">
          {tipoUsuario === "passageiro" ? "Entre para solicitar sua próxima viagem." : "Entre para gerenciar seus ganhos."}
        </p>

        <div className="login-campo-grupo">
          <label className="login-label">Telefone ou E-mail</label>
          <div className="login-input-wrapper">
            <Phone size={18} className="login-input-icon" />
            <input type="text" placeholder="(84) 99999-9999" className="login-input com-icone" />
          </div>
        </div>

        <div className="login-campo-grupo">
          <label className="login-label">Senha</label>
          <div className="login-input-wrapper">
            <Lock size={18} className="login-input-icon" />
            <input 
              type={mostrarSenha ? "text" : "password"} 
              placeholder="••••••••" 
              className="login-input com-icone" 
            />
            <button 
              className="login-btn-senha"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="login-botao-entrar"
          onClick={lidarComLogin}
        >
          <span>Acessar Conta</span>
          <ArrowRight size={20} color="#000" strokeWidth={3} />
        </motion.button>

        <div className="login-rodape">
          <p>
            Ainda não tem conta?{" "}
            <span className="login-link-cadastro" onClick={aoCadastrar}>
              Cadastre-se grátis
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}