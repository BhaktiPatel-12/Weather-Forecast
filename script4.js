document.addEventListener("DOMContentLoaded", () => {
    const dayIndex = parseInt(localStorage.getItem("selectedDayIndex")) || 0;
    const lat = localStorage.getItem("latitude") || 23.0225;
    const lon = localStorage.getItem("longitude") || 72.5714;


    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,weathercode,uv_index_max,wind_speed_10m_max,sunrise,sunset,precipitation_sum&hourly=visibility&current_weather=true&timezone=auto`)
    .then(res => res.json())
    .then(data => {
      const date = data.daily.time[dayIndex];
      const dayDate = new Date(date);
      const dayName = dayDate.toLocaleDateString("en-US", { weekday: "long" });
  
      const maxTemp = data.daily.temperature_2m_max[dayIndex];
      const minTemp = data.daily.temperature_2m_min[dayIndex];
      const feelsLike = data.daily.apparent_temperature_max[dayIndex];
      const humidity = data.daily.precipitation_sum[dayIndex]; // approximation
      const windSpeed = data.daily.wind_speed_10m_max[dayIndex];
      const uvIndex = data.daily.uv_index_max[dayIndex];
      const sunrise = data.daily.sunrise[dayIndex];
      const sunset = data.daily.sunset[dayIndex];
      const code = data.daily.weathercode[dayIndex];
      const visibility = data.hourly.visibility[dayIndex]; // assuming visibility is in the same index
        
  
        // Set weather emoji
        document.getElementById("day-emoji").innerText = getWeatherEmoji(code);
        document.getElementById("day-title").innerText = dayName;
        document.getElementById("feels_like").innerText = `${feelsLike}°C`;
        document.getElementById("humidity").innerText = `${humidity} mm`;
        document.getElementById("sunrise").innerText = sunrise;
        document.getElementById("sunset").innerText = sunset;
        document.getElementById("wind_speed").innerText = `${windSpeed} km/h`;
        document.getElementById("uv_index").innerText = uvIndex;
        document.getElementById("visibility").innerText = `${visibility} km`;
        document.getElementById("min_temp").innerText = `${minTemp}°C`;
        document.getElementById("max_temp").innerText = `${maxTemp}°C`;
      });
  });
  
  function getWeatherEmoji(code) {
    if ([0].includes(code)) return "☀️";
    if ([1, 2].includes(code)) return "🌤️";
    if ([3].includes(code)) return "☁️";
    if ([45, 48].includes(code)) return "🌁";
    if ([51, 53, 55].includes(code)) return "🌦️";
    if ([61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
    if ([71, 73, 75, 85, 86].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "❓";
  }
  