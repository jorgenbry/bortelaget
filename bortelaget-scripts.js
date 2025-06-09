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
    const location = weatherConfig.locations[weatherConfig.currentLocation];
    try {
        const response = await fetch(`${weatherConfig.apiUrl}/api/weather?lat=${location.lat}&lon=${location.lon}`);
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        const currentWeather = data.properties.timeseries[0].data;
        
        updateWeatherDisplay({
            temperature: currentWeather.instant.details.air_temperature?.toFixed(1) || '0',
            precipitation: currentWeather.instant.details.precipitation_rate?.toFixed(1) || '0',
            windDirection: currentWeather.instant.details.wind_from_direction || 0,
            windSpeed: currentWeather.instant.details.wind_speed?.toFixed(1) || '0',
            symbol: currentWeather.next_1_hours?.summary?.symbol_code || 'clearsky_day'
        });
    } catch (error) {
        console.error('Weather error:', error);
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
    if (elements.windDir) elements.windDir.style.transform = `rotate(${weather.windDirection}deg)`;
    if (elements.symbol) {
        elements.symbol.innerHTML = `<img src="${weatherConfig.apiUrl}/icons/${weather.symbol}.svg" alt="${weather.symbol}">`;
    }
}

// YouTube functionality
function setupYouTubePlayer() {
    const container = document.querySelector('div[data-video-id]');
    if (!container) return;

    const iframe = container.querySelector('iframe');
    if (!iframe) return;

    const buttons = {
        play: document.querySelector('.play-button'),
        pause: document.querySelector('.pause-button'),
        soundOn: document.querySelector('.sound-on-button'),
        soundOff: document.querySelector('.sound-off-button')
    };

    // Set initial button states
    if (buttons.play) buttons.play.style.display = 'none';
    if (buttons.pause) buttons.pause.style.display = 'flex';
    if (buttons.soundOn) buttons.soundOn.style.display = 'flex';
    if (buttons.soundOff) buttons.soundOff.style.display = 'none';

    // Configure iframe
    const srcUrl = new URL(iframe.src);
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
    iframe.src = srcUrl.toString();

    // Set up button handlers
    if (buttons.pause) {
        buttons.pause.onclick = () => {
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
    const navShow = document.querySelector('.nav-show');
    const navButton = document.querySelector('.w-nav-button');
    if (navShow && navButton) {
        navShow.addEventListener('click', () => navButton.click());
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupYouTubePlayer();
    fetchWeather();
    setInterval(fetchWeather, 5 * 60 * 1000);
});

