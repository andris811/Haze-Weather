"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCoords,
} from "@/lib/api";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import ForecastCard from "@/components/ForecastCard";
import { WeatherData, ForecastData } from "@/types";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<null | WeatherData>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geoError, setGeoError] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Load unit from localStorage or use locale
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

  useEffect(() => {
    localStorage.setItem("unit", unit);
  }, [unit]);

  const handleSearch = useCallback(
    async (
      searchCity: string,
      coords?: { lat: number; lon: number } | null
    ) => {
      setCity(searchCity);
      localStorage.setItem("lastCity", searchCity);

      if (coords) {
        localStorage.setItem("lastCoords", JSON.stringify(coords));
        localStorage.setItem("lastLat", coords.lat.toString());
        localStorage.setItem("lastLon", coords.lon.toString());
      } else {
        localStorage.removeItem("lastCoords");
        localStorage.removeItem("lastLat");
        localStorage.removeItem("lastLon");
      }

      setLoading(true);
      setError("");
      setGeoError("");
      setForecast([]);

      try {
        const weatherData = coords
          ? await fetchWeatherByCoords(coords.lat, coords.lon, unit)
          : await fetchCurrentWeather(searchCity, unit);

        const forecastData = await fetchForecast(weatherData.city, unit);

        setWeather(weatherData);
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

  const getDistance = (
    coord1: { lat: number; lon: number },
    coord2: { lat: number; lon: number }
  ): number => {
    const R = 6371;
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLon = (coord2.lon - coord1.lon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * (Math.PI / 180)) *
        Math.cos(coord2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const checkLocation = useCallback(async () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoError("Geolocation not supported");
      return;
    }

    setIsDetectingLocation(true);
    setGeoError("");

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      const currentCoords = { lat: latitude, lon: longitude };
      const weatherData = await fetchWeatherByCoords(latitude, longitude, unit);
      const currentCity = weatherData.city;

      const savedCity = localStorage.getItem("lastCity");
      const savedCoords = localStorage.getItem("lastCoords");

      const prevCoords = savedCoords ? JSON.parse(savedCoords) : null;
      const distance = prevCoords
        ? getDistance(prevCoords, currentCoords)
        : 100;

      if (!savedCity) {
        localStorage.setItem("lastCity", currentCity);
        localStorage.setItem("lastCoords", JSON.stringify(currentCoords));
        setCity(""); // <-- force refresh
        handleSearch(currentCity, currentCoords);
      } else {
        const confirmSwitch =
          distance > 1
            ? window.confirm(
                `You're currently in ${currentCity}. Switch to this location?`
              )
            : false;

        if (confirmSwitch) {
          localStorage.setItem("lastCity", currentCity);
          localStorage.setItem("lastCoords", JSON.stringify(currentCoords));
          setCity(""); // <-- force refresh
          handleSearch(currentCity, currentCoords);
        } else {
          setCity(""); // <-- force refresh anyway
          handleSearch(currentCity, currentCoords);
        }
      }
    } catch (err) {
      const error = err as GeolocationPositionError;
      console.warn("Geolocation failed:", error);

      let errorMessage = "Couldn't get your location.";
      if (error.code === 1) {
        errorMessage =
          "Location permission denied. Please enable it in your browser settings.";
      } else if (error.code === 2) {
        errorMessage =
          "Location unavailable. Check your internet or GPS connection.";
      } else if (error.code === 3) {
        errorMessage = "Location request timed out. Please try again.";
      }

      setGeoError(errorMessage);

      const fallbackCity = localStorage.getItem("lastCity");
      if (fallbackCity) handleSearch(fallbackCity);
    } finally {
      setIsDetectingLocation(false);
    }
  }, [unit, handleSearch]);

  // On first load: load saved city or use location
  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    const savedCoords = localStorage.getItem("lastCoords");

    if (savedCity) {
      const coords = savedCoords ? JSON.parse(savedCoords) : null;
      setCity(savedCity);
      handleSearch(savedCity, coords);
    } else {
      checkLocation();
    }
  }, [checkLocation]);

  return (
    <main className="min-h-screen bg-blue-100 px-4 py-8 sm:px-6 sm:py-12 text-center text-slate-800">
      <div className="mb-6">
        <h1
          className="text-5xl font-extrabold tracking-wide"
          style={{ color: "#014565" }}
        >
          HAZE <span className="text-white">WEATHER</span>
        </h1>
        <p className="mt-2 text-lg text-slate-700">
          Your daily weather companion
        </p>
      </div>

      {/* Unit switcher */}
      <div className="mb-6 flex justify-center items-center gap-4 text-sm">
        <span
          className={`transition-colors ${
            unit === "metric" ? "text-[#014565] font-semibold" : "text-gray-400"
          }`}
        >
          °C
        </span>

        <button
          onClick={() =>
            setUnit((prev) => (prev === "metric" ? "imperial" : "metric"))
          }
          className="relative w-14 h-7 rounded-full bg-gray-300 p-1 transition-colors"
          aria-label="Toggle temperature unit"
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
              unit === "metric" ? "translate-x-0" : "translate-x-7"
            }`}
          />
        </button>

        <span
          className={`transition-colors ${
            unit === "imperial"
              ? "text-[#014565] font-semibold"
              : "text-gray-400"
          }`}
        >
          °F
        </span>
      </div>

      <SearchBar onSearch={(val) => handleSearch(val)} />

      {/* use current location button */}
      <button
        onClick={checkLocation}
        disabled={isDetectingLocation}
        className={`mt-2 mb-4 inline-block rounded-full px-5 py-2 text-sm font-medium transition ${
          isDetectingLocation
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-[#4884AA] text-white hover:bg-[#01364e]"
        }`}
      >
        {isDetectingLocation
          ? "Detecting Location..."
          : "Use My Current Location"}
      </button>

      {!city && !loading && !weather && !isDetectingLocation && (
        <p className="mt-6 text-gray-600">
          Enter a city name or use your current location
        </p>
      )}

      {(loading || isDetectingLocation) && (
        <div className="mt-6 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {error && <p className="mt-6 text-red-500">{error}</p>}
      {geoError && (
        <div className="mt-6 p-3 bg-yellow-100 text-yellow-800 rounded-md max-w-md mx-auto">
          {geoError}
        </div>
      )}

      {weather && <CurrentWeatherCard data={weather} unit={unit} />}
      {forecast.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-5 gap-4 max-w-6xl mx-auto px-4">
          {forecast.map((item, index) => (
            <ForecastCard key={index} data={item} />
          ))}
        </div>
      )}
    </main>
  );
}
