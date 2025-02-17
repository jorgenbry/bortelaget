    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};

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
        if (!iframe) {
            console.error('No iframe found in container:', container);
            return;
        }

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
    console.log('Setting up controls for container:', container);
    
    // Get all button elements
    const playIcon = container.querySelector('.play-button');
    const pauseIcon = container.querySelector('.pause-button');
    const soundOnIcon = container.querySelector('.sound-on-button');
    const soundOffIcon = container.querySelector('.sound-off-button');

    console.log('Found buttons:', {
        playIcon: !!playIcon,
        pauseIcon: !!pauseIcon,
        soundOnIcon: !!soundOnIcon,
        soundOffIcon: !!soundOffIcon
    });

    // Initially hide pause icon and show play icon
    if (playIcon && pauseIcon) {
        console.log('Setting up play/pause buttons');
        // Video autoplays, so initially show pause
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';

        // Setup play/pause toggle
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
    } else {
        console.error('Play/Pause buttons not found');
    }

    // Initially show sound-off icon (video starts muted)
    if (soundOnIcon && soundOffIcon) {
        console.log('Setting up sound buttons');
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';

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
    } else {
        console.error('Sound buttons not found');
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

    