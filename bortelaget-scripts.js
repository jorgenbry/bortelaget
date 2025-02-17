    $('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
    });

// Store player and buttons globally
let player = null;
let buttons = null;

console.log('Script loaded');

// Find and set up buttons
function setupButtons() {
    console.log('Setting up buttons');
    
    // Find all buttons
    buttons = {
        play: document.querySelector('.play-button'),
        pause: document.querySelector('.pause-button'),
        soundOn: document.querySelector('.sound-on-button'),
        soundOff: document.querySelector('.sound-off-button')
    };

    // Verify buttons were found
    Object.entries(buttons).forEach(([key, button]) => {
        console.log(`${key} button found:`, !!button);
    });

    // Set initial visibility
    if (buttons.play) buttons.play.style.display = 'none';
    if (buttons.pause) buttons.pause.style.display = 'flex';
    if (buttons.soundOn) buttons.soundOn.style.display = 'flex';
    if (buttons.soundOff) buttons.soundOff.style.display = 'none';

    console.log('Initial button setup complete');
}

// Initialize YouTube player
function initYoutubePlayer() {
    console.log('Initializing YouTube player');
    const container = document.querySelector('div[data-video-id]');
    
    if (!container) {
        console.error('Video container not found');
        return;
    }

    const videoId = container.getAttribute('data-video-id');
    console.log('Video ID:', videoId);

    const iframe = container.querySelector('iframe');
    if (!iframe) {
        console.error('Iframe not found');
        return;
    }

    // Set up button click handlers directly
    if (buttons.pause) {
        buttons.pause.onclick = function() {
            console.log('Pause clicked');
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                buttons.pause.style.display = 'none';
                buttons.play.style.display = 'flex';
            }
        };
    }

    if (buttons.play) {
        buttons.play.onclick = function() {
            console.log('Play clicked');
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                buttons.play.style.display = 'none';
                buttons.pause.style.display = 'flex';
            }
        };
    }

    if (buttons.soundOn) {
        buttons.soundOn.onclick = function() {
            console.log('Sound On clicked');
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[100]}', '*');
                buttons.soundOn.style.display = 'none';
                buttons.soundOff.style.display = 'flex';
            }
        };
    }

    if (buttons.soundOff) {
        buttons.soundOff.onclick = function() {
            console.log('Sound Off clicked');
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                buttons.soundOff.style.display = 'none';
                buttons.soundOn.style.display = 'flex';
            }
        };
    }

    // Update iframe src to enable postMessage API
    const currentSrc = iframe.src;
    if (!currentSrc.includes('enablejsapi')) {
        iframe.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'enablejsapi=1';
    }

    console.log('Player controls attached');
}

// Set up buttons immediately
setupButtons();

// Initialize player when API is ready
function onYouTubeIframeAPIReady() {
    console.log('YouTube API is ready');
    initYoutubePlayer();
}

// Add a global click handler to verify event bubbling
document.addEventListener('click', function(e) {
    if (e.target.closest('.player-button')) {
        console.log('Button clicked (global handler)');
    }
});

// Additional debug
if (typeof YT === 'undefined') {
    console.log('YouTube API not loaded');
}

    