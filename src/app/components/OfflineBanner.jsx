// Component to display offline banner
import React from 'react';
import useOfflineStore from '../hooks/useOfflineStore';
import './style/OfflineBanner.css';

const OfflineBanner = () => {
  const isOnline = useOfflineStore((state) => state.isOnline);

  if (isOnline) return null;

  return (
    <div className="offline-banner">
      <p>Sem conexão de rede</p>
    </div>
  );
};

export default OfflineBanner;
