# 🌤️ HAZE Weather App

**HAZE** is a modern, responsive weather application built with **Next.js** and **Tailwind CSS**. It provides accurate current weather data and a 5-day forecast using the **OpenWeatherMap API**.

Try it live: [HAZE Weather](haze-weather.vercel.app)

---

## ✨ Features

- 🔍 **City Search** – Enter any city to instantly see current weather and forecast.
- 📍 **Use My Location** – Get weather data based on your real-time location.
- 🧭 **5-Day Forecast** – Compact and clear daily forecasts with weather icons.
- 💙 **Searched Locations** – Your previously searched cities are displayed below the forecast.
- 🌡️ **Celsius/Fahrenheit Toggle** – Easily switch between metric and imperial units.
- 💾 **Local Storage** – Saves your preferred temperature unit and last searched city.
- 📱 **Mobile Friendly** – Responsive design with optimized layouts for small screens.
- 🎨 **Clean UI** – Custom styling with FontAwesome and Weather Icons for visual clarity.

---

## 🛠️ Built With

- [Next.js](https://nextjs.org/) – App framework
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [Font Awesome](https://fontawesome.com/) – UI icons
- [Weather Icons](https://erikflowers.github.io/weather-icons/) – Forecast visuals
- [OpenWeatherMap API](https://openweathermap.org/api) – Weather data

---

## 📦 Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/yourusername/haze-weather.git
   cd haze-weather
2. **Install dependencies**:
    ```bash
    npm install
3. **Set your API key**:
    Create a .env.local file and add:
    ```env
    NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key
4. &&Run the app**:
    ```bash
    npm run dev

## 🧠 Developer Notes

- Geolocation is only supported over HTTPS or localhost.
- City searches automatically save to "searched locations".
- Coordinates are saved temporarily for functionality, but no backend is used.

## 📄 License
MIT - Andras Varga, 2025
```vbnet

Let me know if you'd like a Hungarian or Chinese version too, or if you want it customized to your actual deployment URL and GitHub repo!
