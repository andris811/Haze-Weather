import { WeatherData, ForecastData } from "@/types";

type ForecastAPIItem = {
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

export async function fetchCurrentWeather(
  city: string,
  unit: "metric" | "imperial"
): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=${unit}`
  );

  if (!res.ok) {
    throw new Error("City not found");
  }

  const data = await res.json();

  return {
    city: data.name,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    minTemp: Math.round(data.main.temp_min),
    maxTemp: Math.round(data.main.temp_max),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind?.speed || data.wind.speed),
    icon: data.weather[0].icon,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
  };
}

export async function fetchForecast(
  city: string,
  unit: "metric" | "imperial"
): Promise<ForecastData[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=${unit}`
  );

  if (!res.ok) {
    throw new Error("Forecast not found");
  }

  const data = await res.json();
  const list = data.list as ForecastAPIItem[];

  const grouped: { [date: string]: ForecastAPIItem[] } = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  return Object.entries(grouped)
    .slice(1, 6)
    .map(([, items]) => {
      const temps = items.map((i) => i.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));
      const midday =
        items.find((i) => i.dt_txt.includes("12:00:00")) || items[0];

      return {
        date: midday.dt_txt,
        minTemp,
        maxTemp,
        description: midday.weather[0].description,
        icon: midday.weather[0].icon,
      };
    });
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  unit: "metric" | "imperial"
): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
  );

  if (!res.ok) throw new Error("Weather data not found for coordinates");

  const data = await res.json();

  return {
    city: data.name,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    minTemp: Math.round(data.main.temp_min),
    maxTemp: Math.round(data.main.temp_max),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    icon: data.weather[0].icon,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
  };
}

export async function fetchForecastByCoords(
  lat: number,
  lon: number,
  unit: "metric" | "imperial"
): Promise<ForecastData[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
  );

  if (!res.ok) {
    throw new Error("Forecast not found for coordinates");
  }

  const data = await res.json();
  const list = data.list as ForecastAPIItem[];

  const grouped: { [date: string]: ForecastAPIItem[] } = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  return Object.entries(grouped)
    .slice(1, 6)
    .map(([, items]) => {
      const temps = items.map((i) => i.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));
      const midday =
        items.find((i) => i.dt_txt.includes("12:00:00")) || items[0];

      return {
        date: midday.dt_txt,
        minTemp,
        maxTemp,
        description: midday.weather[0].description,
        icon: midday.weather[0].icon,
      };
    });
}