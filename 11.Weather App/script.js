const API_KEY = '4cd0eee81294c867b4bc4cfc64e998c5';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const elements = {
    input: document.querySelector('.input-box'),
    searchButton: document.getElementById('searchBtn'),
    weatherImage: document.querySelector('.weather-img'),
    temperature: document.querySelector('.temperature'),
    description: document.querySelector('.description'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    notFound: document.querySelector('.location-not-found'),
    weatherBody: document.querySelector('.weather-body'),
    notFoundTitle: document.querySelector('.location-not-found h1'),
};

const DEFAULT_NOT_FOUND_MESSAGE = elements.notFoundTitle.textContent;

const WEATHER_ICON_MAP = {
    Clouds: 'cloud',
    Clear: 'clear',
    Rain: 'rain',
    Drizzle: 'rain',
    Thunderstorm: 'rain',
    Mist: 'mist',
    Smoke: 'mist',
    Haze: 'mist',
    Dust: 'mist',
    Fog: 'mist',
    Sand: 'mist',
    Ash: 'mist',
    Squall: 'mist',
    Tornado: 'mist',
    Snow: 'snow',
};

const NETWORK_ERROR_MESSAGE = 'We\'re having trouble retrieving the weather right now. Please try again later.';

function setVisibility(element, isVisible) {
    element.classList.toggle('hidden', !isVisible);
}

function formatDescription(description) {
    if (!description) {
        return '';
    }

    return description.charAt(0).toUpperCase() + description.slice(1);
}

function resolveIconPath(condition) {
    const iconKey = WEATHER_ICON_MAP[condition] ?? 'clear';
    return `assets/${iconKey}.png`;
}

async function fetchWeather(city) {
    const url = new URL(WEATHER_API_URL);
    url.searchParams.set('q', city);
    url.searchParams.set('appid', API_KEY);
    url.searchParams.set('units', 'metric');

    const response = await fetch(url);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Weather request failed with status ${response.status}`);
    }

    return response.json();
}

function showWeather(data) {
    elements.notFoundTitle.textContent = DEFAULT_NOT_FOUND_MESSAGE;
    setVisibility(elements.notFound, false);
    setVisibility(elements.weatherBody, true);

    const { main, weather, wind } = data;
    const [condition] = weather;

    elements.temperature.innerHTML = `${Math.round(main.temp)}<sup>°C</sup>`;
    elements.description.textContent = formatDescription(condition.description);
    elements.humidity.textContent = `${main.humidity}%`;

    const windSpeedKmh = Math.round(wind.speed * 3.6);
    elements.windSpeed.textContent = `${windSpeedKmh} km/h`;

    const iconPath = resolveIconPath(condition.main);
    elements.weatherImage.src = iconPath;
    elements.weatherImage.alt = `${condition.main} weather icon`;
}

function showNotFound(message = DEFAULT_NOT_FOUND_MESSAGE) {
    elements.notFoundTitle.textContent = message;
    setVisibility(elements.notFound, true);
    setVisibility(elements.weatherBody, false);
}

async function handleSearch() {
    const city = elements.input.value.trim();

    if (!city) {
        elements.input.focus();
        return;
    }

    try {
        const weatherData = await fetchWeather(city);

        if (!weatherData) {
            showNotFound();
            return;
        }

        showWeather(weatherData);
    } catch (error) {
        console.error(error);
        showNotFound(NETWORK_ERROR_MESSAGE);
    }
}

elements.searchButton.addEventListener('click', handleSearch);

elements.input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
});
