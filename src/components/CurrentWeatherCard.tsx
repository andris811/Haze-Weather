type WeatherData = {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
};

export default function CurrentWeatherCard({ data }: { data: WeatherData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8 max-w-md mx-auto text-left">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{data.city}</h2>
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-12 h-12"
        />
      </div>
      <p className="text-4xl font-bold">{data.temperature}°C</p>
      <p className="text-gray-700 capitalize">{data.description}</p>
      <div className="mt-4 text-sm text-gray-600">
        <p>Humidity: {data.humidity}%</p>
        <p>Wind: {data.windSpeed} km/h</p>
      </div>
    </div>
  );
}
