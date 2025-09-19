window.onload = function () {
  const cityInput = document.getElementById("city-dropdown") || "Ahmedabad";
  const savedCity = localStorage.getItem("selectedCity") || "Ahmedabad"; // Default city;

  cityInput.value = savedCity; // Set the input
  searchWeather(); // Call your function
};

// script.js
const boxes = document.querySelectorAll(".moving-box");
let currentIndex = 0;

function showNextBox() {
  boxes.forEach((box, index) => {
    box.classList.remove("active");
    if (index === currentIndex) {
      box.classList.add("active");
    }
  });

  currentIndex = (currentIndex + 1) % boxes.length;
}

setInterval(showNextBox, 3000); // every 3 seconds
showNextBox(); // initial

// Select the weather-box and other containers

const otherContainers = document.querySelectorAll(
  ".navbar, .popularcities,.three-day-forecast,.hourly-grid,.forecast-container,.news-section,.footer"
);
const movingContainer = document.querySelector(".moving-container");
const movinboxes = document.querySelectorAll(".moving-box");

const container = document.querySelector(".moving-container");

container.addEventListener("click", () => {
  if (container.classList.contains("expanded")) {
    // Collapse immediately
    container.classList.add("collapsing");
    container.classList.remove("expanded");

    // Remove the .collapsing class after a short delay
    requestAnimationFrame(() => {
      container.offsetHeight; // force reflow
      container.classList.remove("collapsing");
    });
  } else {
    // Expand with animation
    container.classList.add("expanded");
  }
});

function openHourlyPage(hourIndex) {
  window.location.href = `index3.html?startHour=${hourIndex}`;
}

function openDailyPage(index) {
  localStorage.setItem("selectedDayIndex", index);
  window.location.href = "index4.html";
}

const cities = [
  { name: "Delhi", lat: 28.6139, lon: 77.209, elementId: "delhitemp" },
  { name: "Mumbai", lat: 19.076, lon: 72.8777, elementId: "mumbaitemp" },
  { name: "Pune", lat: 18.5204, lon: 73.8567, elementId: "punetemp" },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867, elementId: "hyderabadtemp" },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946, elementId: "bangloretemp" },
  {
    name: "Gandhinagar",
    lat: 23.2237,
    lon: 72.65,
    elementId: "gandhinagartemp",
  },
];

const fetchWeather = async (lat, lon, elementId) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const temp = data.current_weather.temperature;

    document.getElementById(elementId).innerHTML = `${temp}°C`;
    console.log(`${elementId}: ${temp}°C`);
  } catch (error) {
    console.error(`Error fetching weather for ${elementId}:`, error);
  }
};

cities.forEach((city) => {
  fetchWeather(city.lat, city.lon, city.elementId);
});

var longitude, latitude;
function searchWeather() {
  const city = document.getElementById("city-dropdown").value;
  console.log("Selected city:", city);
  localStorage.setItem("selectedCity", city);

  // window.location.href = "forecast.html";
  const weatherCity = document.getElementById("weather-city");
  const weatherTemp = document.getElementById("weather-temp");
  async function fetchData() {
    try {
      // let longitude, latitude;
      const response = await fetch(
        "http://localhost/weather-forecast/data.php"
      );
      const data = await response.json();

      data.forEach((row) => {
        if (row.city === city) {
          longitude = row.Longitude;

          latitude = row.Latitude;
          console.log("Latitude:", latitude, "Longitude:", longitude);
        }
      });

      if (latitude && longitude) {
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
        fetchWeatherDetails(latitude, longitude);
        fetchWeatherDetailsdaily(latitude, longitude);
      } else {
        console.error("Coordinates not found for selected city.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchWeatherDetails = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&current_weather=true&timezone=auto`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();

        const temp = data.current_weather.temperature;
        document.getElementById("weather-city").innerHTML = `${city}`;
        document.getElementById("weather-temp").innerHTML = `${temp}°C`;
        const currentTime = data.current_weather.time;
        const formattedTime = new Date(currentTime).toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        );
        document.getElementById("local_time").innerHTML = formattedTime;

        const weatherBox = document.querySelector(".weather-box");
        const originalContent = weatherBox.innerHTML;
        console.log(originalContent);
        let isExpanded = false; // track state outside the event listener

        movingContainer.addEventListener("click", () => {
          isExpanded = !isExpanded;
          movingContainer.classList.toggle("expanded", isExpanded);

          if (isExpanded) {
            // Expand: activate all boxes
            movinboxes.forEach((box) => box.classList.add("active"));
            weatherBox.innerHTML = ""; // Clear weather content
            otherContainers.forEach((el) => (el.style.display = "none")); // Hide other containers
          } else {
            // Collapse: keep only currentIndex box active
            movinboxes.forEach((box, index) => {
              box.classList.remove("active");
              box.classList.remove("expanded");
              box.style.display = "none"; // Remove expanded class from all boxes
              if (index === currentIndex) {
                box.classList.add("active");
              }
              otherContainers.forEach((el) => (el.style.display = "")); // Show other containers
            });
            weatherBox.innerHTML = originalContent;
            movinboxes.forEach((el) => (el.style.display = ""));
            // Restore content if needed
          }
        });

        const windSpeed = data.current_weather.windspeed;
        const sunrise = data.daily.sunrise[0];
        const sunset = data.daily.sunset[0];
        const minTemp = data.daily.temperature_2m_min[0];
        const maxTemp = data.daily.temperature_2m_max[0];
        const humidity = data.hourly.relative_humidity_2m[0];
        const uvIndex = data.daily.uv_index_max[0];
        const visibility = data.hourly.visibility[0];

        document.getElementById("feels_like").innerHTML = `${temp}°C`;
        document.getElementById("humidity").innerHTML = `${humidity}%`;
        document.getElementById("min_temp").innerHTML = `${minTemp}°C`;
        document.getElementById("max_temp").innerHTML = `${maxTemp}°C`;
        document.getElementById("wind_speed").innerHTML = `${windSpeed} km/h`;
        document.getElementById("sunrise").innerHTML = sunrise;
        document.getElementById("sunset").innerHTML = sunset;
        document.getElementById("uv_index").innerHTML = uvIndex;
        document.getElementById("visibility").innerHTML = `${visibility} m`;
      } else {
        console.error(
          "Failed to fetch data from Open-Meteo:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  fetchData();
}

async function fetchWeatherDetailsdaily(latitude, longitude) {
  // Replace with any city's coordinates
  const lat = latitude;
  const lon = longitude;
  console.log("Latitude:", latitude, "Longitude:", longitude);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const dates = data.daily.time;
      const tempMax = data.daily.temperature_2m_max;
      const tempMin = data.daily.temperature_2m_min;

      for (let i = 0; i < 7; i++) {
        const dateEl = document.getElementById(`day-${i}-date`);
        const maxEl = document.getElementById(`day-${i}-max`);
        const minEl = document.getElementById(`day-${i}-min`);

        if (dateEl && maxEl && minEl) {
          dateEl.textContent = new Date(dates[i]).toDateString();
          maxEl.textContent = tempMax[i];
          minEl.textContent = tempMin[i];
        }
      }

      const hourlyUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto`;

      fetch(hourlyUrl)
        .then((response) => response.json())
        .then((data) => {
          const hourlyTimes = data.hourly.time;
          const hourlyTemps = data.hourly.temperature_2m;
          const today = new Date().toISOString().split("T")[0];

          let filled = 0;

          for (let i = 0; i < hourlyTimes.length; i++) {
            if (hourlyTimes[i].startsWith(today) && filled < 24) {
              const time = new Date(hourlyTimes[i]).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const timeEl = document.getElementById(`hour${filled}-time`);
              const tempEl = document.getElementById(`hour${filled}-temp`);

              if (timeEl && tempEl) {
                timeEl.textContent = time;
                tempEl.textContent = `${hourlyTemps[i]}°C`;
              }

              filled++;
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching hourly data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
