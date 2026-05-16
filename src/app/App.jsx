import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useTheme } from "./hooks/useTheme";

// Imports das Telas e Fluxos
import TelaAbertura from "./components/TelaAbertura";
import TelaLogin from "./components/TelaLogin";
import FluxoCadastro from "./components/FluxoCadastro";
import TelaHomeServicos from "./components/TelaHomeServicos";
import FluxoViagem from "./components/FluxoViagem";
import FluxoPerfil from "./components/FluxoPerfil";
import FluxoServicosAdicionais from "./components/FluxoServicosAdicionais";
import TelaViagens from "./components/TelaViagens";
import FluxoMotorista from "./components/FluxoMotorista"; // <-- NOVO FLUXO UNIFICADO (Mapa não pisca mais!)
import Cabecalho from "./components/Cabecalho";
import MenuInferior from "./components/MenuInferior";

const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";

// Telas que mostram o menu inferior e cabeçalho
const MAIN_SCREENS = ["services-home", "trips", "profile", "profile-motorista"];

// Ordem das telas para a direção da animação de deslize
const SCREEN_ORDER = [
  "splash", "login", "signup-flow", "services-home", "trip-flow", "extra-services",
  "trips", "profile", "profile-motorista", "driver" // Removido as telas antigas do motorista!
];

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [prevScreen, setPrevScreen] = useState("splash");
  const [servicoExtra, setServicoExtra] = useState(null);
  const { isLight } = useTheme();

  const navigate = useCallback((to) => {
    setPrevScreen(screen);
    setScreen(to);
  }, [screen]);

  const dir = SCREEN_ORDER.indexOf(screen) >= SCREEN_ORDER.indexOf(prevScreen) ? 1 : -1;

  return (
      <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: isLight ? "#F9FAFB" : "#000" }}>
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

            {/* Fluxo de Cadastro */}
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

            {/* Fluxo de Viagem do Passageiro */}
            {screen === "trip-flow" && <FluxoViagem aoSair={() => navigate("services-home")} />}

            {/* Serviços Adicionais (Entregas, Mercado, etc) */}
            {screen === "extra-services" && (
                <FluxoServicosAdicionais
                    servico={servicoExtra}
                    onBack={() => {
                      setServicoExtra(null);
                      navigate("services-home");
                    }}
                />
            )}

            {/* Abas Secundárias e Perfis */}
            {screen === "trips" && <TelaViagens />}
            {screen === "profile" && <FluxoPerfil onBack={() => navigate("services-home")} />}
            {screen === "profile-motorista" && <FluxoPerfil tipoUsuario="motorista" onBack={() => navigate("driver")} />}

            {/* ======================================================= */}
            {/* FLUXO DO MOTORISTA UNIFICADO (Sem recarregar o mapa!)   */}
            {/* ======================================================= */}
            {screen === "driver" && <FluxoMotorista aoPerfil={() => navigate("profile-motorista")} />}

          </motion.div>
        </AnimatePresence>

        {/* Renderização do Cabeçalho e Menu Inferior apenas nas telas principais */}
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