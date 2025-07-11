// import { ForecastData } from "@/types";

// export default function ForecastCard({ data }: { data: ForecastData }) {
//   const day = new Date(data.date).toLocaleDateString(undefined, {
//     weekday: "short",
//   });

//   return (
//     <div className="bg-white p-3 rounded shadow text-center text-sm transition hover:shadow-md sm:text-sm flex sm:block items-center justify-between sm:justify-center gap-3 sm:gap-0">
//       <p className="font-semibold w-16 sm:w-auto">{day}</p>
//       <div className="flex flex-col items-center sm:my-2">
//         <img
//           src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
//           alt={data.description}
//           className="w-8 h-8 sm:w-12 sm:h-12"
//         />
//         <p className="text-gray-600 capitalize">{data.description}</p>
//       </div>
//       <div className="text-sm font-semibold sm:mt-1">
//         <p>{data.minTemp}° / {data.maxTemp}°</p>
//       </div>
//     </div>
//   );
// }


import { ForecastData } from "@/types";

export default function ForecastCard({ data }: { data: ForecastData }) {
  const day = new Date(data.date).toLocaleDateString(undefined, {
    weekday: "short",
  });

  return (
    <div className="bg-[#4884AA] text-white rounded-2xl shadow-md transition hover:shadow-lg text-sm p-2 sm:p-4 flex sm:block items-center justify-between gap-3 sm:gap-0">
      {/* Day */}
      <p className="font-semibold w-12 sm:w-auto text-xs sm:text-sm">{day}</p>

      {/* Icon + Description */}
      <div className="flex flex-col items-center sm:my-2">
        <img
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          className="w-8 h-8 sm:w-12 sm:h-12"
        />
        <p className="capitalize text-blue-100 text-[10px] sm:text-xs leading-tight">
          {data.description}
        </p>
      </div>

      {/* Min/Max */}
      <div className="text-xs sm:text-sm font-semibold sm:mt-1">
        <p>
          {data.minTemp}° / {data.maxTemp}°
        </p>
      </div>
    </div>
  );
}

