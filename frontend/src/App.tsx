import { useEffect } from 'react';
import { useTelemetryStore } from './store/useTelemetryStore';
import TelemetryChart from './components/TelemetryChart';
import MaintenanceFeed from './components/center/MaintenanceFeed';
import FleetMap from './components/left/FleetMap';
import DigitalTwinCanvas from './components/center/DigitalTwinCanvas';
import { Activity, AlertTriangle, ShieldCheck, Cpu, Gauge, Thermometer, MapPin, Box } from 'lucide-react';

export default function App() {
  const { data, isConnected, isSimulated, connect } = useTelemetryStore();

  useEffect(() => {
    connect();
  }, [connect]);

  if (!data) {
    return (
      <div className="min-h-screen bg-industrial-bg text-white p-6 flex items-center justify-center">
        <p className="text-industrial-yellow animate-pulse font-mono">Connecting to Aegis Telemetry Stream...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-industrial-bg text-white p-4 font-sans flex flex-col gap-4">
      {/* Top Bar Navigation */}
      <header className="flex justify-between items-center bg-industrial-panel border border-industrial-border px-4 py-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-industrial-green animate-pulse' : 'bg-industrial-red'}`} />
          <h1 className="font-bold text-base tracking-wider text-industrial-yellow uppercase">
            Aegis-HANYUN <span className="text-white text-xs font-normal opacity-70">| XCMG XC968-EV Cockpit</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="px-3 py-1 bg-industrial-bg border border-industrial-border rounded text-industrial-cyan">
            WS STATUS: {isSimulated ? 'EV TELEMETRY (SIMULATED)' : isConnected ? 'CONNECTED (10Hz)' : 'CONNECTING...'}
          </span>
        </div>
      </header>

      {/* Main Layout Grid (12 Columns System) */}
      <div className="grid grid-cols-12 gap-4 flex-1">
        
        {/* PANEL 1: Fleet GIS Map (Kiri Atas - 3 Kolom) */}
        <div className="col-span-12 lg:col-span-3 bg-industrial-panel border border-industrial-border rounded-xl p-4 flex flex-col min-h-[320px]">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
            <MapPin size={16} className="text-industrial-cyan" />
            <span>Fleet GIS Map</span>
          </div>
          <div className="flex-1">
            <FleetMap />
          </div>
        </div>

        {/* PANEL 2: 3D Component-Level Digital Twin (Tengah Atas - 6 Kolom) */}
        <div className="col-span-12 lg:col-span-6 bg-industrial-panel border border-industrial-border rounded-xl p-4 flex flex-col min-h-[320px]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
              <Box size={16} className="text-industrial-yellow" />
              <span>3D Component-Level Digital Twin</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">Powered by Babylon.js</span>
          </div>
          <div className="flex-1">
            <DigitalTwinCanvas />
          </div>
        </div>

        {/* PANEL 3: AI Predictive Health & Copilot (Kanan Atas - 3 Kolom) */}
        <div className="col-span-12 lg:col-span-3 bg-industrial-panel border border-industrial-border rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
            <AlertTriangle className={data?.fault_detected ? "text-industrial-red animate-pulse" : "text-industrial-green"} size={16} />
            <span>AI Copilot & Predictive Health</span>
          </div>

          <div className="my-2 text-center bg-industrial-bg/40 border border-industrial-border/30 p-3 rounded-xl">
            <span className="text-xs text-gray-400 block mb-1">ML Workload Stress</span>
            <div className={`text-4xl font-mono font-black ${(data?.workload_stress_pct ?? 0) > 80 ? 'text-industrial-red animate-bounce' : 'text-industrial-green'}`}>
              {data?.workload_stress_pct ?? 0}%
            </div>
            <span className="text-[10px] text-gray-500 font-mono">Gradient Boosting Engine</span>
          </div>

          {data?.fault_detected ? (
            <div className="bg-red-950/30 border border-industrial-red/50 p-3 rounded-lg text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-industrial-red font-bold">⚠️ CRITICAL FAULT</span>
                <span className="bg-industrial-red text-white px-1.5 py-0.5 rounded font-mono text-[10px]">{data?.diagnostic?.oem_part ?? 'N/A'}</span>
              </div>
              <p className="text-gray-300 mb-2"><strong className="text-white">Failure Mode:</strong> {data?.diagnostic?.failure_mode ?? 'Unknown'}</p>
              <div className="space-y-1">
                <p className="font-semibold text-gray-400">Steps:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5 text-[11px]">
                  {data?.diagnostic?.mitigation_steps?.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-industrial-green text-xs bg-green-950/20 p-3 rounded-lg border border-industrial-green/30">
              <ShieldCheck size={16} />
              <span>All systems nominal. Zero anomalies detected.</span>
            </div>
          )}
        </div>

        {/* PANEL 4: Prioritized Fleet List (Kiri Bawah - 3 Kolom) */}
        <div className="col-span-12 lg:col-span-3 bg-industrial-panel border border-industrial-border rounded-xl p-4">
          <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Prioritized Fleet List</h3>
          <MaintenanceFeed />
        </div>

        {/* PANEL 5: High-Frequency Telemetry Grid & Chart (Kanan Bawah - 9 Kolom) */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-industrial-panel border border-industrial-border p-4 rounded-xl">
              <div className="flex justify-between items-center text-gray-400 text-xs">
                <span>Motor Traction RPM</span>
                <Gauge size={16} className="text-industrial-cyan" />
              </div>
              <div className="text-2xl font-mono font-bold mt-2 text-white flex items-baseline justify-between">
                <span>{data?.motor_rpm ?? data?.engine_rpm ?? 0} <span className="text-xs font-normal text-gray-500">RPM</span></span>
                <span className="text-[10px] bg-cyan-950/60 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800">EV Drive</span>
              </div>
            </div>

            <div className="bg-industrial-panel border border-industrial-border p-4 rounded-xl">
              <div className="flex justify-between items-center text-gray-400 text-xs">
                <span>Hydraulic Line (Pbar)</span>
                <Activity size={16} className="text-industrial-yellow" />
              </div>
              <div className="text-2xl font-mono font-bold mt-2 text-white flex items-baseline justify-between">
                <span>{data?.hydraulic_pressure ?? 0} <span className="text-xs font-normal text-gray-500">Bar</span></span>
                <span className="text-[10px] text-gray-400">150-350 bar</span>
              </div>
            </div>

            <div className="bg-industrial-panel border border-industrial-border p-4 rounded-xl">
              <div className="flex justify-between items-center text-gray-400 text-xs">
                <span>Vibration (a_eff)</span>
                <Cpu size={16} className="text-industrial-cyan" />
              </div>
              <div className="text-2xl font-mono font-bold mt-2 text-white flex items-baseline justify-between">
                <span>{data?.vibration_rms ?? 0} <span className="text-xs font-normal text-gray-500">mm/s</span></span>
                <span className="text-[10px] text-gray-400">86% Model Wt</span>
              </div>
            </div>

            <div className="bg-industrial-panel border border-industrial-border p-4 rounded-xl">
              <div className="flex justify-between items-center text-gray-400 text-xs">
                <span>Inverter & Battery SOC</span>
                <Thermometer size={16} className="text-industrial-amber" />
              </div>
              <div className="text-2xl font-mono font-bold mt-2 text-white flex items-baseline justify-between">
                <span>{data?.temperature ?? 0} <span className="text-xs font-normal text-gray-500">°C</span></span>
                <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  SOC {data?.battery_soc_pct ?? 88}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-industrial-panel border border-industrial-border p-4 rounded-xl flex-1">
            <TelemetryChart />
          </div>
        </div>

      </div>
    </div>
  );
}