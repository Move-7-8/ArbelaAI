// /api/cron/route.js
import fs from 'fs';
import path from 'path';
import {connectToDB} from '@utils/database'
import Stock from '@models/stock';

export async function GET() {
    // console.log('Cron job is hit');
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
        // let tickers = stocks.map(stock => stock.Stock).slice(0, 20);
        console.log("Testing with first 20 tickers:", tickers);

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
                    // console.log(`Stock with Ticker: ${ticker} not found.`);
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
                        
                        stockDetails.LastPrice = apiData.regularMarketPreviousClose?.raw || 'N/A';
                        stockDetails.RegularMarketChange = apiData.regularMarketChange?.raw || 'N/A';
                        stockDetails.Name = apiData.longName || 'N/A',
                        stockDetails.Price = apiData.regularMarketPrice?.raw || 'N/A',
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
                        const rangeVolatility = (((apiData.fiftyTwoWeekHigh?.raw - apiData.fiftyTwoWeekLow?.raw) / apiData.fiftyTwoWeekLow?.raw) * 100).toFixed(2);
                        const percentageChangeVolatility = ((apiData.fiftyTwoWeekChangePercent?.raw + apiData.twoHundredDayAverageChangePercent?.raw + apiData.fiftyDayAverageChangePercent?.raw) / 3).toFixed(2);
                        const volatility = ((0.5 * parseFloat(rangeVolatility)) + (0.5 * parseFloat(percentageChangeVolatility))).toFixed(2);
                        const liquidity = ((0.8 * apiData.averageDailyVolume3Month?.raw) + (0.2 * apiData.regularMarketVolume?.raw)).toFixed(2);
                        const gicsIndustryGroup = gicsMapping[`${ticker}`] || 'N/A';
                        
                        console.log("stockDetails.Price:", stockDetails.Price);
                        console.log("rangeVolatility:", rangeVolatility);
                        console.log("percentageChangeVolatility:", percentageChangeVolatility);
                        console.log("volatility:", volatility);
                        console.log("liquidity:", liquidity);
                        console.log("gicsIndustryGroup:", gicsIndustryGroup);
                        
                        // Updating stock object with calculated fields
                        stockDetails.RangeVolatility = rangeVolatility || 'N/A',
                        stockDetails.PercentageChangeVolatility = percentageChangeVolatility || 'N/A',
                        stockDetails.Volatility = volatility || 'N/A',
                        stockDetails.Liquidity = liquidity || 'N/A'
                        stockDetails.GICsIndustryGroup = gicsIndustryGroup;

                        // Add the stock's volatility to the total if it's valid
                        if (!isNaN(volatility) && !isNaN(liquidity)) {
                            totalVolatility += parseFloat(volatility);
                            validVolatilityCount++;  // Increment the count here
                            validStocks.push({
                                ...stockDetails.toObject(), // Convert Mongoose document to a plain JavaScript object if necessary
                                Volatility: volatility,
                                Liquidity: liquidity
                            });
                        }

                        console.log(`totalVolatility ${totalVolatility} validVolatilityCount ${validVolatilityCount} .`);
                        
                        //START NEW
                        await stockDetails.save()
                        .then(updatedDocument => {
                          console.log(`Successfully updated stock details for ${ticker}`);
                          // Optionally, log the updated document or just a confirmation message
                        //   console.log(updatedDocument);
                        })
                        .catch(error => {
                          console.error(`Error updating stock details for ${ticker}: ${error}`);
                        });
                                          
                        // If you want to increment a completion counter or perform other logic after saving, do it here
                        completedRequests++;
                        // Calculate the completion percentage
                        let percentageComplete = ((completedRequests / tickers.length) * 100).toFixed(2);
                        // console.log(`Completed: ${percentageComplete / 2}% for ticker ${ticker}`);
                
                        //END NEW
                        completedRequests++;

                        // Calculate the completion percentage
                        console.log(`Completed: ${percentageComplete}% for ticker ${ticker}`);
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
        console.log(`totalVolatility: ${totalVolatility}`);
        console.log(`validVolatilityCount: ${validVolatilityCount}`);
        console.log(`Average Volatility across all stocks: ${averageVolatility}`);
        
        // Sorting and scoring for Volatility
        validStocks.sort((a, b) => a.Volatility - b.Volatility);
        
        const binSize = Math.ceil(validStocks.length / 10);
        for (let i = 0; i < validStocks.length; i++) {
            let score = Math.ceil((i + 1) / binSize);
            validStocks[i].VolatilityScore = score;
        }
        
        // Sorting and scoring for Liquidity
        validStocks.sort((a, b) => a.Liquidity - b.Liquidity); // Assuming higher liquidity is better
        const liquidityBinSize = Math.ceil(validStocks.length / 10);
        for (let i = 0; i < validStocks.length; i++) {
            validStocks[i].LiquidityScore = Math.ceil((i + 1) / liquidityBinSize);
        }
        
        // Assuming validStocks contains all the modified stockDetails objects
        for (let stock of validStocks) {
            // Assuming 'stock' contains the MongoDB document _id or some unique identifier in 'Stock'
            await Stock.findOneAndUpdate(
                { _id: stock._id }, // or {_id: stock._id} if you use MongoDB _id
                { $set: { VolatilityScore: stock.VolatilityScore, LiquidityScore: stock.LiquidityScore } },
                { new: true } // This option returns the document after update was applied
            ).then(updatedDocument => {
                console.log(`Successfully updated scores for ${stock.Stock}`);
            }).catch(error => {
                console.error(`Error updating scores for ${stock.Stock}:`, error);
            });
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
            console.log('All stocks updated successfully.');
            return new Response(JSON.stringify( 'File updated successfully' ), { status: 200 });

        } catch (error) {
            console.error('Route Catch Error:', error);
            return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
        }
    }
        