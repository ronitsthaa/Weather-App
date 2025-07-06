const apiKey = "e1bd4f77ecea106d52c620a829017d7c";

document.getElementById("searchBtn").addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  getWeather(city);
});

async function getWeather(city) {
  try {
    // current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const currentResponse = await fetch(currentUrl);
    if (!currentResponse.ok) throw new Error("City not found");
    const currentData = await currentResponse.json();
    updateTodayUI(currentData);

    // tomorrow forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error("Forecast not available");
    const forecastData = await forecastResponse.json();

    // get tomorrow's forecast around midday
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = tomorrow.toISOString().split("T")[0];

    const tomorrowForecasts = forecastData.list.filter(item => item.dt_txt.startsWith(tomorrowDateStr));

    // use the forecast around 12:00 pm if available, otherwise first of the day
    const middayForecast = tomorrowForecasts.find(item => item.dt_txt.includes("12:00:00")) || tomorrowForecasts[0];

    if (middayForecast) {
      updateTomorrowUI(middayForecast, forecastData.city.name);
    } else {
      document.getElementById("tomorrowCard").style.display = "none";
    }

  } catch (error) {
    alert(error.message);
    document.getElementById("todayCard").style.display = "none";
    document.getElementById("tomorrowCard").style.display = "none";
  }
}

function updateTodayUI(data) {
  document.getElementById("todayCard").style.display = "block";
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("description").textContent = `Weather: ${data.weather[0].description}`;
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp} °C`;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent = `Wind: ${data.wind.speed} m/s`;
  document.getElementById("pressure").textContent = `Pressure: ${data.main.pressure} hPa`;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  const now = new Date();
  document.getElementById("date").textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function updateTomorrowUI(forecast, cityName) {
  document.getElementById("tomorrowCard").style.display = "block";

  // Format tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  document.getElementById("tomorrowDate").textContent = formattedDate;

  document.getElementById("tomorrowDescription").textContent = `Weather: ${forecast.weather[0].description}`;
  document.getElementById("tomorrowTemp").textContent = `Temperature: ${forecast.main.temp} °C`;
  document.getElementById("tomorrowHumidity").textContent = `Humidity: ${forecast.main.humidity}%`;
  document.getElementById("tomorrowWind").textContent = `Wind: ${forecast.wind.speed} m/s`;
  document.getElementById("tomorrowPressure").textContent = `Pressure: ${forecast.main.pressure} hPa`;
  document.getElementById("tomorrowIcon").src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
}
