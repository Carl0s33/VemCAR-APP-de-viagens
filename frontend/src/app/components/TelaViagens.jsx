import React, { useState } from "react";
import { motion } from "motion/react";
import { Car, Bike, GraduationCap, TrendingUp, Calendar } from "lucide-react";
import "./style/TelaViagens.css";

const TODAS_VIAGENS = [
  {
    id: "1",
    icon: Car,
    origem: "Santo Antônio",
    destino: "IFRN Nova Cruz",
    data: "Hoje",
    hora: "14:30",
    preco: 15.5,
    nota: 5,
    tipo: "carro",
    motorista: "João Pedro",
    status: "concluída",
    cor: "#00E5FF",
    dia: "Seg",
  },
  {
    id: "2",
    icon: Bike,
    origem: "Praça Central",
    destino: "Terminal Rodoviário",
    data: "Ontem",
    hora: "09:15",
    preco: 8.0,
    nota: 5,
    tipo: "moto",
    motorista: "Lucas Ferreira",
    status: "concluída",
    cor: "#F59E0B",
    dia: "Dom",
  },
  {
    id: "3",
    icon: Car,
    origem: "IFRN Nova Cruz",
    destino: "Mercado Municipal",
    data: "22 Jul",
    hora: "18:40",
    preco: 12.0,
    nota: 4,
    tipo: "carro",
    motorista: "Marcos Souza",
    status: "concluída",
    cor: "#00E5FF",
    dia: "Sáb",
  },
  {
    id: "4",
    icon: GraduationCap,
    origem: "Res. Jardim Verde",
    destino: "IFRN Nova Cruz",
    data: "21 Jul",
    hora: "07:20",
    preco: 6.0,
    nota: 5,
    tipo: "uni",
    motorista: "Paulo Henrique",
    status: "concluída",
    cor: "#8B5CF6",
    dia: "Sex",
  },
  {
    id: "5",
    icon: Car,
    origem: "Feira Central",
    destino: "Banco do Brasil",
    data: "18 Jul",
    hora: "11:00",
    preco: 10.5,
    nota: 5,
    tipo: "carro",
    motorista: "André Costa",
    status: "concluída",
    cor: "#00E5FF",
    dia: "Qui",
  },
  {
    id: "6",
    icon: Bike,
    origem: "Av. Câmara Cascudo",
    destino: "Posto São Miguel",
    data: "15 Jul",
    hora: "16:30",
    preco: 7.5,
    nota: 4,
    tipo: "moto",
    motorista: "Roberto Lima",
    status: "cancelada",
    cor: "#F59E0B",
    dia: "Qua",
  },
];

const FILTROS = [
  { id: "todas", label: "Todas" },
  { id: "carro", label: "Carro" },
  { id: "moto", label: "Moto" },
  { id: "uni", label: "Carona Uni" },
];

export default function TelaViagens() {
  const [filtro, setFiltro] = useState("todas");

  const filtradas =
    filtro === "todas"
      ? TODAS_VIAGENS
      : TODAS_VIAGENS.filter((t) => t.tipo === filtro);

  const gastoTotal = filtradas
    .filter((t) => t.status === "concluída")
    .reduce((sum, t) => sum + t.preco, 0);

  // Dados do gráfico semanal
  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const dadosSemana = diasSemana.map((dia) => {
    const viagensDia = TODAS_VIAGENS.filter((t) => t.dia === dia && t.status === "concluída");
    return viagensDia.reduce((sum, t) => sum + t.preco, 0);
  });
  const valorMax = Math.max(...dadosSemana, 1);

  return (
    <div className="tela-viagens-container">
      <div className="tela-viagens-scroll">
        {/* Título */}
        <div className="tela-viagens-titulo-wrapper">
          <div className="tela-viagens-titulo-icone">
            <Calendar size={24} color="#00E5FF" strokeWidth={2.5} />
            <h1>Minhas Viagens</h1>
          </div>
          <p>
            {TODAS_VIAGENS.length} viagens • {TODAS_VIAGENS.filter((t) => t.status === "concluída").length} concluídas
          </p>
        </div>

        {/* Card resumo + gráfico */}
        <div className="tela-viagens-card-resumo">
          <div className="tela-viagens-card-resumo-conteudo">
            <div className="tela-viagens-gasto-label">
              <TrendingUp size={16} color="#00E5FF" strokeWidth={2.5} />
              <span>Gasto Total</span>
            </div>
            <p className="tela-viagens-gasto-total">
              R$ {gastoTotal.toFixed(2).replace(".", ",")}
            </p>
            <p className="tela-viagens-gasto-semana">Viagens da semana</p>
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
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                    className="tela-viagens-barra"
                    style={{ background: valor > 0 ? "#00E5FF" : "#1E1E1E" }}
                  />
                  <span>{dia}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filtros */}
        <div className="tela-viagens-filtros no-scrollbar">
          {FILTROS.map(({ id, label }) => {
            const ativo = filtro === id;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.94 }}
                onClick={() => setFiltro(id)}
                className={`tela-viagens-filtro ${ativo ? "ativo" : ""}`}
              >
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Lista de viagens */}
        <div className="tela-viagens-lista">
          {filtradas.map((viagem, i) => {
            const Icone = viagem.icon;
            return (
              <motion.div
                key={viagem.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="tela-viagens-card"
              >
                <div className="tela-viagens-card-icone" style={{ background: viagem.cor }}>
                  <Icone size={18} color="#000000" strokeWidth={2.5} />
                </div>
                <div className="tela-viagens-card-info">
                  <div className="tela-viagens-card-rotas">
                    <span>{viagem.origem} → {viagem.destino}</span>
                  </div>
                  <span className="tela-viagens-card-data">{viagem.data} • {viagem.hora}</span>
                </div>
                {viagem.status === "cancelada" ? (
                  <span className="tela-viagens-badge-cancelada">Cancelada</span>
                ) : (
                  <span className="tela-viagens-badge-concluida">Concluída</span>
                )}
                <span className={`tela-viagens-preco${viagem.status === "cancelada" ? " cancelada" : ""}`}>
                  R$ {viagem.preco.toFixed(2).replace(".", ",")}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
