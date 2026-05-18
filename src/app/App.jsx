import React, { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "./hooks/useTheme";
import ErrorBoundary from "./components/ErrorBoundary";

// Imports das Telas
import TelaAbertura from "./components/TelaAbertura";
import TelaLogin from "./components/TelaLogin";
import FluxoCadastro from "./components/FluxoCadastro";
import TelaHomeServicos from "./components/TelaHomeServicos";
import FluxoViagem from "./components/FluxoViagem";
import FluxoPerfil from "./components/FluxoPerfil";
import FluxoServicosAdicionais from "./components/FluxoServicosAdicionais";
import TelaViagens from "./components/TelaViagens";
import FluxoMotorista from "./components/FluxoMotorista";
import Cabecalho from "./components/Cabecalho";
import MenuInferior from "./components/MenuInferior";

const AVATAR_URL = "https://images.unsplash.com/photo-1649044747879-d77b1dbcecf6?fit=max&fm=jpg&q=80&w=400";

// Telas que exibem o cabeçalho e menu inferior
const MAIN_SCREENS = ["services-home", "trips", "profile", "profile-motorista"];

// Ordem estrita para a animação de deslize saber se vai pra esquerda ou direita
const SCREEN_ORDER = [
    "splash", "login", "signup-flow", "services-home", "trip-flow", "extra-services",
    "trips", "profile", "profile-motorista", "driver"
];

export default function App() {
    // 1. ESTADOS DECLARADOS AQUI (Isso resolve os erros "is not defined")
    const [screenState, setScreenState] = useState({
        current: "splash",
        previous: "splash",
    });

    const [servicoExtra, setServicoExtra] = useState(null);
    const [categoriaVindaDaHome, setCategoriaVindaDaHome] = useState("VEM CAR");

    const { isLight } = useTheme();

    // 2. FUNÇÕES DE NAVEGAÇÃO
    const navigate = useCallback((to) => {
        setScreenState(prev => ({ current: to, previous: prev.current }));
    }, []);

    // Calcula a direção da animação
    const dir = useMemo(() => {
        const idxCurrent = SCREEN_ORDER.indexOf(screenState.current);
        const idxPrev = SCREEN_ORDER.indexOf(screenState.previous);
        return idxCurrent >= idxPrev ? 1 : -1;
    }, [screenState]);

    // 3. RENDERIZAÇÃO
    return (
        <ErrorBoundary>
            <div style={{ width: "100%", height: "100vh", height: "100dvh", position: "relative", overflow: "hidden", background: isLight ? "#F8FAFC" : "#000000" }}>
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
                            <TelaHomeServicos onSelectService={(s, cat) => {
                                if (s === "viagens") {
                                    if (cat) setCategoriaVindaDaHome(cat);
                                    navigate("trip-flow");
                                } else {
                                    setServicoExtra(s);
                                    navigate("extra-services");
                                }
                            }} />
                        )}

                        {screenState.current === "trip-flow" && (
                            <FluxoViagem
                                categoriaInicial={categoriaVindaDaHome}
                                aoSair={() => navigate("services-home")}
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
                        {screenState.current === "profile" && <FluxoPerfil onBack={() => navigate("services-home")} />}
                        {screenState.current === "profile-motorista" && <FluxoPerfil tipoUsuario="motorista" onBack={() => navigate("driver")} />}

                        {screenState.current === "driver" && <FluxoMotorista aoPerfil={() => navigate("profile-motorista")} />}
                    </motion.div>
                </AnimatePresence>

                {/* CONTROLES GLOBAIS (CABEÇALHO E MENU) */}
                <AnimatePresence>
                    {MAIN_SCREENS.includes(screenState.current) && (
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
        </ErrorBoundary>
    );
}