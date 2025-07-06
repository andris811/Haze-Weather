"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { fetchCurrentWeather, fetchForecast } from "@/lib/api";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import ForecastCard from "@/components/ForecastCard";
import { WeatherData, ForecastData } from "@/types";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<null | WeatherData>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastData[]>([]);

  const handleSearch = async (searchCity: string) => {
    setCity(searchCity);
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
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Haze</h1>
      <SearchBar onSearch={handleSearch} />

      {/* Empty state */}
      {!city && !loading && !weather && (
        <p className="mt-6 text-gray-600">Enter a city name to begin.</p>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="mt-6 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Error */}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      {/* Current weather */}
      {weather && <CurrentWeatherCard data={weather} />}

      {/* Forecast cards */}
      {forecast.length > 0 && (
        <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-4 max-w-5xl mx-auto px-4">
          {forecast.map((item, index) => (
            <ForecastCard key={index} data={item} />
          ))}
        </div>
      )}
    </main>
  );
}
