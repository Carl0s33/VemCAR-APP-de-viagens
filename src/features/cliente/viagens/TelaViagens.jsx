import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CarFront, Bike, GraduationCap, TrendingUp, Calendar, Star, MapPin, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import "./TelaViagens.css";

const TODAS_VIAGENS = [
  {
    id: "1", icon: CarFront, modalidade: "VEM CAR",
    origem: "Santo Antônio", destino: "IFRN Nova Cruz",
    data: "Hoje", hora: "14:30", preco: 15.5, nota: 5,
    tipo: "carro", motorista: "João Pedro", status: "concluída",
    cor: "#00E5FF", dia: "Seg",
  },
  {
    id: "2", icon: Bike, modalidade: "VEM MOTO",
    origem: "Praça Central", destino: "Terminal Rodoviário",
    data: "Ontem", hora: "09:15", preco: 8.0, nota: 5,
    tipo: "moto", motorista: "Lucas Ferreira", status: "concluída",
    cor: "#FFD500", dia: "Dom",
  },
  {
    id: "3", icon: CarFront, modalidade: "VEM CAR",
    origem: "IFRN Nova Cruz", destino: "Mercado Municipal",
    data: "22 Jul", hora: "18:40", preco: 12.0, nota: 4,
    tipo: "carro", motorista: "Marcos Souza", status: "concluída",
    cor: "#00E5FF", dia: "Sáb",
  },
  {
    id: "5", icon: CarFront, modalidade: "VEM CAR",
    origem: "Feira Central", destino: "Banco do Brasil",
    data: "18 Jul", hora: "11:00", preco: 10.5, nota: 5,
    tipo: "carro", motorista: "André Costa", status: "concluída",
    cor: "#00E5FF", dia: "Qui",
  },
  {
    id: "6", icon: Bike, modalidade: "VEM MOTO",
    origem: "Av. Câmara Cascudo", destino: "Posto São Miguel",
    data: "15 Jul", hora: "16:30", preco: 7.5, nota: null,
    tipo: "moto", motorista: "Roberto Lima", status: "cancelada",
    cor: "#FFD500", dia: "Qua",
  },
];

const FILTROS = [
  { id: "todas", label: "Todas" },
  { id: "carro", label: "VEM CAR" },
  { id: "moto", label: "VEM MOTO" }
];

export default function TelaViagens() {
  const [filtro, setFiltro] = useState("todas");
  const [expandido, setExpandido] = useState(null);

  const filtradas =
    filtro === "todas"
      ? TODAS_VIAGENS
      : TODAS_VIAGENS.filter((t) => t.tipo === filtro);

  const concluidas = filtradas.filter((t) => t.status === "concluída");
  const gastoTotal = concluidas.reduce((sum, t) => sum + t.preco, 0);

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const dadosSemana = diasSemana.map((dia) => {
    const v = TODAS_VIAGENS.filter((t) => t.dia === dia && t.status === "concluída");
    return v.reduce((sum, t) => sum + t.preco, 0);
  });
  const valorMax = Math.max(...dadosSemana, 1);

  return (
    <div className="tela-viagens-container">
      <div className="tela-viagens-scroll">

        
        <div className="tela-viagens-titulo-wrapper">
          <div className="tela-viagens-titulo-icone">
            <Calendar size={22} color="#00E5FF" strokeWidth={2.5} />
            <h1>Minhas Viagens</h1>
          </div>
          <p>{TODAS_VIAGENS.length} viagens • {TODAS_VIAGENS.filter(t => t.status === "concluída").length} concluídas</p>
        </div>

        
        <div className="tela-viagens-card-resumo">
          <div className="tela-viagens-card-resumo-conteudo">
            <div className="tela-viagens-gasto-label">
              <TrendingUp size={14} color="#00E5FF" strokeWidth={2.5} />
              <span>Gasto Total</span>
            </div>
            <p className="tela-viagens-gasto-total">
              R$ {gastoTotal.toFixed(2).replace(".", ",")}
            </p>
            <p className="tela-viagens-gasto-semana">Semana atual</p>
          </div>
          <div className="tela-viagens-grafico-barra">
            {diasSemana.map((dia, i) => {
              const valor = dadosSemana[i];
              const altura = valorMax > 0 ? (valor / valorMax) * 100 : 0;
              return (
                <div key={dia} className="tela-viagens-barra-dia">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${altura}%` }}
                    transition={{ delay: i * 0.06, type: "spring", stiffness: 200, damping: 20 }}
                    className="tela-viagens-barra"
                    style={{ background: valor > 0 ? "#00E5FF" : "#1A1A1A" }}
                  />
                  <span>{dia}</span>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="tela-viagens-filtros no-scrollbar">
          {FILTROS.map(({ id, label }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.94 }}
              onClick={() => setFiltro(id)}
              className={`tela-viagens-filtro ${filtro === id ? "ativo" : ""}`}
            >
              <span>{label}</span>
            </motion.button>
          ))}
        </div>

        
        <div className="tela-viagens-lista">
          <AnimatePresence mode="popLayout">
            {filtradas.map((viagem, i) => {
              const Icone = viagem.icon;
              const isExpand = expandido === viagem.id;
              return (
                <motion.div
                  key={viagem.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                  className={`tela-viagens-card ${isExpand ? 'expandido' : ''}`}
                  onClick={() => setExpandido(isExpand ? null : viagem.id)}
                >
                  
                  <div className="tela-viagens-card-main">
                    <div className="tela-viagens-card-icone" style={{ background: viagem.status === 'cancelada' ? '#222' : viagem.cor }}>
                      <Icone size={18} color={viagem.status === 'cancelada' ? '#555' : "#000"} strokeWidth={2.5} />
                    </div>
                    <div className="tela-viagens-card-info">
                      <div className="tela-viagens-card-modalidade">{viagem.modalidade}</div>
                      <div className="tela-viagens-card-rotas">
                        <span className="origem-texto">{viagem.origem}</span>
                        <ArrowRight size={12} color="#555" style={{ flexShrink: 0 }} />
                        <span>{viagem.destino}</span>
                      </div>
                      <span className="tela-viagens-card-data">{viagem.data} • {viagem.hora}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span className={`tela-viagens-preco ${viagem.status === 'cancelada' ? 'cancelada' : ''}`}>
                        R$ {viagem.preco.toFixed(2).replace(".", ",")}
                      </span>
                      {viagem.status === "cancelada"
                        ? <XCircle size={14} color="#EF4444" />
                        : <CheckCircle size={14} color="#10B981" />
                      }
                    </div>
                  </div>

                  
                  <AnimatePresence>
                    {isExpand && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="tela-viagens-card-detalhe"
                      >
                        <div className="detalhe-linha">
                          <MapPin size={12} color="#666" />
                          <span>{viagem.origem} → {viagem.destino}</span>
                        </div>
                        <div className="detalhe-linha">
                          <span style={{ color: '#666', fontSize: 12 }}>Motorista:</span>
                          <span style={{ fontWeight: 700 }}>{viagem.motorista}</span>
                        </div>
                        {viagem.nota && (
                          <div className="detalhe-linha">
                            <span style={{ color: '#666', fontSize: 12 }}>Avaliação:</span>
                            <div style={{ display: 'flex', gap: 2 }}>
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={12} fill={s <= viagem.nota ? '#F59E0B' : 'transparent'} color="#F59E0B" />
                              ))}
                            </div>
                          </div>
                        )}
                        {viagem.status !== 'cancelada' && (
                          <button className="btn-repetir-corrida" style={{ background: viagem.cor }}>
                            Repetir corrida
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
