import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Imports Essenciais que Sobraram
import TelaAbertura from "./components/TelaAbertura"; 
import TelaLogin from "./components/TelaLogin";
import FluxoCadastro from "./components/FluxoCadastro"; // <-- NOVO FLUXO UNIFICADO
import TelaHomeServicos from "./components/TelaHomeServicos"; 
import FluxoViagem from "./components/FluxoViagem"; // <-- NOVO FLUXO UNIFICADO
import FluxoPerfil from "./components/FluxoPerfil";
import FluxoServicosAdicionais from "./components/FluxoServicosAdicionais";
import TelaViagens from "./components/TelaViagens"; 
import TelaPainelMotorista from "./components/TelaPainelMotorista";
import TelaAlertaCorrida from "./components/TelaAlertaCorrida"; 
import TelaNavegacaoMotorista from "./components/TelaNavegacaoMotorista"; 
import Cabecalho from "./components/Cabecalho"; 
import MenuInferior from "./components/MenuInferior";

const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";

// Telas que mostram o menu inferior e cabeçalho
const MAIN_SCREENS = ["services-home", "trips", "profile", "profile-motorista"];

const SCREEN_ORDER = [
  "splash", "login", "signup-flow", "services-home", "trip-flow", "extra-services",
  "trips", "profile", "profile-motorista", "driver", "driver-ride-alert", "driver-navigation"
];

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [prevScreen, setPrevScreen] = useState("splash");
  const [servicoExtra, setServicoExtra] = useState(null);

  const navigate = useCallback((to) => {
    setPrevScreen(screen);
    setScreen(to);
  }, [screen]);

  const dir = SCREEN_ORDER.indexOf(screen) >= SCREEN_ORDER.indexOf(prevScreen) ? 1 : -1;

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: "#000" }}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          {screen === "splash" && <TelaAbertura aoFinalizar={() => navigate("login")} />}
          {screen === "login" && <TelaLogin aoContinuar={() => navigate("services-home")} aoLoginMotorista={() => navigate("driver")} aoCadastrar={() => navigate("signup-flow")} />}
          
          {/* Fluxo de Cadastro Unificado */}
          {screen === "signup-flow" && (
            <FluxoCadastro 
              aoConcluir={(tipo) => navigate(tipo === "motorista" ? "driver" : "services-home")} 
              aoVoltar={() => navigate("login")} 
            />
          )}

          {/* Home do Passageiro */}
          {screen === "services-home" && (
            <TelaHomeServicos onSelectService={(s) => {
              if (s === "viagens") {
                navigate("trip-flow");
              } else {
                setServicoExtra(s);
                navigate("extra-services");
              }
            }} />
          )}
          
          {/* Fluxo de Viagem Unificado */}
          {screen === "trip-flow" && <FluxoViagem aoSair={() => navigate("services-home")} />}
          
          {/* Serviços Adicionais */}
          {screen === "extra-services" && (
            <FluxoServicosAdicionais 
              servico={servicoExtra} 
              onBack={() => {
                setServicoExtra(null);
                navigate("services-home");
              }} 
            />
          )}
          
          {/* Abas e Perfil */}
          {screen === "trips" && <TelaViagens />}
          {screen === "profile" && <FluxoPerfil onBack={() => navigate("services-home")} />}
          {screen === "profile-motorista" && <FluxoPerfil tipoUsuario="motorista" onBack={() => navigate("driver")} />}

          {/* Fluxo do Motorista (Ainda separado pois é um painel de trabalho) */}
          {screen === "driver" && <TelaPainelMotorista aoPerfil={() => navigate("profile-motorista")} aoIniciarCorrida={() => navigate("driver-ride-alert")} />}
          {screen === "driver-ride-alert" && <TelaAlertaCorrida aoAceitar={() => navigate("driver-navigation")} aoRejeitar={() => navigate("driver")} />}
          {screen === "driver-navigation" && <TelaNavegacaoMotorista aoChegar={() => navigate("driver")} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {MAIN_SCREENS.includes(screen) && (
          <>
            {!["profile", "profile-motorista"].includes(screen) && (
              <Cabecalho urlAvatar={AVATAR_URL} aoClicarAvatar={() => navigate("profile")} />
            )}
            <MenuInferior 
              abaAtiva={screen === "services-home" ? "home" : screen} 
              aoNavegar={(tab) => navigate(tab === "home" ? "services-home" : tab)} 
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}