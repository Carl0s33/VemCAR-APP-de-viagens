import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, CarFront, Upload, ShieldCheck, CheckCircle2, Lock, Mail, Phone, GraduationCap, Hash } from "lucide-react";
import "./style/FluxoCadastro.css"; 

export default function FluxoCadastro({ aoConcluir, aoVoltar }) {
  const [etapa, setEtapa] = useState("escolha"); // escolha, basica, especifico, otp
  const [tipoUsuario, setTipoUsuario] = useState("");
  
  // Dados Básicos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  
  // Dados Específicos
  const [veiculo, setVeiculo] = useState({ placa: "", renavam: "", marca: "", modelo: "", ano: "", cor: "" });
  const [fotoPerfilEnviada, setFotoPerfilEnviada] = useState(false);
  const [cnhEnviada, setCnhEnviada] = useState(false);
  const [crlvEnviado, setCrlvEnviado] = useState(false);
  const [eEstudante, setEEstudante] = useState(false);

  const avancarPara = (proxima) => setEtapa(proxima);

  const camposBasicosPreenchidos = nome && email && telefone && cpf && senha.length >= 6;
  const camposMotoristaPreenchidos = fotoPerfilEnviada && cnhEnviada && crlvEnviado && veiculo.placa && veiculo.renavam && veiculo.marca && veiculo.modelo && veiculo.ano && veiculo.cor;

  return (
    <div className="cadastro-container">
      <header className="cadastro-header">
        <button 
          onClick={() => etapa === "escolha" ? aoVoltar() : avancarPara(etapa === "otp" ? "especifico" : etapa === "especifico" ? "basica" : "escolha")} 
          className="btn-voltar"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
      </header>

      <div className="cadastro-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={etapa}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* ================= ETAPA 1: ESCOLHA ================= */}
            {etapa === "escolha" && (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
                <h1 className="cadastro-titulo">Como você quer usar?</h1>
                <p className="cadastro-subtitulo">Escolha seu perfil no VEM CAR.</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <motion.button whileTap={{ scale: 0.95 }} className="card-opcao" onClick={() => { setTipoUsuario("passageiro"); avancarPara("basica"); }}>
                    <div className="icone-box icone-passageiro"><User size={32} color="#000" /></div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Passageiro</h3>
                      <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Quero pedir viagens.</p>
                    </div>
                  </motion.button>

                  <motion.button whileTap={{ scale: 0.95 }} className="card-opcao" onClick={() => { setTipoUsuario("motorista"); avancarPara("basica"); }}>
                    <div className="icone-box icone-motorista"><CarFront size={32} color="#000" /></div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Motorista</h3>
                      <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Quero aumentar minha renda.</p>
                    </div>
                  </motion.button>
                </div>
              </div>
            )}

            {/* ================= ETAPA 2: DADOS BÁSICOS ================= */}
            {etapa === "basica" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <h1 className="cadastro-titulo">Crie sua conta</h1>
                  <p className="cadastro-subtitulo" style={{ marginBottom: 0 }}>Cadastro de <strong style={{color: "#00E5FF", textTransform: "capitalize"}}>{tipoUsuario}</strong></p>
                </div>

                <div className="input-group-matte">
                  <label className="label-solid"><User size={14} /> Nome Completo</label>
                  <input className="input-solid" type="text" placeholder="Ex: Carlos Eduardo" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>

                <div className="input-group-matte">
                  <label className="label-solid"><Mail size={14} /> E-mail</label>
                  <input className="input-solid" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-group-matte">
                  <label className="label-solid"><Hash size={14} /> CPF</label>
                  <input className="input-solid" type="text" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                </div>

                <div className="input-group-matte">
                  <label className="label-solid"><Phone size={14} /> Telefone</label>
                  <input className="input-solid" type="tel" placeholder="(84) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </div>

                <div className="input-group-matte">
                  <label className="label-solid"><Lock size={14} /> Senha</label>
                  <input className="input-solid" type="password" placeholder="No mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} />
                </div>

                <button 
                  className={`btn-principal ${camposBasicosPreenchidos ? 'ativo' : ''}`}
                  onClick={() => avancarPara("especifico")}
                  disabled={!camposBasicosPreenchidos}
                  style={{ opacity: camposBasicosPreenchidos ? 1 : 0.5 }}
                >
                  Próximo Passo
                </button>
              </div>
            )}

            {/* ================= ETAPA 3: MOTORISTA ================= */}
            {etapa === "especifico" && tipoUsuario === "motorista" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <h1 className="cadastro-titulo">Documentação</h1>
                  <p className="cadastro-subtitulo" style={{ marginBottom: 0 }}>Envie seus dados para análise</p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setFotoPerfilEnviada(!fotoPerfilEnviada)} className={`card-opcao ${fotoPerfilEnviada ? "ativo" : ""}`} style={{ borderColor: fotoPerfilEnviada ? "#00E5FF" : "#1E1E1E", background: fotoPerfilEnviada ? "#1A1A1A" : "#121212", padding: "12px", gap: "10px", margin: 0 }}>
                    {fotoPerfilEnviada ? <CheckCircle2 size={24} color="#00E5FF" /> : <User size={24} color="#666" />}
                    <div style={{flex: 1}}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#FFF" }}>Selfie Perfil</h3>
                    </div>
                  </button>
                  <button onClick={() => setCnhEnviada(!cnhEnviada)} className={`card-opcao ${cnhEnviada ? "ativo" : ""}`} style={{ borderColor: cnhEnviada ? "#00E5FF" : "#1E1E1E", background: cnhEnviada ? "#1A1A1A" : "#121212", padding: "12px", gap: "10px", margin: 0 }}>
                    {cnhEnviada ? <CheckCircle2 size={24} color="#00E5FF" /> : <Upload size={24} color="#666" />}
                    <div style={{flex: 1}}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#FFF" }}>Foto CNH</h3>
                    </div>
                  </button>
                </div>

                <div className="input-group-matte" style={{ marginTop: "6px" }}>
                  <label className="label-solid"><CarFront size={14} /> Dados do Veículo</label>
                  <div className="grid-veiculo" style={{ marginBottom: "6px" }}>
                    <input className="input-solid" placeholder="Placa" value={veiculo.placa} onChange={e => setVeiculo({...veiculo, placa: e.target.value.toUpperCase()})} />
                    <input className="input-solid" placeholder="Renavam" value={veiculo.renavam} onChange={e => setVeiculo({...veiculo, renavam: e.target.value})} />
                  </div>
                  <div className="grid-veiculo" style={{ marginBottom: "6px" }}>
                    <input className="input-solid" placeholder="Marca (Ex: Fiat)" value={veiculo.marca} onChange={e => setVeiculo({...veiculo, marca: e.target.value})} />
                    <input className="input-solid" placeholder="Modelo (Ex: Argo)" value={veiculo.modelo} onChange={e => setVeiculo({...veiculo, modelo: e.target.value})} />
                  </div>
                  <div className="grid-veiculo" style={{ marginBottom: "6px" }}>
                    <input className="input-solid" placeholder="Ano (Ex: 2022)" value={veiculo.ano} onChange={e => setVeiculo({...veiculo, ano: e.target.value})} />
                    <input className="input-solid" placeholder="Cor (Ex: Branco)" value={veiculo.cor} onChange={e => setVeiculo({...veiculo, cor: e.target.value})} />
                  </div>
                </div>

                <button onClick={() => setCrlvEnviado(!crlvEnviado)} className={`card-opcao ${crlvEnviado ? "ativo" : ""}`} style={{ borderColor: crlvEnviado ? "#00E5FF" : "#1E1E1E", background: crlvEnviado ? "#1A1A1A" : "#121212", padding: "12px", gap: "10px", margin: 0 }}>
                  {crlvEnviado ? <CheckCircle2 size={24} color="#00E5FF" /> : <Upload size={24} color="#666" />}
                  <div style={{flex: 1}}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#FFF" }}>Foto do Documento (CRLV)</h3>
                  </div>
                </button>

                <button 
                  className={`btn-principal ${camposMotoristaPreenchidos ? 'ativo' : ''}`}
                  onClick={() => avancarPara("otp")}
                  disabled={!camposMotoristaPreenchidos}
                  style={{ opacity: camposMotoristaPreenchidos ? 1 : 0.5 }}
                >
                  Enviar para Análise
                </button>
              </div>
            )}

            {/* ================= ETAPA 3: PASSAGEIRO ================= */}
            {etapa === "especifico" && tipoUsuario === "passageiro" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <h1 className="cadastro-titulo">Perfil de Passageiro</h1>
                  <p className="cadastro-subtitulo">Configure como você quer viajar</p>
                </div>

                <motion.div 
                  onClick={() => setEEstudante(!eEstudante)}
                  className={`card-opcao ${eEstudante ? 'ativo' : ''}`}
                  style={{ borderColor: eEstudante ? "#00E5FF" : "#1E1E1E", background: eEstudante ? "#00E5FF" : "#121212" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="icone-box" style={{ background: eEstudante ? "#000" : "#1A1A1A" }}>
                    <GraduationCap size={24} color={eEstudante ? "#00E5FF" : "#00E5FF"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: eEstudante ? "#000" : "#FFF" }}>Estudante IFRN</h3>
                    <p style={{ fontSize: 13, margin: 0, color: eEstudante ? "#000" : "#888" }}>Ativa categoria Carona Uni</p>
                  </div>
                </motion.div>

                <button className="btn-principal ativo" onClick={() => avancarPara("otp")}>
                  Salvar Perfil
                </button>
              </div>
            )}

            {/* ================= ETAPA 4: OTP ================= */}
            {etapa === "otp" && (
              <div style={{ textAlign: "center", paddingTop: "40px" }}>
                <div style={{ width: 80, height: 80, background: "#00E5FF", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
                  <CheckCircle2 size={40} color="#000" />
                </div>
                <h1 className="cadastro-titulo">Verifique seu celular</h1>
                <p className="cadastro-subtitulo">Digite o código que enviamos por SMS.</p>
                
                <div className="otp-grid">
                  {[1, 2, 3, 4].map(i => (
                    <input key={i} className="otp-input" maxLength={1} type="tel" />
                  ))}
                </div>

                <div style={{ marginTop: "24px" }}>
                  {tipoUsuario === "motorista" && (
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "16px", padding: "0 16px" }}>
                      Seus dados serão enviados para análise do Backoffice. Para fins de teste, você será redirecionado direto para o painel.
                    </p>
                  )}
                  <button className="btn-principal ativo" onClick={() => aoConcluir(tipoUsuario)}>
                    {tipoUsuario === "motorista" ? "Avançar para o Painel" : "Concluir e Iniciar"}
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}