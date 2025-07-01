export type WeatherData = {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
};

export type ForecastData = {
  date: string;
  temperature: number;
  description: string;
  icon: string;
};
