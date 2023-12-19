
var mymap = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

function getWeather() {
    const apiKey = '02ef0fddf080930100ff88db5cbecb1e';
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;

    if (city) {
        const countryCode = 'us'; 
        const query = zip ? `zip=${zip},${countryCode}` : `q=${city},${countryCode}`;

        fetch('http://localhost:4000/user-input', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                city: city,
                zip: zip
            })
        })
        

        fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=imperial`)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
                updateMap(data);
            })
            .catch(error => {
                displayError(error.message);
            });
    } else {
        displayError('Please enter a city name.');
    }
}


function displayWeather(data) {
    console.log('API Data:', data); 
    const weatherInfo = document.getElementById('weather-info');
    const todayForecast = data.list[0];

   
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    weatherInfo.innerHTML = `
      <h2>Weather in ${data.city.name}, ${data.city.country}</h2>
      <p>Coordinates: ${data.city.coord.lat}, ${data.city.coord.lon}</p>
      <p>Current Temperature: ${todayForecast.main.temp}&deg;F (Feels like: ${todayForecast.main.feels_like}&deg;F)</p>
      <p>Weather: ${todayForecast.weather[0].description}</p>
      <p>Wind Speed: ${todayForecast.wind.speed} mph</p>
    `;

    document.getElementById('error-message').innerHTML = '';
}

function updateMap(data) {
    const cityCoord = data.city.coord;
    mymap.setView([cityCoord.lat, cityCoord.lon], 10);
    L.marker([cityCoord.lat, cityCoord.lon]).addTo(mymap)
        .bindPopup(`<b>${data.city.name}, ${data.city.country}</b><br>Temperature: ${data.list[0].main.temp}&deg;F`).openPopup();
}

function displayError(message) {
    document.getElementById('error-message').innerHTML = `<p>${message}</p>`;
    document.getElementById('weather-info').innerHTML = '';
}
