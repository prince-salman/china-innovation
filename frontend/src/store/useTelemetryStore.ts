// src/store/useTelemetryStore.ts
import { create } from 'zustand';

export interface DiagnosticInfo {
  oem_part?: string;
  failure_mode?: string;
  mitigation_steps?: string[];
}

export interface TelemetryData {
  equipment_id?: string;
  equipment_name?: string;
  motor_rpm?: number;
  engine_rpm?: number;
  hydraulic_pressure?: number;
  vibration_rms?: number;
  temperature?: number;
  battery_soc_pct?: number;
  workload_stress_pct?: number;
  health_score?: number;
  fault_detected?: boolean;
  diagnostic?: DiagnosticInfo;
  timestamp?: number;
  telemetry?: {
    motor_rpm?: number;
    rpm?: number;
    hydraulic_press?: number;
    vibration_rms?: number;
    temperature?: number;
    battery_soc?: number;
  };
}

interface TelemetryStore {
  data: TelemetryData | null;
  isConnected: boolean;
  connect: () => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => {
  let socket: WebSocket | null = null;

  return {
    data: null,
    isConnected: false,
    connect: () => {
      if (socket) return;

      socket = new WebSocket('ws://localhost:8000/ws/telemetry');

      socket.onopen = () => set({ isConnected: true });

      socket.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          set({ data: parsedData });
        } catch (err) {
          console.error('Failed to parse telemetry JSON', err);
        }
      };

      socket.onclose = () => {
        set({ isConnected: false });
        socket = null;
      };
    },
  };
});