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

        // Find control buttons
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
        // Reversed sound icon logic since video starts muted
        if (buttons.soundOn) buttons.soundOn.style.display = 'flex';
        if (buttons.soundOff) buttons.soundOff.style.display = 'none';

        players[playerId] = new YT.Player(playerId, {
            events: {
                'onReady': (event) => {
                    console.log('Player ready for ID:', playerId);
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
    });
}

function setupPlayerControls(player, buttons, playerId) {
    console.log('Setting up controls for player:', playerId);

    // Setup play/pause toggle
    if (buttons.play && buttons.pause) {
        buttons.play.onclick = () => {
            console.log('Play clicked for:', playerId);
            try {
                player.playVideo();
                console.log('Play command sent');
                buttons.play.style.display = 'none';
                buttons.pause.style.display = 'flex';
            } catch (e) {
                console.error('Error playing video:', e);
            }
        };

        buttons.pause.onclick = () => {
            console.log('Pause clicked for:', playerId);
            try {
                player.pauseVideo();
                console.log('Pause command sent');
                buttons.play.style.display = 'flex';
                buttons.pause.style.display = 'none';
            } catch (e) {
                console.error('Error pausing video:', e);
            }
        };
    }

    // Setup sound toggle
    if (buttons.soundOn && buttons.soundOff) {
        buttons.soundOn.onclick = () => {
            console.log('Sound On clicked for:', playerId);
            try {
                player.unMute();
                console.log('Unmute command sent');
                buttons.soundOn.style.display = 'none';
                buttons.soundOff.style.display = 'flex';
            } catch (e) {
                console.error('Error unmuting video:', e);
            }
        };

        buttons.soundOff.onclick = () => {
            console.log('Sound Off clicked for:', playerId);
            try {
                player.mute();
                console.log('Mute command sent');
                buttons.soundOn.style.display = 'flex';
                buttons.soundOff.style.display = 'none';
            } catch (e) {
                console.error('Error muting video:', e);
            }
        };
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

    