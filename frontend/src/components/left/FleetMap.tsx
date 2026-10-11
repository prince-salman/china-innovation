// @ts-nocheck
import React, { useState } from 'react';
import { MapPin, Navigation, Radio } from 'lucide-react';

export default function FleetMap() {
  const [selectedFleet, setSelectedFleet] = useState('XC968-01');

  const fleetNodes = [
    { id: 'XC968-01', label: 'XC968-EV #1', type: 'XCMG Electric Loader', status: 'CRITICAL', top: '52%', left: '48%', color: 'bg-red-500' },
    { id: 'XDR80-02', label: 'XDR80TE #2', type: 'XCMG Electric Dump Truck', status: 'WARNING', top: '45%', left: '38%', color: 'bg-amber-500' },
    { id: 'XE370-03', label: 'XE370E #3', type: 'XCMG Electric Excavator', status: 'NOMINAL', top: '60%', left: '25%', color: 'bg-emerald-500' },
    { id: 'XC958-04', label: 'XC958-EV #4', type: 'XCMG Electric Loader', status: 'NOMINAL', top: '38%', left: '62%', color: 'bg-emerald-500' },
  ];

  return (
    <div className="relative w-full h-[260px] bg-[#090d14] rounded-lg border border-industrial-border/60 overflow-hidden p-3 select-none flex flex-col justify-between">
      
      {/* 1. Foto Background Medan Tambang */}
      <img 
        src="/mine-map.jpg" 
        alt="Mine Site Terrain Map" 
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none filter contrast-125 brightness-90"
      />

      {/* 2. Gradient Overlay untuk Kesan Industrial/Cyberpunk */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-transparent to-[#090d14]/70 pointer-events-none" />

      {/* 3. Grid Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)`,
          backgroundSize: '25px 25px'
        }}
      />

      {/* Header Overlay */}
      <div className="relative z-10 flex justify-between items-center text-xs font-mono">
        <div className="flex items-center gap-1.5 bg-industrial-panel/90 backdrop-blur-md px-2 py-1 rounded border border-industrial-border/60">
          <MapPin size={13} className="text-industrial-cyan" />
          <span className="text-gray-200 font-bold">FLEET GIS MAP</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-industrial-panel/90 backdrop-blur-md px-2 py-1 rounded border border-industrial-border/60 text-[10px]">
            <Navigation size={11} className="text-industrial-yellow" />
            <span className="text-gray-300">XCMG GREEN MINE PIT #4</span>
          </div>
          <div className="flex items-center gap-1 bg-industrial-panel/90 backdrop-blur-md p-1 rounded border border-industrial-border/60">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Pin Points Layar Peta */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        {fleetNodes.map((node) => {
          const isSelected = selectedFleet === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedFleet(node.id)}
              style={{ top: node.top, left: node.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Pulse Efek jika terpilih atau kritis */}
              {node.status === 'CRITICAL' && (
                <span className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping" />
              )}
              
              <div className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-lg transition-transform ${node.color} ${isSelected ? 'scale-125 ring-2 ring-industrial-cyan' : 'group-hover:scale-110'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Tag Nama Unit */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-gray-700 text-[9px] font-mono text-gray-200">
                {node.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Unit Terpilih */}
      <div className="relative z-10 bg-industrial-panel/90 backdrop-blur-md border border-industrial-border/80 p-2 rounded flex justify-between items-center text-[10px] font-mono">
        <div>
          <span className="text-gray-400 block text-[9px]">SELECTED FLEET</span>
          <span className="text-white font-bold">{selectedFleet}</span>
          <span className="text-gray-400 text-[9px] ml-2">
            {fleetNodes.find(n => n.id === selectedFleet)?.type}
          </span>
        </div>
        <div className="text-right">
          <span className="text-gray-400 block text-[9px]">STATUS</span>
          <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
            fleetNodes.find(n => n.id === selectedFleet)?.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
            fleetNodes.find(n => n.id === selectedFleet)?.status === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}>
            {fleetNodes.find(n => n.id === selectedFleet)?.status}
          </span>
        </div>
      </div>

    </div>
  );
}