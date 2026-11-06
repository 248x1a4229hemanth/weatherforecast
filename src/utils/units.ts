import { TemperatureUnit, WindUnit, PressureUnit } from '../types/weather.js';

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  if (unit === 'kelvin') {
    return Math.round(celsius + 273.15);
  }
  return Math.round(celsius);
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const converted = convertTemperature(celsius, unit);
  if (unit === 'fahrenheit') return `${converted}°F`;
  if (unit === 'kelvin') return `${converted} K`;
  return `${converted}°C`;
}

export function convertWindSpeed(kmh: number, unit: WindUnit): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  if (unit === 'ms') {
    return Math.round((kmh / 3.6) * 10) / 10;
  }
  return Math.round(kmh);
}

export function formatWindSpeed(kmh: number, unit: WindUnit): string {
  const converted = convertWindSpeed(kmh, unit);
  if (unit === 'mph') return `${converted} mph`;
  if (unit === 'ms') return `${converted} m/s`;
  return `${converted} km/h`;
}

export function convertPressure(hpa: number, unit: PressureUnit): number {
  if (unit === 'mmHg') {
    return Math.round(hpa * 0.750062);
  }
  if (unit === 'inHg') {
    return Math.round((hpa * 0.02953) * 100) / 100;
  }
  return Math.round(hpa);
}

export function formatPressure(hpa: number, unit: PressureUnit): string {
  const converted = convertPressure(hpa, unit);
  if (unit === 'mmHg') return `${converted} mmHg`;
  if (unit === 'inHg') return `${converted} inHg`;
  return `${converted} hPa`;
}

export function getWindDirectionCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}
