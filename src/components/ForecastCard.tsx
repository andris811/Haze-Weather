type ForecastData = {
  date: string;
  temperature: number;
  description: string;
  icon: string;
};

export default function ForecastCard({ data }: { data: ForecastData }) {
  const day = new Date(data.date).toLocaleDateString(undefined, {
    weekday: "short",
  });

  return (
    <div className="bg-white w-full sm:w-36 md:w-40 p-3 rounded shadow text-sm transition hover:shadow-md flex sm:flex-col items-center sm:items-center justify-between sm:justify-start text-left sm:text-center">
      {/* Day */}
      <p className="font-semibold w-16 sm:w-full">{day}</p>

      {/* Icon and description */}
      <div className="flex items-center sm:flex-col gap-2 sm:gap-1">
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-8 h-8 sm:w-12 sm:h-12"
        />
        <p className="text-xs text-gray-600 capitalize">{data.description}</p>
      </div>

      {/* Temperature */}
      <p className="text-base font-semibold sm:text-lg sm:mt-2">{data.temperature}°C</p>
    </div>
  );

}

