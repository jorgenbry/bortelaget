// Weather location configurations
const locations = {
    dombas: {
        name: 'Dombås',
        lat: '62.0758',
        lon: '9.1280'
    },
    lillehammer: {
        name: 'Lillehammer',
        lat: '61.1153',
        lon: '10.4662'
    }
};

// Current location (default to Dombås)
let currentLocation = locations.dombas;

// Weather functionality
async function fetchWeather(location = currentLocation) {
    try {
        const response = await fetch(`https://api.met.no/weatherapi/nowcast/2.0/complete?lat=${location.lat}&lon=${location.lon}`, {
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
    if (elements.precip) elements.precip.textContent = `${weather.precipitation} mm/h`;
    if (elements.windSpeed) elements.windSpeed.textContent = `${weather.windSpeed} m/s`;
    if (elements.windDir) elements.windDir.style.transform = `rotate(${weather.windDirection + 180}deg)`;
    if (elements.symbol) elements.symbol.src = `path/to/weather-icons/${weather.symbol}.svg`;
}

// Set up dropdown functionality
function setupDropdown() {
    const dropdown = document.querySelector('.weather-dropdown');
    const dropdownList = document.querySelector('.weather-dropdown-list');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownIcon = document.querySelector('.dropdown-icon');
    const placeLabel = document.querySelector('.widget-place');
    const dombasLink = document.querySelector('.dombas');
    const lillehammerLink = document.querySelector('.lillehammer');
    
    let isOpen = false;

    // Toggle dropdown icon rotation and Webflow's dropdown class
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', () => {
            isOpen = !isOpen;
            if (dropdownIcon) {
                dropdownIcon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    // Handle location changes
    if (dombasLink) {
        dombasLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentLocation = locations.dombas;
            if (placeLabel) placeLabel.textContent = currentLocation.name;
            fetchWeather(currentLocation);
            
            // Close dropdown
            if (dropdown) dropdown.classList.remove('w--open');
            if (dropdownList) dropdownList.classList.remove('w--open');
            if (dropdownIcon) dropdownIcon.style.transform = 'rotate(0deg)';
            isOpen = false;
        });
    }

    if (lillehammerLink) {
        lillehammerLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentLocation = locations.lillehammer;
            if (placeLabel) placeLabel.textContent = currentLocation.name;
            fetchWeather(currentLocation);
            
            // Close dropdown
            if (dropdown) dropdown.classList.remove('w--open');
            if (dropdownList) dropdownList.classList.remove('w--open');
            if (dropdownIcon) dropdownIcon.style.transform = 'rotate(0deg)';
            isOpen = false;
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupDropdown();
    fetchWeather(currentLocation);
    
    // Update every 5 minutes
    setInterval(() => fetchWeather(currentLocation), 5 * 60 * 1000);
});