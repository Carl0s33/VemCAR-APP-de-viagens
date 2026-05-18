import React from 'react';

const CarroOriginalSVG = () => (
    <svg width="60" height="90" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="headlightGlowPassageiro" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bodyGradPainelPassageiro" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="40%" stopColor="#00BCD4" />
                <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
        </defs>
        <polygon points="26,45 -10,0 90,0 54,45" fill="url(#headlightGlowPassageiro)" />
        <rect x="24" y="37" width="32" height="46" rx="8" fill="url(#bodyGradPainelPassageiro)" />
        <path d="M 29 47 Q 40 41 51 47 L 50 51 Q 40 47 30 51 Z" fill="rgba(255,255,255,0.8)" />
        <path d="M 30 63 Q 40 67 50 63 L 49 61 Q 40 64 31 61 Z" fill="#0C4A6E" opacity="0.8" />
        <rect x="27" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
        <rect x="45" y="37" width="8" height="4" rx="2" fill="#FEF08A" />
        <rect x="26" y="80" width="8" height="4" rx="2" fill="#EF4444" />
        <rect x="46" y="80" width="8" height="4" rx="2" fill="#EF4444" />
    </svg>
);

export default CarroOriginalSVG;
