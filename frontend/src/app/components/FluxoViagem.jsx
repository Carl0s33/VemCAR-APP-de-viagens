import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowLeft, CreditCard, CarFront, Bike, GraduationCap, AlertTriangle, Star, CheckCircle, Search, User } from "lucide-react";
import { MapaCidade } from "./MapaCidade";
import "./style/FluxoViagem.css";

export default function FluxoViagem({ aoSair }) {
  // Estados: selecao_destino, orcamento, buscando, a_caminho, aguardando_embarque, em_corrida, finalizada, avaliacao
  const [etapa, setEtapa] = useState("selecao_destino");
  const [precisaTroco, setPrecisaTroco] = useState(false);
  const [categoria, setCategoria] = useState("VEM MOTO"); // Padrão

  const modalidades = [
    { id: "VEM MOTO", preco: "R$ 6,00", desc: "Viagem rápida", icone: <Bike size={28} color="#000" /> },
    { id: "VEM CAR", preco: "R$ 10,00", desc: "Conforto", icone: <CarFront size={28} color="#000" /> },
    { id: "VEM IFRN", preco: "R$ 15,00", desc: "Intermunicipal", icone: <GraduationCap size={28} color="#000" /> }
  ];

  const modalidadeEscolhida = modalidades.find(m => m.id === categoria);

  // Simulação de busca do motorista (4 segundos)
  useEffect(() => {
    let timer;
    if (etapa === "buscando") {
      timer = setTimeout(() => setEtapa("a_caminho"), 4000);
    }
    return () => clearTimeout(timer);
  }, [etapa]);

  const RenderBottomSheet = () => {
    switch (etapa) {
      case "selecao_destino":
        return (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Para onde vamos?</h2>
            
            <div className="input-viagem-wrapper">
              <MapPin color="#00E5FF" size={20} />
              <input autoFocus placeholder="Endereço de destino" />
            </div>

            <button className="btn-viagem" onClick={() => setEtapa("orcamento")}>
              Confirmar Destino
            </button>
          </>
        );

      case "orcamento":
        return (
          <>
            <h3 style={{ fontSize: 16, margin: "0 0 16px", fontWeight: 800, color: "#888", textTransform: "uppercase" }}>Escolha a Modalidade (Preço Fixo)</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {modalidades.map((mod) => (
                <div 
                  key={mod.id}
                  className={`card-orcamento ${categoria === mod.id ? 'selecionado' : ''}`}
                  onClick={() => setCategoria(mod.id)}
                  style={{ 
                    cursor: "pointer", 
                    marginBottom: 0,
                    borderColor: categoria === mod.id ? "#00E5FF" : "#1E1E1E",
                    opacity: categoria === mod.id ? 1 : 0.6
                  }}
                >
                  <div className="icone-orcamento" style={{ background: categoria === mod.id ? "#00E5FF" : "#333" }}>
                    {mod.icone}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 18, margin: 0, fontWeight: 900, color: categoria === mod.id ? "#FFF" : "#AAA" }}>{mod.id}</h3>
                    <p style={{ color: "#888", fontSize: 13, margin: 0, fontWeight: 700 }}>{mod.desc}</p>
                  </div>
                  <h2 style={{ fontSize: 22, margin: 0, color: categoria === mod.id ? "#00E5FF" : "#FFF", fontWeight: 900 }}>{mod.preco}</h2>
                </div>
              ))}
            </div>

            <div className="card-pagamento">
               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                 <CreditCard color="#00E5FF" /> 
                 <span style={{ fontWeight: 800 }}>Dinheiro</span>
               </div>
               <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#A1A1AA", fontWeight: 600, cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={precisaTroco} 
                    onChange={() => setPrecisaTroco(!precisaTroco)} 
                    style={{ accentColor: "#00E5FF", width: 16, height: 16 }}
                  /> 
                  Precisa de troco?
               </label>
            </div>

            <button className="btn-viagem" onClick={() => setEtapa("buscando")}>
              Solicitar Corrida
            </button>
          </>
        );

      case "buscando":
        return (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Search size={48} color="#00E5FF" className="search-pulse-icon" style={{ margin: "0 auto" }} />
            <h2 style={{ marginTop: 24, fontSize: 22, fontWeight: 900 }}>Localizando motorista...</h2>
            <p style={{ color: "#888", fontSize: 15, fontWeight: 500 }}>Conectando com parceiros num raio próximo.</p>
            
            <button className="btn-secundario" onClick={() => setEtapa("selecao_destino")} style={{ marginTop: 32 }}>
              Cancelar Solicitação
            </button>
          </div>
        );

      case "a_caminho":
      case "aguardando_embarque":
      case "em_corrida":
        return (
          <>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ color: "#00E5FF", textTransform: "uppercase", fontSize: 14, fontWeight: 900, margin: 0 }}>
                  {etapa === "a_caminho" ? "Motorista a caminho" : etapa === "aguardando_embarque" ? "Motorista chegou" : "Em corrida"}
                </h3>
             </div>

             <div className="perfil-motorista">
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "#121212", border: "2px solid #1E1E1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={32} color="#00E5FF" />
                </div>
                <div style={{ flex: 1 }}>
                   <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>João Pedro</h2>
                   <p style={{ margin: 0, color: "#888", fontSize: 14, fontWeight: 600 }}>Fiat Argo Branco</p>
                </div>
                <div className="badge-placa">QWE-9999</div>
             </div>

             <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-viagem" style={{ flex: 1 }} onClick={() => setEtapa("finalizada")}>
                  [Simular Chegada]
                </button>

                {etapa !== "em_corrida" && (
                  <button className="btn-perigo" onClick={() => setEtapa("selecao_destino")}>
                    <AlertTriangle size={24} />
                  </button>
                )}
             </div>
          </>
        );

      case "finalizada":
        return (
           <div style={{ textAlign: "center", padding: "20px 0" }}>
              <CheckCircle size={56} color="#00E5FF" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Destino Alcançado!</h2>
              <p style={{ color: "#888", fontWeight: 600, marginTop: 8 }}>Valor final cobrado da corrida</p>
              
              <h1 style={{ fontSize: 56, color: "#00E5FF", fontWeight: 900, margin: "16px 0" }}>{modalidadeEscolhida?.preco}</h1>
              <p style={{ color: "#A1A1AA", fontSize: 14, fontWeight: 600, marginBottom: 32 }}>Pagamento físico no veículo.</p>
              
              <button className="btn-viagem" onClick={() => setEtapa("avaliacao")}>
                Confirmar Pagamento
              </button>
           </div>
        );

      case "avaliacao":
        return (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
             <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Avalie o Motorista</h2>
             <p style={{ color: "#888", fontWeight: 600, marginTop: 8, marginBottom: 32 }}>Sua avaliação atualiza a nota média do perfil.</p>
             
             <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 40 }}>
                {[1,2,3,4,5].map(i => (
                  <motion.div key={i} whileTap={{ scale: 0.8 }} style={{ cursor: "pointer" }}>
                    <Star size={44} color="#1E1E1E" fill={i <= 4 ? "#00E5FF" : "transparent"} stroke={i <= 4 ? "#00E5FF" : "#333"} />
                  </motion.div>
                ))}
             </div>
             
             <button className="btn-viagem" onClick={aoSair}>
               Enviar Avaliação
             </button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="viagem-container">
      
      {/* Mapa fixo no background (Renderizado 1 única vez) */}
      <div className="mapa-layer">
         <MapaCidade 
            mostrarRota={etapa !== "selecao_destino" && etapa !== "buscando"} 
            mostrarCarro={etapa === "a_caminho" || etapa === "em_corrida"} 
         />
      </div>

      {/* Header com botão de voltar */}
      <div className="header-viagem">
         <button className="btn-voltar" onClick={aoSair}>
            <ArrowLeft size={22} strokeWidth={2.5} />
         </button>
      </div>

      {/* Bottom Sheet Animado (A Gaveta) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={etapa}
          className="bottom-sheet-viagem"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
        >
          <div className="sheet-drag" />
          {RenderBottomSheet()}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}