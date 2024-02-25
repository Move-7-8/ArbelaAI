// /api/cron/route.js
import { connectToDB } from '@utils/database';
import Stock from '@models/stock';

export async function GET() {
    console.log('Cron job is hit');
    await connectToDB();

    const ASX_Data = "https://asx.api.markitdigital.com/asx-research/1.0/companies/directory/file?access_token=83ff96335c2d45a094df02a206a39ff4";
    const ASX_response = await fetch(ASX_Data);

    if (!ASX_response.ok) {
        console.error(`Error fetching ASX data: ${ASX_response.statusText}`);
        return;
    }


    let data;
    try {
        const ASX_csv = await ASX_response.text();
        const rows = ASX_csv.split('\n').filter(row => row); // Ensure rows are not empty
        const headers = rows[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
        
        data = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
            return values.reduce((object, value, index) => {
                object[headers[index]] = value;
                return object;
            }, {});
        });
    } catch (error) {
        console.error("Error reading ASX response as text:", error);
        return new Response(JSON.stringify({ error: "Error processing ASX data." }), { status: 500 });
    }

    if (!data || data.length === 0) {
        console.error("No data available from ASX response.");
        return new Response(JSON.stringify({ error: "No data available from ASX response." }), { status: 500 });
    }

    const gicsMapping = data.reduce((acc, company) => {
        acc[company['ASX code'] + '.AX'] = company['GICs industry group'];
        return acc;
    }, {});

    const apiKey = process.env.RAPID_API_KEY;
    const apiHost = process.env.RAPID_API_HOST;

    let tickersWithSuffix = data.map(company => company['ASX code'] + '.AX');
    let tickers = tickersWithSuffix // For testing with a subset

    console.log("Testing with tickers:", tickers);

    // Initialize totalVolatility and validVolatilityCount
    let totalVolatility = 0;
    let validVolatilityCount = 0;
    let validStocks = []; // This line initializes the array

    const delay = ms => new Promise(res => setTimeout(res, ms));

    try {
        const totalTickers = tickers.length; // Total number of tickers to process

        for (let i = 0; i < tickers.length; i++) {
            const ticker = tickers[i];
            const apiUrl = `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`;

        try {
            const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost,
                'Cache-Control': 'no-cache'

            }
            });

            if (!response.ok) {
            console.error(`Error fetching ${ticker}: ${response.statusText}`);
            continue;
            }

            const apiData = await response.json();

            const rangeVolatility = (((apiData.fiftyTwoWeekHigh.raw - apiData.fiftyTwoWeekLow.raw) / apiData.fiftyTwoWeekLow.raw) * 100).toFixed(2);
            const percentageChangeVolatility = ((apiData.fiftyTwoWeekChangePercent.raw + apiData.twoHundredDayAverageChangePercent.raw + apiData.fiftyDayAverageChangePercent.raw) / 3).toFixed(2);
            const volatility = ((0.5 * parseFloat(rangeVolatility)) + (0.5 * parseFloat(percentageChangeVolatility))).toFixed(2);
            const liquidity = ((0.8 * apiData.averageDailyVolume3Month.raw) + (0.2 * apiData.regularMarketVolume.raw)).toFixed(2);
  
            if (!isNaN(parseFloat(volatility)) && !isNaN(parseFloat(liquidity))) {
                totalVolatility += parseFloat(volatility);
                validVolatilityCount++;
    
            const stockDetails = {
                Stock: ticker,
                LastPrice: apiData.regularMarketPreviousClose?.raw || 'N/A',
                RegularMarketChange: apiData.regularMarketChange?.raw || 'N/A',
                Name: apiData.longName || 'N/A',
                Price: apiData.regularMarketPrice?.raw || 'N/A',
                MarketCapitalisation: apiData.marketCap?.raw || 'N/A',
                fiftyTwoWeekHigh: apiData.fiftyTwoWeekHigh?.raw || 'N/A',
                fiftyTwoWeekLow: apiData.fiftyTwoWeekLow?.raw || 'N/A',
                fiftyTwoWeekChangePercent: apiData.fiftyTwoWeekChangePercent?.raw || 'N/A',
                twoHundredDayAverageChangePercent: apiData.twoHundredDayAverageChangePercent?.raw || 'N/A',
                fiftyDayAverageChangePercent: apiData.fiftyDayAverageChangePercent?.raw || 'N/A',
                averageDailyVolume3Month: apiData.averageDailyVolume3Month?.raw || 'N/A',
                regularMarketVolume: apiData.regularMarketVolume?.raw || 'N/A',
                priceToBook: apiData.priceToBook?.fmt || 'N/A',
                trailingAnnualDividendRate: apiData.trailingAnnualDividendRate?.raw || 'N/A',
                epsTrailingTwelveMonths: apiData.epsTrailingTwelveMonths?.raw || 'N/A',
                regularMarketChangePercent: apiData.regularMarketChangePercent?.raw || 'N/A',
                RangeVolatility: (((apiData.fiftyTwoWeekHigh?.raw - apiData.fiftyTwoWeekLow?.raw) / apiData.fiftyTwoWeekLow?.raw) * 100).toFixed(2) || 'N/A',
                PercentageChangeVolatility: ((apiData.fiftyTwoWeekChangePercent?.raw + apiData.twoHundredDayAverageChangePercent?.raw + apiData.fiftyDayAverageChangePercent?.raw) / 3).toFixed(2) || 'N/A',
                Volatility: ((0.5 * parseFloat(rangeVolatility)) + (0.5 * parseFloat(percentageChangeVolatility))).toFixed(2) || 'N/A',
                Liquidity: ((0.8 * apiData.averageDailyVolume3Month?.raw) + (0.2 * apiData.regularMarketVolume?.raw)).toFixed(2) || 'N/A',
                GICsIndustryGroup: gicsMapping[`${ticker}`] || 'N/A'
            };         

            validStocks.push(stockDetails);
            await delay(120);

            await Stock.findOneAndUpdate({ Stock: ticker }, stockDetails, { upsert: true, new: true });
            console.log(`Successfully updated or inserted stock details for ${ticker}`);
            
            // Calculate and log the % complete
            const percentComplete = ((i + 1) / totalTickers * 100).toFixed(2);
            console.log(`${percentComplete}% complete (${i + 1}/${totalTickers})`);

        }
        } catch (error) {
            console.error(`Error processing ${ticker}: ${error}`);
        }
    }

    // After processing all tickers
    if (validStocks.length > 0) {
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

        console.log('All stocks processed successfully.');
        } else {
        console.log("No valid stocks to process.");
    }
    
    
} catch (error) {
    console.error('Error during the overall process:', error);
    return new Response(JSON.stringify( 'File update failed' ), { status: 500 });
    
}


return new Response(JSON.stringify( 'File updated successfully' ), { status: 200 });
    // Other operations...
}











//     // /api/cron/route.js
// import fs from 'fs';
// import path from 'path';
// import {connectToDB} from '@utils/database'
// import Stock from '@models/stock';

// export async function GET() {
//     // console.log('Cron job is hit');
//     await connectToDB();

//     let data; // Declare data outside the try block to make it accessible later

//     const ASX_Data = "https://asx.api.markitdigital.com/asx-research/1.0/companies/directory/file?access_token=83ff96335c2d45a094df02a206a39ff4";
//     const ASX_response = await fetch(ASX_Data);
    
//     if (!ASX_response.ok) {
//         console.error(`Error fetching ASX data: ${ASX_response.statusText}`);
//         return; // Early return to prevent further execution
//     }
    
//     try {
//         const ASX_csv = await ASX_response.text();
//         const rows = ASX_csv.split('\n');
//         const headers = rows[0].split(',').map(header => header.trim().replace(/^"|"$/g, '')); // Adjusting header parsing
//         data = rows.slice(1).map(row => {
//             const values = row.split(',').map(value => value.trim().replace(/^"|"$/g, '')); // Adjusting value parsing
//             const entry = headers.reduce((object, header, index) => {
//                 object[header] = values[index];
//                 return object;
//             }, {});
//             return entry;
//         });
//     } catch (error) {
//         console.error("Error reading ASX response as text", error);
//         return; // Early return to prevent further execution
//     }

//     // Make sure data is populated before using it
//     if (!data) {
//         console.error("No data available from ASX response.");
//         return; // Prevent further execution if data is not available
//     }

//     // Assuming 'data' is now populated correctly
//     const gicsMapping = data.reduce((acc, company) => {
//         // Concatenate '.AX' with the company['ASX code']
//         const asxCodeWithSuffix = company['ASX code'] + '.AX';
//         acc[asxCodeWithSuffix] = company['GICs industry group'];
//         return acc;
//     }, {});
    

//     const apiKey = process.env.RAPID_API_KEY
//     const apiHost = process.env.RAPID_API_HOST

//     try {
//         let totalVolatility = 0;
//         let validVolatilityCount = 0; // counter for stocks with valid volatility
//         let validStocks = []; // array to store stocks with valid volatility
    
//         //From DB
//         const stocks = await Stock.find({}).select('Stock'); // This selects only the ASX_code field
        
//         //From ASX
//         let tickersWithSuffix = data.map(company => company['ASX code'] + '.AX');

//         // //REAL
//         // let tickers = stocks.map(stock => stock.Stock);

//         //TESTING
//         //From DB
//         // let tickers = stocks.map(stock => stock.Stock).slice(0, 2);
//         // console.log("Testing with first 20 tickers:", tickers);

//         //From AX
//         let tickers = tickersWithSuffix.slice(0, 2);
//         console.log("Testing with tickers:", tickers);


//         const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
//         const batchSize = 4; // 10 requests per batch
//         let completedRequests = 0; // Counter for completed requests

//         for (let i = 0; i < tickers.length; i += batchSize) {
//             let batchTickers = tickers.slice(i, i + batchSize);
//             // Execute all requests in the current batch concurrently
//             await Promise.all(batchTickers.map(async (ticker) => {

//                 // Fetch stock details from the database
//                 const stockDetails = await Stock.findOne({ Stock: ticker });
//                 if (!stockDetails) {
//                     // console.log(`Stock with Ticker: ${ticker} not found.`);
//                     return;
//                 }    

//                 const apiUrl = `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`;

//                 try {
//                     const response = await fetch(apiUrl, {
//                         method: 'GET',
//                         headers: {
//                           'X-RapidAPI-Key': apiKey,
//                           'X-RapidAPI-Host': apiHost,
//                         }
//                       });

//                     if (!response.ok) {
//                         console.error(`Error fetching ${ticker}: ${response.statusText}`);
//                         return; // Early return on error
//                     }

//                     const apiData = await response.json();

//                     const stockDetails = await Stock.findOne({ Stock: ticker });
//                     if (stockDetails) {
                        
//                         stockDetails.LastPrice = apiData.regularMarketPreviousClose?.raw || 'N/A';
//                         stockDetails.RegularMarketChange = apiData.regularMarketChange?.raw || 'N/A';
//                         stockDetails.Name = apiData.longName || 'N/A',
//                         stockDetails.Price = apiData.regularMarketPrice?.raw || 'N/A',
//                         stockDetails.MarketCapitalisation = apiData.marketCap?.raw || 'N/A',
//                         stockDetails.fiftyTwoWeekHigh = apiData.fiftyTwoWeekHigh?.raw || 'N/A',
//                         stockDetails.fiftyTwoWeekLow = apiData.fiftyTwoWeekLow?.raw || 'N/A',
//                         stockDetails.fiftyTwoWeekChangePercent = apiData.fiftyTwoWeekChangePercent?.raw || 'N/A',
//                         stockDetails.twoHundredDayAverageChangePercent = apiData.twoHundredDayAverageChangePercent?.raw || 'N/A',
//                         stockDetails.fiftyDayAverageChangePercent = apiData.fiftyDayAverageChangePercent?.raw || 'N/A',
//                         stockDetails.averageDailyVolume3Month = apiData.averageDailyVolume3Month?.raw || 'N/A',
//                         stockDetails.regularMarketVolume = apiData.regularMarketVolume?.raw || 'N/A',
//                         stockDetails.priceToBook = apiData.priceToBook?.fmt || 'N/A',
//                         stockDetails.trailingAnnualDividendRate = apiData.trailingAnnualDividendRate?.raw || 'N/A',
//                         stockDetails.epsTrailingTwelveMonths = apiData.epsTrailingTwelveMonths?.raw || 'N/A',
//                         stockDetails.regularMarketChangePercent = apiData.regularMarketChangePercent?.raw || 'N/A'

//                         // Calculated fields
//                         const rangeVolatility = (((apiData.fiftyTwoWeekHigh?.raw - apiData.fiftyTwoWeekLow?.raw) / apiData.fiftyTwoWeekLow?.raw) * 100).toFixed(2);
//                         const percentageChangeVolatility = ((apiData.fiftyTwoWeekChangePercent?.raw + apiData.twoHundredDayAverageChangePercent?.raw + apiData.fiftyDayAverageChangePercent?.raw) / 3).toFixed(2);
//                         const volatility = ((0.5 * parseFloat(rangeVolatility)) + (0.5 * parseFloat(percentageChangeVolatility))).toFixed(2);
//                         const liquidity = ((0.8 * apiData.averageDailyVolume3Month?.raw) + (0.2 * apiData.regularMarketVolume?.raw)).toFixed(2);
//                         const gicsIndustryGroup = gicsMapping[`${ticker}`] || 'N/A';
                        
//                         console.log("stockDetails.Price:", stockDetails.Price);
//                         console.log("stockDetails.Change:", stockDetails.regularMarketChangePercent);

//                         console.log("rangeVolatility:", rangeVolatility);
//                         console.log("percentageChangeVolatility:", percentageChangeVolatility);
//                         console.log("volatility:", volatility);
//                         console.log("liquidity:", liquidity);
//                         console.log("gicsIndustryGroup:", gicsIndustryGroup);
                        
//                         // Updating stock object with calculated fields
//                         stockDetails.RangeVolatility = rangeVolatility || 'N/A',
//                         stockDetails.PercentageChangeVolatility = percentageChangeVolatility || 'N/A',
//                         stockDetails.Volatility = volatility || 'N/A',
//                         stockDetails.Liquidity = liquidity || 'N/A'
//                         stockDetails.GICsIndustryGroup = gicsIndustryGroup;

//                         // Add the stock's volatility to the total if it's valid
//                         if (!isNaN(volatility) && !isNaN(liquidity)) {
//                             totalVolatility += parseFloat(volatility);
//                             validVolatilityCount++;  // Increment the count here
//                             validStocks.push({
//                                 ...stockDetails.toObject(), // Convert Mongoose document to a plain JavaScript object if necessary
//                                 Volatility: volatility,
//                                 Liquidity: liquidity
//                             });
//                         }

//                         console.log(`totalVolatility ${totalVolatility} validVolatilityCount ${validVolatilityCount} .`);
                        
//                         //START NEW
//                         await stockDetails.save()
//                         .then(updatedDocument => {
//                           console.log(`Successfully updated stock details for ${ticker}`);
//                         // Optionally, log the updated document or just a confirmation message
//                         //   console.log(updatedDocument);
//                         })
//                         .catch(error => {
//                           console.error(`Error updating stock details for ${ticker}: ${error}`);
//                         });
                                          
//                         // If you want to increment a completion counter or perform other logic after saving, do it here
//                         completedRequests++;
//                         // Calculate the completion percentage
//                         let percentageComplete = ((completedRequests / tickers.length) * 100).toFixed(2);
//                         // console.log(`Completed: ${percentageComplete / 2}% for ticker ${ticker}`);
                
//                         //END NEW
//                         completedRequests++;

//                         // Calculate the completion percentage
//                         console.log(`Completed: ${percentageComplete}% for ticker ${ticker}`);
//                     }

//                 } catch (error) {
//                     console.error(`Error fetching ${ticker}: ${error}`);
//                 }
//             }));
            
//             await delay(1400); // Wait for 1.4 second (1400 milliseconds) before processing the next batch
//         }

//         ////////////////////
//         //  CALCULATIONS: //
//         ///////////////////

//         let averageVolatility = totalVolatility / validVolatilityCount;
//         console.log(`totalVolatility: ${totalVolatility}`);
//         console.log(`validVolatilityCount: ${validVolatilityCount}`);
//         console.log(`Average Volatility across all stocks: ${averageVolatility}`);
        
//         // Sorting and scoring for Volatility
//         validStocks.sort((a, b) => a.Volatility - b.Volatility);
        
//         const binSize = Math.ceil(validStocks.length / 10);
//         for (let i = 0; i < validStocks.length; i++) {
//             let score = Math.ceil((i + 1) / binSize);
//             validStocks[i].VolatilityScore = score;
//         }
        
//         // Sorting and scoring for Liquidity
//         validStocks.sort((a, b) => a.Liquidity - b.Liquidity); // Assuming higher liquidity is better
//         const liquidityBinSize = Math.ceil(validStocks.length / 10);
//         for (let i = 0; i < validStocks.length; i++) {
//             validStocks[i].LiquidityScore = Math.ceil((i + 1) / liquidityBinSize);
//         }
        
//         // Assuming validStocks contains all the modified stockDetails objects
//         for (let stock of validStocks) {
//             // Assuming 'stock' contains the MongoDB document _id or some unique identifier in 'Stock'
//             await Stock.findOneAndUpdate(
//                 { _id: stock._id }, // or {_id: stock._id} if you use MongoDB _id
//                 { $set: { VolatilityScore: stock.VolatilityScore, LiquidityScore: stock.LiquidityScore } },
//                 { new: true } // This option returns the document after update was applied
//             ).then(updatedDocument => {
//                 console.log(`Successfully updated scores for ${stock.Stock}`);
//             }).catch(error => {
//                 console.error(`Error updating scores for ${stock.Stock}:`, error);
//             });
//         }
  
//         ////////////////////
//         //  RETURN TO FRONT END: //
//         ///////////////////
//             console.log('All stocks updated successfully.');
//             return new Response(JSON.stringify( 'File updated successfully' ), { status: 200 });

//         } catch (error) {
//             console.error('Route Catch Error:', error);
//             return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
//         }
//     }