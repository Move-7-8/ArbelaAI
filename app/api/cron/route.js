// /api/cron/route.js
import { connectToDB } from '@utils/database';
import Stock from '@models/stock';
import fs from 'fs';
import path from 'path';
import Redis from 'ioredis';

const redis = new Redis(); // Default connects to 127.0.0.1:6379

async function updateRedisWithStockData(ticker, newData, dataType) {
    const redisKey = `stockData:${ticker}`;
    const existingDataJson = await redis.get(redisKey);
    let existingData = existingDataJson ? JSON.parse(existingDataJson) : {};

    existingData[dataType] = newData;  // Update the existing data with the new price or historic data

    const serializedData = JSON.stringify(existingData);
    await redis.set(redisKey, serializedData, 'EX', 86400);  // You can adjust the TTL (time to live) as needed
}

async function processBatch(tickers, apiKey, apiHost) {
    const fetchPromises = tickers.map(ticker => {
        const apiUrl = `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`;
        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost,
                'Cache-Control': 'no-cache'
            }
        })
        .then(response => response.json())
        .then(apiData => ({ ticker, apiData }))
        .catch(error => {
            console.error(`Error fetching ${ticker}:`, error);
            return null; // Consider how to handle errors; null is just one option
        });
    });

    return Promise.allSettled(fetchPromises);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//REFRESH DB: DELETE ALL ENTRIES
// await Stock.deleteMany({});
export async function GET() {
    console.log('Cron job is hit');
    await connectToDB();

    const exchangeFiles = ['NYSE.csv', 'AMEX.csv', 'NASDAQ.csv'];
    
    for (const exchangeFile of exchangeFiles) {
        try {
            const filePath = path.join(process.cwd(), 'constants', exchangeFile);
            console.log(`Processing file: ${exchangeFile}`);

            const csvContent = fs.readFileSync(filePath, 'utf8');
            const rows = csvContent.split('\n').filter(row => row);
            const headers = rows[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));

            const data = rows.slice(1).map(row => {
                const values = row.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
                return values.reduce((object, value, index) => {
                    object[headers[index]] = value;
                    return object;
                }, {});
            });

            if (!data || data.length === 0) {
                console.error(`No data available from ${exchangeFile} response.`);
                continue; // Properly use continue within the try block to move to the next iteration
            }
            const apiKey = process.env.RAPID_API_KEY;
            const apiHost = process.env.RAPID_API_HOST;
            
            let gicsMapping = data.reduce((acc, company) => {
                const modifiedSymbol = company['Symbol'].split(/[\^\/]/)[0];
                acc[modifiedSymbol] = company['Industry'];
                return acc;
            }, {});

            let tickers = Object.keys(gicsMapping);
            tickers = [...new Set(tickers)]; // Removes any duplicate tickers
            console.log('tickers',tickers )

            const BATCH_SIZE = 8;
            for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
                const batchTickers = tickers.slice(i, i + BATCH_SIZE);
                const results = await processBatch(batchTickers, apiKey, apiHost);

                for (const result of results) {
                    if (result.status === 'fulfilled' && result.value) {
                        const { ticker, apiData } = result.value;
                        const rangeVolatility = apiData.fiftyTwoWeekHigh?.raw && apiData.fiftyTwoWeekLow?.raw ? (((apiData.fiftyTwoWeekHigh.raw - apiData.fiftyTwoWeekLow.raw) / apiData.fiftyTwoWeekLow.raw) * 100).toFixed(2) : 'N/A';
                        const percentageChangeVolatility = apiData.fiftyTwoWeekChangePercent?.raw && apiData.twoHundredDayAverageChangePercent?.raw && apiData.fiftyDayAverageChangePercent?.raw ? ((apiData.fiftyTwoWeekChangePercent.raw + apiData.twoHundredDayAverageChangePercent.raw + apiData.fiftyDayAverageChangePercent.raw) / 3).toFixed(2) : 'N/A';
                        const volatility = ((0.5 * parseFloat(rangeVolatility)) + (0.5 * parseFloat(percentageChangeVolatility))).toFixed(2);
                        const liquidity = apiData.averageDailyVolume3Month?.raw && apiData.regularMarketVolume?.raw ? ((0.8 * apiData.averageDailyVolume3Month.raw) + (0.2 * apiData.regularMarketVolume.raw)).toFixed(2) : 'N/A';
        
                        // Append industryGroup and exchangeName to apiData before updating Redis
                        const industryGroup = gicsMapping[ticker] || 'Unknown Industry';
                        
                        const stockDetails = {
                            ticker, 
                            ...apiData, // Spread operator to include all apiData fields
                            industryGroup,
                            volatility,
                            liquidity
                            // Include calculated financial metrics here...
                        };

                        await updateRedisWithStockData(ticker, stockDetails, 'priceData');
                        console.log(`Updated Redis for ${ticker} with price and industry data`);

                        // Update MongoDB with the new stockDetails
                        await Stock.findOneAndUpdate(
                            { Stock: stockDetails.ticker }, // Adjusted to match your schema field name
                            { $set: stockDetails },
                            { upsert: true, new: true }
                          );
                        console.log(`Database updated for ${ticker}`);

                    } else {
                        console.error(`Fetching data for ticker ${result.value?.ticker || 'unknown'} failed:`, result.reason);
                    }
                }

                console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(tickers.length / BATCH_SIZE)}`);
                await delay(1000); // Ensure this delay is placed correctly to manage API rate limits
            }

            console.log('All stocks processed successfully for file:', exchangeFile);
        } catch (error) {
            console.error(`Error processing ${exchangeFile}:`, error);
        }
    }
    // Assuming you're correctly handling the HTTP response here
    return new Response(JSON.stringify({ message: 'Files updated successfully' }), { status: 200 });
}

    
//             try {
//                 const totalTickers = tickers.length; // Total number of tickers to process

//                 for (let i = 0; i < tickers.length; i++) {
//                     const ticker = tickers[i];
//                     const apiUrl = `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`;

//                     try {
//                         const response = await fetch(apiUrl, {
//                         method: 'GET',
//                         headers: {
//                             'X-RapidAPI-Key': apiKey,
//                             'X-RapidAPI-Host': apiHost,
//                             'Cache-Control': 'no-cache'

//                         }
//                         });

//                         if (!response.ok) {
//                         console.error(`Error fetching ${ticker}: ${response.statusText}`);
//                         continue;
//                         }

//                         const apiData = await response.json();

//                         const rangeVolatility = (((apiData.fiftyTwoWeekHigh.raw - apiData.fiftyTwoWeekLow.raw) / apiData.fiftyTwoWeekLow.raw) * 100).toFixed(2);
//                         const percentageChangeVolatility = ((apiData.fiftyTwoWeekChangePercent.raw + apiData.twoHundredDayAverageChangePercent.raw + apiData.fiftyDayAverageChangePercent.raw) / 3).toFixed(2);
//                         const volatility = ((0.5 * parseFloat(rangeVolatility)) + (0.5 * parseFloat(percentageChangeVolatility))).toFixed(2);
//                         const liquidity = ((0.8 * apiData.averageDailyVolume3Month.raw) + (0.2 * apiData.regularMarketVolume.raw)).toFixed(2);
            
//                         if (!isNaN(parseFloat(volatility)) && !isNaN(parseFloat(liquidity))) {
//                             totalVolatility += parseFloat(volatility);
//                             validVolatilityCount++;
                
//                             const stockDetails = {
//                                 Stock: ticker,
//                                 LastPrice: apiData.regularMarketPreviousClose?.raw || 'N/A',
//                                 RegularMarketChange: apiData.regularMarketChange?.raw || 'N/A',
//                                 Name: apiData.longName || 'N/A',
//                                 Price: apiData.regularMarketPrice?.raw || 'N/A',
//                                 MarketCapitalisation: apiData.marketCap?.raw || 'N/A',
//                                 fiftyTwoWeekHigh: apiData.fiftyTwoWeekHigh?.raw || 'N/A',
//                                 fiftyTwoWeekLow: apiData.fiftyTwoWeekLow?.raw || 'N/A',
//                                 fiftyTwoWeekChangePercent: apiData.fiftyTwoWeekChangePercent?.raw || 'N/A',
//                                 twoHundredDayAverageChangePercent: apiData.twoHundredDayAverageChangePercent?.raw || 'N/A',
//                                 fiftyDayAverageChangePercent: apiData.fiftyDayAverageChangePercent?.raw || 'N/A',
//                                 averageDailyVolume3Month: apiData.averageDailyVolume3Month?.raw || 'N/A',
//                                 regularMarketVolume: apiData.regularMarketVolume?.raw || 'N/A',
//                                 priceToBook: apiData.priceToBook?.fmt || 'N/A',
//                                 trailingAnnualDividendRate: apiData.trailingAnnualDividendRate?.raw || 'N/A',
//                                 epsTrailingTwelveMonths: apiData.epsTrailingTwelveMonths?.raw || 'N/A',
//                                 regularMarketChangePercent: apiData.regularMarketChangePercent?.raw || 'N/A',
//                                 RangeVolatility: (((apiData.fiftyTwoWeekHigh?.raw - apiData.fiftyTwoWeekLow?.raw) / apiData.fiftyTwoWeekLow?.raw) * 100).toFixed(2) || 'N/A',
//                                 PercentageChangeVolatility: ((apiData.fiftyTwoWeekChangePercent?.raw + apiData.twoHundredDayAverageChangePercent?.raw + apiData.fiftyDayAverageChangePercent?.raw) / 3).toFixed(2) || 'N/A',
//                                 Volatility: ((0.5 * parseFloat(rangeVolatility)) + (0.5 * parseFloat(percentageChangeVolatility))).toFixed(2) || 'N/A',
//                                 Liquidity: ((0.8 * apiData.averageDailyVolume3Month?.raw) + (0.2 * apiData.regularMarketVolume?.raw)).toFixed(2) || 'N/A',
//                                 GICsIndustryGroup: gicsMapping[ticker] || 'N/A',
//                                 Exchange: exchangeName || 'N/A', // Add the exchange name here

//                             };         

//                             validStocks.push(stockDetails);
//                             await delay(120);

//                             await Stock.findOneAndUpdate({ Stock: ticker }, stockDetails, { upsert: true, new: true });
//                             console.log(`Successfully updated or inserted stock details for ${ticker}`);
                            
//                             // Call the function to update Redis with the price data
//                             updateRedisWithStockData(ticker, apiData, 'price')
//                             .then(() => console.log("Price data updated in Redis"))
//                             .catch(err => console.error("Error updating Redis with price data:", err));

//                             // Calculate and log the % complete
//                             const percentComplete = ((i + 1) / totalTickers * 100).toFixed(2);
//                             console.log(`${percentComplete}% complete (${i + 1}/${totalTickers})`);

                        
//                             // Log progress or handle batch completion here
//                             await delay(1000); // Respect API rate limits between batches
                            
//                             }
//                         }
//                     } catch (error) {
//                         console.error(`Error processing ${ticker}: ${error}`);
//                     }
//                 }

//                 // After processing all tickers
//                 if (validStocks.length > 0) {
//                     let averageVolatility = totalVolatility / validVolatilityCount;
//                     console.log(`totalVolatility: ${totalVolatility}`);
//                     console.log(`validVolatilityCount: ${validVolatilityCount}`);
//                     console.log(`Average Volatility across all stocks: ${averageVolatility}`);
//                         // Sorting and scoring for Volatility
//                     validStocks.sort((a, b) => a.Volatility - b.Volatility);

//                     const binSize = Math.ceil(validStocks.length / 10);
//                     for (let i = 0; i < validStocks.length; i++) {
//                         let score = Math.ceil((i + 1) / binSize);
//                         validStocks[i].VolatilityScore = score;
//                     }

//                     // Sorting and scoring for Liquidity
//                     validStocks.sort((a, b) => a.Liquidity - b.Liquidity); // Assuming higher liquidity is better
//                     const liquidityBinSize = Math.ceil(validStocks.length / 10);
//                     for (let i = 0; i < validStocks.length; i++) {
//                         validStocks[i].LiquidityScore = Math.ceil((i + 1) / liquidityBinSize);
//                     }

//                     // Assuming validStocks contains all the modified stockDetails objects
//                     for (let stock of validStocks) {
//                         // Assuming 'stock' contains the MongoDB document _id or some unique identifier in 'Stock'
//                         await Stock.findOneAndUpdate(
//                             { _id: stock._id }, // or {_id: stock._id} if you use MongoDB _id
//                             { $set: { VolatilityScore: stock.VolatilityScore, LiquidityScore: stock.LiquidityScore } },
//                             { new: true } // This option returns the document after update was applied
//                         ).then(updatedDocument => {
//                             console.log(`Successfully updated scores for ${stock.Stock}`);
//                         }).catch(error => {
//                             console.error(`Error updating scores for ${stock.Stock}:`, error);
//                         });

//                     }

//                     console.log('All stocks processed successfully.');
//                     } else {
//                     console.log("No valid stocks to process.");
//                 }

//             } catch (error) {
//                 console.error(`Error processing ${exchangeFile}:`, error);
                
//                 // Decide whether to continue to the next file or not
//                 continue; // Continue to the next file if there's an error
//             }
//         } catch (error) {
//             console.error(`Error processing ${exchangeFile}:`, error);
//         }
//     }
//     return new Response(JSON.stringify({ message: 'Files updated successfully' }), { status: 200 });
// }



