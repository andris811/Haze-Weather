// export async function fetchCurrentWeather(city: string) {
//   const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
//   const res = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
//       city
//     )}&appid=${apiKey}&units=metric`
//   );

//   if (!res.ok) {
//     throw new Error("City not found");
//   }

//   const data = await res.json();

//   return {
//     city: data.name,
//     temperature: Math.round(data.main.temp),
//     description: data.weather[0].description,
//     humidity: data.main.humidity,
//     windSpeed: Math.round(data.wind.speed),
//     icon: data.weather[0].icon,
//   };
// }

// type ForecastAPIItem = {
//   dt_txt: string;
//   main: {
//     temp: number;
//   };
//   weather: {
//     description: string;
//     icon: string;
//   }[];
// };

// export async function fetchForecast(city: string) {
//   const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
//   const res = await fetch(
//     `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
//       city
//     )}&appid=${apiKey}&units=metric`
//   );

//   if (!res.ok) {
//     throw new Error("Forecast not found");
//   }

//   const data = await res.json();

//   // Apply types here:
//   const daily = (data.list as ForecastAPIItem[]).filter((item) =>
//     item.dt_txt.includes("12:00:00")
//   );

//   return daily.map((item) => ({
//     date: item.dt_txt,
//     temperature: Math.round(item.main.temp),
//     description: item.weather[0].description,
//     icon: item.weather[0].icon,
//   }));
// }

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

export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`
  );

  if (!res.ok) {
    throw new Error("City not found");
  }

  const data = await res.json();

  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    minTemp: Math.round(data.main.temp_min),
    maxTemp: Math.round(data.main.temp_max),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.main.wind?.speed || data.wind.speed),
    icon: data.weather[0].icon,
  };
}

export async function fetchForecast(city: string): Promise<ForecastData[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`
  );

  if (!res.ok) {
    throw new Error("Forecast not found");
  }

  const data = await res.json();
  const list = data.list as ForecastAPIItem[];

  // Group forecast items by day
  const grouped: { [date: string]: ForecastAPIItem[] } = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  // Create ForecastData[] with real min/max and midday icon/description
  const forecast: ForecastData[] = Object.entries(grouped)
    .slice(1, 6) // Only next 5 days
    .map(([, items]) => {
      const temps = items.map((i) => i.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));

      // Try to find the 12:00 entry
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

  return forecast;
}
