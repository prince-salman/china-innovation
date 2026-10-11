import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTelemetryStore } from '../store/useTelemetryStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TelemetryChart() {
  const { data } = useTelemetryStore();
  const [history, setHistory] = useState<{ time: string; rpm: number; press: number }[]>([]);

  useEffect(() => {
    if (!data) return;

    // Ambil waktu lokal saat data diterima
    const now = data?.timestamp 
      ? new Date(data.timestamp * 1000).toLocaleTimeString() 
      : new Date().toLocaleTimeString();

    // Ekstraksi nilai dengan fallback aman
    const currentRpm = data?.motor_rpm ?? data?.engine_rpm ?? data?.telemetry?.motor_rpm ?? data?.telemetry?.rpm ?? 0;
    const currentPress = data?.hydraulic_pressure ?? data?.telemetry?.hydraulic_press ?? 0;

    setHistory((prev) => {
      const updated = [...prev, { time: now, rpm: currentRpm, press: currentPress }];
      if (updated.length > 25) updated.shift(); // Simpan 25 data poin terakhir
      return updated;
    });
  }, [data]);

  const chartData = {
    labels: history.map((item) => item.time),
    datasets: [
      {
        label: 'Motor Traction RPM',
        data: history.map((item) => item.rpm),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.5)',
        yAxisID: 'y-rpm',
        tension: 0.3,
      },
      {
        label: 'Hydraulic Press (Bar)',
        data: history.map((item) => item.press),
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        yAxisID: 'y-press',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
      'y-rpm': {
        type: 'linear' as const,
        position: 'left' as const,
        ticks: { color: '#06b6d4' },
        grid: { color: '#1f2937' },
      },
      'y-press': {
        type: 'linear' as const,
        position: 'right' as const,
        ticks: { color: '#eab308' },
        grid: { drawOnChartArea: false },
      },
    },
    plugins: {
      legend: { labels: { color: '#f3f4f6' } },
    },
  };

  return (
    <div className="bg-industrial-panel border border-industrial-border p-5 rounded-xl h-80 w-full mt-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Real-Time Telemetry Trend (Motor RPM vs Hydraulic Line)</h3>
      <div className="h-60">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}