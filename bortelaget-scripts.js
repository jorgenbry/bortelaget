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
    buttons.play.addEventListener('click', function(e) {
        console.log('Play clicked');
        e.stopPropagation();
        if (players.player && isPlayerReady) {
            players.player.playVideo();
            buttons.play.style.display = 'none';
            buttons.pause.style.display = 'flex';
        }
    });

    buttons.pause.addEventListener('click', function(e) {
        console.log('Pause clicked');
        e.stopPropagation();
        if (players.player && isPlayerReady) {
            players.player.pauseVideo();
            buttons.play.style.display = 'flex';
            buttons.pause.style.display = 'none';
        }
    });

    buttons.soundOn.addEventListener('click', function(e) {
        console.log('Sound On clicked');
        e.stopPropagation();
        if (players.player && isPlayerReady) {
            players.player.unMute();
            buttons.soundOn.style.display = 'none';
            buttons.soundOff.style.display = 'flex';
        }
    });

    buttons.soundOff.addEventListener('click', function(e) {
        console.log('Sound Off clicked');
        e.stopPropagation();
        if (players.player && isPlayerReady) {
            players.player.mute();
            buttons.soundOn.style.display = 'flex';
            buttons.soundOff.style.display = 'none';
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
                console.log('Player ready');
                isPlayerReady = true;
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

    