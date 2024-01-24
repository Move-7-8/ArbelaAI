import AWS from 'aws-sdk';
import { createObjectCsvStringifier } from 'csv-writer';

export async function GET() {

    console.log('Uploading file to S3...FIEL ROUTE HIT');
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
        console.log('csvData uploaded successfhully')
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
            return Response.json('Files uploaded successfully.')


        } catch (error) {
            console.error('Error uploading file:', error);
            return Response.json('Files unable to upload.')

        }
    }
}
