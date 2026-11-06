import React from 'react';
import { Wind, ShieldAlert, HeartPulse, Activity } from 'lucide-react';
import { AirQualityData } from '../types/weather.js';

interface AirQualityCardProps {
  airQuality: AirQualityData;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  if (!airQuality) return null;

  const { aqi, category, color, summary, healthAdvice, pollutants, hourlyAqi } = airQuality;

  // Gauge percentage for 0-300 scale
  const gaugePercent = Math.min(100, Math.max(5, (aqi / 300) * 100));

  const pollutantItems = [
    { label: 'PM2.5', name: 'Fine Particles', value: `${pollutants.pm2_5} µg/m³`, benchmark: '< 15 µg/m³' },
    { label: 'PM10', name: 'Coarse Dust', value: `${pollutants.pm10} µg/m³`, benchmark: '< 45 µg/m³' },
    { label: 'NO₂', name: 'Nitrogen Dioxide', value: `${pollutants.no2} µg/m³`, benchmark: '< 25 µg/m³' },
    { label: 'O₃', name: 'Surface Ozone', value: `${pollutants.o3} µg/m³`, benchmark: '< 100 µg/m³' },
    { label: 'CO', name: 'Carbon Monoxide', value: `${pollutants.co} µg/m³`, benchmark: '< 4000 µg/m³' },
    { label: 'SO₂', name: 'Sulphur Dioxide', value: `${pollutants.so2} µg/m³`, benchmark: '< 40 µg/m³' },
  ];

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm sm:text-base font-semibold text-white">
            Air Quality & Atmospheric Pollution
          </h2>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {category}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Left Column: AQI Score & Bar */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span
              className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums"
              style={{ color }}
            >
              {aqi}
            </span>
            <div className="text-xs text-slate-400">
              <div className="font-semibold text-slate-200">US AQI Standard</div>
              <div>0–500 Index Scale</div>
            </div>
          </div>

          {/* Color Spectrum Progress Bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${gaugePercent}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Good (0)</span>
              <span>Mod (50)</span>
              <span>Unhealthy (150)</span>
              <span>Hazard (300+)</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{summary}</p>
        </div>

        {/* Middle Column: Health Advice & Sensitive Populations */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Health Advisory</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{healthAdvice}</p>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>WHO Ambient Air Quality Guidelines compliant</span>
          </div>
        </div>

        {/* Right Column: Key Pollutants Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {pollutantItems.slice(0, 4).map((item) => (
            <div
              key={item.label}
              className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono">{item.label}</span>
                <span className="text-[10px] text-slate-400">{item.benchmark}</span>
              </div>
              <div className="text-sm font-semibold text-slate-200 font-mono mt-1">
                {item.value}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
