// program untuk menampilkan weather forecast Jakarta untuk 5 hari ke depan
// menggunakan OpenWeatherMap API
// API key harus disimpan di file .env: OPENWEATHER_API_KEY

// load environment variables dari file .env
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const https = require("https");

// koordinat Jakarta
const JAKARTA_LAT = -6.2088;
const JAKARTA_LON = 106.8456;

// fungsi untuk melakukan HTTP GET request untuk current weather
function fetchCurrentWeather(apiKey, lat, lon) {
  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(
              new Error(`API request failed with status ${res.statusCode}`),
            );
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// fungsi untuk melakukan HTTP GET request untuk forecast 5 hari
function fetchForecast(apiKey, lat, lon) {
  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(
              new Error(`API request failed with status ${res.statusCode}`),
            );
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// fungsi untuk memformat tanggal
function formatDate(dateString) {
  const date = new Date(dateString);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

// fungsi untuk mendapatkan forecast 5 hari
function getFiveDayForecast(forecastData) {
  const forecasts = [];
  const processedDates = new Set();

  // loop through forecast list (setiap 3 jam)
  for (const item of forecastData.list) {
    const date = item.dt_txt.split(" ")[0]; // ambil tanggal saja (YYYY-MM-DD)

    // ambil satu forecast per hari (yang belum diproses)
    if (!processedDates.has(date) && forecasts.length < 5) {
      forecasts.push({
        date: formatDate(item.dt_txt),
        temp: item.main.temp.toFixed(2),
      });
      processedDates.add(date);
    }

    if (forecasts.length === 5) break;
  }

  return forecasts;
}

// fungsi utama untuk menampilkan weather forecast
async function displayWeatherForecast() {
  try {
    // ambil API key dari environment variable
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.error(
        "Error: OPENWEATHER_API_KEY environment variable is not set",
      );
      console.error("Please check your .env file");
      process.exit(1);
    }

    console.log("Fetching weather data for Jakarta...\n");

    // fetch forecast data untuk 5 hari ke depan
    const forecastData = await fetchForecast(apiKey, JAKARTA_LAT, JAKARTA_LON);

    // ambil forecast 5 hari
    const forecasts = getFiveDayForecast(forecastData);

    // tampilkan hasil
    console.log("Weather Forecast:");
    forecasts.forEach((forecast) => {
      console.log(`${forecast.date}: ${forecast.temp}°C`);
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    process.exit(1);
  }
}

// jalankan program jika file ini dijalankan langsung
if (require.main === module) {
  displayWeatherForecast();
}

module.exports = {
  displayWeatherForecast,
  getFiveDayForecast,
  formatDate,
  fetchCurrentWeather,
  fetchForecast,
};
