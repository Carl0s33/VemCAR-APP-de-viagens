import React from "react";
import { ArrowLeft } from "lucide-react";
import { MapaCidade } from "./MapaCidade";
import "./style/TelaConfirmarColeta.css";

export default function TelaConfirmarColeta({ onConfirm, onBack }) {
  return (
    <div className="tela-confirmar-coleta">
      
      {/* Botão de voltar (Isolado em sua própria div) */}
      <div className="botao-voltar">
        <button onClick={onBack} className="botao-voltar-icone">
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
        </button>
      </div>

      {/* Área do Mapa */}
      <div className="area-mapa">
        <MapaCidade mostrarRota={false} mostrarCarro={false} />
      </div>

      {/* Botão de confirmar (Isolado na parte inferior) */}
      <div className="container-botao-confirmar">
        <button onClick={onConfirm} className="botao-confirmar-coleta">
         Confirmar Local
        </button>
      </div>
      
    </div>
  );
}