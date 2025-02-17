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
    const playerContainers = document.querySelectorAll('.bortelaget-player');
    console.log('Found containers:', playerContainers.length);
    
    playerContainers.forEach((container, index) => {
        const videoId = container.getAttribute('data-video-id');
        console.log('Processing video ID:', videoId);
        
        if (!videoId) return;

        const iframe = container.querySelector('iframe');
        if (!iframe) return;

        const playerId = `bortelaget-player-${index}`;
        iframe.id = playerId;

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
                    setupPlayerControls(event.target, container);
                }
            }
        });
    });
}

function setupPlayerControls(player, container) {
    // Get all button elements
    const playIcon = container.querySelector('.play-button');
    const pauseIcon = container.querySelector('.pause-button');
    const soundOnIcon = container.querySelector('.sound-on-button');
    const soundOffIcon = container.querySelector('.sound-off-button');

    // Initially hide pause icon and show play icon
    if (playIcon && pauseIcon) {
        // Video autoplays, so initially show pause
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';

        // Setup play/pause toggle
        [playIcon, pauseIcon].forEach(button => {
            button.addEventListener('click', () => {
                if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                } else {
                    player.playVideo();
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                }
            });
        });
    }

    // Initially show sound-off icon (video starts muted)
    if (soundOnIcon && soundOffIcon) {
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';

        // Setup sound toggle
        [soundOnIcon, soundOffIcon].forEach(button => {
            button.addEventListener('click', () => {
                if (player.isMuted()) {
                    player.unMute();
                    soundOnIcon.style.display = 'block';
                    soundOffIcon.style.display = 'none';
                } else {
                    player.mute();
                    soundOnIcon.style.display = 'none';
                    soundOffIcon.style.display = 'block';
                }
            });
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

    