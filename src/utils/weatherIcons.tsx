import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudHail,
  SunMedium,
  Wind,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  isDay?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  className = 'w-6 h-6',
  isDay = true,
}) => {
  switch (name) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400`} />;
    case 'SunMedium':
      return <SunMedium className={`${className} text-amber-400`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-300`} />;
    case 'CloudMoon':
      return <CloudMoon className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-sky-400`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${className} text-blue-500`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-cyan-200`} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-cyan-200`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-yellow-400`} />;
    case 'CloudHail':
      return <CloudHail className={`${className} text-indigo-300`} />;
    case 'Wind':
      return <Wind className={`${className} text-teal-400`} />;
    default:
      return isDay ? (
        <Sun className={`${className} text-amber-400`} />
      ) : (
        <Moon className={`${className} text-indigo-300`} />
      );
  }
};
