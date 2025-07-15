export type WeatherData = {
  city: string;
  country?: string;
  temperature: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  sunrise: number;  // UNIX UTC
  sunset: number;   // UNIX UTC
  timezone: number; // UTC offset in seconds
};


export type ForecastData = {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
};

export type FavoriteCity = {
  city: string;
  coords: { lat: number; lon: number };
};