import React from 'react';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Cloud,
  Thermometer,
  CloudRain,
  Compass,
} from 'lucide-react';
import { CurrentWeather } from '../types/weather.js';
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  getWindDirectionCompass,
} from '../utils/units.js';
import { useWeather } from '../context/WeatherContext.js';

interface WeatherMetricsGridProps {
  current: CurrentWeather;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ current }) => {
  const { preferences } = useWeather();

  // Humidity classification
  const getHumidityDesc = (hum: number) => {
    if (hum < 30) return { label: 'Dry air', sub: 'Low moisture level' };
    if (hum <= 60) return { label: 'Comfortable', sub: 'Optimal indoor/outdoor' };
    if (hum <= 80) return { label: 'Humid', sub: 'Noticeable moisture' };
    return { label: 'Very humid', sub: 'Heavy air moisture' };
  };

  // UV risk classification
  const getUvRisk = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400', desc: 'No protection required' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-amber-400', desc: 'Wear sunscreen outdoors' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400', desc: 'Seek shade during midday' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-400', desc: 'Shirt, sunglasses & hat' };
    return { label: 'Extreme', color: 'text-purple-400', desc: 'Avoid midday sun exposure' };
  };

  // Visibility status
  const getVisibilityDesc = (visMeters: number) => {
    const km = visMeters / 1000;
    if (km >= 10) return { label: 'Clear', desc: 'Full optical horizon' };
    if (km >= 5) return { label: 'Moderate', desc: 'Light haze or mist' };
    if (km >= 1) return { label: 'Low', desc: 'Mist or light fog' };
    return { label: 'Very Poor', desc: 'Dense fog advisory' };
  };

  const humidityInfo = getHumidityDesc(current.humidity);
  const uvInfo = getUvRisk(current.uvIndex);
  const visibilityInfo = getVisibilityDesc(current.visibility);
  const windCompass = getWindDirectionCompass(current.windDirection);

  const metrics = [
    {
      title: 'Wind & Gusts',
      icon: Wind,
      value: formatWindSpeed(current.windSpeed, preferences.windUnit),
      subtext: `Direction: ${windCompass} (${current.windDirection}°)`,
      extra: current.windGusts
        ? `Gusts up to ${formatWindSpeed(current.windGusts, preferences.windUnit)}`
        : 'Calm gusts',
      accent: 'text-teal-400',
    },
    {
      title: 'Relative Humidity',
      icon: Droplets,
      value: `${current.humidity}%`,
      subtext: humidityInfo.label,
      extra: humidityInfo.sub,
      accent: 'text-blue-400',
    },
    {
      title: 'Atmospheric Pressure',
      icon: Gauge,
      value: formatPressure(current.pressure, preferences.pressureUnit),
      subtext: current.pressure > 1013 ? 'High pressure system' : 'Low pressure trough',
      extra: 'Standard sea-level: 1013 hPa',
      accent: 'text-indigo-400',
    },
    {
      title: 'UV Radiation Index',
      icon: Sun,
      value: `${current.uvIndex}`,
      subtext: `${uvInfo.label} risk level`,
      extra: uvInfo.desc,
      accent: uvInfo.color,
    },
    {
      title: 'Visibility Distance',
      icon: Eye,
      value: `${(current.visibility / 1000).toFixed(1)} km`,
      subtext: visibilityInfo.label,
      extra: visibilityInfo.desc,
      accent: 'text-cyan-400',
    },
    {
      title: 'Cloud Cover',
      icon: Cloud,
      value: `${current.cloudCover}%`,
      subtext:
        current.cloudCover < 20
          ? 'Clear skies'
          : current.cloudCover < 60
          ? 'Partly cloudy'
          : 'Heavily overcast',
      extra: 'Sky coverage ratio',
      accent: 'text-slate-300',
    },
    {
      title: 'Dew Point Temperature',
      icon: Thermometer,
      value: formatTemperature(current.dewPoint, preferences.tempUnit),
      subtext:
        current.dewPoint > 20
          ? 'Muggy atmosphere'
          : current.dewPoint > 13
          ? 'Comfortable'
          : 'Crisp & dry',
      extra: 'Condensation threshold',
      accent: 'text-emerald-400',
    },
    {
      title: 'Current Precipitation',
      icon: CloudRain,
      value: `${current.precipitation} mm`,
      subtext: current.precipitation > 0 ? 'Active precipitation' : 'No active rainfall',
      extra: 'Liquid equivalent volume',
      accent: 'text-sky-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/80 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium text-slate-300 truncate">{m.title}</span>
              <Icon className={`w-4 h-4 ${m.accent} shrink-0`} />
            </div>

            <div className="my-1">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
                {m.value}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-0.5 truncate">
                {m.subtext}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 truncate">
              {m.extra}
            </div>
          </div>
        );
      })}
    </div>
  );
};
