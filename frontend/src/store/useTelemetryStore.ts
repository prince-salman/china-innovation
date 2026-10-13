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
  isSimulated: boolean;
  connect: () => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => {
  let socket: WebSocket | null = null;
  let simTimer: any = null;

  const startSimulation = () => {
    if (simTimer) return;
    console.log('[Telemetry] Backend offline. Starting client-side XCMG simulation fallback...');
    
    const emitSimData = () => {
      const motorRpm = Math.floor(1800 + Math.random() * 950);
      const hydraulicPressure = Math.floor(185 + Math.random() * 130);
      const vibrationRms = Number((0.9 + Math.random() * 3.2).toFixed(2));
      const temp = Math.floor(62 + Math.random() * 32);
      const batterySoc = Math.floor(74 + Math.random() * 22);

      const normVib = Math.min(100, (vibrationRms / 4.0) * 100);
      const normPress = Math.min(100, Math.max(0, ((hydraulicPressure - 150) / 200) * 100));
      const normTemp = Math.min(100, Math.max(0, ((temp - 50) / 55) * 100));
      const workloadStress = Math.min(95, Math.max(45, Math.floor(0.86 * normVib + 0.08 * normPress + 0.06 * normTemp)));
      const isFault = workloadStress >= 80;

      const mockPacket: TelemetryData = {
        equipment_id: "XCMG-XC968-EV",
        equipment_name: "XCMG XC968-EV Pure-Electric Wheel Loader",
        motor_rpm: motorRpm,
        engine_rpm: motorRpm,
        hydraulic_pressure: hydraulicPressure,
        vibration_rms: vibrationRms,
        temperature: temp,
        battery_soc_pct: batterySoc,
        workload_stress_pct: workloadStress,
        health_score: Math.max(45, 100 - Math.floor(workloadStress * 0.5)),
        fault_detected: isFault,
        timestamp: Math.floor(Date.now() / 1000),
        diagnostic: {
          oem_part: "XCMG-803164921-VALVE",
          failure_mode: "Hydraulic Proportional Valve Leakage & Inverter Thermal Surge",
          mitigation_steps: [
            "Inspect hydraulic line pressure at manifold test port P1",
            "Verify cooling circuit flow rate for traction inverter drive",
            "Recalibrate proportional solenoid valve via HANYUN OS service terminal"
          ]
        }
      };

      set({ data: mockPacket, isConnected: true, isSimulated: true });
    };

    emitSimData();
    simTimer = setInterval(emitSimData, 1000);
  };

  return {
    data: null,
    isConnected: false,
    isSimulated: false,
    connect: () => {
      if (socket) return;

      const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:8000/ws/telemetry';

      try {
        socket = new WebSocket(wsUrl);

        // Fallback jika tidak connect dalam 1.8 detik
        const connectTimeout = setTimeout(() => {
          if (!socket || socket.readyState !== WebSocket.OPEN) {
            startSimulation();
          }
        }, 1800);

        socket.onopen = () => {
          clearTimeout(connectTimeout);
          if (simTimer) {
            clearInterval(simTimer);
            simTimer = null;
          }
          set({ isConnected: true, isSimulated: false });
        };

        socket.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            set({ data: parsedData, isConnected: true, isSimulated: false });
          } catch (err) {
            console.error('Failed to parse telemetry JSON', err);
          }
        };

        socket.onclose = () => {
          clearTimeout(connectTimeout);
          set({ isConnected: false });
          socket = null;
          startSimulation();
        };

        socket.onerror = () => {
          clearTimeout(connectTimeout);
          startSimulation();
        };
      } catch {
        startSimulation();
      }
    },
  };
});