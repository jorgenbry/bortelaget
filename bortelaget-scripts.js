    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};

// Initialize players for all YouTube embeds on the page
function initYoutubePlayers() {
    // Find all iframes with data-video-id
    const playerIframes = document.querySelectorAll('iframe[data-video-id]');
    
    playerIframes.forEach((iframe, index) => {
        // Get video ID from data attribute
        const videoId = iframe.getAttribute('data-video-id');
        if (!videoId) return;

        // Create a unique ID for each player
        const playerId = `bortelaget-player-${index}`;
        iframe.id = playerId;

        // Initialize player using the existing iframe
        players[playerId] = new YT.Player(playerId, {
            events: {
                'onReady': onPlayerReady
            }
        });
    });
}

function onPlayerReady(event) {
    // Player is ready
    console.log('Player is ready');
}

// When YouTube API is ready, initialize all players
function onYouTubeIframeAPIReady() {
    initYoutubePlayers();
    
    // Add click handlers for custom controls
    document.addEventListener('click', function(e) {
        // Find the closest player container
        const container = e.target.closest('[data-video-id]');
        if (!container) return;
        
        const playerId = container.querySelector('iframe').id;
        const player = players[playerId];
        
        // Handle different control buttons
        if (e.target.matches('.play-button')) {
            player.playVideo();
        }
        else if (e.target.matches('.pause-button')) {
            player.pauseVideo();
        }
        else if (e.target.matches('.mute-button')) {
            if (player.isMuted()) {
                player.unMute();
                e.target.textContent = 'Mute';
            } else {
                player.mute();
                e.target.textContent = 'Unmute';
            }
        }
    });
}

    