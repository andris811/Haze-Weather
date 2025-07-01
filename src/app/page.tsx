"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { fetchCurrentWeather, fetchForecast } from "@/lib/api";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import ForecastCard from "@/components/ForecastCard";
import { WeatherData, ForecastData } from '@/types';


export default function Home() {
  const [weather, setWeather] = useState<null | WeatherData>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastData[]>([]);

  const handleSearch = async (searchCity: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchCurrentWeather(searchCity);
      const forecastData = await fetchForecast(searchCity);
      setWeather(result);
      setForecast(forecastData);
    } catch (err) {
      console.error(err);
      setError("City not found");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Haze</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p className="mt-6 text-blue-500">Loading...</p>}
      {error && <p className="mt-6 text-red-500">{error}</p>}
      {weather && <CurrentWeatherCard data={weather} />}
      {forecast.length > 0 && (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {forecast.map((item, index) => (
            <ForecastCard key={index} data={item} />
          ))}
        </div>
      )}
    </main>
  );
}
