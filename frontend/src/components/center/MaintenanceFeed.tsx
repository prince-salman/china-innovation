import React, { useEffect, useState } from 'react';
import { Filter, ArrowUpDown, AlertTriangle, ShieldAlert, Wrench, CheckCircle2 } from 'lucide-react';

interface IncidentReport {
  id: string;
  timestamp: string;
  equipment_id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  root_cause: string;
  oem_part: string;
  confidence_score: number;
}

export default function MaintenanceFeed() {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'confidence'>('newest');

  useEffect(() => {
    fetch('http://localhost:8000/api/incidents')
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching incidents:', err);
        setLoading(false);
      });
  }, []);

  // Filter & Sort Logic
  const filteredIncidents = incidents
    .filter((item) => filterSeverity === 'ALL' || item.severity === filterSeverity)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (sortBy === 'confidence') {
        return b.confidence_score - a.confidence_score;
      }
      return 0;
    });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-900/60 text-red-400 border-red-700 animate-pulse';
      case 'HIGH':
        return 'bg-orange-900/60 text-orange-400 border-orange-700';
      case 'MEDIUM':
        return 'bg-yellow-900/60 text-yellow-400 border-yellow-700';
      case 'LOW':
        return 'bg-blue-900/60 text-blue-400 border-blue-700';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  return (
    <div className="bg-industrial-panel border border-industrial-border p-5 rounded-xl shadow-lg mt-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-industrial-border">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-industrial-yellow" size={20} />
            Agentic Maintenance Feed
          </h2>
          <p className="text-xs text-gray-400">DeepSeek Anomaly Detection & Incident Pipeline</p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-industrial-bg border border-industrial-border px-3 py-1.5 rounded-lg">
            <Filter size={14} className="text-industrial-cyan" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-gray-200 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-industrial-panel">All Severities</option>
              <option value="CRITICAL" className="bg-industrial-panel">CRITICAL</option>
              <option value="HIGH" className="bg-industrial-panel">HIGH</option>
              <option value="MEDIUM" className="bg-industrial-panel">MEDIUM</option>
              <option value="LOW" className="bg-industrial-panel">LOW</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-industrial-bg border border-industrial-border px-3 py-1.5 rounded-lg">
            <ArrowUpDown size={14} className="text-industrial-yellow" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-200 outline-none cursor-pointer"
            >
              <option value="newest" className="bg-industrial-panel">Newest First</option>
              <option value="oldest" className="bg-industrial-panel">Oldest First</option>
              <option value="confidence" className="bg-industrial-panel">Highest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident List */}
      {loading ? (
        <div className="py-8 text-center text-gray-400 text-sm animate-pulse">
          Loading incident feed from pipeline...
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-sm">
          No incidents found matching the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-industrial-bg/60 border border-industrial-border hover:border-industrial-cyan/50 p-4 rounded-xl transition-all duration-200 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded border font-mono ${getSeverityBadge(
                      incident.severity
                    )}`}
                  >
                    {incident.severity}
                  </span>
                  <span className="font-mono text-xs text-industrial-cyan font-semibold">
                    {incident.equipment_id}
                  </span>
                  <span className="text-xs text-gray-500">• {incident.id}</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {new Date(incident.timestamp).toLocaleString()}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mb-2">{incident.title}</h3>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-industrial-panel/50 p-3 rounded-lg border border-industrial-border/40 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">ROOT CAUSE</span>
                  <span className="text-gray-200 font-medium">{incident.root_cause}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">OEM PART REPLACEMENT</span>
                  <span className="text-industrial-yellow font-mono flex items-center gap-1">
                    <Wrench size={12} />
                    {incident.oem_part}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">CONFIDENCE SCORE</span>
                  <span className="text-industrial-green font-mono font-bold">
                    {(incident.confidence_score * 100).toFixed(0)}% Match
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}