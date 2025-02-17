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
    // Find all iframes with data-video-id
    const playerIframes = document.querySelectorAll('iframe[data-video-id]');
    console.log('Found iframes:', playerIframes.length);
    
    playerIframes.forEach((iframe, index) => {
        // Get video ID from data attribute
        const videoId = iframe.getAttribute('data-video-id');
        console.log('Video ID:', videoId);
        if (!videoId) return;

        // Create a unique ID for each player
        const playerId = `bortelaget-player-${index}`;
        iframe.id = playerId;

        // Initialize player using the existing iframe
        players[playerId] = new YT.Player(playerId, {
            events: {
                'onReady': function(event) {
                    onPlayerReady(event, playerId);
                }
            }
        });
    });
}

function onPlayerReady(event, playerId) {
    console.log('Player ready:', playerId);
    
    // Add click handlers for this specific player's controls
    const playerContainer = document.getElementById(playerId).closest('[data-video-id]');
    if (!playerContainer) return;
    
    const playButton = playerContainer.querySelector('.play-button');
    const pauseButton = playerContainer.querySelector('.pause-button');
    const muteButton = playerContainer.querySelector('.mute-button');
    
    if (playButton) {
        playButton.addEventListener('click', () => {
            players[playerId].playVideo();
        });
    }
    
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            players[playerId].pauseVideo();
        });
    }
    
    if (muteButton) {
        muteButton.addEventListener('click', () => {
            if (players[playerId].isMuted()) {
                players[playerId].unMute();
                muteButton.textContent = 'Mute';
            } else {
                players[playerId].mute();
                muteButton.textContent = 'Unmute';
            }
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

    