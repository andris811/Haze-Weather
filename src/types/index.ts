export type WeatherData = {
  city: string;
  temperature: number;
  minTemp: number;
  maxTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
};

export type ForecastData = {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
};
