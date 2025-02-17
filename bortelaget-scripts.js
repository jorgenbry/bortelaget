    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

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
        new YT.Player(playerId, {
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
}

    