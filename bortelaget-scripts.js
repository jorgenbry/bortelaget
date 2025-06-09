// Weather configuration
const weatherConfig = {
    locations: {
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
    },
    currentLocation: 'dombas',
    apiUrl: 'https://bortelaget.vercel.app'
};

// Weather functionality
async function fetchWeather() {
    console.log('Starting weather fetch...');
    const location = weatherConfig.locations[weatherConfig.currentLocation];
    console.log('Using location:', location);
    
    try {
        const url = `${weatherConfig.apiUrl}/api/weather?lat=${location.lat}&lon=${location.lon}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`Weather fetch failed: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Received weather data:', data);
        
        if (!data.properties?.timeseries?.[0]?.data) {
            console.error('Invalid data structure:', data);
            throw new Error('Invalid weather data structure');
        }
        
        const currentWeather = data.properties.timeseries[0].data;
        console.log('Current weather:', currentWeather);
        
        const weather = {
            temperature: currentWeather.instant.details.air_temperature?.toFixed(1) || '0',
            precipitation: currentWeather.instant.details.precipitation_rate?.toFixed(1) || '0',
            windDirection: currentWeather.instant.details.wind_from_direction || 0,
            windSpeed: currentWeather.instant.details.wind_speed?.toFixed(1) || '0',
            symbol: currentWeather.next_1_hours?.summary?.symbol_code || 'clearsky_day'
        };
        
        console.log('Processed weather:', weather);
        updateWeatherDisplay(weather);
    } catch (error) {
        console.error('Weather error:', error);
        console.error('Error stack:', error.stack);
        updateWeatherDisplay({
            temperature: 'Error',
            precipitation: 'Error',
            windDirection: 0,
            windSpeed: 'Error',
            symbol: 'clearsky_day'
        });
    }
}

function updateWeatherDisplay(weather) {
    console.log('Updating weather display with:', weather);
    
    const elements = {
        temp: document.querySelector('.weather-temp'),
        precip: document.querySelector('.weather-precip'),
        windSpeed: document.querySelector('.weather-wind-speed'),
        windDir: document.querySelector('.weather-wind-dir'),
        symbol: document.querySelector('.weather-symbol')
    };
    
    console.log('Found elements:', elements);
    
    if (elements.temp) elements.temp.textContent = `${weather.temperature}°`;
    if (elements.precip) elements.precip.textContent = `${weather.precipitation} mm/h`;
    if (elements.windSpeed) elements.windSpeed.textContent = `${weather.windSpeed} m/s`;
    if (elements.windDir) elements.windDir.style.transform = `rotate(${weather.windDirection}deg)`;
    if (elements.symbol) {
        const iconUrl = `${weatherConfig.apiUrl}/icons/${weather.symbol}.svg`;
        console.log('Loading weather icon from:', iconUrl);
        elements.symbol.innerHTML = `<img src="${iconUrl}" alt="${weather.symbol}">`;
    }
}

// YouTube functionality
function setupYouTubePlayer() {
    console.log('Setting up YouTube player...');
    
    const container = document.querySelector('div[data-video-id]');
    console.log('Found video container:', container);
    
    if (!container) return;

    const iframe = container.querySelector('iframe');
    console.log('Found iframe:', iframe);
    
    if (!iframe) return;

    const buttons = {
        play: document.querySelector('.play-button'),
        pause: document.querySelector('.pause-button'),
        soundOn: document.querySelector('.sound-on-button'),
        soundOff: document.querySelector('.sound-off-button')
    };
    
    console.log('Found buttons:', buttons);

    // Set initial button states
    if (buttons.play) buttons.play.style.display = 'none';
    if (buttons.pause) buttons.pause.style.display = 'flex';
    if (buttons.soundOn) buttons.soundOn.style.display = 'flex';
    if (buttons.soundOff) buttons.soundOff.style.display = 'none';

    // Configure iframe
    const srcUrl = new URL(iframe.src);
    console.log('Original iframe src:', iframe.src);
    
    srcUrl.searchParams.set('enablejsapi', '1');
    srcUrl.searchParams.set('controls', '0');
    srcUrl.searchParams.set('modestbranding', '1');
    srcUrl.searchParams.set('showinfo', '0');
    srcUrl.searchParams.set('rel', '0');
    srcUrl.searchParams.set('iv_load_policy', '3');
    srcUrl.searchParams.set('fs', '0');
    srcUrl.searchParams.set('playsinline', '1');
    srcUrl.searchParams.set('disablekb', '1');
    srcUrl.searchParams.set('autoplay', '1');
    srcUrl.searchParams.set('mute', '1');
    srcUrl.searchParams.set('origin', window.location.origin);
    
    const newSrc = srcUrl.toString();
    console.log('New iframe src:', newSrc);
    iframe.src = newSrc;

    // Set up button handlers
    if (buttons.pause) {
        buttons.pause.onclick = () => {
            console.log('Pause button clicked');
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'pauseVideo'
            }), '*');
            buttons.pause.style.display = 'none';
            buttons.play.style.display = 'flex';
        };
    }

    if (buttons.play) {
        buttons.play.onclick = () => {
            console.log('Play button clicked');
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'playVideo'
            }), '*');
            buttons.play.style.display = 'none';
            buttons.pause.style.display = 'flex';
        };
    }

    if (buttons.soundOn) {
        buttons.soundOn.onclick = () => {
            console.log('Sound on button clicked');
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'unMute'
            }), '*');
            buttons.soundOn.style.display = 'none';
            buttons.soundOff.style.display = 'flex';
        };
    }

    if (buttons.soundOff) {
        buttons.soundOff.onclick = () => {
            console.log('Sound off button clicked');
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'mute'
            }), '*');
            buttons.soundOff.style.display = 'none';
            buttons.soundOn.style.display = 'flex';
        };
    }
}

// Navigation menu
function setupNavigation() {
    console.log('Setting up navigation...');
    
    const navShow = document.querySelector('.nav-show');
    const navButton = document.querySelector('.w-nav-button');
    
    console.log('Found nav elements:', { navShow, navButton });
    
    if (navShow && navButton) {
        navShow.addEventListener('click', () => {
            console.log('Nav show clicked');
            navButton.click();
        });
    }
}

// Initialize everything
console.log('Script starting...');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    setupNavigation();
    setupYouTubePlayer();
    fetchWeather();
    setInterval(fetchWeather, 5 * 60 * 1000);
});

