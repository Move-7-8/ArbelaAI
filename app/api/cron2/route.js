import fetch from 'node-fetch'; // Ensure node-fetch is imported
import { connectToDB } from '@utils/database';
import Stock from '@models/stock';
import {Redis} from 'ioredis';

const redis = new Redis(); // Default connects to 127.0.0.1:6379


async function fetchFromEndpoints(ticker, endpointKeys, apiKey , apiHost, apiHost2 ) {

    const paramsMap = {
      
        //2. For companies page (METHOD: POST with the tickers as Requests)
        //a. Get Profile endpoint 
        //Website, Description, 
        'get-profile': {
          method: 'GET',
          url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-profile',
          params: {
            symbol: ticker,
            region: 'AU',
            lang: 'en-US'
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost2
          }
        },
  
        //b. Get Income Statement  
        'get-income': {
          method: 'GET',
          url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-financials',
          params: {
            symbol: ticker, 
            currencyCode: 'AUD'
          
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost2
          }
        },
  
        //c. Get News endpoint  
          //Recent news articles, 
          'get-news': {
            method: 'POST',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list',
            params: {
              region: 'US',
              snippetCount: '4',
              s: ticker
            },
            headers: {
              'content-type': 'text/plain',
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': apiHost2
              },
            data: 'Pass in the value of uuids field returned right in this endpoint to load the next page, or leave empty to load first page'
        },
          
        //d. Get similarities
        'get-cashflow': {
          method: 'GET',
          url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-cash-flow',
          params: {
            symbol: ticker, 
            currencyCode: 'USD'
          
          },
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost2
          }
        },
  
        //e. Get Balance Sheet
        'get-balance': {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-balance-sheet',
            params: {
              symbol: ticker, 
              currencyCode: 'USD'
            
            },
              headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': apiHost2
            }
        },

        //f. Get Historic
        'historic': {
            method: 'GET',
            url: `https://yahoo-finance127.p.rapidapi.com/historic/${ticker}/1d/1y`,
            headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost
            }, 
            params: {} 

        },

        //g. Get key Stats
        'keyStatistics': {
            method: 'GET',
            url: `https://yahoo-finance127.p.rapidapi.com/key-statistics/${ticker}`,
            headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost
            }, 
            params: {} 

        },
        
    }

    const fetchPromises = endpointKeys.map(key => {
        const endpoint = paramsMap[key];
        const url = new URL(endpoint.url);
        if (endpoint.params) { // Check if params is defined
            Object.keys(endpoint.params).forEach(paramKey => url.searchParams.append(paramKey, endpoint.params[paramKey]));
        }
    
        return fetch(url.toString(), {
            method: endpoint.method,
            headers: endpoint.headers,
            body: endpoint.method === 'POST' ? JSON.stringify(endpoint.data) : null
        })
        .then(response => response.json().then(data => ({ key, data })))
        .catch(error => {
            console.error(`Error fetching ${key}:`, error);
            return null; // Skip this result but continue with others
        });
    });
        const results = await Promise.all(fetchPromises);
    const filteredResults = results.filter(result => result !== null); // Remove failed requests
    return filteredResults.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
    }, {});
}


async function updateRedisWithStockData(ticker, organizedData) {
    const redisKey = `stockData:${ticker}`;
    const existingDataJson = await redis.get(redisKey);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};
    const updatedData = { ...existingData, ...organizedData };
    const serializedData = JSON.stringify(updatedData);
    
    await redis.set(redisKey, serializedData, 'EX', 86400); // Adjust TTL as needed
    console.log(`Redis updated for ${ticker} with full organized data`);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processStock(ticker, endpointKeys, apiKey, apiHost, apiHost2) {
    try {
        const newEndpointData = await fetchFromEndpoints(ticker, endpointKeys, apiKey, apiHost, apiHost2);
        await updateRedisWithStockData(ticker, newEndpointData);
        console.log(`Redis updated for ${ticker} with full organized data`);
    } catch (error) {
        console.error(`Error processing stock ${ticker}:`, error);
    }
}

async function processStocksInBatch(stocks, apiKey, apiHost, apiHost2) {
    const totalStocks = stocks.length; // Total number of stocks to process
    let processedStocks = 0; // Counter for processed stocks

    for (const stock of stocks) {
        await processStock(stock.Stock, ['get-profile', 'get-income', 'get-news', 'get-cashflow', 'get-balance', 'historic', 'keyStatistics'], apiKey, apiHost, apiHost2);
        processedStocks++; // Increment the counter after each stock is processed
        const percentageProcessed = (processedStocks / totalStocks) * 100; // Calculate the percentage of stocks processed
        console.log(`${percentageProcessed.toFixed(2)}% of stocks processed (${processedStocks}/${totalStocks})`); // Log the percentage to the console
        await delay(250); // Ensuring we respect the 4 requests per second rate limit
    }
}


export async function GET(req, res) {
    console.log('Cron job 2 triggered');
    try {
        await connectToDB();
        const apiKey = process.env.RAPID_API_KEY;
        const apiHost = process.env.RAPID_API_HOST;
        const apiHost2 = process.env.RAPID_API_HOST_2;

        // Fetch stocks from the database
        const stocks = await Stock.find({}); // Adjust this as needed, e.g., add .limit(5) for testing

        // Process stocks respecting the API rate limit
        await processStocksInBatch(stocks, apiKey, apiHost, apiHost2);

        console.log('All stocks processed successfully.');

        // Assuming 'res' is your response object from an Express.js handler
        return new Response(JSON.stringify({ message: 'Files Successfully added' }), { status: 200 });
    } catch (error) {
        console.error(`Error during stock processing: `, error);
        return new Response(JSON.stringify({ message: 'Files failed' }), { status: 500 });
}
}




// export async function GET(req, res) {
//     console.log('Cron job 2 is hit');
//     await connectToDB();

//     const apiKey = process.env.RAPID_API_KEY
//     const apiHost = process.env.RAPID_API_HOST
//     const apiHost2 = process.env.RAPID_API_HOST_2; // Adjust according to the specific host for new endpoints

//     try {
//         // PRODUCTION
//         // const stocks = await Stock.find({}); // This query retrieves all documents in the collection
        
//         // TESTING 
//         const stocks = await Stock.find({}).limit(5); // This query retrieves only 5 documents from the collection
//         const totalStocks = stocks.length; // Capture the total number of stocks

//         for (let index = 0; index < stocks.length; index++) {
//             const stock = stocks[index];
//             const ticker = stock.Stock; // Access the 'Stock' attribute which contains the ticker
            
//             //Array of API2 endpoint paths, using the ticker
//             const endpointKeys = ['get-profile', 'get-income', 'get-news', 'get-cashflow', 'get-balance'];
//             const newEndpointData = await fetchFromEndpoints(ticker, endpointKeys, apiKey, apiHost2);

//             // Array of API1 endpoint paths, using the ticker
//             const endpoints = [
//                 { key: 'historic', path: `historic/${ticker}/1d/1y` },
//                 // { key: 'historic30Days', path: `historic/${ticker}/1h/30d` },
//                 // { key: 'historic7Days', path: `historic/${ticker}/30m/7d` },
//                 { key: 'financeAnalytics', path: `finance-analytics/${ticker}` },
//                 { key: 'keyStatistics', path: `key-statistics/${ticker}` }
//             ];

//             // Initialize an empty array to hold the fetched data for the current ticker
//             const allData = [];

//             // Loop through each endpoint, wait for a delay, and then fetch the data
//             for (const { key, path } of endpoints) {
//                 await delay(50); // Wait for 50ms before each request, adjust this value as needed

//                 const apiUrl = `https://yahoo-finance127.p.rapidapi.com/${path}`;

//                 const response = await fetch(apiUrl, {
//                     method: 'GET',
//                     headers: {
//                         'X-RapidAPI-Key': apiKey,
//                         'X-RapidAPI-Host': apiHost,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error(`Error: ${response.statusText}`);
//                 }

//                 const jsonData = await response.json();
//                 allData.push({ [key]: jsonData }); // Accumulate fetched data for the current ticker

//                 // At the end of processing each stock:
//                 const completedPercentage = ((index + 1) / totalStocks) * 100;
//                 console.log(`Updated stock information for ticker: ${ticker}`);
//                 console.log(`Progress: ${completedPercentage.toFixed(2)}% completed (${index + 1}/${totalStocks} stocks)`);

//             }

//             // After fetching data from the original endpoints
//             const organizedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});
//             // Transform fetched historic data to match the schema structure
//             const financeAnalyticsData = organizedData.financeAnalytics;
           
//             const combinedData = { ...organizedData, ...newEndpointData };
//             const newHistoricDataArray = organizedData.historic.timestamp.map((time, index) => {
//             const quote = organizedData.historic.indicators.quote[0];
//             const adjclose = organizedData.historic.indicators.adjclose[0];
            
//             // Combine new endpoint data with the organized data from original endpoints

//             return {
//             date: new Date(time * 1000), // Convert timestamp to Date object
//             open: quote.open[index],
//             close: quote.close[index],
//             high: quote.high[index],
//             low: quote.low[index],
//             volume: quote.volume[index],
//             adjClose: adjclose.adjclose[index] // Adjust this line based on your needs
//             };
//         });
            
//             // Update the stock document in the database
//             try {
//                 await Stock.findOneAndUpdate(
//                 { Stock: ticker },
//                 {
//                     $push: {
//                     historicData: {
//                         $each: newHistoricDataArray
//                     }
//                     }
//                 },
//                 { new: true, upsert: true }
//                 );

//             // Update Redis with the historic data
//             await updateRedisWithStockData(ticker, combinedData)
//             .then(() => console.log("Data updated in Redis"))
//             .catch(err => console.error("Error updating Redis:", err));
                
//             console.log(`Updated stock information for ticker: ${ticker}`);
//             return new Response(JSON.stringify({ message: 'Files updated successfully' }), { status: 200 });

//             } catch (error) {
//                 console.error(`Error updating stock information for ticker: ${ticker}`, error);
//                 return new Response(JSON.stringify({ message: 'Files failed' }), { status: 500 });

//             }
//     }} catch (error) {
//         console.error(`Error updating stock information `, error);
//         return new Response(JSON.stringify({ message: 'Files failed' }), { status: 500 });

//     }
// }