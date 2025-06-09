const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all necessary domains
app.use(cors({
    origin: [
        'https://bortelaget.webflow.io',
        'https://bortelaget.vercel.app',
        'https://bortelaget.no',
        'http://localhost:3000'
    ],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Serve static files from the icons directory
app.use('/icons', express.static(path.join(__dirname, 'icons')));

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Weather API is running');
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat or lon parameters' });
    }

    try {
        const response = await fetch(
            `https://api.met.no/weatherapi/nowcast/2.0/complete?lat=${lat}&lon=${lon}`,
            {
                headers: {
                    'User-Agent': 'Bortelaget/1.0 (https://bortelaget.no)'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Weather API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Test the API at: http://localhost:${port}/api/weather?lat=62.0758&lon=9.1280`);
}); 