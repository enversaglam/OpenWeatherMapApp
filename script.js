const API_KEY = 'eba434d53498ed908a3e822f4e3bce27';
const BASE_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const content = {
    mainGrid: document.querySelector('.grid-item:first-child'),
    locationName: document.querySelector('.location'),
    temp: document.querySelector('.temp'),
    unit: document.querySelector('.unit'),
    desc: document.querySelector('.desc'),
    max: document.querySelector('.max'),
    min: document.querySelector('.min'),
    feelsLike: document.querySelector('.feels-like'),
    humidity: document.querySelector('.humidity'),
    windSpeed: document.querySelector('.wind-speed'),
    pressure: document.querySelector('.pressure'),
    weatherImage: document.querySelector('.weather-image'),
}

const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(e) {
    e.preventDefault();

    const locationName = searchForm.search.value.trim();
    if (!locationName) {
        alert('Please enter a valid City, State or Country Name');
        return;
    }

    const isImperial = document.getElementById('unitType').checked === false;
    const unitType = isImperial ? 'imperial' : 'metric';

    try {
        const data = await getWeatherByLocation(locationName, unitType);

        if (data.cod === "404") {
            alert("Location not found. Please enter a valid City, State or Country Name");
            return;
        }

        displayWeatherData(data, isImperial);
        
    } catch (error) {
        console.error('Error on Form Submit', error);
    }

    searchForm.reset();
}

async function getWeatherByLocation(locationName, unitType) {
    const apiUrl = `${BASE_API_URL}?q=${locationName}&appid=${API_KEY}&units=${unitType}`;

    return await fetchData(apiUrl);
}

async function getWeatherByPosition(lat, lon, unitType) {
    const apiUrl = `${BASE_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitType}`;

    return await fetchData(apiUrl);
}

async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data', error);
        throw error;
    }
}

function displayWeatherData(data, isImperial) {
    const { weather, main, wind, sys, name } = data;

    //set units
    const tempUnit = isImperial ? '°F' : '°C';
    const windSpeedUnit = isImperial ? 'mph' : 'm/s';
    const pressureUnit = isImperial ? 'inHg' : 'hPa';

    //convert pressure
    const pressureInHg = (main.pressure / 33.8639).toFixed(2);
    const pressure = isImperial ? pressureInHg : main.pressure;

    //set data
    content.locationName.textContent = name;
    content.temp.textContent = main.temp.toFixed(2);
    content.unit.textContent = tempUnit;
    content.desc.textContent = weather[0].description;
    content.max.textContent = `${main.temp_max}${tempUnit}`;
    content.min.textContent = `${main.temp_min}${tempUnit}`;
    content.feelsLike.textContent = `${main.feels_like}${tempUnit}`;
    content.humidity.textContent = `${main.humidity}%`;
    content.windSpeed.textContent = `${wind.speed}${windSpeedUnit}`;
    content.pressure.textContent = `${pressure}${pressureUnit}`;
    content.weatherImage.src = `./img/${weather[0].icon}.png`;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const isDayTime = currentTimestamp >= sys.sunrise &&
    currentTimestamp <= sys.sunset;

    content.mainGrid.classList.toggle('day-time', isDayTime);
    content.mainGrid.classList.toggle('night-time', !isDayTime);

}