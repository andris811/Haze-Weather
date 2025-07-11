import { ForecastData } from "@/types";

export default function ForecastSection({
  forecast,
}: {
  forecast: ForecastData[];
}) {
  return (
    <div className="bg-[#4884AA] text-white rounded-2xl shadow-md p-4 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto text-left">
      <h2 className="text-lg font-bold mb-4 text-left">5-Day Forecast</h2>
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
              <img
                src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                alt={data.description}
                className="w-8 h-8 sm:w-10 sm:h-10"
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
            <div key={data.date} className="flex items-center justify-between">
              <p className="w-12">{day}</p>
              <img
                src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                alt={data.description}
                className="w-8 h-8"
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
