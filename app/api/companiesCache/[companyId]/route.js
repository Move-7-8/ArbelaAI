import Redis from 'ioredis'; // Ensure Redis client is imported

// Initialize Redis client Production
// const redis = new Redis(process.env.REDIS_URL); // Use your Redis connection string

// Initialize Redis client Development
const redis = new Redis(); // Connects to 127.0.0.1:6379 by default

export async function POST(req, res) {
    console.log('cache route hit')
    const request_data = await req.json();
    const ticker = request_data.ticker;

    const redisKey = `stockData:${ticker}`;

    try {
        const cachedData = await redis.get(redisKey);
        if (cachedData) {
            console.log('Serving from cache:', cachedData);
            return new Response(cachedData, { status: 200 });
        } else {
            console.log('Cache miss for', ticker);
            return new Response(JSON.stringify({ message: 'Data not found in cache' }), { status: 404 });
        }
    } catch (error) {
        console.error('Error accessing cache:', error);
        return new Response(JSON.stringify({ error: 'Error accessing cache' }), { status: 500 });
    }
}
