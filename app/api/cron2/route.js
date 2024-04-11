import fetch from 'node-fetch'; // Ensure node-fetch is imported
import { connectToDB } from '@utils/database';
import Stock from '@models/stock';
import { createClient } from '@vercel/kv';

// Setup Vercel KV client
const stocks = createClient({
  url: process.env.REDIS_REST_API_URL,
  token: process.env.REDIS_REST_API_TOKEN,
});

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
    // console.log('filteredResults', filteredResults)
    return filteredResults.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
    }, {});
}


async function updateKVWithStockData(ticker, organizedData) {
  const kvKey = `stockData:${ticker}`;
  // Attempt to get existing data
  const existingDataJson = await stocks.get(kvKey);
  let existingData = {};
  
  // Check if existingDataJson is already an object or a valid JSON string
  if (typeof existingDataJson === 'string') {
    try {
      existingData = JSON.parse(existingDataJson);
    } catch (error) {
      console.error(`Error parsing JSON for ${ticker}:`, error);
      // Handle the error or initialize existingData as needed
    }
  } else if (typeof existingDataJson === 'object') {
    existingData = existingDataJson;
  }

  const updatedData = { ...existingData, ...organizedData };
  
  // Use kv.set to update the data as KV does not automatically merge objects like Redis hset might
  await stocks.set(kvKey, JSON.stringify(updatedData));
  console.log(`KV updated for ${ticker} with full organized data`);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processStock(ticker, endpointKeys, apiKey, apiHost, apiHost2) {
    try {
        const newEndpointData = await fetchFromEndpoints(ticker, endpointKeys, apiKey, apiHost, apiHost2);
        await updateKVWithStockData(ticker, newEndpointData);
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
        // const stocks = await Stock.find({}).limit(5); // Adjust this as needed, e.g., add .limit(5) for testing
        const stocks = await Stock.find({}) // Adjust this as needed, e.g., add .limit(5) for testing

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