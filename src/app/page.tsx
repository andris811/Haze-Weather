"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchCurrentWeatherByCoords,
  fetchForecastByCoords,
} from "@/lib/api";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import ForecastCard from "@/components/ForecastCard";
import { WeatherData, ForecastData } from "@/types";

export default function Home() {
  // Load last searched city from localStorage (on first render only)
  const [city, setCity] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lastCity") || "";
    }
    return "";
  });

  const [weather, setWeather] = useState<null | WeatherData>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  // On initial load: get saved unit or auto-detect from locale
  useEffect(() => {
    const savedUnit = localStorage.getItem("unit") as
      | "metric"
      | "imperial"
      | null;

    if (savedUnit) {
      setUnit(savedUnit);
    } else {
      const userLocale = navigator.language;
      const autoUnit = userLocale === "en-US" ? "imperial" : "metric";
      setUnit(autoUnit);
      localStorage.setItem("unit", autoUnit);
    }
  }, []);

  // Auto-fetch user location on first load (only if no city saved)
  useEffect(() => {
    if (!city && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true);
          setError("");

          try {
            const result = await fetchCurrentWeatherByCoords(latitude, longitude, unit);
            const forecastData = await fetchForecastByCoords(latitude, longitude, unit);
            setCity(result.city);
            setWeather(result);
            setForecast(forecastData);
            localStorage.setItem("lastCity", result.city);
          } catch (err) {
            console.error(err);
            setError("Could not fetch weather for your location.");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.warn("Geolocation failed:", err);
          // No city fallback, wait for manual search
        }
      );
    }
  }, [city, unit]);

  // Persist unit setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("unit", unit);
  }, [unit]);

  // Search for city and fetch current + forecast data
  const handleSearch = useCallback(
    async (searchCity: string) => {
      setCity(searchCity);
      localStorage.setItem("lastCity", searchCity); // Save to localStorage
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

  // When unit changes and city is known, re-fetch weather data
  useEffect(() => {
    if (city) {
      handleSearch(city);
    }
  }, [unit, city, handleSearch]);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Haze</h1>

      {/* Unit switcher */}
      <div className="mb-4 flex justify-center items-center gap-4 text-sm">
        <span
          className={`${
            unit === "metric" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          °C
        </span>

        <button
          onClick={() =>
            setUnit((prev) => (prev === "metric" ? "imperial" : "metric"))
          }
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

      {/* Instructions for first-time users */}
      {!city && !loading && !weather && (
        <p className="mt-6 text-gray-600">Enter a city name to begin.</p>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="mt-6 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Display error message if any */}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      {/* Show current weather if data is available */}
      {weather && <CurrentWeatherCard data={weather} unit={unit} />}

      {/* Show 5-day forecast */}
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
