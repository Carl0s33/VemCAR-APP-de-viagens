import React, { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./hooks/useTheme";
import TelaAbertura from "./features/abertura/TelaAbertura";
import TelaLogin from "./features/auth/login/TelaLogin";
import FluxoCadastro from "./features/auth/cadastro/FluxoCadastro";
import FluxoViagem from "./features/cliente/viagem/FluxoViagem";
import FluxoPerfilCliente from "./features/cliente/perfil/FluxoPerfilCliente";
import FluxoPerfilMotorista from "./features/motorista/perfil/FluxoPerfilMotorista";
import FluxoServicosAdicionais from "./features/cliente/servicos/FluxoServicosAdicionais";
import TelaViagens from "./features/cliente/viagens/TelaViagens";
import FluxoMotorista from "./features/motorista/painel/FluxoMotorista"; 
import Cabecalho from "./components/Cabecalho/Cabecalho";
import MenuInferior from "./components/MenuInferior/MenuInferior";

const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";
const MAIN_SCREENS = ["services-home", "trips", "profile"];
const SCREEN_ORDER = [
  "splash", "login", "signup-flow", "services-home", "trip-flow", "extra-services",
  "trips", "profile", "profile-motorista", "driver"
];

export default function App() {
  const [screenState, setScreenState] = useState({
    current: "splash",
    previous: "splash",
  });
  
  const [servicoExtra, setServicoExtra] = useState(null);
  const [inTrip, setInTrip] = useState(false);
  
  const { isLight } = useTheme();
  const navigate = useCallback((to) => {
    setScreenState(prev => ({ current: to, previous: prev.current }));
  }, []);
  const dir = useMemo(() => {
    const idxCurrent = SCREEN_ORDER.indexOf(screenState.current);
    const idxPrev = SCREEN_ORDER.indexOf(screenState.previous);
    return idxCurrent >= idxPrev ? 1 : -1;
  }, [screenState]);

  return (
      <div style={{ width: "100%", height: "100dvh", position: "relative", overflow: "hidden", background: isLight ? "#F8FAFC" : "#000000" }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
              key={screenState.current}
              initial={{ opacity: 0, x: dir * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ position: "absolute", inset: 0 }}
          >
            {screenState.current === "splash" && <TelaAbertura aoFinalizar={() => navigate("login")} />}
            
            {screenState.current === "login" && (
              <TelaLogin 
                aoContinuar={() => navigate("services-home")} 
                aoLoginMotorista={() => navigate("driver")} 
                aoCadastrar={() => navigate("signup-flow")} 
              />
            )}

            {screenState.current === "signup-flow" && (
                <FluxoCadastro
                    aoConcluir={(tipo) => navigate(tipo === "motorista" ? "driver" : "services-home")}
                    aoVoltar={() => navigate("login")}
                />
            )}

            {screenState.current === "services-home" && (
                <FluxoViagem 
                    categoriaInicial={"VEM CAR"} 
                    onFaseChange={(fase) => setInTrip(fase !== "selecao_destino")}
                    aoSair={() => {}} 
                />
            )}

            {screenState.current === "extra-services" && (
                <FluxoServicosAdicionais
                    servico={servicoExtra}
                    onBack={() => {
                      setServicoExtra(null);
                      navigate("services-home");
                    }}
                />
            )}

            {screenState.current === "trips" && <TelaViagens />}
            {screenState.current === "profile" && <FluxoPerfilCliente onBack={() => navigate("services-home")} aoSair={() => navigate("login")} />}
            {screenState.current === "profile-motorista" && <FluxoPerfilMotorista onBack={() => navigate("driver")} aoSair={() => navigate("login")} />}
            
            {screenState.current === "driver" && <FluxoMotorista aoPerfil={() => navigate("profile-motorista")} />}
          </motion.div>
        </AnimatePresence>

        
        <AnimatePresence>
          {MAIN_SCREENS.includes(screenState.current) && !inTrip && (
              <>
                {!["profile", "profile-motorista"].includes(screenState.current) && (
                    <Cabecalho urlAvatar={AVATAR_URL} aoClicarAvatar={() => navigate("profile")} />
                )}
                
                <MenuInferior
                    abaAtiva={screenState.current === "services-home" ? "home" : screenState.current}
                    aoNavegar={(tab) => navigate(tab === "home" ? "services-home" : tab)}
                />
              </>
          )}
        </AnimatePresence>
      </div>
  );
}