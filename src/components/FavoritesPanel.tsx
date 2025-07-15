"use client";

import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { fetchWeatherByCoords } from "@/lib/api";
import { FavoriteCity } from "@/types";
import { getWeatherIconClass } from "@/lib/iconMap";

type Props = {
  onSelect: (city: string, coords?: { lat: number; lon: number }) => void;
  unit: "metric" | "imperial";
};

type WeatherSummary = {
  temp: number;
  description: string;
  icon: string;
};

export default function FavoritesPanel({ onSelect, unit }: Props) {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [weatherData, setWeatherData] = useState<
    Record<string, WeatherSummary>
  >({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);

    // Optionally fetch current weather for each favorite
    saved.forEach(async (fav: FavoriteCity) => {
      try {
        const data = await fetchWeatherByCoords(
          fav.coords.lat,
          fav.coords.lon,
          unit
        );
        setWeatherData((prev) => ({
          ...prev,
          [fav.city]: {
            temp: data.temperature,
            description: data.description,
            icon: data.icon,
          },
        }));
      } catch (err) {
        console.warn(err, "Failed to fetch weather for favorite:", fav.city);
      }
    });
  }, [unit]);

  const removeFavorite = (city: string) => {
    const updated = favorites.filter((fav) => fav.city !== city);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) return null;

  return (
    <div className="mt-10 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-[#014565]">
        Searched Locations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map((fav) => {
          const weather = weatherData[fav.city];
          return (
            <div
              key={fav.city}
              className="bg-white shadow rounded-lg p-4 flex items-center justify-between hover:bg-blue-50 transition cursor-pointer"
              onClick={() => onSelect(fav.city, fav.coords)}
            >
              <div>
                <p className="font-semibold text-[#014565]">{fav.city}</p>
                {weather && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                    <i
                      className={`wi ${getWeatherIconClass(
                        weather.icon
                      )} text-lg sm:text-xl`}
                      aria-hidden="true"
                    />
                    <span>
                      {weather.temp}°{unit === "metric" ? "C" : "F"}
                    </span>
                    <span className="capitalize">{weather.description}</span>
                  </div>
                )}
              </div>

              <button
                className="text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.city);
                }}
              >
                <FaTrashAlt />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
