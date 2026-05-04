import React from "react";
import { motion } from "motion/react";
import { Search, MapPin, Clock, Star, Navigation } from "lucide-react";
import "./style/TelaInicial.css";

// ajuste: export default para o App.jsx reconhecer
export default function TelaInicial({ aoClicarBusca, urlAvatar, aoClicarAvatar }) {
  return (
    <div className="home-container">
      <div className="home-search-section">
        <motion.div 
          className="search-bar-matte"
          onClick={aoClicarBusca}
          whileTap={{ scale: 0.98 }}
        >
          <Search size={20} color="#00E5FF" />
          <span>Para onde vamos?</span>
        </motion.div>
      </div>

      <div className="home-content">
        <div className="recent-destinations">
          <h3 className="section-title">Sugestões</h3>
          
          <div className="destination-item" onClick={aoClicarBusca}>
            <div className="icon-wrapper-matte">
              <Clock size={18} color="#888" />
            </div>
            <div className="destination-info">
              <p className="dest-name">IFRN Campus Nova Cruz</p>
              <p className="dest-address">RN-120, Nova Cruz - RN</p>
            </div>
          </div>

          <div className="destination-item" onClick={aoClicarBusca}>
            <div className="icon-wrapper-matte">
              <Star size={18} color="#888" />
            </div>
            <div className="destination-info">
              <p className="dest-name">Trabalho</p>
              <p className="dest-address">Centro, Santo Antônio - RN</p>
            </div>
          </div>
        </div>

        <div className="promotion-card">
          <div className="promo-text">
            <h3>Ganhe descontos</h3>
            <p>Indique o Vem Car para seus amigos do IFRN.</p>
          </div>
          <div className="promo-icon">
            <Navigation size={32} color="#000" />
          </div>
        </div>
      </div>
    </div>
  );
}