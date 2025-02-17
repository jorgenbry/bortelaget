    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};
let buttons = {};

console.log('Script loaded');

// Find buttons and store them
function findButtons() {
    console.log('Finding buttons');
    
    const container = document.querySelector('.player');
    if (!container) {
        console.error('No player container found');
        return;
    }

    buttons = {
        play: container.querySelector('.button.player-button.play-button'),
        pause: container.querySelector('.button.player-button.pause-button'),
        soundOn: container.querySelector('.button.player-button.sound-on-button'),
        soundOff: container.querySelector('.button.player-button.sound-off-button')
    };

    console.log('Found buttons:', buttons);

    // Set initial states
    buttons.play.style.display = 'none';
    buttons.pause.style.display = 'flex';
    buttons.soundOn.style.display = 'flex';
    buttons.soundOff.style.display = 'none';
}

// Initialize YouTube player
function initYoutubePlayer() {
    console.log('Initializing player');
    const container = document.querySelector('div[data-video-id]');
    if (!container) {
        console.error('No video container found');
        return;
    }

    const videoId = container.getAttribute('data-video-id');
    const iframe = container.querySelector('iframe');
    
    if (!iframe || !videoId) {
        console.error('No iframe or video ID found');
        return;
    }

    iframe.id = 'bortelaget-player';
    
    players.player = new YT.Player('bortelaget-player', {
        events: {
            'onReady': (event) => {
                console.log('Player ready');
                players.player = event.target;
                
                // Now that player is ready, set up button handlers
                buttons.pause.onclick = function() {
                    console.log('Pause clicked');
                    players.player.pauseVideo();
                    buttons.pause.style.display = 'none';
                    buttons.play.style.display = 'flex';
                };

                buttons.play.onclick = function() {
                    console.log('Play clicked');
                    players.player.playVideo();
                    buttons.play.style.display = 'none';
                    buttons.pause.style.display = 'flex';
                };

                buttons.soundOn.onclick = function() {
                    console.log('Sound On clicked');
                    players.player.unMute();
                    players.player.setVolume(100);
                    buttons.soundOn.style.display = 'none';
                    buttons.soundOff.style.display = 'flex';
                };

                buttons.soundOff.onclick = function() {
                    console.log('Sound Off clicked');
                    players.player.mute();
                    buttons.soundOff.style.display = 'none';
                    buttons.soundOn.style.display = 'flex';
                };

                console.log('Button handlers attached to ready player');
            },
            'onStateChange': (event) => {
                console.log('Player state changed:', event.data);
                // -1 (unstarted)
                // 0 (ended)
                // 1 (playing)
                // 2 (paused)
                // 3 (buffering)
                // 5 (video cued)
            },
            'onError': (event) => {
                console.error('Player error:', event.data);
            }
        }
    });
}

// Find buttons immediately
findButtons();

// When YouTube API is ready, initialize player
function onYouTubeIframeAPIReady() {
    console.log('YouTube API Ready');
    initYoutubePlayer();
}

// Additional debug
if (typeof YT === 'undefined') {
    console.log('YouTube API not loaded');
}

    