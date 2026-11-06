import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Play, Pause, RotateCcw, Layers, MapPin, Loader2 } from 'lucide-react';
import { LocationData, CurrentWeather } from '../types/weather.js';
import { formatTemperature } from '../utils/units.js';
import { useWeather } from '../context/WeatherContext.js';

interface WeatherMapLeafletProps {
  location: LocationData;
  current: CurrentWeather;
}

interface RadarData {
  host: string;
  radar: {
    past: Array<{ time: number; path: string }>;
    nowcast: Array<{ time: number; path: string }>;
  };
}

export const WeatherMapLeaflet: React.FC<WeatherMapLeafletProps> = ({ location, current }) => {
  const { preferences } = useWeather();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [radarData, setRadarData] = useState<RadarData | null>(null);
  const [frames, setFrames] = useState<Array<{ time: number; path: string }>>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingRadar, setIsLoadingRadar] = useState<boolean>(true);
  const [baseMapType, setBaseMapType] = useState<'dark' | 'standard'>('dark');
  const [radarOpacity, setRadarOpacity] = useState<number>(0.75);

  // 1. Fetch live radar timestamps from backend
  useEffect(() => {
    let isMounted = true;
    async function loadRadarInfo() {
      try {
        setIsLoadingRadar(true);
        const res = await fetch('/api/weather/radar');
        if (res.ok) {
          const data: RadarData = await res.json();
          if (isMounted) {
            setRadarData(data);
            const allFrames = [...(data.radar?.past || []), ...(data.radar?.nowcast || [])];
            setFrames(allFrames);
            if (allFrames.length > 0) {
              setCurrentFrameIndex(allFrames.length - 1); // default to most recent frame
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load radar info:', err);
      } finally {
        if (isMounted) setIsLoadingRadar(false);
      }
    }
    loadRadarInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 7,
        zoomControl: true,
        attributionControl: false,
      });

      // Add base tile layer
      const baseTileUrl =
        baseMapType === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const baseLayer = L.tileLayer(baseTileUrl, {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom pulse marker for current selected city
      const customIcon = L.divIcon({
        className: 'custom-weather-pin',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(56, 189, 248, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 14px; height: 14px; border-radius: 50%; background: #38bdf8; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.5);"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="color: #0f172a; padding: 4px; font-family: system-ui;">
          <div style="font-weight: 700; font-size: 14px;">${location.name}</div>
          <div style="font-size: 12px; color: #475569;">${current.condition} · ${formatTemperature(current.temperature, preferences.tempUnit)}</div>
        </div>
      `);

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      // Update center & marker
      mapInstanceRef.current.setView([location.latitude, location.longitude], 7);
      if (markerRef.current) {
        markerRef.current.setLatLng([location.latitude, location.longitude]);
        markerRef.current.setPopupContent(`
          <div style="color: #0f172a; padding: 4px; font-family: system-ui;">
            <div style="font-weight: 700; font-size: 14px;">${location.name}</div>
            <div style="font-size: 12px; color: #475569;">${current.condition} · ${formatTemperature(current.temperature, preferences.tempUnit)}</div>
          </div>
        `);
      }
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.latitude, location.longitude, baseMapType]);

  // 3. Update or render Radar Overlay tile layer
  useEffect(() => {
    if (!mapInstanceRef.current || !radarData || frames.length === 0) return;

    const frame = frames[currentFrameIndex];
    if (!frame) return;

    if (radarLayerRef.current) {
      mapInstanceRef.current.removeLayer(radarLayerRef.current);
    }

    const host = radarData.host || 'https://tilecache.rainviewer.com';
    const radarTileUrl = `${host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;

    const newRadarLayer = L.tileLayer(radarTileUrl, {
      opacity: radarOpacity,
      zIndex: 100,
    }).addTo(mapInstanceRef.current);

    radarLayerRef.current = newRadarLayer;
  }, [radarData, currentFrameIndex, radarOpacity, frames]);

  // 4. Radar Animation loop
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, 700);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  const activeTimestamp = frames[currentFrameIndex]?.time;
  const timeString = activeTimestamp
    ? new Date(activeTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Live Radar';

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Live Doppler Radar & Precipitation Overlay
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time radar reflection frames provided by RainViewer Global Array
          </p>
        </div>

        {/* Base map style toggle & opacity */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setBaseMapType('dark')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                baseMapType === 'dark' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Dark Map
            </button>
            <button
              onClick={() => setBaseMapType('standard')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                baseMapType === 'standard' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Street Map
            </button>
          </div>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-800">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Loading Overlay */}
        {isLoadingRadar && (
          <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 backdrop-blur-md">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Buffering radar tiles...</span>
          </div>
        )}

        {/* Radar Controls Bar Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-slate-950/90 border border-slate-800/90 rounded-xl p-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              title={isPlaying ? 'Pause radar playback' : 'Play radar animation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCurrentFrameIndex(0)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset to earliest frame"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 pl-2">
              <span className="font-semibold text-white font-mono">{timeString}</span>
              <span className="text-[10px] text-slate-400">
                Frame {currentFrameIndex + 1}/{frames.length || 1}
              </span>
            </div>
          </div>

          {/* Opacity slider */}
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[11px] text-slate-400">Radar Intensity:</span>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={radarOpacity}
              onChange={(e) => setRadarOpacity(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
