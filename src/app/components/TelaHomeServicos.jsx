import React from "react";
import { motion } from "framer-motion";
import { CarFront, Bike, Package, Calendar, MapPin, Sparkles, CloudSun, ShieldUser } from "lucide-react";
import "./style/TelaHomeServicos.css";

export default function TelaHomeServicos({ onSelectService }) {
    const recentes = [
        { id: 1, local: "IFRN Campus Nova Cruz", endereco: "RN-120, Nova Cruz" },
        { id: 2, local: "Centro", endereco: "Próximo à Igreja Matriz" },
    ];

    return (
        <div className="home-bento-container">
            <div className="home-bento-header">
                <div>
                    <h1 className="saudacao-bento">Bom dia, Carlos! 👋</h1>
                    <p className="sub-saudacao-bento">Onde vamos hoje em Nova Cruz?</p>
                </div>
                <div className="widget-clima">
                    <CloudSun size={24} color="#F59E0B" />
                    <span>28°C</span>
                </div>
            </div>

            <div className="bento-grid">
                {/* Principal: VEM CAR (Passa 'VEM CAR' via callback) */}
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

                {/* Moto: VEM MOTO */}
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

                <motion.button
                    className="bento-card bg-rosa"
                    onClick={() => onSelectService("viagens", "VEM ELAS")}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="bento-icon-wrapper branco">
                        <ShieldUser size={28} color="#EC4899" />
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
                    {recentes.map((r) => (
                        <motion.div
                            key={r.id}
                            className="recente-card-bento"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectService("viagens", "VEM CAR")}
                        >
                            <div className="recente-icon-circulo">
                                <MapPin size={20} color="#00BCD4" />
                            </div>
                            <div className="recente-textos">
                                <p className="recente-local-nome">{r.local}</p>
                                <p className="recente-local-desc">{r.endereco}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}