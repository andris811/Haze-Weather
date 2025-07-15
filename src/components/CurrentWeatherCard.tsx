import { WeatherData, ForecastData } from "@/types";
import { formatTime } from "@/lib/utils";
import { getWeatherIconClass } from "@/lib/iconMap";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { FavoriteCity } from "@/types";

type Props = {
  data: WeatherData;
  unit: "metric" | "imperial";
  today: ForecastData;
};

export default function CurrentWeatherCard({ data, unit, today }: Props) {
  const tempSymbol = unit === "metric" ? "°C" : "°F";

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoritesRaw = localStorage.getItem("favorites");
    if (!favoritesRaw) return;

    const saved: FavoriteCity[] = JSON.parse(favoritesRaw);
    const match = saved.find((fav) => fav.city === data.city);
    setIsFavorite(!!match);
  }, [data.city]);

  const toggleFavorite = () => {
    const favoritesRaw = localStorage.getItem("favorites");
    const favorites: FavoriteCity[] = favoritesRaw
      ? JSON.parse(favoritesRaw)
      : [];

    const isAlreadyFavorite = favorites.some((fav) => fav.city === data.city);

    if (isAlreadyFavorite) {
      const updated = favorites.filter((fav) => fav.city !== data.city);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      const lastLat = localStorage.getItem("lastLat");
      const lastLon = localStorage.getItem("lastLon");

      if (!lastLat || !lastLon) {
        console.warn("No coordinates found, skipping favorite save.");
        return;
      }

      const coords = {
        lat: parseFloat(lastLat),
        lon: parseFloat(lastLon),
      };

      const newFavorite: FavoriteCity = {
        city: data.city,
        coords,
      };

      const updated = [...favorites, newFavorite];
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(true);
    }
  };

  return (
    <div className="bg-[#014565] text-white rounded-2xl shadow-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto mt-8">
      <div className="flex items-center gap-6 mb-6">
        <i
          className={`wi ${getWeatherIconClass(
            data.icon
          )} text-6xl sm:text-7xl md:text-8xl`}
          aria-hidden="true"
        />

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 text-2xl font-bold mb-1">
            <div>
              {data.city}
              {data.country ? `, ${data.country}` : ""}
            </div>
            <button
              onClick={toggleFavorite}
              className="text-white hover:text-red-500 transition"
              aria-label="Toggle Favorite"
            >
              <FontAwesomeIcon icon={isFavorite ? solidHeart : regularHeart} />
            </button>
          </div>
          <p className="text-5xl font-semibold">
            {data.temperature}
            {tempSymbol}
          </p>
          <p className="capitalize text-blue-100 text-sm">{data.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-blue-100 text-left">
        <p>
          <span className="font-semibold">Feels like:</span> {data.feelsLike}
          {tempSymbol}
        </p>
        <p>
          <span className="font-semibold">Min/Max:</span> {today.minTemp}
          {tempSymbol} / {today.maxTemp}
          {tempSymbol}
        </p>

        <p>
          <span className="font-semibold">Humidity:</span> {data.humidity}%
        </p>
        <p>
          <span className="font-semibold">Wind:</span> {data.windSpeed}{" "}
          {unit === "metric" ? "km/h" : "mph"}
        </p>

        <p>
          <span className="font-semibold">Sunrise:</span>{" "}
          {formatTime(data.sunrise, data.timezone)}
        </p>
        <p>
          <span className="font-semibold">Sunset:</span>{" "}
          {formatTime(data.sunset, data.timezone)}
        </p>
      </div>
    </div>
  );
}
