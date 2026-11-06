import React from 'react';
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  Clock,
} from 'lucide-react';
import { CurrentWeather, LocationData, DailyForecastItem } from '../types/weather.js';
import { formatTemperature } from '../utils/units.js';
import { useWeather } from '../context/WeatherContext.js';
import { WeatherIcon } from '../utils/weatherIcons.js';

interface CurrentWeatherHeroProps {
  current: CurrentWeather;
  location: LocationData;
  todayDaily?: DailyForecastItem;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  current,
  location,
  todayDaily,
}) => {
  const { preferences, toggleFavorite, isFavorite } = useWeather();
  const isSaved = isFavorite(location.id);

  // Dynamic atmospheric gradient based on weather condition and day/night
  const getAtmosphericTheme = () => {
    if (!current.isDay) {
      return {
        bg: 'from-indigo-950/50 via-slate-900 to-slate-950',
        border: 'border-indigo-800/40',
        glow: 'bg-indigo-500/10',
        badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
      };
    }
    const code = current.weatherCode;
    if (code === 0 || code === 1) {
      return {
        bg: 'from-amber-950/40 via-slate-900 to-slate-950',
        border: 'border-amber-800/40',
        glow: 'bg-amber-500/15',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
      };
    }
    if (code === 2 || code === 3) {
      return {
        bg: 'from-slate-800/50 via-slate-900 to-slate-950',
        border: 'border-slate-700/50',
        glow: 'bg-slate-500/10',
        badge: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
      };
    }
    if (code >= 51 && code <= 82) {
      return {
        bg: 'from-blue-950/50 via-slate-900 to-slate-950',
        border: 'border-blue-800/40',
        glow: 'bg-blue-500/15',
        badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
      };
    }
    if (code >= 95) {
      return {
        bg: 'from-purple-950/50 via-slate-900 to-slate-950',
        border: 'border-purple-800/40',
        glow: 'bg-purple-500/15',
        badge: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
      };
    }
    if (code >= 71 && code <= 86) {
      return {
        bg: 'from-cyan-950/40 via-slate-900 to-slate-950',
        border: 'border-cyan-800/40',
        glow: 'bg-cyan-500/15',
        badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
      };
    }
    return {
      bg: 'from-slate-800/40 via-slate-900 to-slate-950',
      border: 'border-slate-800',
      glow: 'bg-cyan-500/10',
      badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
    };
  };

  const theme = getAtmosphericTheme();

  // Date formatting
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.bg} p-6 sm:p-8 shadow-xl transition-all duration-300`}
    >
      {/* Background ambient glow circle */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full ${theme.glow} blur-3xl pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Location & Main Temp */}
        <div className="space-y-3">
          {/* Location Title & Favorite Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <MapPin className="w-4 h-4 shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {location.name}
              </h1>
            </div>
            {location.country && (
              <span className="text-sm font-medium text-slate-400">
                {location.admin1 ? `${location.admin1}, ${location.country}` : location.country}
              </span>
            )}
            <button
              onClick={() => toggleFavorite(location)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>

          {/* Time & Day/Night Indicator */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{current.localTime}</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border uppercase ${theme.badge}`}
            >
              {current.isDay ? 'Daytime' : 'Night'}
            </span>
          </div>

          {/* Large Temperature Display */}
          <div className="flex items-baseline gap-4 pt-2">
            <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white font-mono tabular-nums">
              {formatTemperature(current.temperature, preferences.tempUnit)}
            </div>
            <div className="space-y-1">
              <div className="text-sm sm:text-base font-semibold text-slate-200">
                {current.condition}
              </div>
              <div className="text-xs text-slate-400">
                Feels like{' '}
                <span className="font-mono text-slate-300">
                  {formatTemperature(current.feelsLike, preferences.tempUnit)}
                </span>
              </div>
            </div>
          </div>

          {/* Description & High/Low Range */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            <p className="italic text-slate-400">{current.description}</p>
            <div className="flex items-center gap-3 font-mono tabular-nums text-slate-300">
              <span className="flex items-center gap-0.5 text-amber-400">
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{formatTemperature(current.tempMax, preferences.tempUnit)}</span>
              </span>
              <span className="flex items-center gap-0.5 text-sky-400">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>{formatTemperature(current.tempMin, preferences.tempUnit)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Giant Weather Icon & Sunrise/Sunset Card */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-inner">
            <WeatherIcon
              name={current.icon}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
              isDay={current.isDay}
            />
          </div>

          {todayDaily && (
            <div className="flex items-center gap-3 text-xs bg-slate-900/60 border border-slate-800/80 px-3.5 py-2 rounded-xl text-slate-300">
              <div className="flex items-center gap-1.5">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span className="font-mono tabular-nums">
                  {new Date(todayDaily.sunrise).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <Sunset className="w-4 h-4 text-orange-400" />
                <span className="font-mono tabular-nums">
                  {new Date(todayDaily.sunset).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
