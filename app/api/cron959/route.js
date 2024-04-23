
// // /api/cron/route.js
// // CRON 1
// // This Cron job is run more Frequently than Cron2 
// // It updates the stock data in the MongoDB for the price endpoint

// import { connectToDB } from '@utils/database';
// import Stock from '@models/stock';
// import fs from 'fs';
// import path from 'path';
// import { createClient } from '@vercel/kv';


// const stocks = createClient({
//     url: process.env.REDIS_REST_API_URL,
//     token: process.env.REDIS_REST_API_TOKEN,
//   });
  
// // Corrected version of the updateKVWithStockData function
// async function updateKVWithStockData(ticker, newData, dataType) {
//     const kvKey = `stockData:${ticker}`;
//     let existingData = {};

//     try {
//         const existingDataJson = await stocks.get(kvKey);
//         if (existingDataJson) {
//             if (typeof existingDataJson === 'string') {
//                 existingData = JSON.parse(existingDataJson);
//             }
//                     }
//     } catch (error) {
//         console.error(`Error handling data for ${kvKey}:`, error);
//     }

//     existingData[dataType] = newData;

//     try {
//         const serializedData = JSON.stringify(existingData);
//         await stocks.set(kvKey, serializedData);
//         console.log(`KV updated for ${ticker} with ${dataType} data`);
//     } catch (error) {
//         console.error(`Error updating KV for ${ticker}:`, error);
//     }
// }
  
// async function processBatch(tickers, apiKey, apiHost) {
//     const fetchPromises = tickers.map(ticker => {
//         const apiUrl = `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`;
//         return fetch(apiUrl, {
//             method: 'GET',
//             headers: {
//                 'X-RapidAPI-Key': apiKey,
//                 'X-RapidAPI-Host': apiHost,
//                 'Cache-Control': 'no-cache'
//             }
//         })
//         .then(response => response.json())
//         .then(apiData => {
//             // console.log(`Data for ${ticker}:`, JSON.stringify(apiData, null, 2)); // Log the entire API data for inspection
//             return { ticker, apiData };
//         })
//         .catch(error => {
//             console.error(`Error fetching ${ticker}:`, error);
//             return null; // Consider how to handle errors; null is just one option
//         });
//     });

//     return Promise.allSettled(fetchPromises);
// }

// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// function flattenObject(obj, prefix = '') {
//     return Object.keys(obj).reduce((acc, k) => {
//       const pre = prefix.length ? prefix + '.' : '';
//       if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
//         Object.assign(acc, flattenObject(obj[k], pre + k));
//       } else {
//         acc[pre + k] = obj[k];
//       }
//       return acc;
//     }, {});
//   }  

// //REFRESH DB: DELETE ALL ENTRIES
// // await Stock.deleteMany({});
// // Stock.deleteMany({ symbol: /\.AX$/ })
// // .then(result => {
// //     console.log(`Deleted ${result.deletedCount} documents.`);
// //   })

// export async function POST(req) {

//     const data = await req.json();
//     console.log(data);
//     const triggerKeyword = data.triggerKeyword; // Access the property of the parsed object
//     console.log('triggerKeyword', triggerKeyword);
//     // Verify the body 
//     if (triggerKeyword !== process.env.QSTASH_TOKEN) {
//         console.log('env token compare', process.env.QSTASH_TOKEN);
//         console.log('auth token compare', triggerKeyword);

//         console.error('Unauthorized access attempt. Cron is not executing');
//         // Unauthorized response
//         return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
//     }


//     console.log('Cron job is executing');
//     await connectToDB();

//     const exchangeFiles = ['NYSE.csv', 'AMEX.csv', 'NASDAQ.csv'];
    
//     for (const exchangeFile of exchangeFiles) {
//         try {
//             const filePath = path.join(process.cwd(), 'constants', exchangeFile);
//             console.log(`Processing file: ${exchangeFile}`);

//             const csvContent = fs.readFileSync(filePath, 'utf8');
//             const rows = csvContent.split('\n').filter(row => row);
//             const headers = rows[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));

//             //TEST
//             // const data = rows.slice(1, 6).map(row => {  // Adjusted slice to (1, 6) to get first 5

//             //REAL
//             const data = rows.slice(1).map(row => {
//                 const values = row.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
//                 return values.reduce((object, value, index) => {
//                     object[headers[index]] = value;
//                     return object;
//                 }, {});
//             });

//             if (!data || data.length === 0) {
//                 console.error(`No data available from ${exchangeFile} response.`);
//                 continue; // Properly use continue within the try block to move to the next iteration
//             }
//             const apiKey = process.env.RAPID_API_KEY;
//             const apiHost = process.env.RAPID_API_HOST;
            
//             let gicsMapping = data.reduce((acc, company) => {
//                 const modifiedSymbol = company['Symbol'].split(/[\^\/]/)[0];
//                 acc[modifiedSymbol] = company['Industry'];
//                 return acc;
//             }, {});

//             let tickers = Object.keys(gicsMapping);
//             tickers = [...new Set(tickers)]; // Removes any duplicate tickers
//             console.log('tickers',tickers )
            
//             //To calculate the volatility score and liquidity score
//             let allStocksData = [];

//             const BATCH_SIZE = 8;
//             for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
//                 const batchTickers = tickers.slice(i, i + BATCH_SIZE);
//                 const results = await processBatch(batchTickers, apiKey, apiHost);

//                 for (const result of results) {
//                     if (result.status === 'fulfilled' && result.value) {
//                         const { ticker, apiData } = result.value;
//                         const updateData = {
//                             Stock: ticker,
//                             ...apiData // Ensure all other data fields match your schema fields or are correctly transformed before this step
//                         };
//                         await Stock.findOneAndUpdate({ Stock: ticker }, { $set: updateData }, { upsert: true, new: true });
                        
//                         console.log(`Data processed and updated for ${ticker}`);
//                         const toFixedSafe = (value, digits = 2) => {
//                         return typeof value === 'number' ? value.toFixed(digits) : 'N/A';
//                         };
                        
//                         // Inside the loop where you process each ticker
//                         // Immediately before the calculation

//                         let rangeVolatility = 'N/A';
//                         if (apiData.fiftyTwoWeekHigh && typeof apiData.fiftyTwoWeekHigh?.raw === 'number' &&
//                             apiData.fiftyTwoWeekLow && typeof apiData.fiftyTwoWeekLow?.raw === 'number') {
//                             const high = apiData.fiftyTwoWeekHigh?.raw;
//                             const low = apiData.fiftyTwoWeekLow?.raw;
//                             if (high === low) {
//                                 // Handle the case when high and low are the same
//                                 // Option 1: Set rangeVolatility to '0' (indicating no volatility)
//                                 rangeVolatility = '0'; // Or use "0.00" to match your fixed-point format
//                                 // Option 2: Set a specific message or handle differently
//                                 // rangeVolatility = "No Volatility"; // Uncomment this line if you prefer a text message
//                             } else {
//                                 rangeVolatility = (((high - low) / low) * 100).toFixed(2);
//                                 rangeVolatility = parseFloat(rangeVolatility);
//                             }
//                         }
                                                
//                         // Immediately after calculation and conversion
                                                
//                         let percentageChangeVolatility = 'N/A';
//                         // Similar logic for percentageChangeVolatility...
                        
//                         let volatility = 'N/A';
//                         if (rangeVolatility !== 'N/A' && percentageChangeVolatility !== 'N/A') {
//                             volatility = ((parseFloat(rangeVolatility) + parseFloat(percentageChangeVolatility)) / 2);
//                             volatility = toFixedSafe(volatility); // Ensure we're only calling .toFixed on numbers
//                         }
  
//                         // Ensure liquidity calculation logic is appropriately handled as well
//                         let liquidity = 'N/A';
//                         if (typeof apiData.averageDailyVolume3Month?.raw === 'number' && typeof apiData.regularMarketVolume?.raw === 'number') {
//                             liquidity = ((0.8 * apiData.averageDailyVolume3Month?.raw + 0.2 * apiData.regularMarketVolume?.raw) / 1000000).toFixed(2);
//                         }

//                         const stockDetails = {
//                             Stock: ticker,
//                             Name: apiData.shortName, // Assuming 'shortName' directly represents the company name
//                             GICsIndustryGroup: gicsMapping[ticker] || 'Unknown Industry',
//                             Exchange: apiData.exchange,
//                             Price: apiData.regularMarketPrice?.raw,
//                             LastPrice: apiData.regularMarketPreviousClose?.raw,
//                             RegularMarketChange: apiData.regularMarketChange?.raw,
//                             MarketCapitalisation: apiData.marketCap?.raw,
//                             fiftyTwoWeekHigh: apiData.fiftyTwoWeekHigh?.raw ?? 'N/A', // Use 'N/A' if undefined
//                             fiftyTwoWeekLow: apiData.fiftyTwoWeekLow?.raw ?? 'N/A', // Use 'N/A' if undefined
//                             fiftyTwoWeekChangePercent: apiData.fiftyTwoWeekChangePercent?.raw,
//                             twoHundredDayAverageChangePercent: apiData.twoHundredDayAverageChangePercent?.raw,
//                             fiftyDayAverageChangePercent: apiData.fiftyDayAverageChangePercent?.raw,
//                             averageDailyVolume3Month: apiData.averageDailyVolume3Month?.raw,
//                             regularMarketVolume: apiData.regularMarketVolume?.raw,
//                             priceToBook: apiData.priceToBook?.raw, // Assuming this is the correct path
//                             trailingAnnualDividendRate: apiData.trailingAnnualDividendRate?.raw,
//                             epsTrailingTwelveMonths: apiData.epsTrailingTwelveMonths?.raw,
//                             regularMarketChangePercent: apiData.regularMarketChangePercent?.raw,
//                             RangeVolatility: typeof rangeVolatility === 'number' ? rangeVolatility.toFixed(2) : rangeVolatility,
//                             PercentageChangeVolatility: typeof percentageChangeVolatility === 'number' ? percentageChangeVolatility.toFixed(2) : percentageChangeVolatility,
//                             Volatility: volatility,
//                             Liquidity: liquidity,
//                         };
                        
//                         await updateKVWithStockData(ticker, stockDetails, 'priceData');
//                         console.log(`Updated Redis for ${ticker} with price and industry data`);

//                         // Adding the stockDetails to the allStocksData array
//                         allStocksData.push(stockDetails);

//                         // console.log(`Saving to database: `, JSON.stringify(stockDetails, null, 2));
//                         Stock.findOneAndUpdate(
//                             { Stock: stockDetails.Stock },
//                             {
//                               $set: { 
//                                 ...stockDetails,
//                                 updatedDate: new Date() // Manually set the current date and time
//                               }
//                             },
//                             { 
//                               upsert: true, 
//                               new: true, 
//                               setDefaultsOnInsert: true 

//                             }
//                           )
//                           .then(result => {
//                             // console.log('Update result:', result);
//                           })
//                           .catch(error => {
//                             console.error('Update error:', error);
//                         });
                                                                          
//                         // console.log(`Database updated for ${ticker}`);

//                     } else {
//                         console.error(`Fetching data for ticker ${result.value?.ticker || 'unknown'} failed:`, result.reason);
//                     }
//                 }

//                 console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(tickers.length / BATCH_SIZE)}`);
//                 await delay(1000); // Ensure this delay is placed correctly to manage API rate limits
//             }

//             console.log('All stocks processed successfully for file:', exchangeFile);

//             // After all batches are processed
//             let validStocks = allStocksData.filter(stock => stock.Volatility !== 'N/A' && stock.Liquidity !== 'N/A');

//             // Perform the same calculations as in your old code
//             let averageVolatility = validStocks.reduce((acc, stock) => acc + stock.Volatility, 0) / validStocks.length;
            
//             console.log('Starting scoring logic for file:', exchangeFile);

//             // Before sorting for Volatility
//             console.log('Sorting for Volatility...');
//             validStocks.sort((a, b) => a.Volatility - b.Volatility);
//             const binSize = Math.ceil(validStocks.length / 10);
//             console.log('Assigning Volatility Scores...');
//             validStocks.forEach((stock, i) => {
//                 stock.VolatilityScore = Math.ceil((i + 1) / binSize);
//             });
//             console.log('Volatility Scores assigned.');
            
//             // Before sorting for Liquidity
//             console.log('Sorting for Liquidity...');
//             validStocks.sort((a, b) => b.Liquidity - a.Liquidity);
//             const liquidityBinSize = Math.ceil(validStocks.length / 10);
//             console.log('Assigning Liquidity Scores...');
//             validStocks.forEach((stock, i) => {
//                 stock.LiquidityScore = Math.ceil((i + 1) / liquidityBinSize);
//             });
//             console.log('Liquidity Scores assigned.');

//             // This is the new location for the database update logic
//             console.log('Updating the database for each stock with scores...');

//             const updatePromises = validStocks.map((stock) => {
//               const query = { Stock: stock.Stock };
//               const update = {
//                 $set: { 
//                   VolatilityScore: stock.VolatilityScore,
//                   LiquidityScore: stock.LiquidityScore,
//                   updatedDate: new Date() // Ensuring other necessary fields are also updated
//                 }
//               };
              
//               console.log(`Preparing to update stock: ${stock.Stock} with VolatilityScore: ${stock.VolatilityScore}, LiquidityScore: ${stock.LiquidityScore}`);
//               console.log(`Query: ${JSON.stringify(query)}, Update: ${JSON.stringify(update)}`);
              
//               return Stock.findOneAndUpdate(query, update, { upsert: true, new: true, setDefaultsOnInsert: true })
//                 .exec()
//                 .then(result => {
//                   if (result) {
//                     console.log(`Successfully updated stock: ${result.Stock}`);
//                   } else {
//                     console.log(`No document found with Stock: ${stock.Stock} for updating.`);
//                   }
//                   return result;
//                 });
//             });
            
//             await Promise.all(updatePromises).then((results) => {
//               // Filter null results to count successful updates
//               const successfulUpdates = results.filter(result => result !== null);
//               console.log(`Completed updates for ${successfulUpdates.length} stocks.`);
//             }).catch((error) => {
//               console.error('Error updating stocks with scores:', error);
//             });
            
//             console.log('Database update attempts for all stocks completed.');
                        
            

//         } catch (error) {
//             console.error(`Error processing ${exchangeFile}:`, error);
//         }
//     }
//     // Assuming you're correctly handling the HTTP response here
//     return new Response(JSON.stringify({ message: 'Files updated successfully' }), { status: 200 });
// }
