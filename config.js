const config = {
    // API URLs for different environments
    apiUrls: {
        development: 'http://localhost:3001',
        staging: 'https://bortelaget.vercel.app',
        production: 'https://bortelaget.no'
    },
    
    // Get the current environment
    getEnvironment() {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname === 'bortelaget.webflow.io') {
            return 'staging';
        } else {
            return 'production';
        }
    },
    
    // Get the current API URL
    getApiUrl() {
        const env = this.getEnvironment();
        return this.apiUrls[env];
    }
}; 