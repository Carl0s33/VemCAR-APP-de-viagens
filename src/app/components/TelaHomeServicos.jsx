import React, { memo } from "react";
import { motion } from "framer-motion";
import { CarFront, Bike, Package, Calendar, MapPin, Sparkles, CloudSun, User } from "lucide-react";
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

            {/* GRID BENTO BOX */}
            <section className="bento-grid">
                {SERVICOS_MOCK.map((servico) => (
                    <motion.button
                        key={servico.id}
                        className={`bento-card ${servico.principal ? 'principal' : ''} ${servico.largo ? 'largo' : ''} ${servico.outline ? 'outline-rosa' : ''}`}
                        onTap={() => handleServiceClick(servico.id)}
                        whileTap={{ scale: 0.96 }}
                        aria-label={`Solicitar serviço de ${servico.nome}`}
                    >
                        <div className={`bento-icon-wrapper ${servico.cor}`}>
                            <servico.icone size={servico.principal ? 32 : 28} color="currentColor" strokeWidth={servico.id === "VEM CAR FEMININO" ? 2.5 : 2} />
                        </div>
                        
                        {servico.principal || servico.largo ? (
                            <div className="bento-text-area">
                                <h3>{servico.nome}</h3>
                                <p>{servico.desc}</p>
                            </div>
                        ) : (
                            <h3>{servico.nome}</h3>
                        )}
                        
                        {servico.extra && servico.extra}
                    </motion.button>
                ))}
            </section>

            {/* SUGESTÕES RECENTES */}
            <section className="recentes-bento-section">
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