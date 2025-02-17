    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};

// Debug loading
console.log('Script loaded');

// Initialize players for all YouTube embeds on the page
function initYoutubePlayers() {
    console.log('Initializing players');
    const playerIframes = document.querySelectorAll('iframe[data-video-id]');
    console.log('Found iframes:', playerIframes.length);
    
    playerIframes.forEach((iframe, index) => {
        const videoId = iframe.getAttribute('data-video-id');
        console.log('Processing iframe with video ID:', videoId);
        
        if (!videoId) return;

        const playerId = `bortelaget-player-${index}`;
        iframe.id = playerId;

        // Initialize with full player parameters
        players[playerId] = new YT.Player(playerId, {
            host: 'https://www.youtube-nocookie.com',
            playerVars: {
                'controls': 0,
                'modestbranding': 1,
                'showinfo': 0,
                'rel': 0,
                'iv_load_policy': 3,
                'fs': 0,
                'playsinline': 1,
                'disablekb': 1,
                'autoplay': 1,
                'mute': 1,
                'loop': 0,
                'cc_load_policy': 0,
                'origin': window.location.origin,
                'widget_referrer': window.location.href,
                'start': 1
            },
            events: {
                'onReady': (event) => {
                    console.log('Player ready for ID:', playerId);
                    setupPlayerControls(event.target, playerId);
                }
            }
        });
    });
}

function setupPlayerControls(player, playerId) {
    // Find the closest container with player controls
    const container = document.getElementById(playerId).closest('.player');
    if (!container) {
        console.error('Could not find container for player:', playerId);
        return;
    }

    const playButton = container.querySelector('.play-button');
    const pauseButton = container.querySelector('.pause-button');

    if (playButton) {
        playButton.addEventListener('click', () => {
            console.log('Play clicked for:', playerId);
            try {
                player.playVideo();
                console.log('Play command sent');
            } catch (e) {
                console.error('Error playing video:', e);
            }
        });
    } else {
        console.error('Play button not found for:', playerId);
    }

    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            console.log('Pause clicked for:', playerId);
            try {
                player.pauseVideo();
                console.log('Pause command sent');
            } catch (e) {
                console.error('Error pausing video:', e);
            }
        });
    } else {
        console.error('Pause button not found for:', playerId);
    }
}

// When YouTube API is ready, initialize all players
function onYouTubeIframeAPIReady() {
    console.log('YouTube API Ready');
    initYoutubePlayers();
}

// Additional debug
if (typeof YT === 'undefined') {
    console.log('YouTube API not loaded');
}

    