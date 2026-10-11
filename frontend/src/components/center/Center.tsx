import React from 'react';
import { MaintenanceFeed } from './MaintenanceFeed';

export const Center: React.FC = () => {
  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-slate-950">
      {/* Komponen Incident Feed */}
      <MaintenanceFeed />
      
      {/* Nanti viewport 3D Babylon.js atau Map OpenLayers tinggal ditaruh di atas/bawah sini */}
    </div>
  );
};

export default Center;