type ForecastData = {
  date: string;
  temperature: number;
  description: string;
  icon: string;
};

export default function ForecastCard({ data }: { data: ForecastData }) {
  const day = new Date(data.date).toLocaleDateString(undefined, {
    weekday: 'short',
  });

  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="font-semibold">{day}</p>
      <img
        src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
        alt={data.description}
        className="w-12 h-12 mx-auto"
      />
      <p className="text-lg">{data.temperature}°C</p>
      <p className="text-sm text-gray-600 capitalize">{data.description}</p>
    </div>
  );
}
