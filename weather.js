// Weather functionality
async function fetchWeather() {
    try {
        const response = await fetch('https://api.met.no/weatherapi/nowcast/2.0/complete?lat=62.0758&lon=9.1280', {
            headers: {
                'User-Agent': 'Bortelaget/1.0 (https://bortelaget.no)'
            }
        });
        
        const data = await response.json();
        const currentWeather = data.properties.timeseries[0].data;
        
        const weather = {
            temperature: currentWeather.instant.details.air_temperature.toFixed(1).replace('.', ','),
            precipitation: currentWeather.instant.details.precipitation_rate.toString().replace('.', ','),
            windDirection: currentWeather.instant.details.wind_from_direction,
            windSpeed: currentWeather.instant.details.wind_speed.toFixed(1).replace('.', ','),
            symbol: currentWeather.next_1_hours.summary.symbol_code
        };

        updateWeatherDisplay(weather);
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

function updateWeatherDisplay(weather) {
    const elements = {
        temp: document.querySelector('.weather-temp'),
        precip: document.querySelector('.weather-precip'),
        windSpeed: document.querySelector('.weather-wind-speed'),
        windDir: document.querySelector('.weather-wind-dir'),
        symbol: document.querySelector('.weather-symbol')
    };

    if (elements.temp) elements.temp.textContent = `${weather.temperature}°`;
    if (elements.precip) elements.precip.textContent = `${weather.precipitation} mm`;
    if (elements.windSpeed) elements.windSpeed.textContent = `${weather.windSpeed} m/s`;
    if (elements.windDir) elements.windDir.style.transform = `rotate(${weather.windDirection + 180}deg)`;
    if (elements.symbol) elements.symbol.src = `path/to/weather-icons/${weather.symbol}.svg`;
}

// Fetch weather immediately
fetchWeather();

// Update every 5 minutes
setInterval(fetchWeather, 5 * 60 * 1000);