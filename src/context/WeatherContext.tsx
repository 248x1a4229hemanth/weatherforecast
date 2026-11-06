import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WeatherReport,
  LocationData,
  UserPreferences,
  TemperatureUnit,
  WindUnit,
  PressureUnit,
  ThemeMode,
} from '../types/weather.js';

interface WeatherContextType {
  report: WeatherReport | null;
  loading: boolean;
  error: string | null;
  currentView: string;
  preferences: UserPreferences;
  isOffline: boolean;
  cachedAt: string | null;
  setCurrentView: (view: string) => void;
  loadLocation: (loc: LocationData) => Promise<void>;
  loadCoordinates: (lat: number, lon: number, name?: string, country?: string) => Promise<void>;
  useCurrentGpsLocation: () => Promise<void>;
  refresh: () => Promise<void>;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  toggleFavorite: (loc: LocationData) => void;
  isFavorite: (id: string | number) => boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  pressureUnit: 'hPa',
  theme: 'dark',
  notificationsEnabled: false,
  defaultLocation: null,
  savedLocations: [
    {
      id: '16.5062,80.648',
      name: 'Vijayawada',
      country: 'India',
      admin1: 'Andhra Pradesh',
      latitude: 16.5062,
      longitude: 80.648,
      timezone: 'Asia/Kolkata',
    },
    {
      id: '51.5074,-0.1278',
      name: 'London',
      country: 'United Kingdom',
      admin1: 'England',
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 'Europe/London',
    },
    {
      id: '40.7128,-74.006',
      name: 'New York',
      country: 'United States',
      admin1: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
    },
    {
      id: '35.6762,139.6503',
      name: 'Tokyo',
      country: 'Japan',
      admin1: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
      timezone: 'Asia/Tokyo',
    },
  ],
  recentSearches: [],
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [report, setReport] = useState<WeatherReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [cachedAt, setCachedAt] = useState<string | null>(null);

  // Initialize preferences from localStorage
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem('weathersphere_prefs');
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PREFERENCES;
  });

  // Keep localStorage updated with preferences
  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('weathersphere_prefs', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return updated;
    });
  }, []);

  // Theme synchronization with documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (preferences.theme === 'light') {
      root.classList.remove('dark');
    } else if (preferences.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (preferences.theme === 'weather' && report) {
      // Dynamic theme based on day/night or weather condition
      if (report.current.isDay && (report.current.weatherCode <= 1)) {
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
      }
    }
  }, [preferences.theme, report]);

  // Online / Offline tracking
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch weather report from backend
  const fetchReport = useCallback(
    async (lat: number, lon: number, customName?: string, country?: string, admin1?: string) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
      });
      if (customName) params.append('name', customName);
      if (country) params.append('country', country);
      if (admin1) params.append('admin1', admin1);

      try {
        const res = await fetch(`/api/weather/report?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Weather server returned HTTP ${res.status}`);
        }
        const data: WeatherReport = await res.json();
        setReport(data);
        setCachedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        // Cache last valid report in localStorage for offline fallback
        try {
          localStorage.setItem('weathersphere_cached_report', JSON.stringify(data));
          localStorage.setItem('weathersphere_cached_timestamp', new Date().toISOString());
        } catch {
          // ignore storage quota error
        }

        // Add to recent searches if named
        if (customName) {
          const newEntry: LocationData = {
            id: `${lat},${lon}`,
            name: customName,
            country: country || '',
            admin1: admin1 || '',
            latitude: lat,
            longitude: lon,
            timezone: data.location.timezone,
          };
          setPreferencesState((prev) => {
            const filtered = prev.recentSearches.filter(
              (r) => r.name.toLowerCase() !== customName.toLowerCase()
            );
            const updatedRecent = [newEntry, ...filtered].slice(0, 8);
            const updated = { ...prev, recentSearches: updatedRecent };
            try {
              localStorage.setItem('weathersphere_prefs', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      } catch (err: any) {
        console.error('Fetch weather failed:', err);
        // Attempt to load cached report from localStorage if offline or fetch failed
        try {
          const cached = localStorage.getItem('weathersphere_cached_report');
          const cacheTime = localStorage.getItem('weathersphere_cached_timestamp');
          if (cached) {
            setReport(JSON.parse(cached));
            setCachedAt(
              cacheTime
                ? new Date(cacheTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Earlier'
            );
            setError('Using saved weather data. Please check your network connection.');
            return;
          }
        } catch {}
        setError(err?.message || 'Unable to load weather forecast. Please retry.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadLocation = useCallback(
    async (loc: LocationData) => {
      await fetchReport(loc.latitude, loc.longitude, loc.name, loc.country, loc.admin1);
    },
    [fetchReport]
  );

  const loadCoordinates = useCallback(
    async (lat: number, lon: number, name?: string, country?: string) => {
      await fetchReport(lat, lon, name, country);
    },
    [fetchReport]
  );

  const useCurrentGpsLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode to get city name
          const res = await fetch(`/api/weather/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const loc: LocationData = await res.json();
            await fetchReport(latitude, longitude, loc.name, loc.country, loc.admin1);
          } else {
            await fetchReport(latitude, longitude, 'My Location');
          }
        } catch {
          await fetchReport(latitude, longitude, 'My Location');
        }
      },
      (geoErr) => {
        setLoading(false);
        console.warn('Geolocation error:', geoErr);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError('Location access was denied. Showing default location.');
        } else {
          setError('Could not retrieve GPS coordinates.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [fetchReport]);

  const refresh = useCallback(async () => {
    if (report) {
      await fetchReport(
        report.location.latitude,
        report.location.longitude,
        report.location.name,
        report.location.country,
        report.location.admin1
      );
    } else {
      await fetchReport(16.5062, 80.6480, 'Vijayawada', 'India');
    }
  }, [report, fetchReport]);

  // Initial load
  useEffect(() => {
    const initialLoc = preferences.defaultLocation || {
      name: 'Vijayawada',
      country: 'India',
      latitude: 16.5062,
      longitude: 80.6480,
    };
    fetchReport(initialLoc.latitude, initialLoc.longitude, initialLoc.name, initialLoc.country);
  }, []);

  const toggleFavorite = useCallback((loc: LocationData) => {
    setPreferencesState((prev) => {
      const exists = prev.savedLocations.some(
        (s) =>
          s.id === loc.id ||
          (Math.abs(s.latitude - loc.latitude) < 0.01 &&
            Math.abs(s.longitude - loc.longitude) < 0.01)
      );
      let updatedList: LocationData[];
      if (exists) {
        updatedList = prev.savedLocations.filter(
          (s) =>
            s.id !== loc.id &&
            (Math.abs(s.latitude - loc.latitude) >= 0.01 ||
              Math.abs(s.longitude - loc.longitude) >= 0.01)
        );
      } else {
        updatedList = [...prev.savedLocations, loc];
      }
      const updated = { ...prev, savedLocations: updatedList };
      try {
        localStorage.setItem('weathersphere_prefs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string | number) => {
      return preferences.savedLocations.some(
        (s) =>
          s.id === id ||
          (report &&
            Math.abs(s.latitude - report.location.latitude) < 0.01 &&
            Math.abs(s.longitude - report.location.longitude) < 0.01)
      );
    },
    [preferences.savedLocations, report]
  );

  return (
    <WeatherContext.Provider
      value={{
        report,
        loading,
        error,
        currentView,
        preferences,
        isOffline,
        cachedAt,
        setCurrentView,
        loadLocation,
        loadCoordinates,
        useCurrentGpsLocation,
        refresh,
        updatePreferences,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
