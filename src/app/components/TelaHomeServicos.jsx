import React from "react";
import { motion } from "framer-motion";
import { CarFront, Package, ShoppingBag, Send, Search, Clock, MapPin, ChevronRight, Home, Briefcase } from "lucide-react";
import "./style/TelaHomeServicos.css";

export default function TelaHomeServicos({ onSelectService }) {
    const servicos = [
        { id: "viagens", nome: "Viagens", icone: CarFront, estilo: "btn-viagens" },
        { id: "entregas", nome: "Entregas", icone: Package, estilo: "btn-outros" },
        { id: "mercado", nome: "Mercado", icone: ShoppingBag, estilo: "btn-outros" },
        { id: "envios", nome: "Envios", icone: Send, estilo: "btn-outros" },
        { id: "mais", nome: "Mais", icone: Search, estilo: "btn-outros" }, // quadrado extra pra dar scroll
    ];

    const favoritos = [
        { id: "casa", nome: "Casa", endereco: "Rua São José, 120", icone: Home },
        { id: "trabalho", nome: "Trabalho", endereco: "IFRN Campus Nova Cruz", icone: Briefcase },
    ];

    const recentes = [
        { id: 1, local: "Shopping Natal", endereco: "Av. Sen. Salgado Filho" },
        { id: 2, local: "Praça da Matriz", endereco: "Santo Antônio, Centro" },
        { id: 3, local: "Supermercado Nordestão", endereco: "Nova Cruz" },
    ];

    return (
        <div className="home-servicos-container">

            <div className="home-servicos-header">
                <h1 className="home-servicos-saudacao">Olá, Carlos!</h1>
            </div>

            {/* busca estourada bonitona */}
            <motion.div
                className="home-servicos-busca-secao"
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectService("viagens")}
            >
                <div className="barra-busca-falsa">
                    <Search size={24} color="#00BCD4" strokeWidth={2.5} />
                    <span className="texto-busca">Para onde vamos?</span>
                </div>
            </motion.div>

            {/* carrossel horizontal de serviços */}
            <div className="home-servicos-carousel">
                {servicos.map((s) => (
                    <motion.button
                        key={s.id}
                        className="card-servico-matte"
                        onClick={() => onSelectService(s.id === "mais" ? "viagens" : s.id)}
                        whileTap={{ scale: 0.92 }}
                    >
                        <div className={`icone-servico-wrapper ${s.estilo}`}>
                            <s.icone size={28} strokeWidth={2} />
                        </div>
                        <span className="nome-servico-texto">{s.nome}</span>
                    </motion.button>
                ))}
            </div>

            {/* divisao vertical - favoritos */}
            <div className="secao-vertical">
                <h2 className="secao-titulo">Salvos</h2>
                <div className="lista-vertical">
                    {favoritos.map((fav) => (
                        <motion.div
                            key={fav.id}
                            className="card-lista-vertical"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectService("viagens")}
                        >
                            <div className="icone-lista-circulo">
                                <fav.icone size={20} className="icone-lista-cor" />
                            </div>
                            <div className="lista-textos">
                                <p className="lista-titulo">{fav.nome}</p>
                                <p className="lista-subtitulo">{fav.endereco}</p>
                            </div>
                            <ChevronRight size={20} className="icone-seta-cor" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* divisao vertical - recentes */}
            <div className="secao-vertical" style={{ marginTop: '24px' }}>
                <h2 className="secao-titulo">Sugestões para você</h2>
                <div className="lista-vertical">
                    {recentes.map((r) => (
                        <motion.div
                            key={r.id}
                            className="card-lista-vertical"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectService("viagens")}
                        >
                            <div className="icone-lista-circulo">
                                <Clock size={20} className="icone-lista-cor" />
                            </div>
                            <div className="lista-textos">
                                <p className="lista-titulo">{r.local}</p>
                                <p className="lista-subtitulo">{r.endereco}</p>
                            </div>
                            <ChevronRight size={20} className="icone-seta-cor" />
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}