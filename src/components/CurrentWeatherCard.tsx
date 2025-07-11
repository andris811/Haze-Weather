import { WeatherData, ForecastData } from "@/types";
import { formatTime } from "@/lib/utils";
import { getWeatherIconClass } from "@/lib/iconMap";

type Props = {
  data: WeatherData;
  unit: "metric" | "imperial";
  today: ForecastData;
};

export default function CurrentWeatherCard({ data, unit, today }: Props) {
  const tempSymbol = unit === "metric" ? "°C" : "°F";

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
          <h2 className="text-2xl font-bold mb-1">
            {data.city}
            {data.country ? `, ${data.country}` : ""}
          </h2>
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
