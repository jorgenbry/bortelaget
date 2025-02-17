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

        // Log iframe properties
        console.log('Iframe current state:', {
            id: iframe.id,
            src: iframe.src,
            width: iframe.style.width,
            height: iframe.style.height,
            visibility: getComputedStyle(iframe).visibility,
            display: getComputedStyle(iframe).display
        });

        players[playerId] = new YT.Player(playerId, {
            videoId: videoId,
            playerVars: {
                'controls': 0,
                'modestbranding': 1,
                'showinfo': 0,
                'rel': 0,
                'iv_load_policy': 3,
                'fs': 0
            },
            events: {
                'onReady': (event) => {
                    console.log('Player ready for ID:', playerId);
                    onPlayerReady(event, playerId);
                },
                'onStateChange': (event) => {
                    console.log('Player state changed:', event.data);
                },
                'onError': (event) => {
                    console.error('Player error:', event.data);
                }
            }
        });
    });
}

function onPlayerReady(event, playerId) {
    const playerContainer = document.getElementById(playerId).closest('[data-video-id]');
    if (!playerContainer) return;
    
    const playButton = playerContainer.querySelector('.play-button');
    const pauseButton = playerContainer.querySelector('.pause-button');
    
    if (playButton) {
        playButton.addEventListener('click', () => {
            console.log('Play clicked');
            players[playerId].playVideo();
        });
    }
    
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            console.log('Pause clicked');
            players[playerId].pauseVideo();
        });
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

    