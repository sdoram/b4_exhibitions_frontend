import { backendBaseURL } from "./api.js";
const API_URL = `${backendBaseURL}/exhibitions/weather/`

async function fetchWeatherData() {
    try {
        const response = await fetch(API_URL);

        if (response.ok) {
            const data = await response.json();
            const iconUrl = getWeatherIconUrl(data.weather[0].icon);
            return { data, iconUrl };
        } else {
            throw new Error(`Failed to fetch weather data: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}

function getWeatherIconUrl(iconId) {
    return `https://openweathermap.org/img/wn/${iconId}.png`;
}

function updateWeather() {
    document.getElementById("weather-text").innerHTML = "로딩 중...";

    fetchWeatherData()
        .then(({ data, iconUrl }) => {
            const { main, weather } = data;
            const img = document.createElement("img");
            const weatherText = `${Math.round(main.temp * 10) / 10}ºC`;
            img.src = iconUrl;
            img.alt = weather[0].description;
            const weatherElement = document.getElementById("weather-info");
            weatherElement.innerHTML = weatherText;
            weatherElement.appendChild(img);
        })
        .catch((error) => {
            document.getElementById("weather-text").innerHTML = "날씨 정보를 불러오지 못했습니다.";
        });
}

// 페이지 로드시 실행
updateWeather();