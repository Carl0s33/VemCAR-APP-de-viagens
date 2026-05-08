import React from "react";
import { MapPin } from "lucide-react";
import "./style/MapaCidade.css";

export const MapaCidade = ({ mostrarRota = false, mostrarCarro = false }) => {
  return (
    <div className="mapa-container-wrapper" style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* mapa real incorporado direto da web, centrado na tua área */}
      <iframe
        title="mapa real da cidade"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-35.2581%2C-6.4574%2C-35.2181%2C-6.4374&amp;layer=mapnik"
        className="mapa-iframe-real"
      />

      {/* pino centralizado flutuando em cima do mapa */}
      <div className="mapa-centro-pin" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <div className="pin-pulso" />
        <MapPin size={36} color="#00E5FF" strokeWidth={2.5} fill="#000" />
      </div>
    </div>
  );
};