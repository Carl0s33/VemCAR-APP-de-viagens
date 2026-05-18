import React from 'react';

const MotoSVG = () => (
    <svg width="50" height="90" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="headlightGlowMoto" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
            </linearGradient>
        </defs>
        <polygon points="36,45 20,0 60,0 44,45" fill="url(#headlightGlowMoto)" />
        <rect x="36" y="30" width="8" height="20" rx="4" fill="#1E293B" />
        <rect x="24" y="45" width="32" height="4" rx="2" fill="#94A3B8" />
        <path d="M 32 45 L 48 45 L 44 85 L 36 85 Z" fill="#00BCD4" />
        <circle cx="40" cy="65" r="9" fill="#0F172A" stroke="#333" strokeWidth="2" />
        <rect x="36" y="80" width="8" height="22" rx="4" fill="#1E293B" />
        <rect x="36" y="100" width="8" height="4" rx="2" fill="#EF4444" />
    </svg>
);

export default MotoSVG;
