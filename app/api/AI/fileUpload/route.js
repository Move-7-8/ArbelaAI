// import AWS from 'aws-sdk';
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// export async function POST(req) {
//     const data = await req.json();

//     AWS.config.update({
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//         region: 'ap-southeast-2'
//     });

//     const s3 = new AWS.S3();
//     const uploadPromises = [];
    
//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();
//     let page = pdfDoc.addPage(); // Use 'let' instead of 'const' for reassignment
//     const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
//     const fontSize = 12;
//     let yPosition = page.getHeight() - 40; // Start 40 units from the top
//     const xPosition = 50; // Start 50 units from the left
    
//     const lines = [
//         // Price Data
//         `Symbol: ${data.price?.symbol || 'NA'}`,
//         `200 Day Average Change Percent: ${data.price.twoHundredDayAverageChangePercent?.raw || 'NA'}`,
//         `52 Week Low Change Percent: ${data.earningsTrend?.epsRevisions?.downLast30days || 'NA'}`,
//         `Earnings Timestamp End: ${data.price.earningsTimestampEnd?.raw || 'NA'}`,
//         `Regular Market Day Range: ${data.price.regularMarketDayRange?.raw || 'NA'}`,
//         `EPS Forward: ${data.price.epsForward?.raw || 'NA'}`,
//         `Regular Market Day High: ${data.price.regularMarketDayHigh?.raw || 'NA'}`,
//         `200 Day Average Change: ${data.price.twoHundredDayAverageChange?.raw || 'NA'}`,
//         `Ask Size: ${data.price.askSize?.raw || 'NA'}`,
//         `200 Day Average: ${data.price.twoHundredDayAverage?.raw || 'NA'}`,
//         `Book Value: ${data.price.bookValue?.raw || 'NA'}`,
//         `Market Cap: ${data.price.marketCap?.raw || 'NA'}`,
//         `52 Week High Change: ${data.price.fiftyTwoWeekHighChange?.raw || 'NA'}`,
//         `52 Week Range: ${data.price.fiftyTwoWeekRange?.raw || 'NA'}`,
//         `50 Day Average Change: ${data.price.fiftyDayAverageChange?.raw || 'NA'}`,
//         `Average Daily Volume 3 Month: ${data.price.averageDailyVolume3Month?.raw || 'NA'}`,
//         `First Trade Date Milliseconds: ${data.price.firstTradeDateMilliseconds || 'NA'}`,
//         `Exchange Data Delayed By: ${data.price.exchangeDataDelayedBy || 'NA'}`,
//         `52 Week Change Percent: ${data.price.fiftyTwoWeekChangePercent?.raw || 'NA'}`,
//         `Trailing Annual Dividend Rate: ${data.price.trailingAnnualDividendRate?.raw || 'NA'}`,
//         `52 Week Low: ${data.price.fiftyTwoWeekLow?.raw || 'NA'}`,
//         `Regular Market Volume: ${data.price.regularMarketVolume?.raw || 'NA'}`,
//         `Market: ${data.price.market || 'NA'}`,
//         `Message Board ID: ${data.price.messageBoardId || 'NA'}`,
//         `Price Hint: ${data.price.priceHint || 'NA'}`,
//         `Source Interval: ${data.price.sourceInterval || 'NA'}`,
//         `Regular Market Day Low: ${data.price.regularMarketDayLow?.raw || 'NA'}`,
//         `Exchange: ${data.price.exchange || 'NA'}`,
//         `Short Name: ${data.price.shortName || 'NA'}`,
//         `Region: ${data.price.region || 'NA'}`,
//         `50 Day Average Change Percent: ${data.price.fiftyDayAverageChangePercent?.raw || 'NA'}`,
//         `Full Exchange Name: ${data.price.fullExchangeName || 'NA'}`,
//         `Earnings Timestamp Start: ${data.price.earningsTimestampStart?.raw || 'NA'}`,
//         `Financial Currency: ${data.price.financialCurrency || 'NA'}`,
//         `GMT Offset Milliseconds: ${data.price.gmtOffSetMilliseconds || 'NA'}`,
//         `Regular Market Open: ${data.price.regularMarketOpen?.raw || 'NA'}`,
//         `Regular Market Time: ${data.price.regularMarketTime?.raw || 'NA'}`,
//         `Regular Market Change Percent: ${data.price.regularMarketChangePercent?.raw || 'NA'}`,
//         `Trailing Annual Dividend Yield: ${data.price.trailingAnnualDividendYield?.raw || 'NA'}`,
//         `Quote Type: ${data.price.quoteType || 'NA'}`,
//         `Average Daily Volume 10 Day: ${data.price.averageDailyVolume10Day?.raw || 'NA'}`,
//         `52 Week Low Change: ${data.price.fiftyTwoWeekLowChange?.raw || 'NA'}`,
//         `52 Week High Change Percent: ${data.price.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`,
//         `Type Display: ${data.price.typeDisp || 'NA'}`,
//         `Tradeable: ${data.price.tradeable || 'NA'}`,
//         `Currency: ${data.price.currency || 'NA'}`,
//         `Shares Outstanding: ${data.price.sharesOutstanding?.raw || 'NA'}`,
//         `Regular Market Previous Close: ${data.price.regularMarketPreviousClose?.raw || 'NA'}`,
//         `52 Week High: ${data.price.fiftyTwoWeekHigh?.raw || 'NA'}`,
//         `Exchange Timezone Name: ${data.price.exchangeTimezoneName || 'NA'}`,
//         `Bid Size: ${data.price.bidSize?.raw || 'NA'}`,
//         `Regular Market Change: ${data.price.regularMarketChange?.raw || 'NA'}`,
//         `Crypto Tradeable: ${data.price.cryptoTradeable || 'NA'}`,
//         `50 Day Average: ${data.price.fiftyDayAverage?.raw || 'NA'}`,
//         `Exchange Timezone Short Name: ${data.price.exchangeTimezoneShortName || 'NA'}`,
//         `Regular Market Price: ${data.price.regularMarketPrice?.raw || 'NA'}`,
//         `Custom Price Alert Confidence: ${data.price.customPriceAlertConfidence || 'NA'}`,
//         `Market State: ${data.price.marketState || 'NA'}`,
//         `Forward PE: ${data.price.forwardPE?.raw || 'NA'}`,
//         `Ask: ${data.price.ask?.raw || 'NA'}`,
//         `EPS Trailing Twelve Months: ${data.price.epsTrailingTwelveMonths?.raw || 'NA'}`,
//         `Bid: ${data.price.bid?.raw || 'NA'}`,
//         `Triggerable: ${data.price.triggerable || 'NA'}`,
//         `Price to Book: ${data.price.priceToBook?.raw || 'NA'}`,
//         `Long Name: ${data.price.longName || 'NA'}`,
        
//         // Historic Data
//         `Historic Currency: ${data.historic.meta.currency || 'NA'}`,
//         `Historic Symbol: ${data.historic.meta.symbol || 'NA'}`,
//         `Historic Exchange Name: ${data.historic.meta.exchangeName || 'NA'}`,
//         `Historic Instrument Type: ${data.historic.meta.instrumentType || 'NA'}`,
//         `Historic First Trade Date: ${data.historic.meta.firstTradeDate || 'NA'}`,
//         `Historic Regular Market Time: ${data.historic.meta.regularMarketTime || 'NA'}`,
//         `Historic GMT Offset: ${data.historic.meta.gmtoffset || 'NA'}`,
//         `Historic Timezone: ${data.historic.meta.timezone || 'NA'}`,
//         `Historic Exchange Timezone Name: ${data.historic.meta.exchangeTimezoneName || 'NA'}`,
//         `Historic Regular Market Price: ${data.historic.meta.regularMarketPrice || 'NA'}`,
//         `Historic Chart Previous Close: ${data.historic.meta.chartPreviousClose || 'NA'}`,
//         `Historic Price Hint: ${data.historic.meta.priceHint || 'NA'}`,
        
//         //Balance Sheet
//         `Balance Sheet Max Age: ${data.balanceSheet.maxAge || 'NA'}`,
//         `Balance Sheet End Date: ${data.balanceSheet.endDate?.raw || 'NA'}`,
//         `Earnings Max Age: ${data.earnings.maxAge || 'NA'}`,
//         `Earnings Chart Quarterly: ${data.earnings.earningsChart?.quarterly?.map(q => `Q: ${q.quarter}, Actual: ${q.actual}, Estimate: ${q.estimate}`).join('; ') || 'NA'}`,
//         `Earnings Chart Earnings Date: ${data.earnings.earningsChart?.earningsDate?.map(date => `${date}`).join(', ') || 'NA'}`,
//         `Financials Chart Yearly: ${data.earnings.financialsChart?.yearly?.map(y => `Year: ${y.year}, Revenue: ${y.revenue}, Earnings: ${y.earnings}`).join('; ') || 'NA'}`,
//         `Financials Chart Quarterly: ${data.earnings.financialsChart?.quarterly?.map(q => `Q: ${q.quarter}, Revenue: ${q.revenue}, Earnings: ${q.earnings}`).join('; ') || 'NA'}`,
//         `Financials Chart Quarterly: ${data.earnings.financialsChart?.quarterly?.map(q => `Q: ${q.quarter}, Revenue: ${q.revenue}, Earnings: ${q.earnings}`).join('; ') || 'NA'}`,
//         `Earnings Financial Currency: ${data.earnings.financialCurrency || 'NA'}`,
//         `Finance Analytics Max Age: ${data.financeAnalytics?.maxAge || 'NA'}`,
//         `Current Price: ${data.financeAnalytics.currentPrice?.raw || 'NA'}`,
//         `Total Cash: ${data.financeAnalytics.totalCash?.raw || 'NA'}`,
//         `Total Cash Per Share: ${data.financeAnalytics.totalCashPerShare?.raw || 'NA'}`,
//         `EBITDA: ${data.financeAnalytics.ebitda?.raw || 'NA'}`,
//         `Total Debt: ${data.financeAnalytics.totalDebt?.raw || 'NA'}`,
//         `Quick Ratio: ${data.financeAnalytics.quickRatio?.raw || 'NA'}`,
//         `Current Ratio: ${data.financeAnalytics.currentRatio?.raw || 'NA'}`,
//         `Total Revenue: ${data.financeAnalytics.totalRevenue?.raw || 'NA'}`,
//         `Debt to Equity: ${data.financeAnalytics.debtToEquity?.raw || 'NA'}`,
//         `Revenue Per Share: ${data.financeAnalytics.revenuePerShare?.raw || 'NA'}`,
//         `Return on Assets: ${data.financeAnalytics.returnOnAssets?.raw || 'NA'}`,
//         `Return on Equity: ${data.financeAnalytics.returnOnEquity?.raw || 'NA'}`,
//         `Free Cashflow: ${data.financeAnalytics.freeCashflow?.raw || 'NA'}`,
//         `Operating Cashflow: ${data.financeAnalytics.operatingCashflow?.raw || 'NA'}`,
//         `Revenue Growth: ${data.financeAnalytics.revenueGrowth?.raw || 'NA'}`,
//         `Gross Margins: ${data.financeAnalytics.grossMargins?.raw || 'NA'}`,
//         `EBITDA Margins: ${data.financeAnalytics.ebitdaMargins?.raw || 'NA'}`,
//         `Operating Margins: ${data.financeAnalytics.operatingMargins?.raw || 'NA'}`,
//         `Profit Margins: ${data.financeAnalytics.profitMargins?.raw || 'NA'}`,
//         `Finance Analytics Financial Currency: ${data.financeAnalytics.financialCurrency || 'NA'}`,
        
//         //News
//         `News 1 UUID: ${data.news[0]?.uuid || 'NA'}`,
//         `News 1 Title: ${data.news[0]?.title || 'NA'}`,
//         `News 1 Publisher: ${data.news[0]?.publisher || 'NA'}`,
//         `News 1 Link: ${data.news[0]?.link || 'NA'}`,
//         `News 1 Provider Publish Time: ${data.news[0]?.providerPublishTime || 'NA'}`,
//         `News 1 Type: ${data.news[0]?.type || 'NA'}`,
        
//         `News 2 UUID: ${data.news[1]?.uuid || 'NA'}`,
//         `News 2 Title: ${data.news[1]?.title || 'NA'}`,
//         `News 2 Publisher: ${data.news[1]?.publisher || 'NA'}`,
//         `News 2 Link: ${data.news[1]?.link || 'NA'}`,
//         `News 2 Provider Publish Time: ${data.news[1]?.providerPublishTime || 'NA'}`,
//         `News 2 Type: ${data.news[1]?.type || 'NA'}`,
        
//         `News 3 UUID: ${data.news[2]?.uuid || 'NA'}`,
//         `News 3 Title: ${data.news[2]?.title || 'NA'}`,
//         `News 3 Publisher: ${data.news[2]?.publisher || 'NA'}`,
//         `News 3 Link: ${data.news[2]?.link || 'NA'}`,
//         `News 3 Provider Publish Time: ${data.news[2]?.providerPublishTime || 'NA'}`,
//         `News 3 Type: ${data.news[2]?.type || 'NA'}`,
        
//         `News 4 UUID: ${data.news[3]?.uuid || 'NA'}`,
//         `News 4 Title: ${data.news[3]?.title || 'NA'}`,
//         `News 4 Publisher: ${data.news[3]?.publisher || 'NA'}`,
//         `News 4 Link: ${data.news[3]?.link || 'NA'}`,
//         `News 4 Provider Publish Time: ${data.news[3]?.providerPublishTime || 'NA'}`,
//         `News 4 Type: ${data.news[3]?.type || 'NA'}`,
        
//         `News 5 UUID: ${data.news[4]?.uuid || 'NA'}`,
//         `News 5 Title: ${data.news[4]?.title || 'NA'}`,
//         `News 5 Publisher: ${data.news[4]?.publisher || 'NA'}`,
//         `News 5 Link: ${data.news[4]?.link || 'NA'}`,
//         `News 5 Provider Publish Time: ${data.news[4]?.providerPublishTime || 'NA'}`,
//         `News 5 Type: ${data.news[4]?.type || 'NA'}`,
        
//         `News 6 UUID: ${data.news[5]?.uuid || 'NA'}`,
//         `News 6 Title: ${data.news[5]?.title || 'NA'}`,
//         `News 6 Publisher: ${data.news[5]?.publisher || 'NA'}`,
//         `News 6 Link: ${data.news[5]?.link || 'NA'}`,
//         `News 6 Provider Publish Time: ${data.news[5]?.providerPublishTime || 'NA'}`,
//         `News 6 Type: ${data.news[5]?.type || 'NA'}`,
        
//         `News 7 UUID: ${data.news[6]?.uuid || 'NA'}`,
//         `News 7 Title: ${data.news[6]?.title || 'NA'}`,
//         `News 7 Publisher: ${data.news[6]?.publisher || 'NA'}`,
//         `News 7 Link: ${data.news[6]?.link || 'NA'}`,
//         `News 7 Provider Publish Time: ${data.news[6]?.providerPublishTime || 'NA'}`,
//         `News 7 Type: ${data.news[6]?.type || 'NA'}`,
        
//         //Earnings
//         `Earnings Trend Max Age: ${data.earningsTrend.maxAge || 'NA'}`,
//         `Earnings Trend Period: ${data.earningsTrend.period || 'NA'}`,
//         `Earnings Trend End Date: ${data.earningsTrend.endDate || 'NA'}`,

//         `Earnings Estimate Average: ${data.earningsTrend.earningsEstimate?.avg || 'NA'}`,
//         `Earnings Estimate Low: ${data.earningsTrend.earningsEstimate?.low || 'NA'}`,
//         `Earnings Estimate High: ${data.earningsTrend.earningsEstimate?.high || 'NA'}`,
//         `Earnings Estimate Number Of Analysts: ${data.earningsTrend.earningsEstimate?.numberOfAnalysts || 'NA'}`,
//         `Earnings Estimate Growth: ${data.earningsTrend.earningsEstimate?.growth || 'NA'}`,
        
//         `Revenue Estimate Average: ${data.earningsTrend.revenueEstimate?.avg || 'NA'}`,
//         `Revenue Estimate Low: ${data.earningsTrend.revenueEstimate?.low || 'NA'}`,
//         `Revenue Estimate High: ${data.earningsTrend.revenueEstimate?.high || 'NA'}`,
//         `Revenue Estimate Number Of Analysts: ${data.earningsTrend.revenueEstimate?.numberOfAnalysts || 'NA'}`,
        
//         `EPS Trend Current: ${data.earningsTrend.epsTrend?.current || 'NA'}`,
//         `EPS Trend 7 Days Ago: ${data.earningsTrend?.epsTrend?.['7daysAgo'] || 'NA'}`,
//         `EPS Trend 30 Days Ago: ${data.earningsTrend?.epsTrend?.['30daysAgo'] || 'NA'}`,
//         `EPS Trend 60 Days Ago: ${data.earningsTrend?.epsTrend?.['60daysAgo'] || 'NA'}`,
//         `EPS Trend 90 Days Ago: ${data.earningsTrend?.epsTrend?.['90daysAgo'] || 'NA'}`,
        
//         `EPS Revisions Up Last 7 Days: ${data.earningsTrend.epsRevisions?.upLast7days || 'NA'}`,
//         `EPS Revisions Up Last 30 Days: ${data.earningsTrend.epsRevisions?.upLast30days || 'NA'}`,
//         `EPS Revisions Down Last 30 Days: ${data.earningsTrend.epsRevisions?.downLast30days || 'NA'}`,
//         `EPS Revisions Down Last 90 Days: ${data.earningsTrend.epsRevisions?.downLast90days || 'NA'}`,

//         //Key Statistics 
//         `Symbol: ${data.keyStatistics.symbol || 'NA'}`,
//         `200 Day Average Change Percent: ${data.keyStatistics.twoHundredDayAverageChangePercent?.raw || 'NA'}`,
//         `52 Week Low Change Percent: ${data.keyStatistics.fiftyTwoWeekLowChangePercent?.raw || 'NA'}`,
//         `Language: ${data.keyStatistics.language || 'NA'}`,
//         `Regular Market Day Range: ${data.keyStatistics.regularMarketDayRange?.raw || 'NA'}`,
//         `Earnings Timestamp End: ${data.keyStatistics.earningsTimestampEnd?.raw || 'NA'}`,
//         `EPS Forward: ${data.keyStatistics.epsForward?.raw || 'NA'}`,
//         `Regular Market Day High: ${data.keyStatistics.regularMarketDayHigh?.raw || 'NA'}`,
//         `200 Day Average Change: ${data.keyStatistics.twoHundredDayAverageChange?.raw || 'NA'}`,
//         `200 Day Average: ${data.keyStatistics.twoHundredDayAverage?.raw || 'NA'}`,
//         `Ask Size: ${data.keyStatistics.askSize?.raw || 'NA'}`,
//         `Book Value: ${data.keyStatistics.bookValue?.raw || 'NA'}`,
//         `Market Cap: ${data.keyStatistics.marketCap?.raw || 'NA'}`,
//         `52 Week High Change: ${data.keyStatistics.fiftyTwoWeekHighChange?.raw || 'NA'}`,
//         `52 Week Range: ${data.keyStatistics.fiftyTwoWeekRange?.raw || 'NA'}`,
//         `50 Day Average Change: ${data.keyStatistics.fiftyDayAverageChange?.raw || 'NA'}`,
//         `Exchange Data Delayed By: ${data.keyStatistics.exchangeDataDelayedBy || 'NA'}`,
//         `First Trade Date Milliseconds: ${data.keyStatistics.firstTradeDateMilliseconds || 'NA'}`,
//         `Average Daily Volume 3 Month: ${data.keyStatistics.averageDailyVolume3Month?.raw || 'NA'}`,
//         `Trailing Annual Dividend Rate: ${data.keyStatistics.trailingAnnualDividendRate?.raw || 'NA'}`,
//         `52 Week Change Percent: ${data.keyStatistics.fiftyTwoWeekChangePercent?.raw || 'NA'}`,
//         `52 Week Low: ${data.keyStatistics.fiftyTwoWeekLow?.raw || 'NA'}`,
//         `Regular Market Volume: ${data.keyStatistics.regularMarketVolume?.raw || 'NA'}`,
//         `Market: ${data.keyStatistics.market || 'NA'}`,
//         `Quote Source Name: ${data.keyStatistics.quoteSourceName || 'NA'}`,
//         `Message Board ID: ${data.keyStatistics.messageBoardId || 'NA'}`,
//         `Price Hint: ${data.keyStatistics.priceHint || 'NA'}`,
//         `Exchange: ${data.keyStatistics.exchange || 'NA'}`,
//         `Source Interval: ${data.keyStatistics.sourceInterval || 'NA'}`,
//         `Regular Market Day Low: ${data.keyStatistics.regularMarketDayLow?.raw || 'NA'}`,
//         `Region: ${data.keyStatistics.region || 'NA'}`,
//         `Short Name: ${data.keyStatistics.shortName || 'NA'}`,
//         `50 Day Average Change Percent: ${data.keyStatistics.fiftyDayAverageChangePercent?.raw || 'NA'}`,
//         `Full Exchange Name: ${data.keyStatistics.fullExchangeName || 'NA'}`,
//         `Earnings Timestamp Start: ${data.keyStatistics.earningsTimestampStart?.raw || 'NA'}`,
//         `Financial Currency: ${data.keyStatistics.financialCurrency || 'NA'}`,
//         `GMT Offset Milliseconds: ${data.keyStatistics.gmtOffSetMilliseconds || 'NA'}`,
//         `Regular Market Open: ${data.keyStatistics.regularMarketOpen?.raw || 'NA'}`,
//         `Regular Market Time: ${data.keyStatistics.regularMarketTime?.raw || 'NA'}`,
//         `Regular Market Change Percent: ${data.keyStatistics.regularMarketChangePercent?.raw || 'NA'}`,
//         `Trailing Annual Dividend Yield: ${data.keyStatistics.trailingAnnualDividendYield?.raw || 'NA'}`,
//         `Quote Type: ${data.keyStatistics.quoteType || 'NA'}`,
//         `Average Daily Volume 10 Day: ${data.keyStatistics.averageDailyVolume10Day?.raw || 'NA'}`,
//         `52 Week Low Change: ${data.keyStatistics.fiftyTwoWeekLowChange?.raw || 'NA'}`,
//         `52 Week High Change Percent: ${data.keyStatistics.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`,
//         `Type Display: ${data.keyStatistics.typeDisp || 'NA'}`,
//         `Tradeable: ${data.keyStatistics.tradeable || 'NA'}`,
//         `Currency: ${data.keyStatistics.currency || 'NA'}`,
//         `Shares Outstanding: ${data.keyStatistics.sharesOutstanding?.raw || 'NA'}`,
//         `52 Week High: ${data.keyStatistics.fiftyTwoWeekHigh?.raw || 'NA'}`,
//         `Regular Market Previous Close: ${data.keyStatistics.regularMarketPreviousClose?.raw || 'NA'}`,
//         `Exchange Timezone Name: ${data.keyStatistics.exchangeTimezoneName || 'NA'}`,
//         `Bid Size: ${data.keyStatistics.bidSize?.raw || 'NA'}`,
//         `Regular Market Change: ${data.keyStatistics.regularMarketChange?.raw || 'NA'}`,
//         `Crypto Tradeable: ${data.keyStatistics.cryptoTradeable || 'NA'}`,
//         `50 Day Average: ${data.keyStatistics.fiftyDayAverage?.raw || 'NA'}`,
//         `Exchange Timezone Short Name: ${data.keyStatistics.exchangeTimezoneShortName || 'NA'}`,
//         `Custom Price Alert Confidence: ${data.keyStatistics.customPriceAlertConfidence || 'NA'}`,
//         `Regular Market Price: ${data.keyStatistics.regularMarketPrice?.raw || 'NA'}`,
//         `Market State: ${data.keyStatistics.marketState || 'NA'}`,
//         `Forward PE: ${data.keyStatistics.forwardPE?.raw || 'NA'}`,
//         `Ask: ${data.keyStatistics.ask?.raw || 'NA'}`,
//         `EPS Trailing Twelve Months: ${data.keyStatistics.epsTrailingTwelveMonths?.raw || 'NA'}`,
//         `Bid: ${data.keyStatistics.bid?.raw || 'NA'}`,
//         `Triggerable: ${data.keyStatistics.triggerable || 'NA'}`,
//         `Price to Book: ${data.keyStatistics.priceToBook?.raw || 'NA'}`,
//         `Long Name: ${data.keyStatistics.longName || 'NA'}`,

//         // Add the rest of your lines here...
//     ];
    
//     lines.forEach(line => {
//         if (yPosition < 10) { // Check if near the bottom of the page (10 units margin)
//             page = pdfDoc.addPage(); // Correctly reassign 'page' to a new page
//             yPosition = page.getHeight() - 40; // Reset y position for the new page
//         }
    
//         page.drawText(line, {
//             x: xPosition,
//             y: yPosition,
//             size: fontSize,
//             font: timesRomanFont,
//             color: rgb(0, 0, 0),
//         });

//         yPosition -= 18; // Move down for the next line, adjust spacing as needed
//     });
    
//     // Serialize the PDFDocument to bytes (a Uint8Array)
//     const pdfBytes = await pdfDoc.save();

//     // Upload the generated PDF to S3
//     const stockSymbol = data.price?.symbol || 'default';
//     const params = {
//         Bucket: 'kalicapitaltest',
//         Key: `${stockSymbol}_current_data.pdf`,
//         Body: pdfBytes,
//         ContentType: 'application/pdf'
//     };

//     uploadPromises.push(s3.upload(params).promise());

//     try {
//         await Promise.all(uploadPromises);
//         return Response.json({ message: 'Files uploaded successfully.' });
//     } catch (error) {
//         return Response.json({ error: 'Error in file upload.', details: error.message });
//     }
// }


import AWS from 'aws-sdk';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Path: app/api/AI/fileUpload/route.js
export async function POST(req) {
    const data = await req.json();

    console.log('file  upload backend data2', data.data2)
    console.log('file upload backend profile summaryProfile', data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile.industry);

    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-southeast-2'
    });

    const s3 = new AWS.S3();
    const uploadPromises = [];
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage(); // Use 'let' instead of 'const' for reassignment
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontSize = 12;
    let yPosition = page.getHeight() - 40; // Start 40 units from the top
    const xPosition = 50; // Start 50 units from the left
    
    const lines = [


        //get-profile'
        `Business Summary: ${data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.longBusinessSummary || 'NA'}`,
        `Industry: ${data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.industry || 'NA'}`,
        `Website: ${data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.website }`,
        `fullTimeEmployees: ${data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.fullTimeEmployees }`,

        // Price Data
        `Symbol: ${data.data.price?.symbol || 'NA'}`,
        `200 Day Average Change Percent: ${data.data.price.twoHundredDayAverageChangePercent?.raw || 'NA'}`,
        `52 Week Low Change Percent: ${data.data.earningsTrend?.epsRevisions?.downLast30days || 'NA'}`,
        `Earnings Timestamp End: ${data.data.price.earningsTimestampEnd?.raw || 'NA'}`,
        `Regular Market Day Range: ${data.data.price.regularMarketDayRange?.raw || 'NA'}`,
        `EPS Forward: ${data.data.price.epsForward?.raw || 'NA'}`,
        `Regular Market Day High: ${data.data.price.regularMarketDayHigh?.raw || 'NA'}`,
        `200 Day Average Change: ${data.data.price.twoHundredDayAverageChange?.raw || 'NA'}`,
        `Ask Size: ${data.data.price.askSize?.raw || 'NA'}`,
        `200 Day Average: ${data.data.price.twoHundredDayAverage?.raw || 'NA'}`,
        `Book Value: ${data.data.price.bookValue?.raw || 'NA'}`,
        `Market Cap: ${data.data.price.marketCap?.raw || 'NA'}`,
        `52 Week High Change: ${data.data.price.fiftyTwoWeekHighChange?.raw || 'NA'}`,
        `52 Week Range: ${data.data.price.fiftyTwoWeekRange?.raw || 'NA'}`,
        `50 Day Average Change: ${data.data.price.fiftyDayAverageChange?.raw || 'NA'}`,
        `Average Daily Volume 3 Month: ${data.data.price.averageDailyVolume3Month?.raw || 'NA'}`,
        `First Trade Date Milliseconds: ${data.data.price.firstTradeDateMilliseconds || 'NA'}`,
        `Exchange Data Delayed By: ${data.data.price.exchangeDataDelayedBy || 'NA'}`,
        `52 Week Change Percent: ${data.data.price.fiftyTwoWeekChangePercent?.raw || 'NA'}`,
        `Trailing Annual Dividend Rate: ${data.data.price.trailingAnnualDividendRate?.raw || 'NA'}`,
        `52 Week Low: ${data.data.price.fiftyTwoWeekLow?.raw || 'NA'}`,
        `Regular Market Volume: ${data.data.price.regularMarketVolume?.raw || 'NA'}`,
        `Market: ${data.data.price.market || 'NA'}`,
        `Message Board ID: ${data.data.price.messageBoardId || 'NA'}`,
        `Price Hint: ${data.data.price.priceHint || 'NA'}`,
        `Source Interval: ${data.data.price.sourceInterval || 'NA'}`,
        `Regular Market Day Low: ${data.data.price.regularMarketDayLow?.raw || 'NA'}`,
        `Exchange: ${data.data.price.exchange || 'NA'}`,
        `Short Name: ${data.data.price.shortName || 'NA'}`,
        `Region: ${data.data.price.region || 'NA'}`,
        `50 Day Average Change Percent: ${data.data.price.fiftyDayAverageChangePercent?.raw || 'NA'}`,
        `Full Exchange Name: ${data.data.price.fullExchangeName || 'NA'}`,
        `Earnings Timestamp Start: ${data.data.price.earningsTimestampStart?.raw || 'NA'}`,
        `Financial Currency: ${data.data.price.financialCurrency || 'NA'}`,
        `GMT Offset Milliseconds: ${data.data.price.gmtOffSetMilliseconds || 'NA'}`,
        `Regular Market Open: ${data.data.price.regularMarketOpen?.raw || 'NA'}`,
        `Regular Market Time: ${data.data.price.regularMarketTime?.raw || 'NA'}`,
        `Regular Market Change Percent: ${data.data.price.regularMarketChangePercent?.raw || 'NA'}`,
        `Trailing Annual Dividend Yield: ${data.data.price.trailingAnnualDividendYield?.raw || 'NA'}`,
        `Quote Type: ${data.data.price.quoteType || 'NA'}`,
        `Average Daily Volume 10 Day: ${data.data.price.averageDailyVolume10Day?.raw || 'NA'}`,
        `52 Week Low Change: ${data.data.price.fiftyTwoWeekLowChange?.raw || 'NA'}`,
        `52 Week High Change Percent: ${data.data.price.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`,
        `Type Display: ${data.data.price.typeDisp || 'NA'}`,
        `Tradeable: ${data.data.price.tradeable || 'NA'}`,
        `Currency: ${data.data.price.currency || 'NA'}`,
        `Shares Outstanding: ${data.data.price.sharesOutstanding?.raw || 'NA'}`,
        `Regular Market Previous Close: ${data.data.price.regularMarketPreviousClose?.raw || 'NA'}`,
        `52 Week High: ${data.data.price.fiftyTwoWeekHigh?.raw || 'NA'}`,
        `Exchange Timezone Name: ${data.data.price.exchangeTimezoneName || 'NA'}`,
        `Bid Size: ${data.data.price.bidSize?.raw || 'NA'}`,
        `Regular Market Change: ${data.data.price.regularMarketChange?.raw || 'NA'}`,
        `Crypto Tradeable: ${data.data.price.cryptoTradeable || 'NA'}`,
        `50 Day Average: ${data.data.price.fiftyDayAverage?.raw || 'NA'}`,
        `Exchange Timezone Short Name: ${data.data.price.exchangeTimezoneShortName || 'NA'}`,
        `Regular Market Price: ${data.data.price.regularMarketPrice?.raw || 'NA'}`,
        `Custom Price Alert Confidence: ${data.data.price.customPriceAlertConfidence || 'NA'}`,
        `Market State: ${data.data.price.marketState || 'NA'}`,
        `Forward PE: ${data.data.price.forwardPE?.raw || 'NA'}`,
        `Ask: ${data.data.price.ask?.raw || 'NA'}`,
        `EPS Trailing Twelve Months: ${data.data.price.epsTrailingTwelveMonths?.raw || 'NA'}`,
        `Bid: ${data.data.price.bid?.raw || 'NA'}`,
        `Triggerable: ${data.data.price.triggerable || 'NA'}`,
        `Price to Book: ${data.data.price.priceToBook?.raw || 'NA'}`,
        `Long Name: ${data.data.price.longName || 'NA'}`,
        
        // Historic Data
        `Historic Currency: ${data.data.historic.meta.currency || 'NA'}`,
        `Historic Symbol: ${data.data.historic.meta.symbol || 'NA'}`,
        `Historic Exchange Name: ${data.data.historic.meta.exchangeName || 'NA'}`,
        `Historic Instrument Type: ${data.data.historic.meta.instrumentType || 'NA'}`,
        `Historic First Trade Date: ${data.data.historic.meta.firstTradeDate || 'NA'}`,
        `Historic Regular Market Time: ${data.data.historic.meta.regularMarketTime || 'NA'}`,
        `Historic GMT Offset: ${data.data.historic.meta.gmtoffset || 'NA'}`,
        `Historic Timezone: ${data.data.historic.meta.timezone || 'NA'}`,
        `Historic Exchange Timezone Name: ${data.data.historic.meta.exchangeTimezoneName || 'NA'}`,
        `Historic Regular Market Price: ${data.data.historic.meta.regularMarketPrice || 'NA'}`,
        `Historic Chart Previous Close: ${data.data.historic.meta.chartPreviousClose || 'NA'}`,
        `Historic Price Hint: ${data.data.historic.meta.priceHint || 'NA'}`,
        
        //Balance Sheet
        `Balance Sheet Max Age: ${data.data.balanceSheet.maxAge || 'NA'}`,
        `Balance Sheet End Date: ${data.data.balanceSheet.endDate?.raw || 'NA'}`,
        `Earnings Max Age: ${data.data.earnings.maxAge || 'NA'}`,
        `Earnings Chart Quarterly: ${data.data.earnings.earningsChart?.quarterly?.map(q => `Q: ${q.quarter}, Actual: ${q.actual}, Estimate: ${q.estimate}`).join('; ') || 'NA'}`,
        `Earnings Chart Earnings Date: ${data.data.earnings.earningsChart?.earningsDate?.map(date => `${date}`).join(', ') || 'NA'}`,
        `Financials Chart Yearly: ${data.data.earnings.financialsChart?.yearly?.map(y => `Year: ${y.year}, Revenue: ${y.revenue}, Earnings: ${y.earnings}`).join('; ') || 'NA'}`,
        `Financials Chart Quarterly: ${data.data.earnings.financialsChart?.quarterly?.map(q => `Q: ${q.quarter}, Revenue: ${q.revenue}, Earnings: ${q.earnings}`).join('; ') || 'NA'}`,
        `Financials Chart Quarterly: ${data.data.earnings.financialsChart?.quarterly?.map(q => `Q: ${q.quarter}, Revenue: ${q.revenue}, Earnings: ${q.earnings}`).join('; ') || 'NA'}`,
        `Earnings Financial Currency: ${data.data.earnings.financialCurrency || 'NA'}`,
        `Finance Analytics Max Age: ${data.data.financeAnalytics?.maxAge || 'NA'}`,
        `Current Price: ${data.data.financeAnalytics.currentPrice?.raw || 'NA'}`,
        `Total Cash: ${data.data.financeAnalytics.totalCash?.raw || 'NA'}`,
        `Total Cash Per Share: ${data.data.financeAnalytics.totalCashPerShare?.raw || 'NA'}`,
        `EBITDA: ${data.data.financeAnalytics.ebitda?.raw || 'NA'}`,
        `Total Debt: ${data.data.financeAnalytics.totalDebt?.raw || 'NA'}`,
        `Quick Ratio: ${data.data.financeAnalytics.quickRatio?.raw || 'NA'}`,
        `Current Ratio: ${data.data.financeAnalytics.currentRatio?.raw || 'NA'}`,
        `Total Revenue: ${data.data.financeAnalytics.totalRevenue?.raw || 'NA'}`,
        `Debt to Equity: ${data.data.financeAnalytics.debtToEquity?.raw || 'NA'}`,
        `Revenue Per Share: ${data.data.financeAnalytics.revenuePerShare?.raw || 'NA'}`,
        `Return on Assets: ${data.data.financeAnalytics.returnOnAssets?.raw || 'NA'}`,
        `Return on Equity: ${data.data.financeAnalytics.returnOnEquity?.raw || 'NA'}`,
        `Free Cashflow: ${data.data.financeAnalytics.freeCashflow?.raw || 'NA'}`,
        `Operating Cashflow: ${data.data.financeAnalytics.operatingCashflow?.raw || 'NA'}`,
        `Revenue Growth: ${data.data.financeAnalytics.revenueGrowth?.raw || 'NA'}`,
        `Gross Margins: ${data.data.financeAnalytics.grossMargins?.raw || 'NA'}`,
        `EBITDA Margins: ${data.data.financeAnalytics.ebitdaMargins?.raw || 'NA'}`,
        `Operating Margins: ${data.data.financeAnalytics.operatingMargins?.raw || 'NA'}`,
        `Profit Margins: ${data.data.financeAnalytics.profitMargins?.raw || 'NA'}`,
        `Finance Analytics Financial Currency: ${data.data.financeAnalytics.financialCurrency || 'NA'}`,
        
        //News
        `News 1 UUID: ${data.data.news[0]?.uuid || 'NA'}`,
        `News 1 Title: ${data.data.news[0]?.title || 'NA'}`,
        `News 1 Publisher: ${data.data.news[0]?.publisher || 'NA'}`,
        `News 1 Link: ${data.data.news[0]?.link || 'NA'}`,
        `News 1 Provider Publish Time: ${data.data.news[0]?.providerPublishTime || 'NA'}`,
        `News 1 Type: ${data.data.news[0]?.type || 'NA'}`,
        
        `News 2 UUID: ${data.data.news[1]?.uuid || 'NA'}`,
        `News 2 Title: ${data.data.news[1]?.title || 'NA'}`,
        `News 2 Publisher: ${data.data.news[1]?.publisher || 'NA'}`,
        `News 2 Link: ${data.data.news[1]?.link || 'NA'}`,
        `News 2 Provider Publish Time: ${data.data.news[1]?.providerPublishTime || 'NA'}`,
        `News 2 Type: ${data.data.news[1]?.type || 'NA'}`,
        
        `News 3 UUID: ${data.data.news[2]?.uuid || 'NA'}`,
        `News 3 Title: ${data.data.news[2]?.title || 'NA'}`,
        `News 3 Publisher: ${data.data.news[2]?.publisher || 'NA'}`,
        `News 3 Link: ${data.data.news[2]?.link || 'NA'}`,
        `News 3 Provider Publish Time: ${data.data.news[2]?.providerPublishTime || 'NA'}`,
        `News 3 Type: ${data.data.news[2]?.type || 'NA'}`,
        
        `News 4 UUID: ${data.data.news[3]?.uuid || 'NA'}`,
        `News 4 Title: ${data.data.news[3]?.title || 'NA'}`,
        `News 4 Publisher: ${data.data.news[3]?.publisher || 'NA'}`,
        `News 4 Link: ${data.data.news[3]?.link || 'NA'}`,
        `News 4 Provider Publish Time: ${data.data.news[3]?.providerPublishTime || 'NA'}`,
        `News 4 Type: ${data.data.news[3]?.type || 'NA'}`,
        
        `News 5 UUID: ${data.data.news[4]?.uuid || 'NA'}`,
        `News 5 Title: ${data.data.news[4]?.title || 'NA'}`,
        `News 5 Publisher: ${data.data.news[4]?.publisher || 'NA'}`,
        `News 5 Link: ${data.data.news[4]?.link || 'NA'}`,
        `News 5 Provider Publish Time: ${data.data.news[4]?.providerPublishTime || 'NA'}`,
        `News 5 Type: ${data.data.news[4]?.type || 'NA'}`,
        
        `News 6 UUID: ${data.data.news[5]?.uuid || 'NA'}`,
        `News 6 Title: ${data.data.news[5]?.title || 'NA'}`,
        `News 6 Publisher: ${data.data.news[5]?.publisher || 'NA'}`,
        `News 6 Link: ${data.data.news[5]?.link || 'NA'}`,
        `News 6 Provider Publish Time: ${data.data.news[5]?.providerPublishTime || 'NA'}`,
        `News 6 Type: ${data.data.news[5]?.type || 'NA'}`,
        
        `News 7 UUID: ${data.data.news[6]?.uuid || 'NA'}`,
        `News 7 Title: ${data.data.news[6]?.title || 'NA'}`,
        `News 7 Publisher: ${data.data.news[6]?.publisher || 'NA'}`,
        `News 7 Link: ${data.data.news[6]?.link || 'NA'}`,
        `News 7 Provider Publish Time: ${data.data.news[6]?.providerPublishTime || 'NA'}`,
        `News 7 Type: ${data.data.news[6]?.type || 'NA'}`,
        
        //Earnings
        `Earnings Trend Max Age: ${data.data.earningsTrend.maxAge || 'NA'}`,
        `Earnings Trend Period: ${data.data.earningsTrend.period || 'NA'}`,
        `Earnings Trend End Date: ${data.data.earningsTrend.endDate || 'NA'}`,

        `Earnings Estimate Average: ${data.data.earningsTrend.earningsEstimate?.avg || 'NA'}`,
        `Earnings Estimate Low: ${data.data.earningsTrend.earningsEstimate?.low || 'NA'}`,
        `Earnings Estimate High: ${data.data.earningsTrend.earningsEstimate?.high || 'NA'}`,
        `Earnings Estimate Number Of Analysts: ${data.data.earningsTrend.earningsEstimate?.numberOfAnalysts || 'NA'}`,
        `Earnings Estimate Growth: ${data.data.earningsTrend.earningsEstimate?.growth || 'NA'}`,
        
        `Revenue Estimate Average: ${data.data.earningsTrend.revenueEstimate?.avg || 'NA'}`,
        `Revenue Estimate Low: ${data.data.earningsTrend.revenueEstimate?.low || 'NA'}`,
        `Revenue Estimate High: ${data.data.earningsTrend.revenueEstimate?.high || 'NA'}`,
        `Revenue Estimate Number Of Analysts: ${data.data.earningsTrend.revenueEstimate?.numberOfAnalysts || 'NA'}`,
        
        `EPS Trend Current: ${data.data.earningsTrend.epsTrend?.current || 'NA'}`,
        `EPS Trend 7 Days Ago: ${data.data.earningsTrend?.epsTrend?.['7daysAgo'] || 'NA'}`,
        `EPS Trend 30 Days Ago: ${data.data.earningsTrend?.epsTrend?.['30daysAgo'] || 'NA'}`,
        `EPS Trend 60 Days Ago: ${data.data.earningsTrend?.epsTrend?.['60daysAgo'] || 'NA'}`,
        `EPS Trend 90 Days Ago: ${data.data.earningsTrend?.epsTrend?.['90daysAgo'] || 'NA'}`,
        
        `EPS Revisions Up Last 7 Days: ${data.data.earningsTrend.epsRevisions?.upLast7days || 'NA'}`,
        `EPS Revisions Up Last 30 Days: ${data.data.earningsTrend.epsRevisions?.upLast30days || 'NA'}`,
        `EPS Revisions Down Last 30 Days: ${data.data.earningsTrend.epsRevisions?.downLast30days || 'NA'}`,
        `EPS Revisions Down Last 90 Days: ${data.data.earningsTrend.epsRevisions?.downLast90days || 'NA'}`,

        //Key Statistics 
        `Symbol: ${data.data.keyStatistics.symbol || 'NA'}`,
        `200 Day Average Change Percent: ${data.data.keyStatistics.twoHundredDayAverageChangePercent?.raw || 'NA'}`,
        `52 Week Low Change Percent: ${data.data.keyStatistics.fiftyTwoWeekLowChangePercent?.raw || 'NA'}`,
        `Language: ${data.data.keyStatistics.language || 'NA'}`,
        `Regular Market Day Range: ${data.data.keyStatistics.regularMarketDayRange?.raw || 'NA'}`,
        `Earnings Timestamp End: ${data.data.keyStatistics.earningsTimestampEnd?.raw || 'NA'}`,
        `EPS Forward: ${data.data.keyStatistics.epsForward?.raw || 'NA'}`,
        `Regular Market Day High: ${data.data.keyStatistics.regularMarketDayHigh?.raw || 'NA'}`,
        `200 Day Average Change: ${data.data.keyStatistics.twoHundredDayAverageChange?.raw || 'NA'}`,
        `200 Day Average: ${data.data.keyStatistics.twoHundredDayAverage?.raw || 'NA'}`,
        `Ask Size: ${data.data.keyStatistics.askSize?.raw || 'NA'}`,
        `Book Value: ${data.data.keyStatistics.bookValue?.raw || 'NA'}`,
        `Market Cap: ${data.data.keyStatistics.marketCap?.raw || 'NA'}`,
        `52 Week High Change: ${data.data.keyStatistics.fiftyTwoWeekHighChange?.raw || 'NA'}`,
        `52 Week Range: ${data.data.keyStatistics.fiftyTwoWeekRange?.raw || 'NA'}`,
        `50 Day Average Change: ${data.data.keyStatistics.fiftyDayAverageChange?.raw || 'NA'}`,
        `Exchange Data Delayed By: ${data.data.keyStatistics.exchangeDataDelayedBy || 'NA'}`,
        `First Trade Date Milliseconds: ${data.data.keyStatistics.firstTradeDateMilliseconds || 'NA'}`,
        `Average Daily Volume 3 Month: ${data.data.keyStatistics.averageDailyVolume3Month?.raw || 'NA'}`,
        `Trailing Annual Dividend Rate: ${data.data.keyStatistics.trailingAnnualDividendRate?.raw || 'NA'}`,
        `52 Week Change Percent: ${data.data.keyStatistics.fiftyTwoWeekChangePercent?.raw || 'NA'}`,
        `52 Week Low: ${data.data.keyStatistics.fiftyTwoWeekLow?.raw || 'NA'}`,
        `Regular Market Volume: ${data.data.keyStatistics.regularMarketVolume?.raw || 'NA'}`,
        `Market: ${data.data.keyStatistics.market || 'NA'}`,
        `Quote Source Name: ${data.data.keyStatistics.quoteSourceName || 'NA'}`,
        `Message Board ID: ${data.data.keyStatistics.messageBoardId || 'NA'}`,
        `Price Hint: ${data.data.keyStatistics.priceHint || 'NA'}`,
        `Exchange: ${data.data.keyStatistics.exchange || 'NA'}`,
        `Source Interval: ${data.data.keyStatistics.sourceInterval || 'NA'}`,
        `Regular Market Day Low: ${data.data.keyStatistics.regularMarketDayLow?.raw || 'NA'}`,
        `Region: ${data.data.keyStatistics.region || 'NA'}`,
        `Short Name: ${data.data.keyStatistics.shortName || 'NA'}`,
        `50 Day Average Change Percent: ${data.data.keyStatistics.fiftyDayAverageChangePercent?.raw || 'NA'}`,
        `Full Exchange Name: ${data.data.keyStatistics.fullExchangeName || 'NA'}`,
        `Earnings Timestamp Start: ${data.data.keyStatistics.earningsTimestampStart?.raw || 'NA'}`,
        `Financial Currency: ${data.data.keyStatistics.financialCurrency || 'NA'}`,
        `GMT Offset Milliseconds: ${data.data.keyStatistics.gmtOffSetMilliseconds || 'NA'}`,
        `Regular Market Open: ${data.data.keyStatistics.regularMarketOpen?.raw || 'NA'}`,
        `Regular Market Time: ${data.data.keyStatistics.regularMarketTime?.raw || 'NA'}`,
        `Regular Market Change Percent: ${data.data.keyStatistics.regularMarketChangePercent?.raw || 'NA'}`,
        `Trailing Annual Dividend Yield: ${data.data.keyStatistics.trailingAnnualDividendYield?.raw || 'NA'}`,
        `Quote Type: ${data.data.keyStatistics.quoteType || 'NA'}`,
        `Average Daily Volume 10 Day: ${data.data.keyStatistics.averageDailyVolume10Day?.raw || 'NA'}`,
        `52 Week Low Change: ${data.data.keyStatistics.fiftyTwoWeekLowChange?.raw || 'NA'}`,
        `52 Week High Change Percent: ${data.data.keyStatistics.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`,
        `Type Display: ${data.data.keyStatistics.typeDisp || 'NA'}`,
        `Tradeable: ${data.data.keyStatistics.tradeable || 'NA'}`,
        `Currency: ${data.data.keyStatistics.currency || 'NA'}`,
        `Shares Outstanding: ${data.data.keyStatistics.sharesOutstanding?.raw || 'NA'}`,
        `52 Week High: ${data.data.keyStatistics.fiftyTwoWeekHigh?.raw || 'NA'}`,
        `Regular Market Previous Close: ${data.data.keyStatistics.regularMarketPreviousClose?.raw || 'NA'}`,
        `Exchange Timezone Name: ${data.data.keyStatistics.exchangeTimezoneName || 'NA'}`,
        `Bid Size: ${data.data.keyStatistics.bidSize?.raw || 'NA'}`,
        `Regular Market Change: ${data.data.keyStatistics.regularMarketChange?.raw || 'NA'}`,
        `Crypto Tradeable: ${data.data.keyStatistics.cryptoTradeable || 'NA'}`,
        `50 Day Average: ${data.data.keyStatistics.fiftyDayAverage?.raw || 'NA'}`,
        `Exchange Timezone Short Name: ${data.data.keyStatistics.exchangeTimezoneShortName || 'NA'}`,
        `Custom Price Alert Confidence: ${data.data.keyStatistics.customPriceAlertConfidence || 'NA'}`,
        `Regular Market Price: ${data.data.keyStatistics.regularMarketPrice?.raw || 'NA'}`,
        `Market State: ${data.data.keyStatistics.marketState || 'NA'}`,
        `Forward PE: ${data.data.keyStatistics.forwardPE?.raw || 'NA'}`,
        `Ask: ${data.data.keyStatistics.ask?.raw || 'NA'}`,
        `EPS Trailing Twelve Months: ${data.data.keyStatistics.epsTrailingTwelveMonths?.raw || 'NA'}`,
        `Bid: ${data.data.keyStatistics.bid?.raw || 'NA'}`,
        `Triggerable: ${data.data.keyStatistics.triggerable || 'NA'}`,
        `Price to Book: ${data.data.keyStatistics.priceToBook?.raw || 'NA'}`,
        `Long Name: ${data.data.keyStatistics.longName || 'NA'}`,

        // Add the rest of your lines here...
    ];
    
    lines.forEach(line => {
        if (yPosition < 10) { // Check if near the bottom of the page (10 units margin)
            page = pdfDoc.addPage(); // Correctly reassign 'page' to a new page
            yPosition = page.getHeight() - 40; // Reset y position for the new page
        }
    
        page.drawText(line, {
            x: xPosition,
            y: yPosition,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        yPosition -= 18; // Move down for the next line, adjust spacing as needed
    });
    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Upload the generated PDF to S3
    const stockSymbol = data.data.price?.symbol || 'default';
    const params = {
        Bucket: 'kalicapitaltest',
        Key: `${stockSymbol}_current_data.pdf`,
        Body: pdfBytes,
        ContentType: 'application/pdf'
    };

    uploadPromises.push(s3.upload(params).promise());

    try {
        await Promise.all(uploadPromises);
        return Response.json({ message: 'Files uploaded successfully.' });
    } catch (error) {
        return Response.json({ error: 'Error in file upload.', details: error.message });
    }
}

