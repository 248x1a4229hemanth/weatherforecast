export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';
export type WindUnit = 'kmh' | 'ms' | 'mph';
export type PressureUnit = 'hPa' | 'mmHg' | 'inHg';
export type ThemeMode = 'dark' | 'light' | 'system' | 'weather';

export interface LocationData {
  id: string | number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string; // State or province
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone: string;
  population?: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts?: number;
  uvIndex: number;
  visibility: number; // in meters or km
  cloudCover: number;
  dewPoint: number;
  precipitation: number;
  weatherCode: number;
  condition: string;
  description: string;
  icon: string;
  isDay: boolean;
  timestamp: string;
  localTime: string;
}

export interface HourlyForecastItem {
  time: string;
  timestamp: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  condition: string;
  icon: string;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  isDay: boolean;
  pressure: number;
}

export interface DailyForecastItem {
  date: string;
  timestamp: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  weatherCode: number;
  condition: string;
  description: string;
  icon: string;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  windDirectionDominant: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  daylightDurationHours: number;
}

export interface AirQualityData {
  aqi: number; // US AQI scale (0-500)
  europeanAqi?: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  summary: string;
  healthAdvice: string;
  pollutants: {
    pm2_5: number;
    pm10: number;
    co: number;
    no2: number;
    so2: number;
    o3: number;
  };
  hourlyAqi: Array<{
    time: string;
    aqi: number;
    pm2_5: number;
    pm10: number;
  }>;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  category: string;
  description: string;
  startTime: string;
  endTime: string;
  precautions: string[];
  source: string;
}

export interface AstronomyData {
  sunrise: string;
  sunset: string;
  daylightProgress: number; // 0 to 1
  isDay: boolean;
  moonPhase: string;
  moonPhaseValue: number; // 0 to 1
  moonIllumination: number; // percentage
  moonrise?: string;
  moonset?: string;
}

export interface WeatherRecommendation {
  type: 'clothing' | 'umbrella' | 'outdoor' | 'sun' | 'travel';
  title: string;
  status: 'positive' | 'neutral' | 'warning' | 'alert';
  message: string;
  icon: string;
}

export interface WeatherInsights {
  highlights: string[];
  recommendations: WeatherRecommendation[];
  summary: string;
}

export interface WeatherReport {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQualityData;
  astronomy: AstronomyData;
  alerts: WeatherAlert[];
  insights: WeatherInsights;
  lastUpdated: string;
  source: string;
}

export interface UserPreferences {
  tempUnit: TemperatureUnit;
  windUnit: WindUnit;
  pressureUnit: PressureUnit;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  defaultLocation: LocationData | null;
  savedLocations: LocationData[];
  recentSearches: LocationData[];
}
