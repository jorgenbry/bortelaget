export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return new Response('Missing lat or lon parameters', { status: 400 });
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

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://bortelaget.webflow.io',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://bortelaget.webflow.io',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': 'https://bortelaget.webflow.io',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
} 