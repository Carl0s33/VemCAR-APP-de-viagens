import React from "react";
import "./style/MapaCidade.css";

export const MapaCidade = ({ mostrarRota = false, mostrarCarro = false }) => {
  return (
    <div className="mapa-container-wrapper" style={{ backgroundColor: "#e0e0e0", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", minHeight: "300px" }}>
      <p style={{ color: "#333" }}>Mapa Placeholder (Leaflet removido)</p>
    </div>
  );
};