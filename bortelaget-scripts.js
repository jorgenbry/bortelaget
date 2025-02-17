    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};

console.log('Script loaded');

// Initialize players for all YouTube embeds on the page
function initYoutubePlayers() {
    console.log('Initializing players');
    // Only select the parent container
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

        // Find control buttons before initializing player
        const buttons = {
            play: container.parentElement.querySelector('.play-button'),
            pause: container.parentElement.querySelector('.pause-button'),
            soundOn: container.parentElement.querySelector('.sound-on-button'),
            soundOff: container.parentElement.querySelector('.sound-off-button')
        };

        console.log('Found buttons:', {
            play: !!buttons.play,
            pause: !!buttons.pause,
            soundOn: !!buttons.soundOn,
            soundOff: !!buttons.soundOff
        });

        // Set initial button states
        if (buttons.play) buttons.play.style.display = 'none';
        if (buttons.pause) buttons.pause.style.display = 'flex';
        if (buttons.soundOn) buttons.soundOn.style.display = 'none';
        if (buttons.soundOff) buttons.soundOff.style.display = 'flex';

        players[playerId] = new YT.Player(playerId, {
            events: {
                'onReady': (event) => {
                    console.log('Player ready for ID:', playerId);
                    setupPlayerControls(event.target, buttons);
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

function setupPlayerControls(player, buttons) {
    console.log('Setting up controls with buttons:', buttons);

    // Setup play/pause toggle
    if (buttons.play && buttons.pause) {
        buttons.play.addEventListener('click', () => {
            console.log('Play clicked');
            player.playVideo();
            buttons.play.style.display = 'none';
            buttons.pause.style.display = 'flex';
        });

        buttons.pause.addEventListener('click', () => {
            console.log('Pause clicked');
            player.pauseVideo();
            buttons.play.style.display = 'flex';
            buttons.pause.style.display = 'none';
        });
    }

    // Setup sound toggle
    if (buttons.soundOn && buttons.soundOff) {
        buttons.soundOn.addEventListener('click', () => {
            console.log('Sound On clicked');
            player.mute();
            buttons.soundOn.style.display = 'none';
            buttons.soundOff.style.display = 'flex';
        });

        buttons.soundOff.addEventListener('click', () => {
            console.log('Sound Off clicked');
            player.unMute();
            buttons.soundOn.style.display = 'flex';
            buttons.soundOff.style.display = 'none';
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

    