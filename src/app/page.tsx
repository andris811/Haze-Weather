"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";

export default function Home() {
  const [city, setCity] = useState("");

  const handleSearch = (searchCity: string) => {
    setCity(searchCity);
    // I'll later trigger weather fetch here
  };

  const mockWeather = {
    city: "London",
    temperature: 21,
    description: "Sunny",
    humidity: 60,
    windSpeed: 12,
    icon: "01d",
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Haze</h1>
      <SearchBar onSearch={handleSearch} />
      <p className="mt-6 text-gray-700">City searched: {city}</p>
      {city && <CurrentWeatherCard data={mockWeather} />}
    </main>
  );
}
