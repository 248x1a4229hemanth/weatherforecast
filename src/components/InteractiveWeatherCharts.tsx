import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { HourlyForecastItem } from '../types/weather.js';
import {
  convertTemperature,
  convertWindSpeed,
  convertPressure,
} from '../utils/units.js';
import { useWeather } from '../context/WeatherContext.js';

interface InteractiveWeatherChartsProps {
  hourly: HourlyForecastItem[];
}

export const InteractiveWeatherCharts: React.FC<InteractiveWeatherChartsProps> = ({ hourly }) => {
  const { preferences } = useWeather();
  const [activeChart, setActiveChart] = useState<
    'temperature' | 'precipitation' | 'wind' | 'humidity' | 'pressure'
  >('temperature');

  const chartData = hourly.slice(0, 24).map((h) => {
    const time = new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      time,
      temp: convertTemperature(h.temperature, preferences.tempUnit),
      feelsLike: convertTemperature(h.feelsLike, preferences.tempUnit),
      rainProb: h.precipitationProbability,
      precip: h.precipitation,
      windSpeed: convertWindSpeed(h.windSpeed, preferences.windUnit),
      humidity: h.humidity,
      pressure: convertPressure(h.pressure, preferences.pressureUnit),
    };
  });

  const tabs = [
    { id: 'temperature', label: 'Temperature' },
    { id: 'precipitation', label: 'Precipitation' },
    { id: 'wind', label: 'Wind Speed' },
    { id: 'humidity', label: 'Humidity' },
    { id: 'pressure', label: 'Atmospheric Pressure' },
  ] as const;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header and Chart Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white">
            Interactive Atmospheric Dynamics
          </h2>
          <p className="text-xs text-slate-400">
            24-hour continuous sensor graphs with interactive cursor inspection
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeChart === tab.id
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'temperature' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stop-color="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stop-color="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [`${val}°`, 'Temperature']}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
                name="Temperature"
              />
              <Line
                type="monotone"
                dataKey="feelsLike"
                stroke="#fbbf24"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
                name="Feels Like"
              />
            </AreaChart>
          ) : activeChart === 'precipitation' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#f8fafc',
                }}
                formatter={(val: any, name: any) => [
                  name === 'Rain Probability' ? `${val}%` : `${val} mm`,
                  name,
                ]}
              />
              <Bar dataKey="rainProb" fill="#0284c7" radius={[4, 4, 0, 0]} name="Rain Probability" />
            </BarChart>
          ) : activeChart === 'wind' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stop-color="#2dd4bf" stopOpacity={0.4} />
                  <stop offset="95%" stop-color="#2dd4bf" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [`${val} ${preferences.windUnit}`, 'Wind Speed']}
              />
              <Area
                type="monotone"
                dataKey="windSpeed"
                stroke="#2dd4bf"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#windGradient)"
                name="Wind Speed"
              />
            </AreaChart>
          ) : activeChart === 'humidity' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [`${val}%`, 'Relative Humidity']}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#60a5fa"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                name="Humidity"
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stop-color="#a78bfa" stopOpacity={0.4} />
                  <stop offset="95%" stop-color="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [`${val} ${preferences.pressureUnit}`, 'Barometric Pressure']}
              />
              <Area
                type="monotone"
                dataKey="pressure"
                stroke="#a78bfa"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#pressureGradient)"
                name="Pressure"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
