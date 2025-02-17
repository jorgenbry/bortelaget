    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store all players in an object
let players = {};
let isPlayerReady = false;

console.log('Script loaded');

// Attach click handlers immediately
function attachButtonHandlers() {
    console.log('Attaching button handlers');
    
    const container = document.querySelector('.player');
    if (!container) {
        console.error('No player container found');
        return;
    }

    const buttons = {
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

    // Add click handlers
    buttons.pause.addEventListener('click', function(e) {
        console.log('Pause clicked');
        e.stopPropagation();
        if (players.player) {
            console.log('Attempting to pause video');
            players.player.pauseVideo();
            console.log('Current player state:', players.player.getPlayerState());
            buttons.pause.style.display = 'none';
            buttons.play.style.display = 'flex';
        } else {
            console.log('Player not found');
        }
    });

    buttons.play.addEventListener('click', function(e) {
        console.log('Play clicked');
        e.stopPropagation();
        if (players.player) {
            console.log('Attempting to play video');
            players.player.playVideo();
            console.log('Current player state:', players.player.getPlayerState());
            buttons.play.style.display = 'none';
            buttons.pause.style.display = 'flex';
        } else {
            console.log('Player not found');
        }
    });

    buttons.soundOn.addEventListener('click', function(e) {
        console.log('Sound On clicked');
        e.stopPropagation();
        if (players.player) {
            console.log('Attempting to unmute');
            players.player.unMute();
            players.player.setVolume(100);
            console.log('Is muted:', players.player.isMuted());
            buttons.soundOn.style.display = 'none';
            buttons.soundOff.style.display = 'flex';
        } else {
            console.log('Player not found');
        }
    });

    buttons.soundOff.addEventListener('click', function(e) {
        console.log('Sound Off clicked');
        e.stopPropagation();
        if (players.player) {
            console.log('Attempting to mute');
            players.player.mute();
            console.log('Is muted:', players.player.isMuted());
            buttons.soundOff.style.display = 'none';
            buttons.soundOn.style.display = 'flex';
        } else {
            console.log('Player not found');
        }
    });

    console.log('Button handlers attached');
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
                isPlayerReady = true;
                // Store the player instance
                players.player = event.target;
                console.log('Player methods available:', 
                    'playVideo:', !!players.player.playVideo,
                    'pauseVideo:', !!players.player.pauseVideo,
                    'mute:', !!players.player.mute,
                    'unMute:', !!players.player.unMute
                );
            },
            'onStateChange': (event) => {
                console.log('Player state changed:', event.data);
            },
            'onError': (event) => {
                console.error('Player error:', event.data);
            }
        }
    });
}

// Attach handlers immediately
attachButtonHandlers();

// When YouTube API is ready, initialize player
function onYouTubeIframeAPIReady() {
    console.log('YouTube API Ready');
    initYoutubePlayer();
}

// Additional debug
if (typeof YT === 'undefined') {
    console.log('YouTube API not loaded');
}

    