//Backend Data Structuring (Inflow): 
    //CompaniesMongo (MongoDB Data)
      //Cron959
        //Price(1), 
      //Cron2959 
        //Historic(1), KeyStatistics(1), Profile(2), Income Statement(2), News(2), Cashflow Statement(2), Balance Sheet(2)

    //CompaniesCache (Cached Data)
      //Cron3959

//Backend Data Structuring (Outflow): 
    //Companies/[companyId] (Live Data 1)
        //Live Data: Price*(1), Historic30Days(1), Historic7Days(1), KeyStatistics (1)
    //Companies2 (Live Data 2)
        //Live Data: NA 
    //CompaniesMongo (MongoDB Data)
        // Daily Data: NA 
        // Weekly Data: Historic(1), Profile(2), Income Statement(2), News(2), Cashflow Statement(2), Balance Sheet(2)
        //Stored to pass to cache but not used in outflow: Price(1), KeyStatistics (1)
    //CompaniesCache (Cached Data)
        // Price(1), Profile(2), FinanceAnalytics(1), KeyStatistics (1)

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
