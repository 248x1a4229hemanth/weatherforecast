import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Wind, Droplets, Gauge, Shield, Loader2 } from 'lucide-react';
import { WeatherReport, LocationData } from '../types/weather.js';
import { formatTemperature, formatWindSpeed, formatPressure } from '../utils/units.js';
import { useWeather } from '../context/WeatherContext.js';
import { WeatherIcon } from '../utils/weatherIcons.js';

export const CityComparisonView: React.FC = () => {
  const { preferences, loadLocation, setCurrentView } = useWeather();
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Initial comparison targets
  const [comparisonTargets, setComparisonTargets] = useState<LocationData[]>([
    {
      id: '16.5062,80.648',
      name: 'Vijayawada',
      country: 'India',
      latitude: 16.5062,
      longitude: 80.648,
      timezone: 'Asia/Kolkata',
    },
    {
      id: '51.5074,-0.1278',
      name: 'London',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 'Europe/London',
    },
    {
      id: '40.7128,-74.006',
      name: 'New York',
      country: 'United States',
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
    },
  ]);

  // Load comparison data whenever targets change
  useEffect(() => {
    let isMounted = true;
    async function fetchComparisonData() {
      setLoading(true);
      try {
        const queryStr = JSON.stringify(comparisonTargets);
        const res = await fetch(`/api/weather/compare?targets=${encodeURIComponent(queryStr)}`);
        if (res.ok) {
          const data: WeatherReport[] = await res.json();
          if (isMounted) setReports(data);
        }
      } catch (err) {
        console.error('Comparison fetch failed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchComparisonData();
    return () => {
      isMounted = false;
    };
  }, [comparisonTargets]);

  // Autocomplete search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/weather/geocode?query=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data: LocationData[] = await res.json();
          setSearchResults(data);
        }
      } catch {}
      finally {
        setIsSearching(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddCity = (loc: LocationData) => {
    if (comparisonTargets.some((t) => t.id === loc.id || (Math.abs(t.latitude - loc.latitude) < 0.05 && Math.abs(t.longitude - loc.longitude) < 0.05))) {
      setShowSearchModal(false);
      setSearchQuery('');
      return;
    }
    if (comparisonTargets.length >= 4) {
      // replace last or limit to 4
      setComparisonTargets((prev) => [...prev.slice(0, 3), loc]);
    } else {
      setComparisonTargets((prev) => [...prev, loc]);
    }
    setShowSearchModal(false);
    setSearchQuery('');
  };

  const handleRemoveCity = (index: number) => {
    if (comparisonTargets.length <= 1) return;
    setComparisonTargets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInspectCity = (loc: LocationData) => {
    loadLocation(loc);
    setCurrentView('dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Multi-City Weather Comparison
          </h2>
          <p className="text-xs text-slate-400">
            Compare meteorological indicators, air purity, and temperature across global regions
          </p>
        </div>

        {comparisonTargets.length < 4 && (
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add City to Compare</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs text-slate-400">Gathering comparative sensor telemetry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reports.map((rep, idx) => {
            const { location, current, airQuality } = rep;
            return (
              <div
                key={location.id}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm"
              >
                {/* Remove button */}
                {reports.length > 1 && (
                  <button
                    onClick={() => handleRemoveCity(idx)}
                    className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* City Heading */}
                <div>
                  <h3 className="text-base font-bold text-white truncate pr-6">
                    {location.name}
                  </h3>
                  <div className="text-xs text-slate-400 truncate">
                    {location.admin1 ? `${location.admin1}, ${location.country}` : location.country}
                  </div>
                </div>

                {/* Main Temperature & Condition */}
                <div className="flex items-center justify-between py-2 border-y border-slate-800/80">
                  <div className="space-y-0.5">
                    <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                      {formatTemperature(current.temperature, preferences.tempUnit)}
                    </div>
                    <div className="text-xs text-slate-300 font-medium">{current.condition}</div>
                  </div>
                  <WeatherIcon name={current.icon} className="w-10 h-10" isDay={current.isDay} />
                </div>

                {/* Metrics Matrix */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Wind className="w-3.5 h-3.5 text-teal-400" />
                      <span>Wind</span>
                    </span>
                    <span className="font-mono font-medium">
                      {formatWindSpeed(current.windSpeed, preferences.windUnit)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>Humidity</span>
                    </span>
                    <span className="font-mono font-medium">{current.humidity}%</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Pressure</span>
                    </span>
                    <span className="font-mono font-medium">
                      {formatPressure(current.pressure, preferences.pressureUnit)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Shield className="w-3.5 h-3.5" style={{ color: airQuality?.color || '#10b981' }} />
                      <span>Air Quality</span>
                    </span>
                    <span className="font-mono font-bold" style={{ color: airQuality?.color || '#10b981' }}>
                      AQI {airQuality?.aqi || 35}
                    </span>
                  </div>
                </div>

                {/* View on Dashboard action */}
                <button
                  onClick={() => handleInspectCity(location)}
                  className="w-full mt-2 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
                >
                  Set as Active Dashboard City
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add City Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Add City to Comparison</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city name (e.g. Paris, Sydney, Dubai)..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-800">
              {isSearching && (
                <div className="py-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Searching locations...</span>
                </div>
              )}
              {searchResults.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleAddCity(loc)}
                  className="w-full py-2.5 px-2 text-left hover:bg-slate-800 rounded-md transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{loc.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
