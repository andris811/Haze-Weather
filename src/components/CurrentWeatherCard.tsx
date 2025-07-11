// import { WeatherData } from "@/types";
// import { formatTime } from "@/lib/utils";

// type Props = {
//   data: WeatherData;
//   unit: "metric" | "imperial";
// };

// export default function CurrentWeatherCard({ data, unit }: Props) {
//   const tempSymbol = unit === "metric" ? "°C" : "°F";

//   return (
//     <div className="bg-[#014565] text-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto mt-8">
//       <div className="text-center mb-4">
//         <h2 className="text-2xl font-bold">
//           {data.city}{data.country ? `, ${data.country}` : ""}
//         </h2>
//       </div>

//       <div className="flex items-center justify-center gap-4 mb-6">
//         <img
//           src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
//           alt={data.description}
//           className="w-20 h-20"
//         />
//         <div>
//           <p className="text-5xl font-semibold">{data.temperature}{tempSymbol}</p>
//           <p className="capitalize text-blue-100 text-sm">{data.description}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-blue-100 text-left">
//         <p><span className="font-semibold">Feels like:</span> {data.feelsLike}{tempSymbol}</p>
//         <p><span className="font-semibold">Min/Max:</span> {data.minTemp}{tempSymbol} / {data.maxTemp}{tempSymbol}</p>

//         <p><span className="font-semibold">Humidity:</span> {data.humidity}%</p>
//         <p><span className="font-semibold">Wind:</span> {data.windSpeed} {unit === "metric" ? "km/h" : "mph"}</p>

//         <p><span className="font-semibold">Sunrise:</span> {formatTime(data.sunrise, data.timezone)}</p>
//         <p><span className="font-semibold">Sunset:</span> {formatTime(data.sunset, data.timezone)}</p>
//       </div>
//     </div>
//   );
// }

import { WeatherData } from "@/types";
import { formatTime } from "@/lib/utils";

type Props = {
  data: WeatherData;
  unit: "metric" | "imperial";
};

export default function CurrentWeatherCard({ data, unit }: Props) {
  const tempSymbol = unit === "metric" ? "°C" : "°F";

  return (
    <div className="bg-[#014565] text-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto mt-8">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-32 h-32 shrink-0"
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
          <span className="font-semibold">Min/Max:</span> {data.minTemp}
          {tempSymbol} / {data.maxTemp}
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
