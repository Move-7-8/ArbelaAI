
import { connectToDB } from '@utils/database';
import Stock from '@models/stock';

export async function POST(req, res) {
  console.log('MongoDB route hit');
  const request_data = await req.json(); // Parsing JSON from the incoming request.
  const ticker = request_data.ticker; // Extract ticker from the request data

  console.log('Ticker:', ticker);

  try {
    await connectToDB(); // Ensure MongoDB is connected
    const stockData = await Stock.findOne({ Stock: ticker });

    if (stockData) {
      console.log('Serving from MongoDB:', stockData);
      // Send the MongoDB data as a response
      return new Response(JSON.stringify(stockData), { status: 200 });
    } else {
      console.log('MongoDB miss for', ticker);
      // Send a not found response if the data is not in MongoDB
      return new Response(JSON.stringify({ message: 'Data not found in MongoDB' }), { status: 404 });
    }
  } catch (error) {
    console.error('Error accessing MongoDB:', error);
    // Send a server error response if accessing MongoDB fails
    return new Response(JSON.stringify({ message: 'Error accessing MongoDB' }), { status: 500 });
  }
}
