    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};

console.log('Script loaded');

// Initialize players for all YouTube embeds on the page
function initYoutubePlayers() {
    console.log('Initializing players');
    const playerContainers = document.querySelectorAll('[data-video-id]');
    console.log('Found containers:', playerContainers.length);
    
    playerContainers.forEach((container, index) => {
        const videoId = container.getAttribute('data-video-id');
        console.log('Processing video ID:', videoId);
        
        if (!videoId) return;

        const iframe = container.querySelector('iframe');
        if (!iframe) {
            console.error('No iframe found in container:', container);
            return;
        }

        const playerId = `bortelaget-player-${index}`;
        iframe.id = playerId;
        console.log('Created player ID:', playerId);

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

function setupPlayerControls(player, container) {
    console.log('Setting up controls for container');
    
    // Find the control buttons container
    const controlsContainer = container.closest('.player').querySelector('.player-control-buttons');
    console.log('Found controls container:', !!controlsContainer);

    if (!controlsContainer) {
        console.error('Controls container not found');
        return;
    }

    // Get all button elements with more specific selectors
    const playIcon = controlsContainer.querySelector('.player-button.play-button');
    const pauseIcon = controlsContainer.querySelector('.player-button.pause-button');
    const soundOnIcon = controlsContainer.querySelector('.player-button.sound-on-button');
    const soundOffIcon = controlsContainer.querySelector('.player-button.sound-off-button');

    console.log('Found buttons:', {
        playIcon: !!playIcon,
        pauseIcon: !!pauseIcon,
        soundOnIcon: !!soundOnIcon,
        soundOffIcon: !!soundOffIcon
    });

    // Setup play/pause toggle
    if (playIcon && pauseIcon) {
        console.log('Setting up play/pause buttons');
        
        playIcon.addEventListener('click', () => {
            console.log('Play clicked');
            player.playVideo();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        });

        pauseIcon.addEventListener('click', () => {
            console.log('Pause clicked');
            player.pauseVideo();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        });

        // Initial state
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }

    // Setup sound toggle
    if (soundOnIcon && soundOffIcon) {
        console.log('Setting up sound buttons');
        
        soundOnIcon.addEventListener('click', () => {
            console.log('Sound On clicked');
            player.mute();
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
        });

        soundOffIcon.addEventListener('click', () => {
            console.log('Sound Off clicked');
            player.unMute();
            soundOnIcon.style.display = 'block';
            soundOffIcon.style.display = 'none';
        });

        // Initial state
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';
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

    