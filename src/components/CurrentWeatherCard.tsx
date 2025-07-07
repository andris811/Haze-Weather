import { WeatherData } from "@/types";
import { formatTime } from "@/lib/utils";

type Props = {
  data: WeatherData;
  unit: "metric" | "imperial";
};

export default function CurrentWeatherCard({ data, unit }: Props) {
  const tempSymbol = unit === "metric" ? "°C" : "°F";

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">{data.city}</h2>
      <div className="flex items-center justify-center gap-4 mb-2">
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
        />
        <div>
          <p className="text-4xl font-bold">
            {data.temperature}{tempSymbol}
          </p>
          <p className="capitalize text-gray-600">{data.description}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-1">
        Feels like: {data.feelsLike}{tempSymbol}
      </p>
      <p className="text-gray-700 mb-1">
        Min: {data.minTemp}{tempSymbol} / Max: {data.maxTemp}{tempSymbol}
      </p>
      <p className="text-gray-700 mb-1">Humidity: {data.humidity}%</p>
      <p className="text-gray-700 mb-1">Wind: {data.windSpeed} {unit === "metric" ? "km/h" : "mph"}</p>

      <div className="text-gray-700 mt-2">
        <p>Sunrise: {formatTime(data.sunrise, data.timezone)}</p>
        <p>Sunset: {formatTime(data.sunset, data.timezone)}</p>
      </div>
    </div>
  );
}
