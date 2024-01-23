// /api/cron/route.js
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import { createObjectCsvStringifier } from 'csv-writer';


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
        //  WRITE TO S3 PDF: //
        ///////////////////
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-southeast-2'        
        });

        const s3 = new AWS.S3();

        //TEST DATA: 
        const testData = [
            {
              "ASX_code": "14D.AX",
              "Company name": "1414 DEGREES LIMITED",
              "GICsindustrygroup": "Capital Goods",
              "Listing date": "12/09/2018",
              "Price": 0.057,
              "Change (%)": -0.001000002,
              "Last Price": "0.036",
              "Market Cap": 15,
              "fiftyTwoWeekHigh": 0.085,
              "fiftyTwoWeekLow": 0.025,
              "fiftyTwoWeekChangePercent": -24,
              "twoHundredDayAverageChangePercent": 0.12721401,
              "fiftyDayAverageChangePercent": 0.19546975,
              "averageDailyVolume3Month": 104790,
              "regularMarketVolume": 26754,
              "priceToBook": "1.33",
              "trailingAnnualDividendRate": "N/A",
              "epsTrailingTwelveMonths": -0.01,
              "regularMarketChangePercent": "N/A",
              "MarketCapitalisation": 13575633,
              "LastPrice": 0.057,
              "RangeVolatility": 240,
              "PercentageChangeVolatility": -7.892438746666667,
              "Volatility": 116.05378062666666,
              "Change": 0,
              "Liquidity": 89182.8,
              "VolatilityScore": 2,
              "LiquidityScore": 1,
              "Date": "20 Jamuary 2024"
            },
            {
              "ASX_code": "1AD.AX",
              "Company name": "ADALTA LIMITED",
              "GICsindustrygroup": "Pharmaceuticals, Biotechnology & Life Sciences",
              "Listing date": "22/08/2016",
              "Price": 0.024,
              "Change (%)": 0,
              "Last Price": "0.024",
              "Market Cap": 15,
              "fiftyTwoWeekHigh": 0.048,
              "fiftyTwoWeekLow": 0.017,
              "fiftyTwoWeekChangePercent": -45.454544,
              "twoHundredDayAverageChangePercent": 0.008297447,
              "fiftyDayAverageChangePercent": 0.069995515,
              "averageDailyVolume3Month": 495229,
              "regularMarketVolume": 30800,
              "priceToBook": "4.80",
              "trailingAnnualDividendRate": "N/A",
              "epsTrailingTwelveMonths": -0.02,
              "regularMarketChangePercent": "N/A",
              "MarketCapitalisation": 12619296,
              "LastPrice": 0.024,
              "RangeVolatility": 182.35294117647058,
              "PercentageChangeVolatility": -15.125417012666666,
              "Volatility": 83.61376208190195,
              "Change": 0,
              "Liquidity": 402343.2,
              "VolatilityScore": 1,
              "LiquidityScore": 2,
              "Date": "20 Jamuary 2024"
            },
            {
              "ASX_code": "1AE.AX",
              "Company name": "AURORA ENERGY METALS LIMITED",
              "GICsindustrygroup": "Materials",
              "Listing date": "18/05/2022",
              "Price": 0.115,
              "Change (%)": 0.017000005,
              "Last Price": "0.115",
              "Market Cap": 15,
              "fiftyTwoWeekHigh": 0.185,
              "fiftyTwoWeekLow": 0.053,
              "fiftyTwoWeekChangePercent": -23.333336,
              "twoHundredDayAverageChangePercent": 0.33430028,
              "fiftyDayAverageChangePercent": 0.2717019,
              "averageDailyVolume3Month": 559704,
              "regularMarketVolume": 175459,
              "priceToBook": "5.00",
              "trailingAnnualDividendRate": "N/A",
              "epsTrailingTwelveMonths": -0.04,
              "regularMarketChangePercent": -4.1666627,
              "MarketCapitalisation": 20592360,
              "LastPrice": 0.115,
              "RangeVolatility": 249.05660377358492,
              "PercentageChangeVolatility": -7.575777939999999,
              "Volatility": 120.74041291679247,
              "Change": 0,
              "Liquidity": 482855,
              "VolatilityScore": 3,
              "LiquidityScore": 3,
              "Date": "20 Jamuary 2024"
            },
        ]
          
        for (const stock of testData) {
            const csvStringifier = createObjectCsvStringifier({
                header: [
                    // Add all the fields from your JSON data
                    {id: 'ASX_code', title: 'ASX Code'},
                    {id: 'Company name', title: 'Company Name'},
                    {id: 'GICsindustrygroup', title: 'GICs Industry Group'},
                    {id: 'Listing date', title: 'Listing Date'},
                    {id: 'Price', title: 'Price'},
                    {id: 'Change (%)', title: 'Change (%)'},
                    {id: 'Last Price', title: 'Last Price'},
                    {id: 'Market Cap', title: 'Market Cap'},
                    {id: 'fiftyTwoWeekHigh', title: '52 Week High'},
                    {id: 'fiftyTwoWeekLow', title: '52 Week Low'},
                    {id: 'fiftyTwoWeekChangePercent', title: '52 Week Change Percent'},
                    {id: 'twoHundredDayAverageChangePercent', title: '200 Day Average Change Percent'},
                    {id: 'fiftyDayAverageChangePercent', title: '50 Day Average Change Percent'},
                    {id: 'averageDailyVolume3Month', title: 'Average Daily Volume 3 Month'},
                    {id: 'regularMarketVolume', title: 'Regular Market Volume'},
                    {id: 'priceToBook', title: 'Price to Book'},
                    {id: 'trailingAnnualDividendRate', title: 'Trailing Annual Dividend Rate'},
                    {id: 'epsTrailingTwelveMonths', title: 'EPS Trailing Twelve Months'},
                    {id: 'regularMarketChangePercent', title: 'Regular Market Change Percent'},
                    {id: 'MarketCapitalisation', title: 'Market Capitalisation'},
                    {id: 'LastPrice', title: 'Last Price'},
                    {id: 'RangeVolatility', title: 'Range Volatility'},
                    {id: 'PercentageChangeVolatility', title: 'Percentage Change Volatility'},
                    {id: 'Volatility', title: 'Volatility'},
                    {id: 'Change', title: 'Change'},
                    {id: 'Liquidity', title: 'Liquidity'},
                    {id: 'VolatilityScore', title: 'Volatility Score'},
                    {id: 'LiquidityScore', title: 'Liquidity Score'},
                    {id: 'Date', title: 'Date'}
                            // ... more fields as per your data
                ]
            });
            const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords([stock]);

            // Define the parameters for the S3 upload
            const params = {
                Bucket: 'kalicapitaltest',
                Key: `pdf/${stock['ASX_code']}.csv`,
                Body: csvData,
                ContentType: 'text/csv'
            };

                    // Upload the file to S3
            try {
                await s3.upload(params).promise();
                console.log(`File uploaded successfully. ${params.Key}`);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

    
        ////////////////////
        //  RETURN TO FRONT END: //
        ///////////////////

            return new Response(JSON.stringify( 'File updated successfully' ), { status: 200 });

        } catch (error) {
            console.error('Route Catch Error:', error);
            return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
        }
    }
        