import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  History,
  Compass,
  X,
  Loader2,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext.js';
import { LocationData } from '../types/weather.js';
import { PWAInstallButton } from './PWAInstallButton.js';

export const Navbar: React.FC = () => {
  const {
    report,
    loading,
    refresh,
    loadLocation,
    useCurrentGpsLocation,
    preferences,
    updatePreferences,
  } = useWeather();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/weather/geocode?query=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data: LocationData[] = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationData) => {
    loadLocation(loc);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const toggleTemperatureUnit = () => {
    const nextUnit = preferences.tempUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    updatePreferences({ tempUnit: nextUnit });
  };

  const toggleTheme = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    updatePreferences({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center shadow-md shadow-cyan-900/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Weather<span className="text-cyan-400">Sphere</span>
          </span>
        </div>

        {/* Search Bar Zone */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search worldwide city, state, or postal..."
              className="w-full pl-9 pr-20 py-1.5 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-12 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={useCurrentGpsLocation}
              title="Use current GPS location"
              className="absolute right-1.5 p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-1.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 shadow-xl overflow-hidden z-50 text-xs text-slate-200 divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
              {isSearching && (
                <div className="flex items-center gap-2 px-3 py-2 text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching meteorological coordinates...</span>
                </div>
              )}

              {/* Live search results */}
              {results.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Locations Found
                  </div>
                  {results.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-medium text-slate-100 group-hover:text-cyan-300 truncate">
                          {loc.name}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate">
                          {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 tabular-nums shrink-0 ml-2">
                        {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* No results notice */}
              {!isSearching && searchQuery.length >= 2 && results.length === 0 && (
                <div className="px-3 py-2.5 text-center text-slate-400">
                  No cities found matching "{searchQuery}"
                </div>
              )}

              {/* Recent searches fallback */}
              {searchQuery.length < 2 && preferences.recentSearches.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3 h-3" />
                    <span>Recent Searches</span>
                  </div>
                  {preferences.recentSearches.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => handleSelectLocation(rec)}
                      className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <span className="font-medium text-slate-200 truncate">{rec.name}</span>
                      <span className="text-[11px] text-slate-400 truncate">{rec.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Temperature Unit Toggle */}
          <button
            onClick={toggleTemperatureUnit}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors whitespace-nowrap"
            title="Toggle Temperature Unit"
          >
            {preferences.tempUnit === 'celsius' ? '°C' : preferences.tempUnit === 'fahrenheit' ? '°F' : 'K'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Refresh Action */}
          <button
            onClick={refresh}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors disabled:opacity-50"
            title="Refresh Meteorological Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* In-App PWA Install */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
