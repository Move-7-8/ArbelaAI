// /api/cron/route.js
import fs from 'fs';
import path from 'path';


export async function GET() {
    console.log('Cron job is hit');
    const filePath = path.join(process.cwd(), 'constants', 'ASX.json');
    const apiKey = process.env.RAPID_API_KEY
    const apiHost = process.env.RAPID_API_HOST

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        let data = JSON.parse(fileData);

        // Initialize sum of all volatilities
        let totalVolatility = 0;
        let validVolatilityCount = 0; // counter for stocks with valid volatility
        let validStocks = []; // array to store stocks with valid volatility
    
        //REAL
        // let tickers = data.map(stock => stock["ASX_code"]); // Use all tickers

        //TESTING
        let tickers = data.map(stock => stock["ASX_code"]).slice(0, 3); // Use only first 10 tickers
        console.log("Testing with first 10 tickers:", tickers);

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        const batchSize = 9; // 10 requests per batch
        let completedRequests = 0; // Counter for completed requests

        for (let i = 0; i < tickers.length; i += batchSize) {
            let batchTickers = tickers.slice(i, i + batchSize);

            // Execute all requests in the current batch concurrently
            await Promise.all(batchTickers.map(async (ticker) => {
            let tickers = data.map(stock => stock["ASX_code"]).slice(0, 3); // Adjust as needed
            console.log("Processing tickers:", tickers);
    
            // for (let ticker of tickers) { // Iterate over each ticker
    
                const apiUrl = `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`;
                // const apiUrl = `https://yahoo-finance127.p.rapidapi.com/price/CBA.AX`;
                console.log(`Requesting URL: ${apiUrl}`); // Log the URL being requested

                try {
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                          'X-RapidAPI-Key': apiKey,
                          'X-RapidAPI-Host': apiHost,
                          'Content-Type': 'application/json'
                        }
                      });

                    if (!response.ok) {
                        console.error(`Error fetching ${ticker}: ${response.statusText}`);
                        console.error(`Error fetching 14D: ${response.statusText}`);

                        return; // Early return on error
                    }

                    const jsonData = await response.json();
                    console.log('RAW DATA CRON ROUTE: ')
                    console.log(jsonData)
                    let stock = data.find(stock => stock["ASX_code"] === ticker);
                    if (stock) {
                        
                        let lastPrice = stock.Price || 'N/A';
                        // console.log(`Stock: ${ticker}`)
                        // console.log(`Price: ${JSON.stringify(jsonData)}`)
                        Object.assign(stock, {
                            Price: jsonData.regularMarketPrice?.raw || 'N/A',
                            LastPrice: lastPrice, // Set the 'Last Price' to what was previously the 'Price'
                            MarketCapitalisation: jsonData.marketCap?.raw || 'N/A',
                            fiftyTwoWeekHigh: jsonData.fiftyTwoWeekHigh?.raw || 'N/A',
                            fiftyTwoWeekLow: jsonData.fiftyTwoWeekLow?.raw || 'N/A',
                            fiftyTwoWeekChangePercent: jsonData.fiftyTwoWeekChangePercent?.raw || 'N/A',
                            twoHundredDayAverageChangePercent: jsonData.twoHundredDayAverageChangePercent?.raw || 'N/A',
                            fiftyDayAverageChangePercent: jsonData.fiftyDayAverageChangePercent?.raw || 'N/A',
                            averageDailyVolume3Month: jsonData.averageDailyVolume3Month?.raw || 'N/A',
                            regularMarketVolume: jsonData.regularMarketVolume?.raw || 'N/A',
                            priceToBook: jsonData.priceToBook?.fmt || 'N/A',
                            trailingAnnualDividendRate: jsonData.trailingAnnualDividendRate?.raw || 'N/A',
                            epsTrailingTwelveMonths: jsonData.epsTrailingTwelveMonths?.raw || 'N/A',
                            regularMarketChangePercent: jsonData.regularMarketChangePercent?.raw || 'N/A',
                            Date: '20 Jamuary 2024'
                        });

                        // Calculated fields
                        const rangeVolatility = ((stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow) / stock.fiftyTwoWeekLow) * 100;
                        const percentageChangeVolatility = (stock.fiftyTwoWeekChangePercent + stock.twoHundredDayAverageChangePercent + stock.fiftyDayAverageChangePercent) / 3;
                        const volatility = (0.5 * rangeVolatility) + (0.5 * percentageChangeVolatility);
                        const change = ((stock.Price - stock.LastPrice) / stock.LastPrice) * 100;
                        const liquidity = (0.8 * stock.averageDailyVolume3Month) + (0.2 * stock.regularMarketVolume);

                        // Updating stock object with calculated fields
                        Object.assign(stock, {
                            RangeVolatility: rangeVolatility || 'N/A',
                            PercentageChangeVolatility: percentageChangeVolatility || 'N/A',
                            Volatility: volatility || 'N/A',
                            Change: change ,
                            Liquidity: liquidity || 'N/A'
                        });

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
                        
                        completedRequests++;

                        // Calculate the completion percentage
                        let percentageComplete = ((completedRequests / tickers.length) * 100).toFixed(2);
                        console.log(`Completed: ${percentageComplete}%`);

                        
                    }
                } catch (error) {
                    console.error(`Error fetching ${ticker}: ${error}`);
                }
            // }
            }));
            
            await delay(1200); // Wait for 1 second (1000 milliseconds) before processing the next batch
        }

        ////////////////////
        //  CALCULATIONS: //
        ///////////////////

            // Calculate and log the average volatility
            let averageVolatility = totalVolatility / validVolatilityCount;
            console.log(`Average Volatility across all stocks: ${averageVolatility}%`);
            
            // // Sorting and scoring for Volatility
            validStocks.sort((a, b) => a.Volatility - b.Volatility);

            const binSize = Math.ceil(validStocks.length / 10);

            for (let i = 0; i < validStocks.length; i++) {
                let score = Math.ceil((i + 1) / binSize);
                validStocks[i].VolatilityScore = score;
            }
            data.forEach(stock => {
                const found = validStocks.find(vStock => vStock["ASX_code"] === stock["ASX_code"]);
                if(found) {
                    stock.VolatilityScore = found.VolatilityScore;
                }
            });

            // // Sorting and scoring for Liquidity
            validStocks.sort((a, b) => a.Liquidity - b.Liquidity); // Sort stocks by liquidity
            const liquidityBinSize = Math.ceil(validStocks.length / 10); // Determine bin size for liquidity

            // // Assign Liquidity Scores
            for (let i = 0; i < validStocks.length; i++) {
                let liquidityScore = Math.ceil((i + 1) / liquidityBinSize);
                validStocks[i].LiquidityScore = liquidityScore;
            }

            // // Map the scores back to the original data
            data.forEach(stock => {
                const found = validStocks.find(vStock => vStock["ASX_code"] === stock["ASX_code"]);
                if(found) {
                    stock.VolatilityScore = found.VolatilityScore; // Existing Volatility Score assignment
                    stock.LiquidityScore = found.LiquidityScore; // New Liquidity Score assignment
                }
            });


        ////////////////////
        //  REWRITE JSON: //
        ///////////////////
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log('File updated successfully');
        

    
        ////////////////////
        //  RETURN TO FRONT END: //
        ///////////////////

            return new Response(JSON.stringify( 'File updated successfully' ), { status: 200 });

        } catch (error) {
            console.error('Route Catch Error:', error);
            return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
        }
    }
        