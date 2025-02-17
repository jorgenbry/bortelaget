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
                'onReady': onPlayerReady
            }
        });
    });
}

function onPlayerReady(event) {
    console.log('Player ready:', event);
}

// When YouTube API is ready, initialize all players
function onYouTubeIframeAPIReady() {
    console.log('YouTube API Ready');
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

// Additional debug
if (typeof YT === 'undefined') {
    console.log('YouTube API not loaded');
}

    