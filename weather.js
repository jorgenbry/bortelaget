// Configuration
const config = {
    // API URLs for different environments
    apiUrls: {
        development: 'http://localhost:3001',
        staging: 'https://bortelaget.vercel.app',
        production: 'https://bortelaget.no'
    },
    
    // Get the current environment
    getEnvironment() {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname === 'bortelaget.webflow.io') {
            return 'staging';
        } else {
            return 'production';
        }
    },
    
    // Get the current API URL
    getApiUrl() {
        const env = this.getEnvironment();
        return this.apiUrls[env];
    }
};

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

// Weather symbol mapping
const weatherSymbolKeys = {
    clearsky_day: '01d',
    clearsky_night: '01n',
    clearsky_polartwilight: '01m',
    fair_day: '02d',
    fair_night: '02n',
    fair_polartwilight: '02m',
    partlycloudy_day: '03d',
    partlycloudy_night: '03n',
    partlycloudy_polartwilight: '03m',
    cloudy: '04',
    rainshowers_day: '05d',
    rainshowers_night: '05n',
    rainshowers_polartwilight: '05m',
    rainshowersandthunder_day: '06d',
    rainshowersandthunder_night: '06n',
    rainshowersandthunder_polartwilight: '06m',
    sleetshowers_day: '07d',
    sleetshowers_night: '07n',
    sleetshowers_polartwilight: '07m',
    snowshowers_day: '08d',
    snowshowers_night: '08n',
    snowshowers_polartwilight: '08m',
    rain: '09',
    heavyrain: '10',
    heavyrainandthunder: '11',
    sleet: '12',
    snow: '13',
    snowandthunder: '14',
    fog: '15',
    sleetshowersandthunder_day: '20d',
    sleetshowersandthunder_night: '20n',
    sleetshowersandthunder_polartwilight: '20m',
    snowshowersandthunder_day: '21d',
    snowshowersandthunder_night: '21n',
    snowshowersandthunder_polartwilight: '21m',
    rainandthunder: '22',
    sleetandthunder: '23',
    lightrainshowersandthunder_day: '24d',
    lightrainshowersandthunder_night: '24n',
    lightrainshowersandthunder_polartwilight: '24m',
    heavyrainshowersandthunder_day: '25d',
    heavyrainshowersandthunder_night: '25n',
    heavyrainshowersandthunder_polartwilight: '25m',
    lightssleetshowersandthunder_day: '26d',
    lightssleetshowersandthunder_night: '26n',
    lightssleetshowersandthunder_polartwilight: '26m',
    heavysleetshowersandthunder_day: '27d',
    heavysleetshowersandthunder_night: '27n',
    heavysleetshowersandthunder_polartwilight: '27m',
    lightssnowshowersandthunder_day: '28d',
    lightssnowshowersandthunder_night: '28n',
    lightssnowshowersandthunder_polartwilight: '28m',
    heavysnowshowersandthunder_day: '29d',
    heavysnowshowersandthunder_night: '29n',
    heavysnowshowersandthunder_polartwilight: '29m',
    lightrainandthunder: '30',
    lightsleetandthunder: '31',
    heavysleetandthunder: '32',
    lightsnowandthunder: '33',
    heavysnowandthunder: '34',
    lightrainshowers_day: '40d',
    lightrainshowers_night: '40n',
    lightrainshowers_polartwilight: '40m',
    heavyrainshowers_day: '41d',
    heavyrainshowers_night: '41n',
    heavyrainshowers_polartwilight: '41m',
    lightsleetshowers_day: '42d',
    lightsleetshowers_night: '42n',
    lightsleetshowers_polartwilight: '42m',
    heavysleetshowers_day: '43d',
    heavysleetshowers_night: '43n',
    heavysleetshowers_polartwilight: '43m',
    lightsnowshowers_day: '44d',
    lightsnowshowers_night: '44n',
    lightsnowshowers_polartwilight: '44m',
    heavysnowshowers_day: '45d',
    heavysnowshowers_night: '45n',
    heavysnowshowers_polartwilight: '45m',
    lightrain: '46',
    lightsleet: '47',
    heavysleet: '48',
    lightsnow: '49',
    heavysnow: '50'
};

// Weather functionality
async function fetchWeather(location = currentLocation) {
    try {
        const apiUrl = config.getApiUrl();
        console.log('Current environment:', config.getEnvironment());
        console.log('Using API URL:', apiUrl);
        console.log('Fetching weather for:', location);
        
        const response = await fetch(`${apiUrl}/api/weather?lat=${location.lat}&lon=${location.lon}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('API Response status:', response.status);
        console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Raw weather data:', data);
        
        if (!data.properties || !data.properties.timeseries || !data.properties.timeseries[0]) {
            console.error('Invalid data structure:', data);
            throw new Error('Invalid weather data structure received');
        }
        
        const currentWeather = data.properties.timeseries[0].data;
        console.log('Current weather data:', currentWeather);
        
        if (!currentWeather.instant || !currentWeather.instant.details) {
            console.error('Missing weather details:', currentWeather);
            throw new Error('Missing weather details in response');
        }
        
        const weather = {
            temperature: currentWeather.instant.details.air_temperature?.toFixed(1).replace('.', ',') || '0',
            precipitation: currentWeather.instant.details.precipitation_rate?.toString().replace('.', ',') || '0',
            windDirection: currentWeather.instant.details.wind_from_direction || 0,
            windSpeed: currentWeather.instant.details.wind_speed?.toFixed(1).replace('.', ',') || '0',
            symbol: currentWeather.next_1_hours?.summary?.symbol_code || 'clearsky_day'
        };

        console.log('Processed weather data:', weather);
        updateWeatherDisplay(weather);
    } catch (error) {
        console.error('Error fetching weather:', error);
        // Show error in the UI
        const elements = {
            temp: document.querySelector('.weather-temp'),
            precip: document.querySelector('.weather-precip'),
            windSpeed: document.querySelector('.weather-wind-speed'),
            windDir: document.querySelector('.weather-wind-dir'),
            symbol: document.querySelector('.weather-symbol')
        };
        
        if (elements.temp) elements.temp.textContent = 'Error';
        if (elements.precip) elements.precip.textContent = 'Error';
        if (elements.windSpeed) elements.windSpeed.textContent = 'Error';
        if (elements.windDir) elements.windDir.style.transform = 'rotate(0deg)';
        if (elements.symbol) elements.symbol.innerHTML = '';
    }
}

// Update weather display
function updateWeatherDisplay(weather) {
    const elements = {
        temp: document.querySelector('.weather-temp'),
        precip: document.querySelector('.weather-precip'),
        windSpeed: document.querySelector('.weather-wind-speed'),
        windDir: document.querySelector('.weather-wind-dir'),
        symbol: document.querySelector('.weather-symbol')
    };

    if (elements.temp) elements.temp.textContent = weather.temperature;
    if (elements.precip) elements.precip.textContent = weather.precipitation;
    if (elements.windSpeed) elements.windSpeed.textContent = weather.windSpeed;
    if (elements.windDir) elements.windDir.style.transform = `rotate(${weather.windDirection}deg)`;
    if (elements.symbol) {
        const symbolCode = weatherSymbolKeys[weather.symbol] || '01d';
        elements.symbol.innerHTML = `<img src="https://bortelaget.vercel.app/icons/${symbolCode}.svg" alt="${weather.symbol}">`;
    }
}

// Set up location dropdown
function setupDropdown() {
    const dropdown = document.querySelector('.weather-dropdown');
    const dropdownContent = document.querySelector('.weather-dropdown-content');
    const locationText = document.querySelector('.weather-location');

    if (!dropdown || !dropdownContent || !locationText) return;

    // Set initial location
    locationText.textContent = currentLocation.name;

    // Toggle dropdown
    dropdown.addEventListener('click', function() {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });

    // Handle location selection
    const locationItems = dropdownContent.querySelectorAll('.weather-location-item');
    locationItems.forEach(item => {
        item.addEventListener('click', function() {
            const locationName = this.getAttribute('data-location');
            if (locations[locationName]) {
                currentLocation = locations[locationName];
                locationText.textContent = currentLocation.name;
                dropdownContent.style.display = 'none';
                fetchWeather(currentLocation);
            }
        });
    });
}

// Initialize weather functionality
document.addEventListener('DOMContentLoaded', function() {
    setupDropdown();
    fetchWeather();
    // Refresh weather every 5 minutes
    setInterval(fetchWeather, 5 * 60 * 1000);
});