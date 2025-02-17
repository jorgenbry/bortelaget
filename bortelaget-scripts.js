    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Initialize players for all YouTube embeds on the page
function initYoutubePlayers() {
    // Find all elements with class 'bortelaget-player'
    const playerContainers = document.querySelectorAll('[data-video-id]');
    
    playerContainers.forEach((container, index) => {
        // Get video ID from data attribute
        const videoId = container.getAttribute('data-video-id');
        if (!videoId) return;

        // Create a unique ID for each player
        const playerId = `bortelaget-player-${index}`;
        
        // Create a div for the player
        const playerDiv = document.createElement('div');
        playerDiv.id = playerId;
        container.appendChild(playerDiv);

        // Initialize player
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

    