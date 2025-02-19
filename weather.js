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

    console.log('Weather data received:', weather);
    console.log('Found symbol element:', elements.symbol);

    if (elements.temp) elements.temp.textContent = `${weather.temperature}°`;
    if (elements.precip) elements.precip.textContent = `${weather.precipitation} mm/h`;
    if (elements.windSpeed) elements.windSpeed.textContent = `${weather.windSpeed} m/s`;
    if (elements.windDir) elements.windDir.style.transform = `rotate(${weather.windDirection + 180}deg)`;
    
    if (elements.symbol) {
        const symbolCode = weatherSymbolKeys[weather.symbol] || '01d';
        console.log('Fetching symbol:', symbolCode);
        
        fetch(`https://bortelaget.vercel.app/icons/${symbolCode}.svg`)
            .then(response => {
                console.log('SVG response:', response.status);
                return response.text();
            })
            .then(svgContent => {
                console.log('SVG content received, length:', svgContent.length);
                
                // Create a wrapper div to safely parse the SVG
                const wrapper = document.createElement('div');
                wrapper.innerHTML = svgContent;
                
                // Get the SVG element
                const svg = wrapper.querySelector('svg');
                if (svg) {
                    // Add any desired classes or attributes
                    svg.classList.add('weather-symbol-svg');
                    svg.setAttribute('width', '40');
                    svg.setAttribute('height', '40');
                    svg.setAttribute('aria-label', weather.symbol.replace(/_/g, ' '));
                    
                    // Replace the current content with the new SVG
                    elements.symbol.innerHTML = '';
                    elements.symbol.appendChild(svg);
                    console.log('SVG inserted into DOM');
                } else {
                    console.log('No SVG element found in response');
                }
            })
            .catch(error => console.error('Error loading weather icon:', error));
    } else {
        console.log('Weather symbol element not found in DOM');
    }
}

// Set up dropdown functionality
function setupDropdown() {
    const dropdown = document.querySelector('.weather-dropdown');
    const dropdownList = document.querySelector('nav.dropdown-list.w-dropdown-list');
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

    function closeDropdown() {
        if (dropdown) dropdown.classList.remove('w--open');
        if (dropdownList) dropdownList.classList.remove('w--open');
        if (dropdownToggle) dropdownToggle.classList.remove('w--open');
        if (dropdownIcon) dropdownIcon.style.transform = 'rotate(0deg)';
        isOpen = false;
    }

    // Handle location changes
    if (dombasLink) {
        dombasLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentLocation = locations.dombas;
            if (placeLabel) placeLabel.textContent = currentLocation.name;
            fetchWeather(currentLocation);
            closeDropdown();
        });
    }

    if (lillehammerLink) {
        lillehammerLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentLocation = locations.lillehammer;
            if (placeLabel) placeLabel.textContent = currentLocation.name;
            fetchWeather(currentLocation);
            closeDropdown();
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