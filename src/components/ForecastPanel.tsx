import { ForecastData } from "@/types";
import { getWeatherIconClass } from "@/lib/iconMap";

export default function ForecastSection({
  forecast,
}: {
  forecast: ForecastData[];
}) {
  return (
    <div className="bg-[#4884AA] text-white rounded-2xl shadow-md p-4 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto text-left">
      <h2 className="text-lg font-bold mb-4 text-left">5-Day Forecast</h2>

      {/* Desktop layout */}
      <div className="hidden sm:flex justify-between">
        {forecast.map((data) => {
          const day = new Date(data.date).toLocaleDateString(undefined, {
            weekday: "short",
          });

          return (
            <div
              key={data.date}
              className="flex flex-col items-center text-xs sm:text-sm gap-1"
            >
              <p>{day}</p>
              <i
                className={`wi ${getWeatherIconClass(data.icon)} text-xl sm:text-2xl`}
                aria-hidden="true"
              />
              <p className="text-[11px] sm:text-xs">
                {data.minTemp}° / {data.maxTemp}°
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden flex flex-col gap-3">
        {forecast.map((data) => {
          const day = new Date(data.date).toLocaleDateString(undefined, {
            weekday: "short",
          });

          return (
            <div
              key={data.date}
              className="flex items-center justify-between"
            >
              <p className="w-12">{day}</p>
              <i
                className={`wi ${getWeatherIconClass(data.icon)} text-xl`}
                aria-hidden="true"
              />
              <p className="text-sm font-medium">
                {data.minTemp}° / {data.maxTemp}°
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
