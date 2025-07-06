import { WeatherData } from "@/types";

export default function CurrentWeatherCard({ data }: { data: WeatherData }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2">{data.city}</h2>
      <div className="flex justify-center items-center gap-3 mb-2">
        <span className="text-4xl font-bold">{data.temperature}°C</span>
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-12 h-12"
        />
      </div>
      <p className="text-gray-600 capitalize">{data.description}</p>
      <p className="text-sm text-gray-500">
        Min: {data.minTemp}° / Max: {data.maxTemp}°
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Humidity: {data.humidity}% <br />
        Wind: {data.windSpeed} km/h
      </p>
    </div>
  );
}
