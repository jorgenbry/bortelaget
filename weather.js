async function fetchWeather() {
    try {
        const response = await fetch('https://api.met.no/weatherapi/nowcast/2.0/complete?lat=62.0758&lon=9.1280', {
            headers: {
                'User-Agent': 'Bortelaget/1.0 (https://bortelaget.no)'
            }
        });
        
        const data = await response.json();
        const currentWeather = data.properties.timeseries[0].data;
        
        // Extract and format the properties
        const weather = {
            temperature: currentWeather.instant.details.air_temperature.toFixed(1),
            precipitation: currentWeather.instant.details.precipitation_rate,
            windDirection: currentWeather.instant.details.wind_from_direction,
            windSpeed: currentWeather.instant.details.wind_speed.toFixed(1),
            symbol: currentWeather.next_1_hours.summary.symbol_code
        };

        console.log('Weather data:', weather);
        updateWeatherDisplay(weather);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

function updateWeatherDisplay(weather) {
    // Update DOM elements
    document.querySelector('.weather-temp').textContent = `${weather.temperature}°`;
    document.querySelector('.weather-precip').textContent = `${weather.precipitation} mm/h`;
    document.querySelector('.weather-wind-speed').textContent = `${weather.windSpeed} m/s`;
    
    // Rotate wind direction arrow
    const windArrow = document.querySelector('.weather-wind-dir');
    if (windArrow) {
        windArrow.style.transform = `rotate(${weather.windDirection + 180}deg)`;
        console.log('Wind direction rotation:', weather.windDirection + 180);
    }
    
    document.querySelector('.weather-symbol').src = `path/to/weather-icons/${weather.symbol}.svg`;
}

// Fetch weather immediately
fetchWeather();

// Update every 5 minutes
setInterval(fetchWeather, 5 * 60 * 1000); 