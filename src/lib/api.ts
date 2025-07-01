export async function fetchCurrentWeather(city: string) {
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
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    icon: data.weather[0].icon,
  };
}

type ForecastAPIItem = {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

export async function fetchForecast(city: string) {
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

  // Apply types here:
  const daily = (data.list as ForecastAPIItem[]).filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  return daily.map((item) => ({
    date: item.dt_txt,
    temperature: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
  }));
}
