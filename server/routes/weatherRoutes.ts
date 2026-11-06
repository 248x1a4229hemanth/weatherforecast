import { Router, Request, Response } from 'express';
import {
  fetchWeatherReport,
  searchLocations,
  reverseGeocode,
} from '../services/weatherService.js';
import { LocationData } from '../../src/types/weather.js';

export const weatherRouter = Router();

// Default coordinates: Vijayawada, India (from project brief) as primary reference
const DEFAULT_LAT = 16.5062;
const DEFAULT_LON = 80.6480;
const DEFAULT_NAME = 'Vijayawada';
const DEFAULT_COUNTRY = 'India';

// GET /api/weather/report
weatherRouter.get('/report', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : DEFAULT_LAT;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : DEFAULT_LON;

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude coordinates' });
    }

    const customLoc: Partial<LocationData> = {
      name: (req.query.name as string) || (lat === DEFAULT_LAT && lon === DEFAULT_LON ? DEFAULT_NAME : undefined),
      country: (req.query.country as string) || (lat === DEFAULT_LAT && lon === DEFAULT_LON ? DEFAULT_COUNTRY : undefined),
      admin1: (req.query.admin1 as string) || undefined,
      countryCode: (req.query.countryCode as string) || undefined,
    };

    const report = await fetchWeatherReport(lat, lon, customLoc);
    return res.json(report);
  } catch (error: any) {
    console.error('Error fetching weather report:', error);
    return res.status(500).json({
      error: 'Failed to retrieve meteorological data',
      message: error?.message || 'Unknown upstream service error',
    });
  }
});

// GET /api/weather/current
weatherRouter.get('/current', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : DEFAULT_LAT;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : DEFAULT_LON;
    const report = await fetchWeatherReport(lat, lon);
    return res.json(report.current);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Error fetching current weather' });
  }
});

// GET /api/weather/forecast
weatherRouter.get('/forecast', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : DEFAULT_LAT;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : DEFAULT_LON;
    const report = await fetchWeatherReport(lat, lon);
    return res.json({
      hourly: report.hourly,
      daily: report.daily,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Error fetching forecast' });
  }
});

// GET /api/weather/air-quality
weatherRouter.get('/air-quality', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : DEFAULT_LAT;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : DEFAULT_LON;
    const report = await fetchWeatherReport(lat, lon);
    return res.json(report.airQuality);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Error fetching air quality' });
  }
});

// GET /api/weather/alerts
weatherRouter.get('/alerts', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : DEFAULT_LAT;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : DEFAULT_LON;
    const report = await fetchWeatherReport(lat, lon);
    return res.json(report.alerts);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Error fetching alerts' });
  }
});

// GET /api/weather/geocode
weatherRouter.get('/geocode', async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }
    const locations = await searchLocations(query);
    return res.json(locations);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Geocoding failed' });
  }
});

// GET /api/weather/reverse-geocode
weatherRouter.get('/reverse-geocode', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Valid latitude and longitude required' });
    }
    const loc = await reverseGeocode(lat, lon);
    return res.json(loc);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Reverse geocoding failed' });
  }
});

// GET /api/weather/compare
weatherRouter.get('/compare', async (req: Request, res: Response) => {
  try {
    const targetsStr = req.query.targets as string;
    if (!targetsStr) {
      // Default comparison set: Vijayawada, London, New York, Tokyo
      const defaultCities = [
        { lat: 16.5062, lon: 80.6480, name: 'Vijayawada', country: 'India' },
        { lat: 51.5074, lon: -0.1278, name: 'London', country: 'United Kingdom' },
        { lat: 40.7128, lon: -74.0060, name: 'New York', country: 'United States' },
        { lat: 35.6762, lon: 139.6503, name: 'Tokyo', country: 'Japan' },
      ];
      const reports = await Promise.all(
        defaultCities.map((c) => fetchWeatherReport(c.lat, c.lon, c))
      );
      return res.json(reports);
    }

    const parsedTargets = JSON.parse(targetsStr);
    if (!Array.isArray(parsedTargets) || parsedTargets.length === 0) {
      return res.status(400).json({ error: 'targets must be an array of locations' });
    }

    const reports = await Promise.all(
      parsedTargets.slice(0, 5).map((t: any) =>
        fetchWeatherReport(t.latitude || t.lat, t.longitude || t.lon, {
          name: t.name,
          country: t.country,
          admin1: t.admin1,
        })
      )
    );

    return res.json(reports);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'City comparison query failed' });
  }
});

// GET /api/weather/radar
weatherRouter.get('/radar', async (_req: Request, res: Response) => {
  try {
    const radarRes = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
      headers: { 'User-Agent': 'WeatherSphere/1.0' },
    });
    if (!radarRes.ok) {
      throw new Error(`RainViewer HTTP ${radarRes.status}`);
    }
    const data = await radarRes.json();
    return res.json(data);
  } catch (error: any) {
    console.warn('Radar info fetch error, returning fallback:', error.message);
    return res.json({
      host: 'https://tilecache.rainviewer.com',
      radar: {
        past: [],
        nowcast: [],
      },
    });
  }
});

// GET /api/weather/config
weatherRouter.get('/config', (_req: Request, res: Response) => {
  res.json({
    name: 'WeatherSphere Meteorological Core',
    version: '2.5.0',
    primaryProvider: 'Open-Meteo & WMO World Meteorological Network',
    openWeatherKeyConfigured: Boolean(process.env.OPENWEATHER_API_KEY),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    features: {
      highResForecast: true,
      airQualityIndex: true,
      severeAlerts: true,
      animatedRadar: true,
      astronomyEngine: true,
      cityComparison: true,
      offlinePwaSupport: true,
    },
  });
});
