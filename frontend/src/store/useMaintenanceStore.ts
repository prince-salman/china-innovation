import { create } from 'zustand';

export interface Incident {
  id: string;
  timestamp: string;
  equipment_id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  root_cause: string;
  oem_part: string;
  confidence_score: number;
}

interface MaintenanceState {
  incidents: Incident[];
  severityFilter: string;
  sortBy: string;
  fetchIncidents: () => Promise<void>;
  setSeverityFilter: (severity: string) => void;
  setSortBy: (sortBy: string) => void;
}

export const useMaintenanceStore = create<MaintenanceState>((set) => ({
  incidents: [],
  severityFilter: 'ALL',
  sortBy: 'latest',

  fetchIncidents: async () => {
    try {
      const res = await fetch('http://localhost:8000/api/incidents');
      const data = await res.json();
      set({ incidents: data });
    } catch (err) {
      console.error('Gagal fetch incidents:', err);
    }
  },

  setSeverityFilter: (severity) => set({ severityFilter: severity }),
  setSortBy: (sortBy) => set({ sortBy }),
}));