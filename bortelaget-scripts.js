    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

    // YouTube Player Code
let players = {};
let buttons = null;

function setupButtons() {
    buttons = {
        play: document.querySelector('.play-button'),
        pause: document.querySelector('.pause-button'),
        soundOn: document.querySelector('.sound-on-button'),
        soundOff: document.querySelector('.sound-off-button')
    };

    // Set initial visibility
    if (buttons.play) buttons.play.style.display = 'none';
    if (buttons.pause) buttons.pause.style.display = 'flex';
    if (buttons.soundOn) buttons.soundOn.style.display = 'flex';
    if (buttons.soundOff) buttons.soundOff.style.display = 'none';
}

function initYoutubePlayer() {
    const container = document.querySelector('div[data-video-id]');
    if (!container) return;

    const iframe = container.querySelector('iframe');
    if (!iframe) return;

    // Update iframe src to enable API
    let srcUrl = new URL(iframe.src);
    srcUrl.searchParams.set('enablejsapi', '1');
    srcUrl.searchParams.set('origin', window.location.origin);
    iframe.src = srcUrl.toString();

    // Set up button click handlers
    if (buttons.pause) {
        buttons.pause.onclick = function() {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'pauseVideo'
            }), '*');
            buttons.pause.style.display = 'none';
            buttons.play.style.display = 'flex';
        };
    }

    if (buttons.play) {
        buttons.play.onclick = function() {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'playVideo'
            }), '*');
            buttons.play.style.display = 'none';
            buttons.pause.style.display = 'flex';
        };
    }

    if (buttons.soundOn) {
        buttons.soundOn.onclick = function() {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'unMute'
            }), '*');
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'setVolume',
                args: [100]
            }), '*');
            buttons.soundOn.style.display = 'none';
            buttons.soundOff.style.display = 'flex';
        };
    }

    if (buttons.soundOff) {
        buttons.soundOff.onclick = function() {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'mute'
            }), '*');
            buttons.soundOff.style.display = 'none';
            buttons.soundOn.style.display = 'flex';
        };
    }
}

// Set up buttons immediately
setupButtons();

// Initialize player when API is ready
function onYouTubeIframeAPIReady() {
    initYoutubePlayer();
}

// Weather Code (in an IIFE to avoid global scope pollution)
(function() {
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
                temperature: currentWeather.instant.details.air_temperature.toFixed(1),
                precipitation: currentWeather.instant.details.precipitation_rate,
                windDirection: currentWeather.instant.details.wind_from_direction,
                windSpeed: currentWeather.instant.details.wind_speed.toFixed(1),
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

    // Fetch weather immediately
    fetchWeather();

    // Update every 5 minutes
    setInterval(fetchWeather, 5 * 60 * 1000);
})();