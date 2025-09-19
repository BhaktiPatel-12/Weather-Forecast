
// Get the full URL's query string (e.g., ?startHour=6)
const queryString = window.location.search;

// Create a URLSearchParams object from the query string
const urlParams = new URLSearchParams(queryString);

// Get the value of "startHour"
const startHour = urlParams.get("startHour");

// Optionally, convert to number (since it's a string by default)
const startHourIndex = parseInt(startHour, 10);

// Log to check
console.log("Start hour:", startHourIndex);

// Retrieve the city name from localStorage
const selectedCity = localStorage.getItem("selectedCity");
// const selectedCity = sessionStorage.getItem("selectedCity");

function goBack() {
  // const city = document.getElementById("city-dropdown")?.value || "Ahmedabad";
  localStorage.setItem("selectedCity", selectedCity);  // Save city
  window.location.href = "index.html";         // Go back
}


// Optional: check if it's there
if (selectedCity) {
  console.log("Selected city:", selectedCity);
  // Use selectedCity in your API call, display, etc.
} else {
  console.log("No city found in localStorage.");
}

var   longitude, latitude;

fetchData(); // Call fetchData to get the coordinates
async function fetchData() {
  try {
  
    const response = await fetch("http://localhost/weather-forecast/data.php");
    const data = await response.json();
    console.log("Data fetched:", data); // Log the fetched data
    data.forEach((row) => {
      if (row.city === selectedCity) {
        longitude = row.Longitude;
        
        latitude = row.Latitude;
        console.log("Latitude:", latitude, "Longitude:", longitude);
      }
    });

    if (latitude && longitude) {
      fetchWeatherDetails(latitude, longitude);
    } else {
      console.error("Coordinates not found for selected city.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


// Fetch 48-hour forecast from Open Meteo API
async function fetchWeatherDetails(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,weathercode&forecast_days=3&timezone=auto`;


  try {
    const response = await fetch(url);
    const weatherData = await response.json();

    // Get all hourly time and temperature data
    const times = weatherData.hourly.time;
    const temperatures = weatherData.hourly.temperature_2m;
    const weatherCodes = weatherData.hourly.weathercode;
    const apparentTemps = weatherData.hourly.apparent_temperature;


    // Slice 48 hours starting from startHourIndex
    const slicedData = [];

    for (let i = startHourIndex; i < startHourIndex + 48 && i < times.length; i++) {
      slicedData.push({
        time: times[i],
        temperature: temperatures[i],
        feelsLike: apparentTemps[i],
        weatherCode: weatherCodes[i],
      });
    }
    

    console.log("48-Hour Forecast Slice:", slicedData);

    // You can now render this slicedData on the page
    renderForecast(slicedData);

  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function renderForecast(forecastData) {
  const container = document.getElementById("hourly-forecast-container");
  container.innerHTML = ""; // Clear old data

  let currentDate = "";

  forecastData.forEach((hour) => {
    const dateTime = new Date(hour.time);
    const dateStr = dateTime.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = dateTime.toTimeString().slice(0, 5); // HH:MM
    const dayName = dateTime.toLocaleDateString("en-US", { weekday: 'long' });

    // Check if day/date has changed
    if (dateStr !== currentDate) {
      currentDate = dateStr;

      // Insert a day/date header
      const dayHeader = document.createElement("div");
      dayHeader.innerHTML = `<h3>${dayName}, ${currentDate}</h3>`;
      dayHeader.style.marginTop = "1em";
      container.appendChild(dayHeader);
    }

    // Insert the hourly forecast
    const div = document.createElement("div");
    div.className = "hour-box";
    const feelsEmoji = hour.feelsLike >= 30 ? "🥵" : hour.feelsLike <= 10 ? "🥶" : "😊";
    div.innerHTML = `
      <p>${timeStr}</p>
      <p>🌡️ ${hour.temperature}°C</p>
      <p>${feelsEmoji} Feels Like: ${hour.feelsLike}°C</p>
    `;
  
    container.appendChild(div);
  });
}


