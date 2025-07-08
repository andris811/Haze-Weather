// "use client";

// import { useState, useEffect, useCallback } from "react";
// import SearchBar from "@/components/SearchBar";
// import {
//   fetchCurrentWeather,
//   fetchForecast,
//   fetchWeatherByCoords,
// } from "@/lib/api";
// import CurrentWeatherCard from "@/components/CurrentWeatherCard";
// import ForecastCard from "@/components/ForecastCard";
// import { WeatherData, ForecastData } from "@/types";

// export default function Home() {
//   const [city, setCity] = useState(() => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("lastCity") || "";
//     }
//     return "";
//   });

//   const [weather, setWeather] = useState<null | WeatherData>(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [forecast, setForecast] = useState<ForecastData[]>([]);
//   const [unit, setUnit] = useState<"metric" | "imperial">("metric");

//   // Load unit from localStorage or use locale
//   useEffect(() => {
//     const savedUnit = localStorage.getItem("unit") as
//       | "metric"
//       | "imperial"
//       | null;

//     if (savedUnit) {
//       setUnit(savedUnit);
//     } else {
//       const userLocale = navigator.language;
//       const autoUnit = userLocale === "en-US" ? "imperial" : "metric";
//       setUnit(autoUnit);
//       localStorage.setItem("unit", autoUnit);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("unit", unit);
//   }, [unit]);

//   const handleSearch = useCallback(
//     async (
//       searchCity: string,
//       coords?: { lat: number; lon: number } | null
//     ) => {
//       setCity(searchCity);
//       localStorage.setItem("lastCity", searchCity);

//       if (coords) {
//         localStorage.setItem("lastCoords", JSON.stringify(coords));
//         localStorage.setItem("lastLat", coords.lat.toString());
//         localStorage.setItem("lastLon", coords.lon.toString());
//       } else {
//         localStorage.removeItem("lastCoords");
//         localStorage.removeItem("lastLat");
//         localStorage.removeItem("lastLon");
//       }

//       setLoading(true);
//       setError("");

//       try {
//         const weatherData = coords
//           ? await fetchWeatherByCoords(coords.lat, coords.lon, unit)
//           : await fetchCurrentWeather(searchCity, unit);

//         const forecastData = await fetchForecast(searchCity, unit);

//         setWeather(weatherData);
//         setForecast(forecastData);
//       } catch (err) {
//         console.error(err);
//         setError("City not found");
//         setWeather(null);
//         setForecast([]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [unit]
//   );

//   // Re-fetch if unit or city changes
//   useEffect(() => {
//     const savedCoords = localStorage.getItem("lastCoords");
//     if (city) {
//       if (savedCoords) {
//         const coords = JSON.parse(savedCoords);
//         handleSearch(city, coords);
//       } else {
//         handleSearch(city);
//       }
//     }
//   }, [unit, city, handleSearch]);

//   // Detect location and prompt user
//   useEffect(() => {
//     const tryAutoDetectCity = () => {
//       if (typeof window === "undefined") return;

//       navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//           const { latitude, longitude } = pos.coords;

//           // Always store current coords
//           localStorage.setItem("currentLat", latitude.toString());
//           localStorage.setItem("currentLon", longitude.toString());

//           const savedLat = localStorage.getItem("lastLat");
//           const savedLon = localStorage.getItem("lastLon");

//           const lastLat = savedLat ? parseFloat(savedLat) : null;
//           const lastLon = savedLon ? parseFloat(savedLon) : null;

//           const moved =
//             !lastLat ||
//             !lastLon ||
//             Math.abs(lastLat - latitude) > 0.2 ||
//             Math.abs(lastLon - longitude) > 0.2;

//           if (moved) {
//             try {
//               const result = await fetchWeatherByCoords(
//                 latitude,
//                 longitude,
//                 unit
//               );
//               const detectedCity = result.city;

//               const confirmSwitch = window.confirm(
//                 `You're currently in ${detectedCity}. Switch to this location's weather?`
//               );

//               if (confirmSwitch) {
//                 localStorage.setItem(
//                   "lastCoords",
//                   JSON.stringify({ lat: latitude, lon: longitude })
//                 );
//                 localStorage.setItem("lastLat", latitude.toString());
//                 localStorage.setItem("lastLon", longitude.toString());
//                 localStorage.setItem("lastCity", detectedCity);
//                 setCity(detectedCity);
//                 handleSearch(detectedCity, { lat: latitude, lon: longitude });
//               }
//             } catch (err) {
//               console.warn("Could not fetch weather by coordinates:", err);
//             }
//           }
//         },
//         (err) => {
//           console.warn("Geolocation denied or failed", err);
//         }
//       );
//     };

//     tryAutoDetectCity();
//   }, [unit, handleSearch]);

//   return (
//     <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-10 text-center">
//       <h1 className="text-3xl font-bold mb-4">Haze</h1>

//       {/* Unit switcher */}
//       <div className="mb-4 flex justify-center items-center gap-4 text-sm">
//         <span
//           className={`${
//             unit === "metric" ? "font-bold text-black" : "text-gray-500"
//           }`}
//         >
//           °C
//         </span>

//         <button
//           onClick={() =>
//             setUnit((prev) => (prev === "metric" ? "imperial" : "metric"))
//           }
//           className="w-12 h-6 rounded-full relative bg-gray-300 flex items-center px-1"
//           aria-label="Toggle temperature unit"
//         >
//           <span
//             className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
//               unit === "metric" ? "translate-x-0" : "translate-x-6"
//             }`}
//           />
//         </button>

//         <span
//           className={`${
//             unit === "imperial" ? "font-bold text-black" : "text-gray-500"
//           }`}
//         >
//           °F
//         </span>
//       </div>

//       <SearchBar onSearch={(val) => handleSearch(val)} />

//       {!city && !loading && !weather && (
//         <p className="mt-6 text-gray-600">Enter a city name to begin.</p>
//       )}

//       {loading && (
//         <div className="mt-6 flex justify-center">
//           <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
//         </div>
//       )}

//       {error && <p className="mt-6 text-red-500">{error}</p>}

//       {weather && <CurrentWeatherCard data={weather} unit={unit} />}

//       {forecast.length > 0 && (
//         <div className="mt-10 grid grid-cols-1 sm:grid-cols-5 gap-4 max-w-6xl mx-auto px-4">
//           {forecast.map((item, index) => (
//             <ForecastCard key={index} data={item} />
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

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
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [geoError, setGeoError] = useState("");

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

      try {
        const weatherData = coords
          ? await fetchWeatherByCoords(coords.lat, coords.lon, unit)
          : await fetchCurrentWeather(searchCity, unit);

        const forecastData = await fetchForecast(
          coords ? weatherData.city : searchCity,
          unit
        );

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

  // Re-fetch if unit or city changes
  useEffect(() => {
    const savedCoords = localStorage.getItem("lastCoords");
    if (city) {
      if (savedCoords) {
        const coords = JSON.parse(savedCoords);
        handleSearch(city, coords);
      } else {
        handleSearch(city);
      }
    }
  }, [unit, city, handleSearch]);

  // Location logic (callable by button or effect)
  const checkLocation = async () => {
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
            timeout: 10000,
            maximumAge: 60 * 1000,
            enableHighAccuracy: true,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      const newCoords = { lat: latitude, lon: longitude };

      // Save coords
      localStorage.setItem("currentLat", latitude.toString());
      localStorage.setItem("currentLon", longitude.toString());
      localStorage.setItem("lastCoords", JSON.stringify(newCoords));

      const weatherData = await fetchWeatherByCoords(latitude, longitude, unit);
      const detectedCity = weatherData.city;

      const lastCity = localStorage.getItem("lastCity");

      if (!lastCity) {
        // First visit – set location automatically
        localStorage.setItem("lastCity", detectedCity);
        handleSearch(detectedCity, newCoords);
      } else {
        const savedCoords = JSON.parse(
          localStorage.getItem("lastCoords") || "{}"
        );

        const distance = getDistance(savedCoords, newCoords);

        if (distance > 1) {
          const confirmSwitch = window.confirm(
            `You're currently in ${detectedCity}. Switch to this location?`
          );

          if (confirmSwitch) {
            localStorage.setItem("lastCity", detectedCity);
            handleSearch(detectedCity, newCoords);
          }
        }
      }
    } catch (err) {
      const error = err as GeolocationPositionError;
      console.warn("Geolocation error:", error.code, error.message);
      setGeoError(
        error.code === 1
          ? "Permission denied. Please allow location access."
          : error.code === 2
          ? "Location unavailable. Try again later."
          : error.code === 3
          ? "Location request timed out."
          : "Unknown location error."
      );

      // Fallback to last city if any
      if (city) handleSearch(city);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Optional auto-run on desktop only (iPhone Safari blocks this)
  useEffect(() => {
    if (!navigator.userAgent.includes("iPhone")) {
      checkLocation();
    }
  }, [unit]);

  // Haversine formula
  function getDistance(
    coord1: { lat: number; lon: number },
    coord2: { lat: number; lon: number }
  ): number {
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
  }

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

      <SearchBar onSearch={(val) => handleSearch(val)} />

      {/* Manual geolocation trigger */}
      <button
        onClick={checkLocation}
        className="text-blue-600 underline mt-2 mb-4"
      >
        Use my current location
      </button>

      {!city && !loading && !weather && !isDetectingLocation && (
        <p className="mt-6 text-gray-600">Enter a city name to begin.</p>
      )}

      {(loading || isDetectingLocation) && (
        <div className="mt-6 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {error && <p className="mt-6 text-red-500">{error}</p>}
      {geoError && <p className="mt-6 text-yellow-600">{geoError}</p>}

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
