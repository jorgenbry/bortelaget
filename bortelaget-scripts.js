    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};

console.log('Script loaded');

// Initialize players for all YouTube embeds on the page
function initYoutubePlayers() {
    console.log('Initializing players');
    const playerContainers = document.querySelectorAll('div[data-video-id]');
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

        // Find control buttons using exact classes
        const controlsContainer = container.parentElement.querySelector('.player-control-buttons');
        const buttons = {
            play: controlsContainer.querySelector('.button.player-button.play-button'),
            pause: controlsContainer.querySelector('.button.player-button.pause-button'),
            soundOn: controlsContainer.querySelector('.button.player-button.sound-on-button'),
            soundOff: controlsContainer.querySelector('.button.player-button.sound-off-button')
        };

        console.log('Found buttons:', buttons);

        // Set initial states
        buttons.play.style.display = 'none';
        buttons.pause.style.display = 'flex';
        buttons.soundOn.style.display = 'flex';
        buttons.soundOff.style.display = 'none';

        players[playerId] = new YT.Player(playerId, {
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'modestbranding': 1,
                'showinfo': 0,
                'rel': 0,
                'iv_load_policy': 3,
                'fs': 0,
                'playsinline': 1,
                'disablekb': 1,
                'mute': 1
            },
            events: {
                'onReady': (event) => {
                    console.log('Player ready for ID:', playerId);
                    console.log('Player state:', event.target.getPlayerState());
                    setupPlayerControls(event.target, buttons, playerId);
                },
                'onStateChange': (event) => {
                    console.log('Player state changed for ID:', playerId, 'State:', event.data);
                },
                'onError': (event) => {
                    console.error('Player error for ID:', playerId, 'Error:', event.data);
                }
            }
        });
        
        console.log('Player initialized:', playerId);
    });
}

function setupPlayerControls(player, buttons, playerId) {
    console.log('Setting up controls for player:', playerId);

    // Setup play/pause toggle
    buttons.play.onclick = function() {
        console.log('Play clicked for:', playerId);
        player.playVideo();
        buttons.play.style.display = 'none';
        buttons.pause.style.display = 'flex';
    };

    buttons.pause.onclick = function() {
        console.log('Pause clicked for:', playerId);
        player.pauseVideo();
        buttons.play.style.display = 'flex';
        buttons.pause.style.display = 'none';
    };

    // Setup sound toggle
    buttons.soundOn.onclick = function() {
        console.log('Sound On clicked for:', playerId);
        player.unMute();
        buttons.soundOn.style.display = 'none';
        buttons.soundOff.style.display = 'flex';
    };

    buttons.soundOff.onclick = function() {
        console.log('Sound Off clicked for:', playerId);
        player.mute();
        buttons.soundOn.style.display = 'flex';
        buttons.soundOff.style.display = 'none';
    };

    console.log('Control setup complete for:', playerId);
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

    