import React, { memo } from "react";
import { motion } from "framer-motion";
import { CarFront, Bike, Package, Calendar, MapPin, Sparkles, CloudSun } from "lucide-react";
import "./style/TelaHomeServicos.css";

// 🚀 OTIMIZAÇÃO: Dados estáticos fora do componente evitam re-renderizações e economizam memória.
const SERVICOS_MOCK = [
    { id: "VEM CAR", nome: "VemCAR Corridas", desc: "Viagens rápidas e seguras", icone: CarFront, cor: "azul", extra: <Sparkles className="icon-badge" size={20} color="#00BCD4" />, principal: true },
    { id: "VEM MOTO", nome: "Vem MOTO", desc: "", icone: Bike, cor: "laranja", principal: false },
    
    // 👇👇 ALTERAÇÃO AQUI: Nome atualizado para VEMCAR FEMINO e ícone mudado para CarFront Rosa 👇👇
    { id: "VEM CAR FEMININO", nome: "VEMCAR FEMINO", desc: "", icone: CarFront, cor: "rosa", outline: true, principal: false },
    
    { id: "agendar", nome: "Agendar Corrida", desc: "Garanta sua viagem", icone: Calendar, cor: "roxo", largo: true },
    { id: "entregas", nome: "Entregas", desc: "Envie pacotes na cidade", icone: Package, cor: "verde", largo: true }
];

const RECENTES_MOCK = [
    { id: 1, local: "IFRN Campus Nova Cruz", endereco: "RN-120, Nova Cruz" },
    { id: 2, local: "Centro", endereco: "Próximo à Igreja Matriz" },
];

// 🚀 OTIMIZAÇÃO: React.memo evita que a Home re-renderize se o App.jsx mudar estados que não afetam ela.
const TelaHomeServicos = memo(({ onSelectService }) => {
    
    // Tratamento unificado de cliques para limpar o JSX
    const handleServiceClick = (servicoId) => {
        if (servicoId === "entregas") {
            onSelectService("entregas");
        } else {
            onSelectService("viagens", servicoId === "agendar" ? "VEM CAR" : servicoId);
        }
    };

    return (
        <div className="home-bento-container">
            {/* HEADER */}
            <header className="home-bento-header">
                <div className="header-textos">
                    <h1 className="saudacao-bento">Bom dia, Carlos! 👋</h1>
                    <p className="sub-saudacao-bento">Onde vamos hoje em Nova Cruz?</p>
                </div>
                <div className="widget-clima">
                    <CloudSun size={24} color="#F59E0B" strokeWidth={2.5} />
                    <span>28°C</span>
                </div>
            </header>

            <div className="bento-grid">
                {/* VEM CAR */}
                <motion.button
                    className="bento-card principal"
                    onClick={() => onSelectService("viagens", "VEM CAR")}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="bento-icon-wrapper azul">
                        <CarFront size={32} color="#FFF" />
                    </div>
                    <div className="bento-text-area">
                        <h3>VemCAR Corridas</h3>
                        <p>Viagens rápidas e seguras</p>
                    </div>
                    <Sparkles className="icon-badge" size={20} color="#00BCD4" />
                </motion.button>

                {/* VEM MOTO */}
                <motion.button
                    className="bento-card"
                    onClick={() => onSelectService("viagens", "VEM MOTO")}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="bento-icon-wrapper laranja">
                        <Bike size={28} color="#FFF" />
                    </div>
                    <h3>Vem MOTO</h3>
                </motion.button>

                {/* VEM CAR FEMININO */}
                <motion.button
                    className="bento-card bg-rosa"
                    onClick={() => onSelectService("viagens", "VEM CAR FEMININO")}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="bento-icon-wrapper branco">
                        <CarFront size={28} color="#FFF" />
                    </div>
                    <h3>VEM CAR FEMININO</h3>
                </motion.button>

                {/* Agendamento */}
                <motion.button
                    className="bento-card largo"
                    onClick={() => onSelectService("viagens", "VEM CAR")}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="bento-icon-wrapper roxo">
                        <Calendar size={24} color="#FFF" />
                    </div>
                    <div className="bento-text-area">
                        <h3>Agendar Corrida</h3>
                        <p>Garanta sua viagem pro IFRN</p>
                    </div>
                </motion.button>

                {/* Entregas */}
                <motion.button
                    className="bento-card largo"
                    onClick={() => onSelectService("entregas")}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="bento-icon-wrapper verde">
                        <Package size={24} color="#FFF" />
                    </div>
                    <div className="bento-text-area">
                        <h3>Entregas</h3>
                        <p>Envie pacotes na cidade</p>
                    </div>
                </motion.button>
            </div>

            <div className="recentes-bento-section">
                <h2 className="recentes-titulo-bento">Sugestões rápidas</h2>
                <div className="recentes-lista-bento">
                    {RECENTES_MOCK.map((recente) => (
                        <motion.div
                            key={recente.id}
                            className="recente-card-bento"
                            whileTap={{ scale: 0.98 }}
                            onTap={() => onSelectService("viagens", "VEM CAR")}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="recente-icon-circulo">
                                <MapPin size={20} color="#00BCD4" strokeWidth={2.5} />
                            </div>
                            <div className="recente-textos">
                                <p className="recente-local-nome">{recente.local}</p>
                                <p className="recente-local-desc">{recente.endereco}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
});

export default TelaHomeServicos;