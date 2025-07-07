"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const handleSearch = useCallback(
    async (searchCity: string) => {
      setCity(searchCity);
      setLoading(true);
      setError("");
      try {
        const result = await fetchCurrentWeather(searchCity, unit);
        const forecastData = await fetchForecast(searchCity, unit);
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
    },
    [unit]
  );

  useEffect(() => {
    if (city) {
      handleSearch(city); // Re-fetch data with new unit
    }
  }, [unit, city, handleSearch]);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Haze</h1>
      <div className="mb-4 flex justify-center items-center gap-4 text-sm">
        <span
          className={`${
            unit === "metric" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          °C
        </span>

        <button
          onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
          className="w-12 h-6 rounded-full relative bg-gray-300 flex items-center px-1"
          aria-label="Toggle temperature unit"
        >
          <span
            className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
              unit === "metric" ? "translate-x-0" : "translate-x-6"
            }`}
          />
        </button>

        <span
          className={`${
            unit === "imperial" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          °F
        </span>
      </div>

      <SearchBar onSearch={handleSearch} />

      {!city && !loading && !weather && (
        <p className="mt-6 text-gray-600">Enter a city name to begin.</p>
      )}

      {loading && (
        <div className="mt-6 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {error && <p className="mt-6 text-red-500">{error}</p>}

      {weather && <CurrentWeatherCard data={weather} unit={unit} />}

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
