// /api/cron/route.js
import fs from 'fs';
import path from 'path';
import {connectToDB} from '@utils/database'
import Stock from '@models/stock';

export async function GET() {
    console.log('Cron job is hit');
    await connectToDB();

    // Read the JSON file
  const jsonFilePath = path.join(process.cwd(), 'constants/ASX.json');
  const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonCompanies = JSON.parse(fileContent);
    
    // Create a mapping from ASX_code to GICsindustrygroup
    const gicsMapping = jsonCompanies.reduce((acc, company) => {
        acc[company.ASX_code] = company.GICsindustrygroup;
        return acc;
    }, {});
    
    const apiKey = process.env.RAPID_API_KEY
    const apiHost = process.env.RAPID_API_HOST

    try {
        let totalVolatility = 0;
        let validVolatilityCount = 0; // counter for stocks with valid volatility
        let validStocks = []; // array to store stocks with valid volatility
    
        const stocks = await Stock.find({}).select('Stock'); // This selects only the ASX_code field
        
        // //REAL
        let tickers = stocks.map(stock => stock.Stock);

        //TESTING
        // let tickers = stocks.map(stock => stock.Stock).slice(0, 2);
        // console.log("Testing with first 10 tickers:", tickers);

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        const batchSize = 4; // 10 requests per batch
        let completedRequests = 0; // Counter for completed requests

        for (let i = 0; i < tickers.length; i += batchSize) {
            let batchTickers = tickers.slice(i, i + batchSize);
            // Execute all requests in the current batch concurrently
            await Promise.all(batchTickers.map(async (ticker) => {

                // Fetch stock details from the database
                const stockDetails = await Stock.findOne({ Stock: ticker });
                if (!stockDetails) {
                    console.log(`Stock with Ticker: ${ticker} not found.`);
                    return;
                }    
                const apiUrl = `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`;

                try {
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                          'X-RapidAPI-Key': apiKey,
                          'X-RapidAPI-Host': apiHost,
                        }
                      });

                    if (!response.ok) {
                        console.error(`Error fetching ${ticker}: ${response.statusText}`);
                        return; // Early return on error
                    }

                    const apiData = await response.json();

                    const stockDetails = await Stock.findOne({ Stock: ticker });
                    if (stockDetails) {
                        
                        let lastPrice = stockDetails.Price || 'N/A';
                        stockDetails.Name = apiData.longName || 'N/A',
                        stockDetails.Price = apiData.regularMarketPrice?.raw || 'N/A',
                        stockDetails.LastPrice = lastPrice, // Set the 'Last Price' to what was previously the 'Price'
                        stockDetails.MarketCapitalisation = apiData.marketCap?.raw || 'N/A',
                        stockDetails.fiftyTwoWeekHigh = apiData.fiftyTwoWeekHigh?.raw || 'N/A',
                        stockDetails.fiftyTwoWeekLow = apiData.fiftyTwoWeekLow?.raw || 'N/A',
                        stockDetails.fiftyTwoWeekChangePercent = apiData.fiftyTwoWeekChangePercent?.raw || 'N/A',
                        stockDetails.twoHundredDayAverageChangePercent = apiData.twoHundredDayAverageChangePercent?.raw || 'N/A',
                        stockDetails.fiftyDayAverageChangePercent = apiData.fiftyDayAverageChangePercent?.raw || 'N/A',
                        stockDetails.averageDailyVolume3Month = apiData.averageDailyVolume3Month?.raw || 'N/A',
                        stockDetails.regularMarketVolume = apiData.regularMarketVolume?.raw || 'N/A',
                        stockDetails.priceToBook = apiData.priceToBook?.fmt || 'N/A',
                        stockDetails.trailingAnnualDividendRate = apiData.trailingAnnualDividendRate?.raw || 'N/A',
                        stockDetails.epsTrailingTwelveMonths = apiData.epsTrailingTwelveMonths?.raw || 'N/A',
                        stockDetails.regularMarketChangePercent = apiData.regularMarketChangePercent?.raw || 'N/A'

                        // Calculated fields
                        const rangeVolatility = ((apiData.fiftyTwoWeekHigh - apiData.fiftyTwoWeekLow) / apiData.fiftyTwoWeekLow) * 100;
                        const percentageChangeVolatility = (apiData.fiftyTwoWeekChangePercent + apiData.twoHundredDayAverageChangePercent + apiData.fiftyDayAverageChangePercent) / 3;
                        const volatility = (0.5 * rangeVolatility) + (0.5 * percentageChangeVolatility);
                        const change = ((apiData.regularMarketPrice?.raw - lastPrice) / lastPrice) * 100;
                        const liquidity = (0.8 * apiData.averageDailyVolume3Month) + (0.2 * apiData.regularMarketVolume);
                        const gicsIndustryGroup = gicsMapping[`${ticker}`] || 'N/A';

                        // Updating stock object with calculated fields
                        stockDetails.RangeVolatility = rangeVolatility || 'N/A',
                        stockDetails.PercentageChangeVolatility = percentageChangeVolatility || 'N/A',
                        stockDetails.Volatility = volatility || 'N/A',
                        stockDetails.Change = change ,
                        stockDetails.Liquidity = liquidity || 'N/A'
                        stockDetails.GICsIndustryGroup = gicsIndustryGroup;
                        // stockDetails.Ding = 'Dong';

                        // Add the stock's volatility to the total if it's valid
                        if (!isNaN(volatility) && !isNaN(liquidity)) {
                            totalVolatility += volatility;
                            validVolatilityCount++;  // Increment the count here
                            validStocks.push({
                                ...stock, 
                                Volatility: volatility,
                                Liquidity: liquidity
                            }); 
                        }
                        
                        //START NEW
                        await stockDetails.save()
                        .then(updatedDocument => {
                        })
                        .catch(error => {
                            console.error(`Error updating stock details for ${ticker}: ${error}`);
                        });
                    
                        // If you want to increment a completion counter or perform other logic after saving, do it here
                        completedRequests++;
                        // Calculate the completion percentage
                        let percentageComplete = ((completedRequests / tickers.length) * 100).toFixed(2);
                        console.log(`Completed: ${percentageComplete / 2}% for ticker ${ticker}`);
                
                        //END NEW
                        completedRequests++;

                        // Calculate the completion percentage
                        // let percentageComplete = ((completedRequests / tickers.length) * 100).toFixed(2);
                        // console.log(`Completed: ${percentageComplete}% for ticker ${ticker}`);
                    }

                } catch (error) {
                    console.error(`Error fetching ${ticker}: ${error}`);
                }
            }));
            
            await delay(1400); // Wait for 1.4 second (1400 milliseconds) before processing the next batch
        }

        ////////////////////
        //  CALCULATIONS: //
        ///////////////////

        let averageVolatility = totalVolatility / validVolatilityCount;
        console.log(`Average Volatility across all stocks: ${averageVolatility}%`);
        
        // Sorting and scoring for Volatility
        validStocks.sort((a, b) => a.Volatility - b.Volatility);
        
        const binSize = Math.ceil(validStocks.length / 10);
        for (let i = 0; i < validStocks.length; i++) {
            let score = Math.ceil((i + 1) / binSize);
            validStocks[i].VolatilityScore = score;
        }
        
        // Sorting and scoring for Liquidity
        validStocks.sort((a, b) => b.Liquidity - a.Liquidity); // Assuming higher liquidity is better
        const liquidityBinSize = Math.ceil(validStocks.length / 10);
        for (let i = 0; i < validStocks.length; i++) {
            validStocks[i].LiquidityScore = Math.ceil((i + 1) / liquidityBinSize);
        }
        

        ////////////////////
        //  REWRITE DB: //
        ///////////////////

    
        // for (const updatedStock of validStocks) {
        //     try {
        //         await Stock.updateOne(
        //             { Stock: updatedStock.Stock }, // Filter to identify the document to update
        //             {
        //                 $set: {
        //                     Name: updatedStock.Name,
        //                     Price: updatedStock.Price,
        //                     LastPrice: updatedStock.LastPrice,
        //                     MarketCapitalisation: updatedStock.MarketCapitalisation,
        //                     fiftyTwoWeekHigh: updatedStock.fiftyTwoWeekHigh,
        //                     fiftyTwoWeekLow: updatedStock.fiftyTwoWeekLow,
        //                     fiftyTwoWeekChangePercent: updatedStock.fiftyTwoWeekChangePercent,
        //                     twoHundredDayAverageChangePercent: updatedStock.twoHundredDayAverageChangePercent,
        //                     fiftyDayAverageChangePercent: updatedStock.fiftyDayAverageChangePercent,
        //                     averageDailyVolume3Month: updatedStock.averageDailyVolume3Month,
        //                     regularMarketVolume: updatedStock.regularMarketVolume,
        //                     priceToBook: updatedStock.priceToBook,
        //                     trailingAnnualDividendRate: updatedStock.trailingAnnualDividendRate,
        //                     epsTrailingTwelveMonths: updatedStock.epsTrailingTwelveMonths,
        //                     regularMarketChangePercent: updatedStock.regularMarketChangePercent,
        //                     RangeVolatility: updatedStock.RangeVolatility,
        //                     PercentageChangeVolatility: updatedStock.PercentageChangeVolatility,
        //                     Volatility: updatedStock.Volatility,
        //                     Change: updatedStock.Change,
        //                     Liquidity: updatedStock.Liquidity,
        //                     GICsIndustryGroup: updatedStock.GICsIndustryGroup,
        //                     VolatilityScore: updatedStock.VolatilityScore,
        //                     LiquidityScore: updatedStock.LiquidityScore,
        //                     Ding: updatedStock.Ding
        //                 },
        //             },
        //             { new: true } // This option returns the document after update was applied
        //         );
        //         console.log(`Stock ${updatedStock.Stock} updated successfully.`);
        //     } catch (error) {
        //         console.error(`Error updating stock ${updatedStock.Stock}:`, error);
        //     }
        // }
        
        // Database Update - Assuming validStocks now holds all the data to be updated
        // for (let i = 0; i < validStocks.length; i++) {
        //     const stock = validStocks[i];
        //     await Stock.findOneAndUpdate({ Stock: stock.Stock }, { $set: stock }, { upsert: true, new: true });
        //     let percentageComplete = ((i + 1) / validStocks.length * 100).toFixed(2);
        //     console.log(`Update Progress: ${percentageComplete}% (${i + 1}/${validStocks.length})`);
        // }
        
        // console.log('All stocks updated successfully.');

    
        ////////////////////
        //  RETURN TO FRONT END: //
        ///////////////////

            return new Response(JSON.stringify( 'File updated successfully' ), { status: 200 });

        } catch (error) {
            console.error('Route Catch Error:', error);
            return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
        }
    }
        