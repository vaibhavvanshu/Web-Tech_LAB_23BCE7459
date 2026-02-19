const apiKey = "da407f31ea05f0162096924e3f341aea";

const cityInput = document.getElementById("city");
const statusDiv = document.getElementById("status");
const weatherDiv = document.getElementById("weatherResult");

let cache = {}; // cache last searched city

// Enter key support
cityInput.addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather();
});

function getWeather() {
  const city = cityInput.value.trim().toLowerCase();

  if (!city) {
    statusDiv.textContent = "Please enter a city name";
    statusDiv.className = "error";
    return;
  }

  // Check cache first
  if (cache[city]) {
    displayWeather(cache[city], true);
    return;
  }

  statusDiv.textContent = "Loading...";
  statusDiv.className = "loading";
  weatherDiv.style.display = "none";

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      cache[city] = data; // store in cache
      displayWeather(data, false);
    })
    .catch(err => {
      statusDiv.textContent = err.message;
      statusDiv.className = "error";
      weatherDiv.style.display = "none";
    });
}

function displayWeather(data, fromCache) {
  statusDiv.textContent = fromCache
    ? "Loaded from cache"
    : "Weather fetched successfully";
  statusDiv.className = "";

  weatherDiv.style.display = "block";

  weatherDiv.innerHTML = `
    <h3>${data.name}</h3>
    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
  `;
}
