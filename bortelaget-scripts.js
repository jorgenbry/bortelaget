// Load scripts
document.addEventListener('DOMContentLoaded', function() {
    // Load weather script
    const weatherScript = document.createElement('script');
    weatherScript.src = 'https://bortelaget.vercel.app/weather.js';
    document.head.appendChild(weatherScript);

    // Load YouTube player script
    const youtubeScript = document.createElement('script');
    youtubeScript.src = 'https://bortelaget.vercel.app/youtube-player.js';
    document.head.appendChild(youtubeScript);
});

// Navigation menu
$('.nav-show').on('click', function() {
    $('.w-nav-button').trigger('click');
});

