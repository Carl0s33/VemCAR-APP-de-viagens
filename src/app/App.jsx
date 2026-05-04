import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

import TelaAbertura from "./components/TelaAbertura"; 
import TelaLogin from "./components/TelaLogin";
import TelaEscolhaCadastro from "./components/TelaEscolhaCadastro";
import TelaCadastroInfoBasica from "./components/TelaCadastroInfoBasica";
import TelaCadastroPassageiro from "./components/TelaCadastroPassageiro"; 
import TelaCadastroMotorista from "./components/TelaCadastroMotorista";
import TelaVerificacaoCodigo from "./components/TelaVerificacaoCodigo"; 
import TelaHomeServicos from "./components/TelaHomeServicos"; 
import TelaSelecaoDestino from "./components/TelaSelecaoDestino";
import TelaConfirmarColeta from "./components/TelaConfirmarColeta";
import TelaPrecoCategoria from "./components/TelaPrecoCategoria"; 
import TelaAguardandoMotorista from "./components/TelaAguardandoMotorista"; 
import TelaInicial from "./components/TelaInicial";
import TelaPagamento from "./components/TelaPagamento"; 
import TelaRadar from "./components/TelaRadar";
import TelaViagem from "./components/TelaViagem";
import TelaAvaliacao from "./components/TelaAvaliacao";
import TelaPerfil from "./components/TelaPerfil";
import TelaViagens from "./components/TelaViagens"; 
import TelaPainelMotorista from "./components/TelaPainelMotorista";
import TelaAlertaCorrida from "./components/TelaAlertaCorrida"; 
import TelaNavegacaoMotorista from "./components/TelaNavegacaoMotorista"; 
import TelaViagemConcluida from "./components/TelaViagemConcluida"; 
import Cabecalho from "./components/Cabecalho"; 
import MenuInferior from "./components/MenuInferior";

const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";

const MAIN_SCREENS = ["services-home", "trips", "profile"];

function toTab(s) {
  if (s === "trips") return "trips";
  if (s === "profile") return "profile";
  return "home";
}

function tabToScreen(tab) {
  if (tab === "trips") return "trips";
  if (tab === "profile") return "profile";
  return "services-home";
}

const SCREEN_ORDER = [
  "splash", "login", "signup-choice", "signup-basic-info",
  "signup-passenger-details", "signup-driver-details", "signup-otp",
  "services-home", "destination-select", "pickup-confirm",
  "category-price", "live-wait", "trips", "profile", "home",
  "checkout", "radar", "trip", "rating", "driver",
  "driver-ride-alert", "driver-navigation", "driver-trip-complete",
];

function getDir(from, to) {
  return SCREEN_ORDER.indexOf(to) >= SCREEN_ORDER.indexOf(from) ? 1 : -1;
}

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [prevScreen, setPrevScreen] = useState("splash");
  const [signupUserType, setSignupUserType] = useState("passageiro");

  const navigate = useCallback((to) => {
    setPrevScreen(screen);
    setScreen(to);
  }, [screen]);

  const isMainScreen = MAIN_SCREENS.includes(screen);
  const dir = getDir(prevScreen, screen);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={screen}
          custom={dir}
          initial={{ opacity: 0, x: dir * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -30 }}
          transition={{ duration: 0.22 }}
          style={{ position: "absolute", inset: 0 }}
        >
          {screen === "splash" && <TelaAbertura aoFinalizar={() => navigate("login")} />}
          {screen === "login" && <TelaLogin aoContinuar={() => navigate("services-home")} aoLoginMotorista={() => navigate("driver")} aoCadastrar={() => navigate("signup-choice")} />}
          {screen === "signup-choice" && <TelaEscolhaCadastro onSelectPassenger={() => { setSignupUserType("passageiro"); navigate("signup-basic-info"); }} onSelectDriver={() => { setSignupUserType("motorista"); navigate("signup-basic-info"); }} onBack={() => navigate("login")} />}
          {screen === "signup-basic-info" && <TelaCadastroInfoBasica userType={signupUserType} onContinue={() => navigate(signupUserType === "passageiro" ? "signup-passenger-details" : "signup-driver-details")} onBack={() => navigate("signup-choice")} />}
          {screen === "signup-passenger-details" && <TelaCadastroPassageiro aoContinuar={() => navigate("signup-otp")} aoVoltar={() => navigate("signup-basic-info")} />}
          {screen === "signup-driver-details" && <TelaCadastroMotorista aoContinuar={() => navigate("signup-otp")} aoVoltar={() => navigate("signup-basic-info")} />}
          {screen === "signup-otp" && <TelaVerificacaoCodigo aoConcluir={() => navigate(signupUserType === "passageiro" ? "services-home" : "driver")} />}
          {screen === "services-home" && <TelaHomeServicos onSelectService={(s) => s === "viagens" && navigate("destination-select")} />}
          {screen === "destination-select" && <TelaSelecaoDestino onSelectDestination={() => navigate("pickup-confirm")} onBack={() => navigate("services-home")} />}
          {screen === "pickup-confirm" && <TelaConfirmarColeta onConfirm={() => navigate("category-price")} onBack={() => navigate("destination-select")} />}
          {screen === "category-price" && <TelaPrecoCategoria aoConfirmar={() => navigate("live-wait")} onBack={() => navigate("pickup-confirm")} />}
          {screen === "live-wait" && <TelaAguardandoMotorista onHome={() => navigate("services-home")} />}
          {screen === "home" && <TelaInicial aoClicarBusca={() => navigate("checkout")} urlAvatar={AVATAR_URL} aoClicarAvatar={() => navigate("profile")} />}
          {screen === "trips" && <TelaViagens />}
          {screen === "profile" && <TelaPerfil onBack={() => navigate("home")} />}
          {screen === "checkout" && <TelaPagamento aoVoltar={() => navigate("home")} aoConfirmar={() => navigate("radar")} />}
          {screen === "radar" && <TelaRadar aoCancelar={() => navigate("checkout")} aoMotoristaEncontrado={() => navigate("trip")} />}
          {screen === "trip" && <TelaViagem onFinish={() => navigate("rating")} />}
          {screen === "rating" && <TelaAvaliacao aoEnviar={() => navigate("services-home")} />}
          {screen === "driver" && <TelaPainelMotorista aoPerfil={() => navigate("profile")} aoIniciarCorrida={() => navigate("driver-ride-alert")} />}
          {screen === "driver-ride-alert" && <TelaAlertaCorrida aoAceitar={() => navigate("driver-navigation")} aoRejeitar={() => navigate("driver")} />}
          {screen === "driver-navigation" && <TelaNavegacaoMotorista aoChegar={() => navigate("driver-trip-complete")} />}
          {screen === "driver-trip-complete" && <TelaViagemConcluida aoFinalizar={() => navigate("driver")} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isMainScreen && (
          <Cabecalho key="global-header" urlAvatar={AVATAR_URL} aoClicarAvatar={() => navigate("profile")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMainScreen && (
          <MenuInferior key="global-bottom-nav" abaAtiva={toTab(screen)} aoNavegar={(tab) => navigate(tabToScreen(tab))} />
        )}
      </AnimatePresence>
    </div>
  );
}