    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};
let buttons = {};

console.log('Script loaded');

// Find buttons and store them
function findButtons() {
    console.log('Finding buttons');
    
    const container = document.querySelector('.player');
    if (!container) {
        console.error('No player container found');
        return;
    }

    buttons = {
        play: container.querySelector('.button.player-button.play-button'),
        pause: container.querySelector('.button.player-button.pause-button'),
        soundOn: container.querySelector('.button.player-button.sound-on-button'),
        soundOff: container.querySelector('.button.player-button.sound-off-button')
    };

    console.log('Found buttons:', buttons);

    // Set initial states
    buttons.play.style.display = 'none';
    buttons.pause.style.display = 'flex';
    buttons.soundOn.style.display = 'flex';
    buttons.soundOff.style.display = 'none';
}

// Initialize YouTube player
function initYoutubePlayer() {
    console.log('Initializing player');
    const container = document.querySelector('div[data-video-id]');
    if (!container) {
        console.error('No video container found');
        return;
    }

    const videoId = container.getAttribute('data-video-id');
    const iframe = container.querySelector('iframe');
    
    if (!iframe || !videoId) {
        console.error('No iframe or video ID found');
        return;
    }

    iframe.id = 'bortelaget-player';
    
    players.player = new YT.Player('bortelaget-player', {
        events: {
            'onReady': (event) => {
                console.log('Player ready');
                players.player = event.target;
                
                // Now that player is ready, set up button handlers
                buttons.pause.onclick = function() {
                    console.log('Pause clicked');
                    players.player.pauseVideo();
                    buttons.pause.style.display = 'none';
                    buttons.play.style.display = 'flex';
                };

                buttons.play.onclick = function() {
                    console.log('Play clicked');
                    players.player.playVideo();
                    buttons.play.style.display = 'none';
                    buttons.pause.style.display = 'flex';
                };

                buttons.soundOn.onclick = function() {
                    console.log('Sound On clicked');
                    players.player.unMute();
                    players.player.setVolume(100);
                    buttons.soundOn.style.display = 'none';
                    buttons.soundOff.style.display = 'flex';
                };

                buttons.soundOff.onclick = function() {
                    console.log('Sound Off clicked');
                    players.player.mute();
                    buttons.soundOff.style.display = 'none';
                    buttons.soundOn.style.display = 'flex';
                };

                console.log('Button handlers attached to ready player');
            },
            'onStateChange': (event) => {
                console.log('Player state changed:', event.data);
                // -1 (unstarted)
                // 0 (ended)
                // 1 (playing)
                // 2 (paused)
                // 3 (buffering)
                // 5 (video cued)
            },
            'onError': (event) => {
                console.error('Player error:', event.data);
            }
        }
    });
}

// Find buttons immediately
findButtons();

// When YouTube API is ready, initialize player
function onYouTubeIframeAPIReady() {
    console.log('YouTube API Ready');
    initYoutubePlayer();
}

// Add a global click handler to verify event bubbling
document.addEventListener('click', function(e) {
    if (e.target.closest('.player-button')) {
        console.log('Button clicked (global handler)');
    }
});

// Additional debug
if (typeof YT === 'undefined') {
    console.log('YouTube API not loaded');
}


// Weather widget

async function fetchWeather() {
    try {
        const response = await fetch('https://api.met.no/weatherapi/nowcast/2.0/complete?lat=62.0758&lon=9.1280', {
            headers: {
                'User-Agent': 'Bortelaget/1.0 (https://bortelaget.no)'
            }
        });
        
        const data = await response.json();
        const currentWeather = data.properties.timeseries[0].data;
        
        // Extract the specific properties we want
        const weather = {
            temperature: Math.round(currentWeather.instant.details.air_temperature),
            precipitation: currentWeather.instant.details.precipitation_rate,
            windDirection: currentWeather.instant.details.wind_from_direction,
            windSpeed: Math.round(currentWeather.instant.details.wind_speed),
            symbol: currentWeather.next_1_hours.summary.symbol_code
        };

        console.log('Weather data:', weather);
        updateWeatherDisplay(weather);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

function updateWeatherDisplay(weather) {
    // Update DOM elements - adjust selectors to match your HTML
    document.querySelector('.weather-temp').textContent = `${weather.temperature}°C`;
    document.querySelector('.weather-precip').textContent = `${weather.precipitation} mm/h`;
    document.querySelector('.weather-wind-speed').textContent = `${weather.windSpeed} m/s`;
    document.querySelector('.weather-wind-dir').style.transform = `rotate(${weather.windDirection}deg)`;
    document.querySelector('.weather-symbol').src = `path/to/weather-icons/${weather.symbol}.svg`;
}

// Fetch weather immediately
fetchWeather();

// Update every 5 minutes
setInterval(fetchWeather, 5 * 60 * 1000);