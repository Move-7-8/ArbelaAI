// // CRON 3
// // This Cron job is used to transfer high priority data from mongoDB to KV Cache  

// import { connectToDB } from '@utils/database';
// import Stock from '@models/stock';
// import { createClient } from '@vercel/kv';

// // Setup Vercel KV client
// const stocksKV = createClient({
//   url: process.env.REDIS_REST_API_URL,
//   token: process.env.REDIS_REST_API_TOKEN,
// });

// async function updateKVWithStockData(ticker, stockData) {
//   const kvKey = `stockData:${ticker}`;
//   // Serialize the MongoDB data into a JSON string
//   const serializedData = JSON.stringify(stockData);
//   // Update KV
//   await stocksKV.set(kvKey, serializedData);
//   console.log(`KV updated for ${ticker} with data from MongoDB`);
// }

// async function transferDataFromMongoToKV() {
//   await connectToDB();  // Ensure MongoDB is connected

//   // Fetch the required fields from MongoDB
//   const stocks = await Stock.find({}, 'Stock Name Exchange Price MarketCapitalisation').exec();

//   // Update KV for each stock
//   for (const stock of stocks) {
//     const stockData = {
//       Name: stock.Name,
//       Exchange: stock.Exchange,
//       Price: stock.Price,
//       MarketCapitalisation: stock.MarketCapitalisation
//     };
//     await updateKVWithStockData(stock.Stock, stockData);
//   }

//   console.log('All stocks have been processed and updated in KV.');
// }

// // Start the process
// transferDataFromMongoToKV().then(() => console.log('Data transfer complete.'))
// .catch(err => console.error('Error during data transfer:', err));

