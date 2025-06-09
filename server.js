const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all domains
app.use(cors({
    origin: '*',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Serve static files with proper MIME types
app.get('/bortelaget-scripts.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    const filePath = path.join(__dirname, 'bortelaget-scripts.js');
    const content = fs.readFileSync(filePath, 'utf8');
    res.send(content);
});

app.get('/weather.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'weather.js'));
});

app.get('/youtube-player.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'youtube-player.js'));
});

app.get('/dist/css/bortelaget-style.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    const filePath = path.join(__dirname, 'dist', 'css', 'bortelaget-style.css');
    const content = fs.readFileSync(filePath, 'utf8');
    res.send(content);
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Missing lat or lon parameters' });
        }

        const response = await fetch(
            `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
            {
                headers: {
                    'User-Agent': 'Bortelaget Weather Widget (bortelaget.no)'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`MET API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Serve icons
app.get('/icons/:filename', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    const filePath = path.join(__dirname, 'icons', req.params.filename);
    const content = fs.readFileSync(filePath, 'utf8');
    res.send(content);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 