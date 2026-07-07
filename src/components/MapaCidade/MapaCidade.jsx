import React, { useRef, useEffect } from "react";
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./MapaCidade.css";

const PONTO_CARRO   = [-35.43762226387801, -6.475483074012976];
const PONTO_DESTINO = [-35.44523200903737, -6.470226792030399];

const CarroMini = () => (
  <svg width="36" height="56" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
    <polygon points="26,45 -8,0 88,0 54,45" fill="rgba(255,255,255,0.2)" />
    <rect x="20" y="36" width="40" height="50" rx="10" fill="#00BCD4" />
    <rect x="26" y="42" width="28" height="26" rx="5" fill="rgba(0,0,0,0.5)" />
    <path d="M 28 44 Q 40 38 52 44 L 51 48 Q 40 44 29 48 Z" fill="rgba(255,255,255,0.55)" />
    <rect x="22" y="36" width="10" height="5" rx="2.5" fill="#FEF08A" />
    <rect x="48" y="36" width="10" height="5" rx="2.5" fill="#FEF08A" />
    <rect x="22" y="83" width="10" height="4" rx="2" fill="#EF4444" />
    <rect x="48" y="83" width="10" height="4" rx="2" fill="#EF4444" />
  </svg>
);

const ROTA_MOCK = [
  PONTO_CARRO,
  [-35.439, -6.473],
  [-35.442, -6.471],
  PONTO_DESTINO,
];

export const MapaCidade = ({ mostrarRota = true, mostrarCarro = true, height = "100%" }) => {
  return (
    <div className="mapa-container-wrapper" style={{ height }}>
      <Map
        initialViewState={{
          longitude: (PONTO_CARRO[0] + PONTO_DESTINO[0]) / 2,
          latitude: (PONTO_CARRO[1] + PONTO_DESTINO[1]) / 2,
          zoom: 14.5,
          pitch: 40,
          bearing: -15,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        interactive={false}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        
        {mostrarRota && (
          <Source id="rota-deco" type="geojson" data={{
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: ROTA_MOCK }
          }}>
            <Layer id="rota-glow" type="line"
              paint={{ 'line-color': '#00BCD4', 'line-width': 10, 'line-opacity': 0.12 }} />
            <Layer id="rota-solid" type="line"
              paint={{ 'line-color': '#00BCD4', 'line-width': 3.5, 'line-opacity': 0.85,
                       'line-dasharray': [6, 3] }} />
          </Source>
        )}

        
        {mostrarCarro && (
          <Marker longitude={PONTO_CARRO[0]} latitude={PONTO_CARRO[1]}
            anchor="center" pitchAlignment="map" rotationAlignment="map" rotation={45}>
            <CarroMini />
          </Marker>
        )}

        
        <Marker longitude={PONTO_DESTINO[0]} latitude={PONTO_DESTINO[1]} anchor="bottom">
          <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
            <svg width="28" height="40" viewBox="0 0 28 40">
              <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 26 14 26S28 23.333 28 14C28 6.268 21.732 0 14 0z"
                fill="#00BCD4" />
              <circle cx="14" cy="14" r="6" fill="#000" />
            </svg>
          </div>
        </Marker>
      </Map>

      
      <div className="mapa-vignette" />
    </div>
  );
};