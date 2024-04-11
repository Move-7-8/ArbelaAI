// Import Vercel KV client library
import { createClient } from '@vercel/kv';

// Setup Vercel KV client
const stocksKV = createClient({
  url: process.env.REDIS_REST_API_URL,
  token: process.env.REDIS_REST_API_TOKEN,
});

export async function POST(req, res) {
  console.log('Cache route hit');
  const request_data = await req.json(); // Parsing JSON from the incoming request.
  const ticker = request_data.ticker; // 


  console.log('Cache Ticker:', ticker);
  const kvKey = `stockData:${ticker}`;

  try {
    const cachedData = await stocksKV.get(kvKey);

    if (cachedData) {
      console.log('Serving from KV cache:', cachedData);

      let responseData;
      if (typeof cachedData === "string") {
        try {
          responseData = JSON.parse(cachedData); // Parse the string to JSON
        } catch (parseError) {
          console.error('Error parsing cachedData:', parseError);
          // Send a server error response if parsing fails
          return new Response(JSON.stringify({ message: 'Cached data is not valid JSON' }), { status: 500 });

        }
      } else {
        responseData = cachedData; // Use directly if it's already an object
      }

      // Send the cached data as a response
      return new Response(JSON.stringify({ responseData }), { status: 200 });


    } else {
      console.log('KV cache miss for', ticker);
      // Send a not found response if the data is not in the cache
      return new Response(JSON.stringify({ message: 'Data not found in KV cache' }), { status: 404 });

    }
    } catch (error) {
      console.error('Error accessing KV cache:', error);
      // Send a server error response if accessing the KV cache fails
      return new Response(JSON.stringify({ message: 'Error accessing KV cache' }), { status: 500 });

    }
}
  // } else {
  //   // Send a 405 Method Not Allowed response if the request method is not POST
  //   return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });

  // }

