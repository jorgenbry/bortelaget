// Store buttons globally
let buttons = null;

// Find and set up buttons
function setupButtons() {
    buttons = {
        play: document.querySelector('.play-button'),
        pause: document.querySelector('.pause-button'),
        soundOn: document.querySelector('.sound-on-button'),
        soundOff: document.querySelector('.sound-off-button')
    };

    // Set initial visibility
    if (buttons.play) buttons.play.style.display = 'none';
    if (buttons.pause) buttons.pause.style.display = 'flex';
    if (buttons.soundOn) buttons.soundOn.style.display = 'flex';
    if (buttons.soundOff) buttons.soundOff.style.display = 'none';
}

// Initialize YouTube player
function initYoutubePlayer() {
    const container = document.querySelector('div[data-video-id]');
    if (!container) return;

    const iframe = container.querySelector('iframe');
    if (!iframe) return;

    // Update iframe src to enable API
    let srcUrl = new URL(iframe.src);
    srcUrl.searchParams.set('enablejsapi', '1');
    srcUrl.searchParams.set('controls', '0');
    srcUrl.searchParams.set('modestbranding', '1');
    srcUrl.searchParams.set('showinfo', '0');
    srcUrl.searchParams.set('rel', '0');
    srcUrl.searchParams.set('iv_load_policy', '3');
    srcUrl.searchParams.set('fs', '0');
    srcUrl.searchParams.set('playsinline', '1');
    srcUrl.searchParams.set('disablekb', '1');
    srcUrl.searchParams.set('autoplay', '1');
    srcUrl.searchParams.set('mute', '1');
    srcUrl.searchParams.set('loop', '0');
    srcUrl.searchParams.set('cc_load_policy', '0');
    srcUrl.searchParams.set('origin', window.location.origin);
    iframe.src = srcUrl.toString();

    // Set up button click handlers
    if (buttons.pause) {
        buttons.pause.onclick = function() {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'pauseVideo'
            }), '*');
            buttons.pause.style.display = 'none';
            buttons.play.style.display = 'flex';
        };
    }

    if (buttons.play) {
        buttons.play.onclick = function() {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'playVideo'
            }), '*');
            buttons.play.style.display = 'none';
            buttons.pause.style.display = 'flex';
        };
    }

    if (buttons.soundOn) {
        buttons.soundOn.onclick = function() {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'unMute'
            }), '*');
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'setVolume',
                args: [100]
            }), '*');
            buttons.soundOn.style.display = 'none';
            buttons.soundOff.style.display = 'flex';
        };
    }

    if (buttons.soundOff) {
        buttons.soundOff.onclick = function() {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'mute'
            }), '*');
            buttons.soundOff.style.display = 'none';
            buttons.soundOn.style.display = 'flex';
        };
    }
}

// Set up buttons immediately
setupButtons();

// Initialize player when API is ready
function onYouTubeIframeAPIReady() {
    initYoutubePlayer();
}