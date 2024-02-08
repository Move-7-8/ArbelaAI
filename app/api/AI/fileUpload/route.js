import AWS from 'aws-sdk';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(req) {
    const data = await req.json();

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
        // Price Data
        `Symbol: ${data.price?.symbol || 'NA'}`,
        `200 Day Average Change Percent: ${data.price.twoHundredDayAverageChangePercent?.raw || 'NA'}`,
        `52 Week Low Change Percent: ${data.earningsTrend?.epsRevisions?.downLast30days || 'NA'}`,
        `Earnings Timestamp End: ${data.price.earningsTimestampEnd?.raw || 'NA'}`,
        `Regular Market Day Range: ${data.price.regularMarketDayRange?.raw || 'NA'}`,
        `EPS Forward: ${data.price.epsForward?.raw || 'NA'}`,
        `Regular Market Day High: ${data.price.regularMarketDayHigh?.raw || 'NA'}`,
        `200 Day Average Change: ${data.price.twoHundredDayAverageChange?.raw || 'NA'}`,
        `Ask Size: ${data.price.askSize?.raw || 'NA'}`,
        `200 Day Average: ${data.price.twoHundredDayAverage?.raw || 'NA'}`,
        `Book Value: ${data.price.bookValue?.raw || 'NA'}`,
        `Market Cap: ${data.price.marketCap?.raw || 'NA'}`,
        `52 Week High Change: ${data.price.fiftyTwoWeekHighChange?.raw || 'NA'}`,
        `52 Week Range: ${data.price.fiftyTwoWeekRange?.raw || 'NA'}`,
        `50 Day Average Change: ${data.price.fiftyDayAverageChange?.raw || 'NA'}`,
        `Average Daily Volume 3 Month: ${data.price.averageDailyVolume3Month?.raw || 'NA'}`,
        `First Trade Date Milliseconds: ${data.price.firstTradeDateMilliseconds || 'NA'}`,
        `Exchange Data Delayed By: ${data.price.exchangeDataDelayedBy || 'NA'}`,
        `52 Week Change Percent: ${data.price.fiftyTwoWeekChangePercent?.raw || 'NA'}`,
        `Trailing Annual Dividend Rate: ${data.price.trailingAnnualDividendRate?.raw || 'NA'}`,
        `52 Week Low: ${data.price.fiftyTwoWeekLow?.raw || 'NA'}`,
        `Regular Market Volume: ${data.price.regularMarketVolume?.raw || 'NA'}`,
        `Market: ${data.price.market || 'NA'}`,
        `Message Board ID: ${data.price.messageBoardId || 'NA'}`,
        `Price Hint: ${data.price.priceHint || 'NA'}`,
        `Source Interval: ${data.price.sourceInterval || 'NA'}`,
        `Regular Market Day Low: ${data.price.regularMarketDayLow?.raw || 'NA'}`,
        `Exchange: ${data.price.exchange || 'NA'}`,
        `Short Name: ${data.price.shortName || 'NA'}`,
        `Region: ${data.price.region || 'NA'}`,
        `50 Day Average Change Percent: ${data.price.fiftyDayAverageChangePercent?.raw || 'NA'}`,
        `Full Exchange Name: ${data.price.fullExchangeName || 'NA'}`,
        `Earnings Timestamp Start: ${data.price.earningsTimestampStart?.raw || 'NA'}`,
        `Financial Currency: ${data.price.financialCurrency || 'NA'}`,
        `GMT Offset Milliseconds: ${data.price.gmtOffSetMilliseconds || 'NA'}`,
        `Regular Market Open: ${data.price.regularMarketOpen?.raw || 'NA'}`,
        `Regular Market Time: ${data.price.regularMarketTime?.raw || 'NA'}`,
        `Regular Market Change Percent: ${data.price.regularMarketChangePercent?.raw || 'NA'}`,
        `Trailing Annual Dividend Yield: ${data.price.trailingAnnualDividendYield?.raw || 'NA'}`,
        `Quote Type: ${data.price.quoteType || 'NA'}`,
        `Average Daily Volume 10 Day: ${data.price.averageDailyVolume10Day?.raw || 'NA'}`,
        `52 Week Low Change: ${data.price.fiftyTwoWeekLowChange?.raw || 'NA'}`,
        `52 Week High Change Percent: ${data.price.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`,
        `Type Display: ${data.price.typeDisp || 'NA'}`,
        `Tradeable: ${data.price.tradeable || 'NA'}`,
        `Currency: ${data.price.currency || 'NA'}`,
        `Shares Outstanding: ${data.price.sharesOutstanding?.raw || 'NA'}`,
        `Regular Market Previous Close: ${data.price.regularMarketPreviousClose?.raw || 'NA'}`,
        `52 Week High: ${data.price.fiftyTwoWeekHigh?.raw || 'NA'}`,
        `Exchange Timezone Name: ${data.price.exchangeTimezoneName || 'NA'}`,
        `Bid Size: ${data.price.bidSize?.raw || 'NA'}`,
        `Regular Market Change: ${data.price.regularMarketChange?.raw || 'NA'}`,
        `Crypto Tradeable: ${data.price.cryptoTradeable || 'NA'}`,
        `50 Day Average: ${data.price.fiftyDayAverage?.raw || 'NA'}`,
        `Exchange Timezone Short Name: ${data.price.exchangeTimezoneShortName || 'NA'}`,
        `Regular Market Price: ${data.price.regularMarketPrice?.raw || 'NA'}`,
        `Custom Price Alert Confidence: ${data.price.customPriceAlertConfidence || 'NA'}`,
        `Market State: ${data.price.marketState || 'NA'}`,
        `Forward PE: ${data.price.forwardPE?.raw || 'NA'}`,
        `Ask: ${data.price.ask?.raw || 'NA'}`,
        `EPS Trailing Twelve Months: ${data.price.epsTrailingTwelveMonths?.raw || 'NA'}`,
        `Bid: ${data.price.bid?.raw || 'NA'}`,
        `Triggerable: ${data.price.triggerable || 'NA'}`,
        `Price to Book: ${data.price.priceToBook?.raw || 'NA'}`,
        `Long Name: ${data.price.longName || 'NA'}`,
        
        // Historic Data
        `Historic Currency: ${data.historic.meta.currency || 'NA'}`,
        `Historic Symbol: ${data.historic.meta.symbol || 'NA'}`,
        `Historic Exchange Name: ${data.historic.meta.exchangeName || 'NA'}`,
        `Historic Instrument Type: ${data.historic.meta.instrumentType || 'NA'}`,
        `Historic First Trade Date: ${data.historic.meta.firstTradeDate || 'NA'}`,
        `Historic Regular Market Time: ${data.historic.meta.regularMarketTime || 'NA'}`,
        `Historic GMT Offset: ${data.historic.meta.gmtoffset || 'NA'}`,
        `Historic Timezone: ${data.historic.meta.timezone || 'NA'}`,
        `Historic Exchange Timezone Name: ${data.historic.meta.exchangeTimezoneName || 'NA'}`,
        `Historic Regular Market Price: ${data.historic.meta.regularMarketPrice || 'NA'}`,
        `Historic Chart Previous Close: ${data.historic.meta.chartPreviousClose || 'NA'}`,
        `Historic Price Hint: ${data.historic.meta.priceHint || 'NA'}`,
        
        //Balance Sheet
        `Balance Sheet Max Age: ${data.balanceSheet.maxAge || 'NA'}`,
        `Balance Sheet End Date: ${data.balanceSheet.endDate?.raw || 'NA'}`,
        `Earnings Max Age: ${data.earnings.maxAge || 'NA'}`,
        `Earnings Chart Quarterly: ${data.earnings.earningsChart.quarterly.map(q => `Q: ${q.quarter}, Actual: ${q.actual}, Estimate: ${q.estimate}`).join('; ') || 'NA'}`,
        `Earnings Chart Earnings Date: ${data.earnings.earningsChart.earningsDate.map(date => `${date}`).join(', ') || 'NA'}`,
        `Financials Chart Yearly: ${data.earnings.financialsChart.yearly.map(y => `Year: ${y.year}, Revenue: ${y.revenue}, Earnings: ${y.earnings}`).join('; ') || 'NA'}`,
        `Financials Chart Quarterly: ${data.earnings.financialsChart.quarterly.map(q => `Q: ${q.quarter}, Revenue: ${q.revenue}, Earnings: ${q.earnings}`).join('; ') || 'NA'}`,
        `Earnings Financial Currency: ${data.earnings.financialCurrency || 'NA'}`,
        `Finance Analytics Max Age: ${data.financeAnalytics.maxAge || 'NA'}`,
        `Current Price: ${data.financeAnalytics.currentPrice?.raw || 'NA'}`,
        `Total Cash: ${data.financeAnalytics.totalCash?.raw || 'NA'}`,
        `Total Cash Per Share: ${data.financeAnalytics.totalCashPerShare?.raw || 'NA'}`,
        `EBITDA: ${data.financeAnalytics.ebitda?.raw || 'NA'}`,
        `Total Debt: ${data.financeAnalytics.totalDebt?.raw || 'NA'}`,
        `Quick Ratio: ${data.financeAnalytics.quickRatio?.raw || 'NA'}`,
        `Current Ratio: ${data.financeAnalytics.currentRatio?.raw || 'NA'}`,
        `Total Revenue: ${data.financeAnalytics.totalRevenue?.raw || 'NA'}`,
        `Debt to Equity: ${data.financeAnalytics.debtToEquity?.raw || 'NA'}`,
        `Revenue Per Share: ${data.financeAnalytics.revenuePerShare?.raw || 'NA'}`,
        `Return on Assets: ${data.financeAnalytics.returnOnAssets?.raw || 'NA'}`,
        `Return on Equity: ${data.financeAnalytics.returnOnEquity?.raw || 'NA'}`,
        `Free Cashflow: ${data.financeAnalytics.freeCashflow?.raw || 'NA'}`,
        `Operating Cashflow: ${data.financeAnalytics.operatingCashflow?.raw || 'NA'}`,
        `Revenue Growth: ${data.financeAnalytics.revenueGrowth?.raw || 'NA'}`,
        `Gross Margins: ${data.financeAnalytics.grossMargins?.raw || 'NA'}`,
        `EBITDA Margins: ${data.financeAnalytics.ebitdaMargins?.raw || 'NA'}`,
        `Operating Margins: ${data.financeAnalytics.operatingMargins?.raw || 'NA'}`,
        `Profit Margins: ${data.financeAnalytics.profitMargins?.raw || 'NA'}`,
        `Finance Analytics Financial Currency: ${data.financeAnalytics.financialCurrency || 'NA'}`,
        
        //News
        `News 1 UUID: ${data.news[0]?.uuid || 'NA'}`,
        `News 1 Title: ${data.news[0]?.title || 'NA'}`,
        `News 1 Publisher: ${data.news[0]?.publisher || 'NA'}`,
        `News 1 Link: ${data.news[0]?.link || 'NA'}`,
        `News 1 Provider Publish Time: ${data.news[0]?.providerPublishTime || 'NA'}`,
        `News 1 Type: ${data.news[0]?.type || 'NA'}`,
        
        `News 2 UUID: ${data.news[1]?.uuid || 'NA'}`,
        `News 2 Title: ${data.news[1]?.title || 'NA'}`,
        `News 2 Publisher: ${data.news[1]?.publisher || 'NA'}`,
        `News 2 Link: ${data.news[1]?.link || 'NA'}`,
        `News 2 Provider Publish Time: ${data.news[1]?.providerPublishTime || 'NA'}`,
        `News 2 Type: ${data.news[1]?.type || 'NA'}`,
        
        `News 3 UUID: ${data.news[2]?.uuid || 'NA'}`,
        `News 3 Title: ${data.news[2]?.title || 'NA'}`,
        `News 3 Publisher: ${data.news[2]?.publisher || 'NA'}`,
        `News 3 Link: ${data.news[2]?.link || 'NA'}`,
        `News 3 Provider Publish Time: ${data.news[2]?.providerPublishTime || 'NA'}`,
        `News 3 Type: ${data.news[2]?.type || 'NA'}`,
        
        `News 4 UUID: ${data.news[3]?.uuid || 'NA'}`,
        `News 4 Title: ${data.news[3]?.title || 'NA'}`,
        `News 4 Publisher: ${data.news[3]?.publisher || 'NA'}`,
        `News 4 Link: ${data.news[3]?.link || 'NA'}`,
        `News 4 Provider Publish Time: ${data.news[3]?.providerPublishTime || 'NA'}`,
        `News 4 Type: ${data.news[3]?.type || 'NA'}`,
        
        `News 5 UUID: ${data.news[4]?.uuid || 'NA'}`,
        `News 5 Title: ${data.news[4]?.title || 'NA'}`,
        `News 5 Publisher: ${data.news[4]?.publisher || 'NA'}`,
        `News 5 Link: ${data.news[4]?.link || 'NA'}`,
        `News 5 Provider Publish Time: ${data.news[4]?.providerPublishTime || 'NA'}`,
        `News 5 Type: ${data.news[4]?.type || 'NA'}`,
        
        `News 6 UUID: ${data.news[5]?.uuid || 'NA'}`,
        `News 6 Title: ${data.news[5]?.title || 'NA'}`,
        `News 6 Publisher: ${data.news[5]?.publisher || 'NA'}`,
        `News 6 Link: ${data.news[5]?.link || 'NA'}`,
        `News 6 Provider Publish Time: ${data.news[5]?.providerPublishTime || 'NA'}`,
        `News 6 Type: ${data.news[5]?.type || 'NA'}`,
        
        `News 7 UUID: ${data.news[6]?.uuid || 'NA'}`,
        `News 7 Title: ${data.news[6]?.title || 'NA'}`,
        `News 7 Publisher: ${data.news[6]?.publisher || 'NA'}`,
        `News 7 Link: ${data.news[6]?.link || 'NA'}`,
        `News 7 Provider Publish Time: ${data.news[6]?.providerPublishTime || 'NA'}`,
        `News 7 Type: ${data.news[6]?.type || 'NA'}`,
        
        //Earnings
        `Earnings Trend Max Age: ${data.earningsTrend.maxAge || 'NA'}`,
        `Earnings Trend Period: ${data.earningsTrend.period || 'NA'}`,
        `Earnings Trend End Date: ${data.earningsTrend.endDate || 'NA'}`,

        `Earnings Estimate Average: ${data.earningsTrend.earningsEstimate.avg || 'NA'}`,
        `Earnings Estimate Low: ${data.earningsTrend.earningsEstimate.low || 'NA'}`,
        `Earnings Estimate High: ${data.earningsTrend.earningsEstimate.high || 'NA'}`,
        `Earnings Estimate Number Of Analysts: ${data.earningsTrend.earningsEstimate.numberOfAnalysts || 'NA'}`,
        `Earnings Estimate Growth: ${data.earningsTrend.earningsEstimate.growth || 'NA'}`,

        `Revenue Estimate Average: ${data.earningsTrend.revenueEstimate.avg || 'NA'}`,
        `Revenue Estimate Low: ${data.earningsTrend.revenueEstimate.low || 'NA'}`,
        `Revenue Estimate High: ${data.earningsTrend.revenueEstimate.high || 'NA'}`,
        `Revenue Estimate Number Of Analysts: ${data.earningsTrend.revenueEstimate.numberOfAnalysts || 'NA'}`,

        `EPS Trend Current: ${data.earningsTrend.epsTrend.current || 'NA'}`,
        `EPS Trend 7 Days Ago: ${data.earningsTrend.epsTrend['7daysAgo'] || 'NA'}`,
        `EPS Trend 30 Days Ago: ${data.earningsTrend.epsTrend['30daysAgo'] || 'NA'}`,
        `EPS Trend 60 Days Ago: ${data.earningsTrend.epsTrend['60daysAgo'] || 'NA'}`,
        `EPS Trend 90 Days Ago: ${data.earningsTrend.epsTrend['90daysAgo'] || 'NA'}`,

        `EPS Revisions Up Last 7 Days: ${data.earningsTrend.epsRevisions.upLast7days || 'NA'}`,
        `EPS Revisions Up Last 30 Days: ${data.earningsTrend.epsRevisions.upLast30days || 'NA'}`,
        `EPS Revisions Down Last 30 Days: ${data.earningsTrend.epsRevisions.downLast30days || 'NA'}`,
        `EPS Revisions Down Last 90 Days: ${data.earningsTrend.epsRevisions.downLast90days || 'NA'}`,

        //Key Statistics 
        `Symbol: ${data.keyStatistics.symbol || 'NA'}`,
        `200 Day Average Change Percent: ${data.keyStatistics.twoHundredDayAverageChangePercent?.raw || 'NA'}`,
        `52 Week Low Change Percent: ${data.keyStatistics.fiftyTwoWeekLowChangePercent?.raw || 'NA'}`,
        `Language: ${data.keyStatistics.language || 'NA'}`,
        `Regular Market Day Range: ${data.keyStatistics.regularMarketDayRange?.raw || 'NA'}`,
        `Earnings Timestamp End: ${data.keyStatistics.earningsTimestampEnd?.raw || 'NA'}`,
        `EPS Forward: ${data.keyStatistics.epsForward?.raw || 'NA'}`,
        `Regular Market Day High: ${data.keyStatistics.regularMarketDayHigh?.raw || 'NA'}`,
        `200 Day Average Change: ${data.keyStatistics.twoHundredDayAverageChange?.raw || 'NA'}`,
        `200 Day Average: ${data.keyStatistics.twoHundredDayAverage?.raw || 'NA'}`,
        `Ask Size: ${data.keyStatistics.askSize?.raw || 'NA'}`,
        `Book Value: ${data.keyStatistics.bookValue?.raw || 'NA'}`,
        `Market Cap: ${data.keyStatistics.marketCap?.raw || 'NA'}`,
        `52 Week High Change: ${data.keyStatistics.fiftyTwoWeekHighChange?.raw || 'NA'}`,
        `52 Week Range: ${data.keyStatistics.fiftyTwoWeekRange?.raw || 'NA'}`,
        `50 Day Average Change: ${data.keyStatistics.fiftyDayAverageChange?.raw || 'NA'}`,
        `Exchange Data Delayed By: ${data.keyStatistics.exchangeDataDelayedBy || 'NA'}`,
        `First Trade Date Milliseconds: ${data.keyStatistics.firstTradeDateMilliseconds || 'NA'}`,
        `Average Daily Volume 3 Month: ${data.keyStatistics.averageDailyVolume3Month?.raw || 'NA'}`,
        `Trailing Annual Dividend Rate: ${data.keyStatistics.trailingAnnualDividendRate?.raw || 'NA'}`,
        `52 Week Change Percent: ${data.keyStatistics.fiftyTwoWeekChangePercent?.raw || 'NA'}`,
        `52 Week Low: ${data.keyStatistics.fiftyTwoWeekLow?.raw || 'NA'}`,
        `Regular Market Volume: ${data.keyStatistics.regularMarketVolume?.raw || 'NA'}`,
        `Market: ${data.keyStatistics.market || 'NA'}`,
        `Quote Source Name: ${data.keyStatistics.quoteSourceName || 'NA'}`,
        `Message Board ID: ${data.keyStatistics.messageBoardId || 'NA'}`,
        `Price Hint: ${data.keyStatistics.priceHint || 'NA'}`,
        `Exchange: ${data.keyStatistics.exchange || 'NA'}`,
        `Source Interval: ${data.keyStatistics.sourceInterval || 'NA'}`,
        `Regular Market Day Low: ${data.keyStatistics.regularMarketDayLow?.raw || 'NA'}`,
        `Region: ${data.keyStatistics.region || 'NA'}`,
        `Short Name: ${data.keyStatistics.shortName || 'NA'}`,
        `50 Day Average Change Percent: ${data.keyStatistics.fiftyDayAverageChangePercent?.raw || 'NA'}`,
        `Full Exchange Name: ${data.keyStatistics.fullExchangeName || 'NA'}`,
        `Earnings Timestamp Start: ${data.keyStatistics.earningsTimestampStart?.raw || 'NA'}`,
        `Financial Currency: ${data.keyStatistics.financialCurrency || 'NA'}`,
        `GMT Offset Milliseconds: ${data.keyStatistics.gmtOffSetMilliseconds || 'NA'}`,
        `Regular Market Open: ${data.keyStatistics.regularMarketOpen?.raw || 'NA'}`,
        `Regular Market Time: ${data.keyStatistics.regularMarketTime?.raw || 'NA'}`,
        `Regular Market Change Percent: ${data.keyStatistics.regularMarketChangePercent?.raw || 'NA'}`,
        `Trailing Annual Dividend Yield: ${data.keyStatistics.trailingAnnualDividendYield?.raw || 'NA'}`,
        `Quote Type: ${data.keyStatistics.quoteType || 'NA'}`,
        `Average Daily Volume 10 Day: ${data.keyStatistics.averageDailyVolume10Day?.raw || 'NA'}`,
        `52 Week Low Change: ${data.keyStatistics.fiftyTwoWeekLowChange?.raw || 'NA'}`,
        `52 Week High Change Percent: ${data.keyStatistics.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`,
        `Type Display: ${data.keyStatistics.typeDisp || 'NA'}`,
        `Tradeable: ${data.keyStatistics.tradeable || 'NA'}`,
        `Currency: ${data.keyStatistics.currency || 'NA'}`,
        `Shares Outstanding: ${data.keyStatistics.sharesOutstanding?.raw || 'NA'}`,
        `52 Week High: ${data.keyStatistics.fiftyTwoWeekHigh?.raw || 'NA'}`,
        `Regular Market Previous Close: ${data.keyStatistics.regularMarketPreviousClose?.raw || 'NA'}`,
        `Exchange Timezone Name: ${data.keyStatistics.exchangeTimezoneName || 'NA'}`,
        `Bid Size: ${data.keyStatistics.bidSize?.raw || 'NA'}`,
        `Regular Market Change: ${data.keyStatistics.regularMarketChange?.raw || 'NA'}`,
        `Crypto Tradeable: ${data.keyStatistics.cryptoTradeable || 'NA'}`,
        `50 Day Average: ${data.keyStatistics.fiftyDayAverage?.raw || 'NA'}`,
        `Exchange Timezone Short Name: ${data.keyStatistics.exchangeTimezoneShortName || 'NA'}`,
        `Custom Price Alert Confidence: ${data.keyStatistics.customPriceAlertConfidence || 'NA'}`,
        `Regular Market Price: ${data.keyStatistics.regularMarketPrice?.raw || 'NA'}`,
        `Market State: ${data.keyStatistics.marketState || 'NA'}`,
        `Forward PE: ${data.keyStatistics.forwardPE?.raw || 'NA'}`,
        `Ask: ${data.keyStatistics.ask?.raw || 'NA'}`,
        `EPS Trailing Twelve Months: ${data.keyStatistics.epsTrailingTwelveMonths?.raw || 'NA'}`,
        `Bid: ${data.keyStatistics.bid?.raw || 'NA'}`,
        `Triggerable: ${data.keyStatistics.triggerable || 'NA'}`,
        `Price to Book: ${data.keyStatistics.priceToBook?.raw || 'NA'}`,
        `Long Name: ${data.keyStatistics.longName || 'NA'}`,

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
    const stockSymbol = data.price?.symbol || 'default';
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


// //PDFKit version 
// //app/api/AI/fileUpload/route.js
// import AWS from 'aws-sdk';
// import { createObjectCsvStringifier } from 'csv-writer';
// import PDFDocument from 'pdfkit-next';
// import path from 'path';

// export async function POST(req) {
//     const data = await req.json();
//      // This is the data sent from the front-end
//     console.log('*********************************')
//     console.log('Uploading file to S3...FILE ROUTE HIT');
//     console.log('*********************************')
//     const fontPath = path.join(process.cwd(), 'utils/fonts/Roboto-Black.ttf');

//     AWS.config.update({
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//         region: 'ap-southeast-2'        
//     });

//     const s3 = new AWS.S3();
//     const uploadPromises = [];
    
//     // Initialize a PDF document
//     const doc = new PDFDocument();
//     let buffers = [];
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => {
//         const pdfData = Buffer.concat(buffers);
//         const stockSymbol = data.price.symbol || 'default';
//         const params = {
//             Bucket: 'kalicapitaltest',
//             Key: `${stockSymbol}.pdf`,
//             Body: pdfData,
//             ContentType: 'application/pdf'
//         };

//         // Upload the PDF to S3
//         uploadPromises.push(s3.upload(params).promise());

//         Promise.all(uploadPromises).then(() => {
//             console.log('Files uploaded successfully.');
//         }).catch(error => {
//             console.error('Error uploading files:', error);
//         });
//     });

//     // Using a custom font
//     // doc.font('./utils/fonts/Roboto-Black.ttf').fontSize(12)
//     doc.font(fontPath).fontSize(12);


//     // Price Data 
//     doc.fontSize(12).text('Stock Report', { align: 'center' });
//     doc.moveDown();
//     doc.text(`Symbol: ${data.price?.symbol || 'NA'}`, { align: 'left' });
//     doc.text(`200 Day Average Change Percent: ${data.price.twoHundredDayAverageChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Low Change Percent: ${data.earningsTrend?.epsRevisions?.downLast30days || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Timestamp End: ${data.price.earningsTimestampEnd?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Day Range: ${data.price.regularMarketDayRange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Forward: ${data.price.epsForward?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Day High: ${data.price.regularMarketDayHigh?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`200 Day Average Change: ${data.price.twoHundredDayAverageChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Ask Size: ${data.price.askSize?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`200 Day Average: ${data.price.twoHundredDayAverage?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Book Value: ${data.price.bookValue?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Market Cap: ${data.price.marketCap?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week High Change: ${data.price.fiftyTwoWeekHighChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Range: ${data.price.fiftyTwoWeekRange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`50 Day Average Change: ${data.price.fiftyDayAverageChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Average Daily Volume 3 Month: ${data.price.averageDailyVolume3Month?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`First Trade Date Milliseconds: ${data.price.firstTradeDateMilliseconds || 'NA'}`, { align: 'left' });
//     doc.text(`Exchange Data Delayed By: ${data.price.exchangeDataDelayedBy || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Change Percent: ${data.price.fiftyTwoWeekChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Trailing Annual Dividend Rate: ${data.price.trailingAnnualDividendRate?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Low: ${data.price.fiftyTwoWeekLow?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Volume: ${data.price.regularMarketVolume?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Market: ${data.price.market || 'NA'}`, { align: 'left' });
//     doc.text(`Message Board ID: ${data.price.messageBoardId || 'NA'}`, { align: 'left' });
//     doc.text(`Price Hint: ${data.price.priceHint || 'NA'}`, { align: 'left' });
//     doc.text(`Source Interval: ${data.price.sourceInterval || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Day Low: ${data.price.regularMarketDayLow?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Exchange: ${data.price.exchange || 'NA'}`, { align: 'left' });
//     doc.text(`Short Name: ${data.price.shortName || 'NA'}`, { align: 'left' });
//     doc.text(`Region: ${data.price.region || 'NA'}`, { align: 'left' });
//     doc.text(`50 Day Average Change Percent: ${data.price.fiftyDayAverageChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Full Exchange Name: ${data.price.fullExchangeName || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Timestamp Start: ${data.price.earningsTimestampStart?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Financial Currency: ${data.price.financialCurrency || 'NA'}`, { align: 'left' });
//     doc.text(`GMT Offset Milliseconds: ${data.price.gmtOffSetMilliseconds || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Open: ${data.price.regularMarketOpen?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Time: ${data.price.regularMarketTime?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Change Percent: ${data.price.regularMarketChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Trailing Annual Dividend Yield: ${data.price.trailingAnnualDividendYield?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Quote Type: ${data.price.quoteType || 'NA'}`, { align: 'left' });
//     doc.text(`Average Daily Volume 10 Day: ${data.price.averageDailyVolume10Day?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Low Change: ${data.price.fiftyTwoWeekLowChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week High Change Percent: ${data.price.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Type Display: ${data.price.typeDisp || 'NA'}`, { align: 'left' });
//     doc.text(`Tradeable: ${data.price.tradeable || 'NA'}`, { align: 'left' });
//     doc.text(`Currency: ${data.price.currency || 'NA'}`, { align: 'left' });
//     doc.text(`Shares Outstanding: ${data.price.sharesOutstanding?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Previous Close: ${data.price.regularMarketPreviousClose?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week High: ${data.price.fiftyTwoWeekHigh?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Exchange Timezone Name: ${data.price.exchangeTimezoneName || 'NA'}`, { align: 'left' });
//     doc.text(`Bid Size: ${data.price.bidSize?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Change: ${data.price.regularMarketChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Crypto Tradeable: ${data.price.cryptoTradeable || 'NA'}`, { align: 'left' });
//     doc.text(`50 Day Average: ${data.price.fiftyDayAverage?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Exchange Timezone Short Name: ${data.price.exchangeTimezoneShortName || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Price: ${data.price.regularMarketPrice?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Custom Price Alert Confidence: ${data.price.customPriceAlertConfidence || 'NA'}`, { align: 'left' });
//     doc.text(`Market State: ${data.price.marketState || 'NA'}`, { align: 'left' });
//     doc.text(`Forward PE: ${data.price.forwardPE?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Ask: ${data.price.ask?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Trailing Twelve Months: ${data.price.epsTrailingTwelveMonths?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Bid: ${data.price.bid?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Triggerable: ${data.price.triggerable || 'NA'}`, { align: 'left' });
//     doc.text(`Price to Book: ${data.price.priceToBook?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Long Name: ${data.price.longName || 'NA'}`, { align: 'left' });
    
//     //Historic Data
//     doc.text(`Historic Currency: ${data.historic.meta.currency || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Symbol: ${data.historic.meta.symbol || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Exchange Name: ${data.historic.meta.exchangeName || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Instrument Type: ${data.historic.meta.instrumentType || 'NA'}`, { align: 'left' });
//     doc.text(`Historic First Trade Date: ${data.historic.meta.firstTradeDate || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Regular Market Time: ${data.historic.meta.regularMarketTime || 'NA'}`, { align: 'left' });
//     doc.text(`Historic GMT Offset: ${data.historic.meta.gmtoffset || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Timezone: ${data.historic.meta.timezone || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Exchange Timezone Name: ${data.historic.meta.exchangeTimezoneName || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Regular Market Price: ${data.historic.meta.regularMarketPrice || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Chart Previous Close: ${data.historic.meta.chartPreviousClose || 'NA'}`, { align: 'left' });
//     doc.text(`Historic Price Hint: ${data.historic.meta.priceHint || 'NA'}`, { align: 'left' });

//     //Balance Sheet Data
//     doc.text(`Balance Sheet Max Age: ${data.balanceSheet.maxAge || 'NA'}`, { align: 'left' });
//     doc.text(`Balance Sheet End Date: ${data.balanceSheet.endDate?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Max Age: ${data.earnings.maxAge || 'NA'}`, { align: 'left' });
//     // Earnings Chart Quarterly - Assuming it's an array of objects [{quarter, actual, estimate}, ...]
//     const earningsChartQuarterlyText = data.earnings.earningsChart.quarterly.map(q => `Q: ${q.quarter}, Actual: ${q.actual}, Estimate: ${q.estimate}`).join('; ');
//     doc.text(`Earnings Chart Quarterly: ${earningsChartQuarterlyText || 'NA'}`, { align: 'left' });
//     // Earnings Chart Earnings Date - Assuming it's an array of dates
//     const earningsChartEarningsDateText = data.earnings.earningsChart.earningsDate.map(date => `${date}`).join(', ');
//     doc.text(`Earnings Chart Earnings Date: ${earningsChartEarningsDateText || 'NA'}`, { align: 'left' });
//     // Financials Chart Yearly - Assuming it's an array of objects [{year, revenue, earnings}, ...]
//     const financialsChartYearlyText = data.earnings.financialsChart.yearly.map(y => `Year: ${y.year}, Revenue: ${y.revenue}, Earnings: ${y.earnings}`).join('; ');
//     doc.text(`Financials Chart Yearly: ${financialsChartYearlyText || 'NA'}`, { align: 'left' });
//     // Financials Chart Quarterly - Similar handling as yearly
//     const financialsChartQuarterlyText = data.earnings.financialsChart.quarterly.map(q => `Q: ${q.quarter}, Revenue: ${q.revenue}, Earnings: ${q.earnings}`).join('; ');
//     doc.text(`Financials Chart Quarterly: ${financialsChartQuarterlyText || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Financial Currency: ${data.earnings.financialCurrency || 'NA'}`, { align: 'left' });
//     doc.text(`Finance Analytics Max Age: ${data.financeAnalytics.maxAge || 'NA'}`, { align: 'left' });
//     doc.text(`Current Price: ${data.financeAnalytics.currentPrice?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Total Cash: ${data.financeAnalytics.totalCash?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Total Cash Per Share: ${data.financeAnalytics.totalCashPerShare?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`EBITDA: ${data.financeAnalytics.ebitda?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Total Debt: ${data.financeAnalytics.totalDebt?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Quick Ratio: ${data.financeAnalytics.quickRatio?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Current Ratio: ${data.financeAnalytics.currentRatio?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Total Revenue: ${data.financeAnalytics.totalRevenue?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Debt to Equity: ${data.financeAnalytics.debtToEquity?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Revenue Per Share: ${data.financeAnalytics.revenuePerShare?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Return on Assets: ${data.financeAnalytics.returnOnAssets?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Return on Equity: ${data.financeAnalytics.returnOnEquity?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Free Cashflow: ${data.financeAnalytics.freeCashflow?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Operating Cashflow: ${data.financeAnalytics.operatingCashflow?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Revenue Growth: ${data.financeAnalytics.revenueGrowth?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Gross Margins: ${data.financeAnalytics.grossMargins?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`EBITDA Margins: ${data.financeAnalytics.ebitdaMargins?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Operating Margins: ${data.financeAnalytics.operatingMargins?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Profit Margins: ${data.financeAnalytics.profitMargins?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Finance Analytics Financial Currency: ${data.financeAnalytics.financialCurrency || 'NA'}`, { align: 'left' });
    
    
// //     //News Data
//     doc.text(`News 1 UUID: ${data.news[0]?.uuid || 'NA'}`, { align: 'left' });
//     doc.text(`News 1 Title: ${data.news[0]?.title || 'NA'}`, { align: 'left' });
//     doc.text(`News 1 Publisher: ${data.news[0]?.publisher || 'NA'}`, { align: 'left' });
//     doc.text(`News 1 Link: ${data.news[0]?.link || 'NA'}`, { align: 'left' });
//     doc.text(`News 1 Provider Publish Time: ${data.news[0]?.providerPublishTime || 'NA'}`, { align: 'left' });
//     doc.text(`News 1 Type: ${data.news[0]?.type || 'NA'}`, { align: 'left' });
    
//     doc.text(`News 2 UUID: ${data.news[1]?.uuid || 'NA'}`, { align: 'left' });
//     doc.text(`News 2 Title: ${data.news[1]?.title || 'NA'}`, { align: 'left' });
//     doc.text(`News 2 Publisher: ${data.news[1]?.publisher || 'NA'}`, { align: 'left' });
//     doc.text(`News 2 Link: ${data.news[1]?.link || 'NA'}`, { align: 'left' });
//     doc.text(`News 2 Provider Publish Time: ${data.news[1]?.providerPublishTime || 'NA'}`, { align: 'left' });
//     doc.text(`News 2 Type: ${data.news[1]?.type || 'NA'}`, { align: 'left' });
    
//     doc.text(`News 3 UUID: ${data.news[2]?.uuid || 'NA'}`, { align: 'left' });
//     doc.text(`News 3 Title: ${data.news[2]?.title || 'NA'}`, { align: 'left' });
//     doc.text(`News 3 Publisher: ${data.news[2]?.publisher || 'NA'}`, { align: 'left' });
//     doc.text(`News 3 Link: ${data.news[2]?.link || 'NA'}`, { align: 'left' });
//     doc.text(`News 3 Provider Publish Time: ${data.news[2]?.providerPublishTime || 'NA'}`, { align: 'left' });
//     doc.text(`News 3 Type: ${data.news[2]?.type || 'NA'}`, { align: 'left' });
    
//     doc.text(`News 4 UUID: ${data.news[3]?.uuid || 'NA'}`, { align: 'left' });
//     doc.text(`News 4 Title: ${data.news[3]?.title || 'NA'}`, { align: 'left' });
//     doc.text(`News 4 Publisher: ${data.news[3]?.publisher || 'NA'}`, { align: 'left' });
//     doc.text(`News 4 Link: ${data.news[3]?.link || 'NA'}`, { align: 'left' });
//     doc.text(`News 4 Provider Publish Time: ${data.news[3]?.providerPublishTime || 'NA'}`, { align: 'left' });
//     doc.text(`News 4 Type: ${data.news[3]?.type || 'NA'}`, { align: 'left' });
    
//     doc.text(`News 5 UUID: ${data.news[4]?.uuid || 'NA'}`, { align: 'left' });
//     doc.text(`News 5 Title: ${data.news[4]?.title || 'NA'}`, { align: 'left' });
//     doc.text(`News 5 Publisher: ${data.news[4]?.publisher || 'NA'}`, { align: 'left' });
//     doc.text(`News 5 Link: ${data.news[4]?.link || 'NA'}`, { align: 'left' });
//     doc.text(`News 5 Provider Publish Time: ${data.news[4]?.providerPublishTime || 'NA'}`, { align: 'left' });
//     doc.text(`News 5 Type: ${data.news[4]?.type || 'NA'}`, { align: 'left' });
    
//     doc.text(`News 6 UUID: ${data.news[5]?.uuid || 'NA'}`, { align: 'left' });
//     doc.text(`News 6 Title: ${data.news[5]?.title || 'NA'}`, { align: 'left' });
//     doc.text(`News 6 Publisher: ${data.news[5]?.publisher || 'NA'}`, { align: 'left' });
//     doc.text(`News 6 Link: ${data.news[5]?.link || 'NA'}`, { align: 'left' });
//     doc.text(`News 6 Provider Publish Time: ${data.news[5]?.providerPublishTime || 'NA'}`, { align: 'left' });
//     doc.text(`News 6 Type: ${data.news[5]?.type || 'NA'}`, { align: 'left' });
    
//     doc.text(`News 7 UUID: ${data.news[6]?.uuid || 'NA'}`, { align: 'left' });
//     doc.text(`News 7 Title: ${data.news[6]?.title || 'NA'}`, { align: 'left' });
//     doc.text(`News 7 Publisher: ${data.news[6]?.publisher || 'NA'}`, { align: 'left' });
//     doc.text(`News 7 Link: ${data.news[6]?.link || 'NA'}`, { align: 'left' });
//     doc.text(`News 7 Provider Publish Time: ${data.news[6]?.providerPublishTime || 'NA'}`, { align: 'left' });
//     doc.text(`News 7 Type: ${data.news[6]?.type || 'NA'}`, { align: 'left' });
    
//     //Earnings Trends
//     doc.text(`Earnings Trend Max Age: ${data.earningsTrend.maxAge || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Trend Period: ${data.earningsTrend.period || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Trend End Date: ${data.earningsTrend.endDate || 'NA'}`, { align: 'left' });

//     //Earnings Estimates
//     doc.text(`Earnings Estimate Average: ${data.earningsTrend.earningsEstimate.avg || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Estimate Low: ${data.earningsTrend.earningsEstimate.low || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Estimate High: ${data.earningsTrend.earningsEstimate.high || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Estimate Number Of Analysts: ${data.earningsTrend.earningsEstimate.numberOfAnalysts || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Estimate Growth: ${data.earningsTrend.earningsEstimate.growth || 'NA'}`, { align: 'left' });

//     //Revenue Estimates
//     doc.text(`Revenue Estimate Average: ${data.earningsTrend.revenueEstimate.avg || 'NA'}`, { align: 'left' });
//     doc.text(`Revenue Estimate Low: ${data.earningsTrend.revenueEstimate.low || 'NA'}`, { align: 'left' });
//     doc.text(`Revenue Estimate High: ${data.earningsTrend.revenueEstimate.high || 'NA'}`, { align: 'left' });
//     doc.text(`Revenue Estimate Number Of Analysts: ${data.earningsTrend.revenueEstimate.numberOfAnalysts || 'NA'}`, { align: 'left' });

//     //EPS Trend
//     doc.text(`EPS Trend Current: ${data.earningsTrend.epsTrend.current || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Trend 7 Days Ago: ${data.earningsTrend.epsTrend['7daysAgo'] || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Trend 30 Days Ago: ${data.earningsTrend.epsTrend['30daysAgo'] || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Trend 60 Days Ago: ${data.earningsTrend.epsTrend['60daysAgo'] || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Trend 90 Days Ago: ${data.earningsTrend.epsTrend['90daysAgo'] || 'NA'}`, { align: 'left' });

//     //EPS Revisions
//     doc.text(`EPS Revisions Up Last 7 Days: ${data.earningsTrend.epsRevisions.upLast7days || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Revisions Up Last 30 Days: ${data.earningsTrend.epsRevisions.upLast30days || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Revisions Down Last 30 Days: ${data.earningsTrend.epsRevisions.downLast30days || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Revisions Down Last 90 Days: ${data.earningsTrend.epsRevisions.downLast90days || 'NA'}`, { align: 'left' });

// //     //Key Statistics
//     doc.text(`Symbol: ${data.keyStatistics.symbol || 'NA'}`, { align: 'left' });
//     doc.text(`200 Day Average Change Percent: ${data.keyStatistics.twoHundredDayAverageChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Low Change Percent: ${data.keyStatistics.fiftyTwoWeekLowChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Language: ${data.keyStatistics.language || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Day Range: ${data.keyStatistics.regularMarketDayRange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Timestamp End: ${data.keyStatistics.earningsTimestampEnd?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Forward: ${data.keyStatistics.epsForward?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Day High: ${data.keyStatistics.regularMarketDayHigh?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`200 Day Average Change: ${data.keyStatistics.twoHundredDayAverageChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`200 Day Average: ${data.keyStatistics.twoHundredDayAverage?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Ask Size: ${data.keyStatistics.askSize?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Book Value: ${data.keyStatistics.bookValue?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Market Cap: ${data.keyStatistics.marketCap?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week High Change: ${data.keyStatistics.fiftyTwoWeekHighChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Range: ${data.keyStatistics.fiftyTwoWeekRange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`50 Day Average Change: ${data.keyStatistics.fiftyDayAverageChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Exchange Data Delayed By: ${data.keyStatistics.exchangeDataDelayedBy || 'NA'}`, { align: 'left' });
//     doc.text(`First Trade Date Milliseconds: ${data.keyStatistics.firstTradeDateMilliseconds || 'NA'}`, { align: 'left' });
//     doc.text(`Average Daily Volume 3 Month: ${data.keyStatistics.averageDailyVolume3Month?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Trailing Annual Dividend Rate: ${data.keyStatistics.trailingAnnualDividendRate?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Change Percent: ${data.keyStatistics.fiftyTwoWeekChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Low: ${data.keyStatistics.fiftyTwoWeekLow?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Volume: ${data.keyStatistics.regularMarketVolume?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Market: ${data.keyStatistics.market || 'NA'}`, { align: 'left' });
//     doc.text(`Quote Source Name: ${data.keyStatistics.quoteSourceName || 'NA'}`, { align: 'left' });
//     doc.text(`Message Board ID: ${data.keyStatistics.messageBoardId || 'NA'}`, { align: 'left' });
//     doc.text(`Price Hint: ${data.keyStatistics.priceHint || 'NA'}`, { align: 'left' });
//     doc.text(`Exchange: ${data.keyStatistics.exchange || 'NA'}`, { align: 'left' });
//     doc.text(`Source Interval: ${data.keyStatistics.sourceInterval || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Day Low: ${data.keyStatistics.regularMarketDayLow?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Region: ${data.keyStatistics.region || 'NA'}`, { align: 'left' });
//     doc.text(`Short Name: ${data.keyStatistics.shortName || 'NA'}`, { align: 'left' });
//     doc.text(`50 Day Average Change Percent: ${data.keyStatistics.fiftyDayAverageChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Full Exchange Name: ${data.keyStatistics.fullExchangeName || 'NA'}`, { align: 'left' });
//     doc.text(`Earnings Timestamp Start: ${data.keyStatistics.earningsTimestampStart?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Financial Currency: ${data.keyStatistics.financialCurrency || 'NA'}`, { align: 'left' });
//     doc.text(`GMT Offset Milliseconds: ${data.keyStatistics.gmtOffSetMilliseconds || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Open: ${data.keyStatistics.regularMarketOpen?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Time: ${data.keyStatistics.regularMarketTime?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Change Percent: ${data.keyStatistics.regularMarketChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Trailing Annual Dividend Yield: ${data.keyStatistics.trailingAnnualDividendYield?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Quote Type: ${data.keyStatistics.quoteType || 'NA'}`, { align: 'left' });
//     doc.text(`Average Daily Volume 10 Day: ${data.keyStatistics.averageDailyVolume10Day?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week Low Change: ${data.keyStatistics.fiftyTwoWeekLowChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week High Change Percent: ${data.keyStatistics.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Type Display: ${data.keyStatistics.typeDisp || 'NA'}`, { align: 'left' });
//     doc.text(`Tradeable: ${data.keyStatistics.tradeable || 'NA'}`, { align: 'left' });
//     doc.text(`Currency: ${data.keyStatistics.currency || 'NA'}`, { align: 'left' });
//     doc.text(`Shares Outstanding: ${data.keyStatistics.sharesOutstanding?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`52 Week High: ${data.keyStatistics.fiftyTwoWeekHigh?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Previous Close: ${data.keyStatistics.regularMarketPreviousClose?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Exchange Timezone Name: ${data.keyStatistics.exchangeTimezoneName || 'NA'}`, { align: 'left' });
//     doc.text(`Bid Size: ${data.keyStatistics.bidSize?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Change: ${data.keyStatistics.regularMarketChange?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Crypto Tradeable: ${data.keyStatistics.cryptoTradeable || 'NA'}`, { align: 'left' });
//     doc.text(`50 Day Average: ${data.keyStatistics.fiftyDayAverage?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Exchange Timezone Short Name: ${data.keyStatistics.exchangeTimezoneShortName || 'NA'}`, { align: 'left' });
//     doc.text(`Custom Price Alert Confidence: ${data.keyStatistics.customPriceAlertConfidence || 'NA'}`, { align: 'left' });
//     doc.text(`Regular Market Price: ${data.keyStatistics.regularMarketPrice?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Market State: ${data.keyStatistics.marketState || 'NA'}`, { align: 'left' });
//     doc.text(`Forward PE: ${data.keyStatistics.forwardPE?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Ask: ${data.keyStatistics.ask?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`EPS Trailing Twelve Months: ${data.keyStatistics.epsTrailingTwelveMonths?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Bid: ${data.keyStatistics.bid?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Triggerable: ${data.keyStatistics.triggerable || 'NA'}`, { align: 'left' });
//     doc.text(`Price to Book: ${data.keyStatistics.priceToBook?.raw || 'NA'}`, { align: 'left' });
//     doc.text(`Long Name: ${data.keyStatistics.longName || 'NA'}`, { align: 'left' });

    //Key Statistics 



//     // Add more data as needed

//     // Finalize the PDF file
//     doc.end();
// }







//     const csvStringifier = createObjectCsvStringifier({
//         header: [
//             //PRICE: 
//             { id: 'data.price.symbol', title: 'Symbol' },
//             { id: 'data.price.twoHundredDayAverageChangePercent.raw', title: '200 Day Average Change Percent' },
//             { id: 'data.price.fiftyTwoWeekLowChangePercent.raw', title: '52 Week Low Change Percent' },
            // { id: 'data.price.earningsTimestampEnd.raw', title: 'Earnings Timestamp End' },
            // { id: 'data.price.regularMarketDayRange.raw', title: 'Regular Market Day Range' },
            // { id: 'data.price.epsForward.raw', title: 'EPS Forward' },
            // { id: 'data.price.regularMarketDayHigh.raw', title: 'Regular Market Day High' },
            // { id: 'data.price.twoHundredDayAverageChange.raw', title: '200 Day Average Change' },
            // { id: 'data.price.askSize.raw', title: 'Ask Size' },
            // { id: 'data.price.twoHundredDayAverage.raw', title: '200 Day Average' },
            // { id: 'data.price.bookValue.raw', title: 'Book Value' },
            // { id: 'data.price.marketCap.raw', title: 'Market Cap' },
            // { id: 'data.price.fiftyTwoWeekHighChange.raw', title: '52 Week High Change' },
            // { id: 'data.price.fiftyTwoWeekRange.raw', title: '52 Week Range' },
            // { id: 'data.price.fiftyDayAverageChange.raw', title: '50 Day Average Change' },
            // { id: 'data.price.averageDailyVolume3Month.raw', title: 'Average Daily Volume 3 Month' },
            // { id: 'data.price.firstTradeDateMilliseconds', title: 'First Trade Date Milliseconds' },
            // { id: 'data.price.exchangeDataDelayedBy', title: 'Exchange Data Delayed By' },
            // { id: 'data.price.fiftyTwoWeekChangePercent.raw', title: '52 Week Change Percent' },
            // { id: 'data.price.trailingAnnualDividendRate.raw', title: 'Trailing Annual Dividend Rate' },
            // { id: 'data.price.fiftyTwoWeekLow.raw', title: '52 Week Low' },
            // { id: 'data.price.regularMarketVolume.raw', title: 'Regular Market Volume' },
            // { id: 'data.price.market', title: 'Market' },
            // { id: 'data.price.messageBoardId', title: 'Message Board ID' },
            // { id: 'data.price.priceHint', title: 'Price Hint' },
            // { id: 'data.price.sourceInterval', title: 'Source Interval' },
            // { id: 'data.price.regularMarketDayLow.raw', title: 'Regular Market Day Low' },
            // { id: 'data.price.exchange', title: 'Exchange' },
            // { id: 'data.price.shortName', title: 'Short Name' },
            // { id: 'data.price.region', title: 'Region' },
            // { id: 'data.price.fiftyDayAverageChangePercent.raw', title: '50 Day Average Change Percent' },
            // { id: 'data.price.fullExchangeName', title: 'Full Exchange Name' },
            // { id: 'data.price.earningsTimestampStart.raw', title: 'Earnings Timestamp Start' },
            // { id: 'data.price.financialCurrency', title: 'Financial Currency' },
            // { id: 'data.price.gmtOffSetMilliseconds', title: 'GMT Offset Milliseconds' },
            // { id: 'data.price.regularMarketOpen.raw', title: 'Regular Market Open' },
            // { id: 'data.price.regularMarketTime.raw', title: 'Regular Market Time' },
            // { id: 'data.price.regularMarketChangePercent.raw', title: 'Regular Market Change Percent' },
            // { id: 'data.price.trailingAnnualDividendYield.raw', title: 'Trailing Annual Dividend Yield' },
            // { id: 'data.price.quoteType', title: 'Quote Type' },
            // { id: 'data.price.averageDailyVolume10Day.raw', title: 'Average Daily Volume 10 Day' },
            // { id: 'data.price.fiftyTwoWeekLowChange.raw', title: '52 Week Low Change' },
            // { id: 'data.price.fiftyTwoWeekHighChangePercent.raw', title: '52 Week High Change Percent' },
            // { id: 'data.price.typeDisp', title: 'Type Display' },
            // { id: 'data.price.tradeable', title: 'Tradeable' },
            // { id: 'data.price.currency', title: 'Currency' },


            // { id: 'data.price.sharesOutstanding.raw', title: 'Shares Outstanding' },
            // { id: 'data.price.regularMarketPreviousClose.raw', title: 'Regular Market Previous Close' },
            // { id: 'data.price.fiftyTwoWeekHigh.raw', title: '52 Week High' },
            // { id: 'data.price.exchangeTimezoneName', title: 'Exchange Timezone Name' },
            // { id: 'data.price.bidSize.raw', title: 'Bid Size' },
            // { id: 'data.price.regularMarketChange.raw', title: 'Regular Market Change' },
            // { id: 'data.price.cryptoTradeable', title: 'Crypto Tradeable' },
            // { id: 'data.price.fiftyDayAverage.raw', title: '50 Day Average' },
            // { id: 'data.price.exchangeTimezoneShortName', title: 'Exchange Timezone Short Name' },
            // { id: 'data.price.regularMarketPrice.raw', title: 'Regular Market Price' },
            // { id: 'data.price.customPriceAlertConfidence', title: 'Custom Price Alert Confidence' },
            // { id: 'data.price.marketState', title: 'Market State' },
            // { id: 'data.price.forwardPE.raw', title: 'Forward PE' },
            // { id: 'data.price.ask.raw', title: 'Ask' },
            // { id: 'data.price.epsTrailingTwelveMonths.raw', title: 'EPS Trailing Twelve Months' },
            // { id: 'data.price.bid.raw', title: 'Bid' },
            // { id: 'data.price.triggerable', title: 'Triggerable' },
            // { id: 'data.price.priceToBook.raw', title: 'Price to Book' },
            // { id: 'data.price.longName', title: 'Long Name' },
            
//             //HISTORIC (Only including Meta for now, may need to run a function to make the AI useful for historic info)
            // { id: 'data.historic.meta.currency', title: 'Historic Currency' },
            // { id: 'data.historic.meta.symbol', title: 'Historic Symbol' },
            // { id: 'data.historic.meta.exchangeName', title: 'Historic Exchange Name' },
            // { id: 'data.historic.meta.instrumentType', title: 'Historic Instrument Type' },
            // { id: 'data.historic.meta.firstTradeDate', title: 'Historic First Trade Date' },
            // { id: 'data.historic.meta.regularMarketTime', title: 'Historic Regular Market Time' },
            // { id: 'data.historic.meta.gmtoffset', title: 'Historic GMT Offset' },
            // { id: 'data.historic.meta.timezone', title: 'Historic Timezone' },
            // { id: 'data.historic.meta.exchangeTimezoneName', title: 'Historic Exchange Timezone Name' },
            // { id: 'data.historic.meta.regularMarketPrice', title: 'Historic Regular Market Price' },
            // { id: 'data.historic.meta.chartPreviousClose', title: 'Historic Chart Previous Close' },
            // { id: 'data.historic.meta.priceHint', title: 'Historic Price Hint' },
        
//             //Balance Sheet, Earnings, Financial Analytics
            // { id: 'data.balanceSheet.maxAge', title: 'Balance Sheet Max Age' },
            // { id: 'data.balanceSheet.endDate.raw', title: 'Balance Sheet End Date' },
            // { id: 'data.earnings.maxAge', title: 'Earnings Max Age' },
            // { id: 'data.earnings.earningsChart.quarterly', title: 'Earnings Chart Quarterly' }, // Note: This is an array and might need special handling
            // { id: 'data.earnings.earningsChart.earningsDate', title: 'Earnings Chart Earnings Date' }, // Note: This is an array and might need special handling
            // { id: 'data.earnings.financialsChart.yearly', title: 'Financials Chart Yearly' }, // Note: This is an array and might need special handling
            // { id: 'data.earnings.financialsChart.quarterly', title: 'Financials Chart Quarterly' }, // Note: This is an array and might need special handling
            // { id: 'data.earnings.financialCurrency', title: 'Earnings Financial Currency' },
            // { id: 'data.financeAnalytics.maxAge', title: 'Finance Analytics Max Age' },
            // { id: 'data.financeAnalytics.currentPrice.raw', title: 'Current Price' },
            // { id: 'data.financeAnalytics.totalCash.raw', title: 'Total Cash' },
            // { id: 'data.financeAnalytics.totalCashPerShare.raw', title: 'Total Cash Per Share' },
            // { id: 'data.financeAnalytics.ebitda.raw', title: 'EBITDA' },
            // { id: 'data.financeAnalytics.totalDebt.raw', title: 'Total Debt' },
            // { id: 'data.financeAnalytics.quickRatio.raw', title: 'Quick Ratio' },
            // { id: 'data.financeAnalytics.currentRatio.raw', title: 'Current Ratio' },
            // { id: 'data.financeAnalytics.totalRevenue.raw', title: 'Total Revenue' },
            // { id: 'data.financeAnalytics.debtToEquity.raw', title: 'Debt to Equity' },
            // { id: 'data.financeAnalytics.revenuePerShare.raw', title: 'Revenue Per Share' },
            // { id: 'data.financeAnalytics.returnOnAssets.raw', title: 'Return on Assets' },
            // { id: 'data.financeAnalytics.returnOnEquity.raw', title: 'Return on Equity' },
            // { id: 'data.financeAnalytics.freeCashflow.raw', title: 'Free Cashflow' },
            // { id: 'data.financeAnalytics.operatingCashflow.raw', title: 'Operating Cashflow' },
            // { id: 'data.financeAnalytics.revenueGrowth.raw', title: 'Revenue Growth' },
            // { id: 'data.financeAnalytics.grossMargins.raw', title: 'Gross Margins' },
            // { id: 'data.financeAnalytics.ebitdaMargins.raw', title: 'EBITDA Margins' },
            // { id: 'data.financeAnalytics.operatingMargins.raw', title: 'Operating Margins' },
            // { id: 'data.financeAnalytics.profitMargins.raw', title: 'Profit Margins' },
            // { id: 'data.financeAnalytics.financialCurrency', title: 'Finance Analytics Financial Currency' },

//              //News
//              { id: 'data.news.0.uuid', title: 'News 1 UUID' },
//              { id: 'data.news.0.title', title: 'News 1 Title' },
//              { id: 'data.news.0.publisher', title: 'News 1 Publisher' },
//              { id: 'data.news.0.link', title: 'News 1 Link' },
//              { id: 'data.news.0.providerPublishTime', title: 'News 1 Provider Publish Time' },
//              { id: 'data.news.0.type', title: 'News 1 Type' },
         
//              { id: 'data.news.1.uuid', title: 'News 2 UUID' },
//              { id: 'data.news.1.title', title: 'News 2 Title' },
//              { id: 'data.news.1.publisher', title: 'News 2 Publisher' },
//              { id: 'data.news.1.link', title: 'News 2 Link' },
//              { id: 'data.news.1.providerPublishTime', title: 'News 2 Provider Publish Time' },
//              { id: 'data.news.1.type', title: 'News 2 Type' },

//              { id: 'data.news.2.uuid', title: 'News 3 UUID' },
//              { id: 'data.news.2.title', title: 'News 3 Title' },
//              { id: 'data.news.2.publisher', title: 'News 3 Publisher' },
//              { id: 'data.news.2.link', title: 'News 3 Link' },
//              { id: 'data.news.2.providerPublishTime', title: 'News 3 Provider Publish Time' },
//              { id: 'data.news.2.type', title: 'News 3 Type' },

//              { id: 'data.news.3.uuid', title: 'News 4 UUID' },
//              { id: 'data.news.3.title', title: 'News 4 Title' },
//              { id: 'data.news.3.publisher', title: 'News 4 Publisher' },
//              { id: 'data.news.3.link', title: 'News 4 Link' },
//              { id: 'data.news.3.providerPublishTime', title: 'News 4 Provider Publish Time' },
//              { id: 'data.news.3.type', title: 'News 4 Type' },

//              { id: 'data.news.4.uuid', title: 'News 5 UUID' },
//              { id: 'data.news.4.title', title: 'News 5 Title' },
//              { id: 'data.news.4.publisher', title: 'News 5 Publisher' },
//              { id: 'data.news.4.link', title: 'News 5 Link' },
//              { id: 'data.news.4.providerPublishTime', title: 'News 5 Provider Publish Time' },
//              { id: 'data.news.4.type', title: 'News 5 Type' },

//              { id: 'data.news.5.uuid', title: 'News 6 UUID' },
//              { id: 'data.news.5.title', title: 'News 6 Title' },
//              { id: 'data.news.5.publisher', title: 'News 6 Publisher' },
//              { id: 'data.news.5.link', title: 'News 6 Link' },
//              { id: 'data.news.5.providerPublishTime', title: 'News 6 Provider Publish Time' },
//              { id: 'data.news.5.type', title: 'News 6 Type' },

//              { id: 'data.news.6.uuid', title: 'News 7 UUID' },
//              { id: 'data.news.6.title', title: 'News 7 Title' },
//              { id: 'data.news.6.publisher', title: 'News 7 Publisher' },
//              { id: 'data.news.6.link', title: 'News 7 Link' },
//              { id: 'data.news.6.providerPublishTime', title: 'News 7 Provider Publish Time' },
//              { id: 'data.news.6.type', title: 'News 7 Type' },

//             //Earnings Trends
//             { id: 'data.earningsTrend.maxAge', title: 'Earnings Trend Max Age' },
//             { id: 'data.earningsTrend.period', title: 'Earnings Trend Period' },
//             { id: 'data.earningsTrend.endDate', title: 'Earnings Trend End Date' },

//             // Earnings Estimate
//             { id: 'data.earningsTrend.earningsEstimate.avg', title: 'Earnings Estimate Average' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.earningsEstimate.low', title: 'Earnings Estimate Low' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.earningsEstimate.high', title: 'Earnings Estimate High' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.earningsEstimate.numberOfAnalysts', title: 'Earnings Estimate Number Of Analysts' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.earningsEstimate.growth', title: 'Earnings Estimate Growth' }, // This is an object, needs specific handling
            
//             // Revenue Estimate
//             { id: 'data.earningsTrend.revenueEstimate.avg', title: 'Revenue Estimate Average' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.revenueEstimate.low', title: 'Revenue Estimate Low' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.revenueEstimate.high', title: 'Revenue Estimate High' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.revenueEstimate.numberOfAnalysts', title: 'Revenue Estimate Number Of Analysts' }, // This is an object, needs specific handling
            
//             // EPS Trend
//             { id: 'data.earningsTrend.epsTrend.current', title: 'EPS Trend Current' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsTrend.7daysAgo', title: 'EPS Trend 7 Days Ago' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsTrend.30daysAgo', title: 'EPS Trend 30 Days Ago' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsTrend.60daysAgo', title: 'EPS Trend 60 Days Ago' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsTrend.90daysAgo', title: 'EPS Trend 90 Days Ago' }, // This is an object, needs specific handling
            
//             // EPS Revisions
//             { id: 'data.earningsTrend.epsRevisions.upLast7days', title: 'EPS Revisions Up Last 7 Days' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsRevisions.upLast30days', title: 'EPS Revisions Up Last 30 Days' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsRevisions.downLast30days', title: 'EPS Revisions Down Last 30 Days' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsRevisions.downLast90days', title: 'EPS Revisions Down Last 90 Days' }, // This is an object, needs specific handling
         
//             //Key Statistics
//             { id: 'data.keyStatistics.symbol', title: 'Symbol' },
//             { id: 'data.keyStatistics.twoHundredDayAverageChangePercent.raw', title: '200 Day Average Change Percent' },
//             { id: 'data.keyStatistics.fiftyTwoWeekLowChangePercent.raw', title: '52 Week Low Change Percent' },
//             { id: 'data.keyStatistics.language', title: 'Language' },
//             { id: 'data.keyStatistics.regularMarketDayRange.raw', title: 'Regular Market Day Range' },
//             { id: 'data.keyStatistics.earningsTimestampEnd.raw', title: 'Earnings Timestamp End' },
//             { id: 'data.keyStatistics.epsForward.raw', title: 'EPS Forward' },
//             { id: 'data.keyStatistics.regularMarketDayHigh.raw', title: 'Regular Market Day High' },
//             { id: 'data.keyStatistics.twoHundredDayAverageChange.raw', title: '200 Day Average Change' },
//             { id: 'data.keyStatistics.twoHundredDayAverage.raw', title: '200 Day Average' },
//             { id: 'data.keyStatistics.askSize.raw', title: 'Ask Size' },
//             { id: 'data.keyStatistics.bookValue.raw', title: 'Book Value' },
//             { id: 'data.keyStatistics.marketCap.raw', title: 'Market Cap' },
//             { id: 'data.keyStatistics.fiftyTwoWeekHighChange.raw', title: '52 Week High Change' },
//             { id: 'data.keyStatistics.fiftyTwoWeekRange.raw', title: '52 Week Range' },
//             { id: 'data.keyStatistics.fiftyDayAverageChange.raw', title: '50 Day Average Change' },
//             { id: 'data.keyStatistics.exchangeDataDelayedBy', title: 'Exchange Data Delayed By' },
//             { id: 'data.keyStatistics.firstTradeDateMilliseconds', title: 'First Trade Date Milliseconds' },
//             { id: 'data.keyStatistics.averageDailyVolume3Month.raw', title: 'Average Daily Volume 3 Month' },
//             { id: 'data.keyStatistics.trailingAnnualDividendRate.raw', title: 'Trailing Annual Dividend Rate' },
//             { id: 'data.keyStatistics.fiftyTwoWeekChangePercent.raw', title: '52 Week Change Percent' },
//             { id: 'data.keyStatistics.fiftyTwoWeekLow.raw', title: '52 Week Low' },
//             { id: 'data.keyStatistics.regularMarketVolume.raw', title: 'Regular Market Volume' },
//             { id: 'data.keyStatistics.market', title: 'Market' },
//             { id: 'data.keyStatistics.quoteSourceName', title: 'Quote Source Name' },
//             { id: 'data.keyStatistics.messageBoardId', title: 'Message Board ID' },
//             { id: 'data.keyStatistics.priceHint', title: 'Price Hint' },
//             { id: 'data.keyStatistics.exchange', title: 'Exchange' },
//             { id: 'data.keyStatistics.sourceInterval', title: 'Source Interval' },
//             { id: 'data.keyStatistics.regularMarketDayLow.raw', title: 'Regular Market Day Low' },
//             { id: 'data.keyStatistics.region', title: 'Region' },
//             { id: 'data.keyStatistics.shortName', title: 'Short Name' },
//             { id: 'data.keyStatistics.fiftyDayAverageChangePercent.raw', title: '50 Day Average Change Percent' },
//             { id: 'data.keyStatistics.fullExchangeName', title: 'Full Exchange Name' },
//             { id: 'data.keyStatistics.earningsTimestampStart.raw', title: 'Earnings Timestamp Start' },
//             { id: 'data.keyStatistics.financialCurrency', title: 'Financial Currency' },
//             { id: 'data.keyStatistics.gmtOffSetMilliseconds', title: 'GMT Offset Milliseconds' },
//             { id: 'data.keyStatistics.regularMarketOpen.raw', title: 'Regular Market Open' },
//             { id: 'data.keyStatistics.regularMarketTime.raw', title: 'Regular Market Time' },
//             { id: 'data.keyStatistics.regularMarketChangePercent.raw', title: 'Regular Market Change Percent' },
//             { id: 'data.keyStatistics.trailingAnnualDividendYield.raw', title: 'Trailing Annual Dividend Yield' },
//             { id: 'data.keyStatistics.quoteType', title: 'Quote Type' },
//             { id: 'data.keyStatistics.averageDailyVolume10Day.raw', title: 'Average Daily Volume 10 Day' },
//             { id: 'data.keyStatistics.fiftyTwoWeekLowChange.raw', title: '52 Week Low Change' },
//             { id: 'data.keyStatistics.fiftyTwoWeekHighChangePercent.raw', title: '52 Week High Change Percent' },
//             { id: 'data.keyStatistics.typeDisp', title: 'Type Display' },
//             { id: 'data.keyStatistics.tradeable', title: 'Tradeable' },
//             { id: 'data.keyStatistics.currency', title: 'Currency' },
//             { id: 'data.keyStatistics.sharesOutstanding.raw', title: 'Shares Outstanding' },
//             { id: 'data.keyStatistics.fiftyTwoWeekHigh.raw', title: '52 Week High' },
//             { id: 'data.keyStatistics.regularMarketPreviousClose.raw', title: 'Regular Market Previous Close' },
//             { id: 'data.keyStatistics.exchangeTimezoneName', title: 'Exchange Timezone Name' },
//             { id: 'data.keyStatistics.bidSize.raw', title: 'Bid Size' },
//             { id: 'data.keyStatistics.regularMarketChange.raw', title: 'Regular Market Change' },
//             { id: 'data.keyStatistics.cryptoTradeable', title: 'Crypto Tradeable' },
//             { id: 'data.keyStatistics.fiftyDayAverage.raw', title: '50 Day Average' },
//             { id: 'data.keyStatistics.exchangeTimezoneShortName', title: 'Exchange Timezone Short Name' },
//             { id: 'data.keyStatistics.customPriceAlertConfidence', title: 'Custom Price Alert Confidence' },
//             { id: 'data.keyStatistics.regularMarketPrice.raw', title: 'Regular Market Price' },
//             { id: 'data.keyStatistics.marketState', title: 'Market State' },
//             { id: 'data.keyStatistics.forwardPE.raw', title: 'Forward PE' },
//             { id: 'data.keyStatistics.ask.raw', title: 'Ask' },
//             { id: 'data.keyStatistics.epsTrailingTwelveMonths.raw', title: 'EPS Trailing Twelve Months' },
//             { id: 'data.keyStatistics.bid.raw', title: 'Bid' },
//             { id: 'data.keyStatistics.triggerable', title: 'Triggerable' },
//             { id: 'data.keyStatistics.priceToBook.raw', title: 'Price to Book' },
//             { id: 'data.keyStatistics.longName', title: 'Long Name' },

//         ]
//     });

//         // Preparing the data object to match the CSV structure
//     // Prepare your data object to match the CSV structure
//     const csvRowData = {
//         //Price Data
//         'data.price.symbol': data.price?.symbol || 'NA',
//         'data.price.twoHundredDayAverageChangePercent.raw': data.price.twoHundredDayAverageChangePercent?.raw || 'NA',
//         'data.price.fiftyTwoWeekLowChangePercent.raw': data.price.fiftyTwoWeekLowChangePercent?.raw || 'NA',
//         'data.price.earningsTimestampEnd.raw': data.price.earningsTimestampEnd?.raw || 'NA',
//         'data.price.regularMarketDayRange.raw': data.price.regularMarketDayRange?.raw || 'NA',
//         'data.price.epsForward.raw': data.price.epsForward?.raw || 'NA',
//         'data.price.regularMarketDayHigh.raw': data.price.regularMarketDayHigh?.raw || 'NA',
//         'data.price.twoHundredDayAverageChange.raw': data.price.twoHundredDayAverageChange?.raw || 'NA',
//         'data.price.askSize.raw': data.price.askSize?.raw || 'NA',
//         'data.price.twoHundredDayAverage.raw': data.price.twoHundredDayAverage?.raw || 'NA',
//         'data.price.bookValue.raw': data.price.bookValue?.raw || 'NA',
//         'data.price.marketCap.raw': data.price.marketCap?.raw || 'NA',
//         'data.price.fiftyTwoWeekHighChange.raw': data.price.fiftyTwoWeekHighChange?.raw || 'NA',
//         'data.price.fiftyTwoWeekRange.raw': data.price.fiftyTwoWeekRange?.raw || 'NA',
//         'data.price.fiftyDayAverageChange.raw': data.price.fiftyDayAverageChange?.raw || 'NA',
//         'data.price.averageDailyVolume3Month.raw': data.price.averageDailyVolume3Month?.raw || 'NA',
//         'data.price.firstTradeDateMilliseconds': data.price.firstTradeDateMilliseconds || 'NA',
//         'data.price.exchangeDataDelayedBy': data.price.exchangeDataDelayedBy || 'NA',
//         'data.price.fiftyTwoWeekChangePercent.raw': data.price.fiftyTwoWeekChangePercent?.raw || 'NA',
//         'data.price.trailingAnnualDividendRate.raw': data.price.trailingAnnualDividendRate?.raw || 'NA',
//         'data.price.fiftyTwoWeekLow.raw': data.price.fiftyTwoWeekLow?.raw || 'NA',
//         'data.price.regularMarketVolume.raw': data.price.regularMarketVolume?.raw || 'NA',
//         'data.price.market': data.price.market || 'NA',
//         'data.price.messageBoardId': data.price.messageBoardId || 'NA',
//         'data.price.priceHint': data.price.priceHint || 'NA',
//         'data.price.sourceInterval': data.price.sourceInterval || 'NA',
//         'data.price.regularMarketDayLow.raw': data.price.regularMarketDayLow?.raw || 'NA',
//         'data.price.exchange': data.price.exchange || 'NA',
//         'data.price.shortName': data.price.shortName || 'NA',
//         'data.price.region': data.price.region || 'NA',
//         'data.price.fiftyDayAverageChangePercent.raw': data.price.fiftyDayAverageChangePercent?.raw || 'NA',
//         'data.price.fullExchangeName': data.price.fullExchangeName || 'NA',
//         'data.price.earningsTimestampStart.raw': data.price.earningsTimestampStart?.raw || 'NA',
//         'data.price.financialCurrency': data.price.financialCurrency || 'NA',
//         'data.price.gmtOffSetMilliseconds': data.price.gmtOffSetMilliseconds || 'NA',
//         'data.price.regularMarketOpen.raw': data.price.regularMarketOpen?.raw || 'NA',
//         'data.price.regularMarketTime.raw': data.price.regularMarketTime?.raw || 'NA',
//         'data.price.regularMarketChangePercent.raw': data.price.regularMarketChangePercent?.raw || 'NA',
//         'data.price.trailingAnnualDividendYield.raw': data.price.trailingAnnualDividendYield?.raw || 'NA',
//         'data.price.quoteType': data.price.quoteType || 'NA',
//         'data.price.averageDailyVolume10Day.raw': data.price.averageDailyVolume10Day?.raw || 'NA',
//         'data.price.fiftyTwoWeekLowChange.raw': data.price.fiftyTwoWeekLowChange?.raw || 'NA',
//         'data.price.fiftyTwoWeekHighChangePercent.raw': data.price.fiftyTwoWeekHighChangePercent?.raw || 'NA',
//         'data.price.typeDisp': data.price.typeDisp || 'NA',
//         'data.price.tradeable': data.price.tradeable || 'NA',
//         'data.price.currency': data.price.currency || 'NA',
//         'data.price.sharesOutstanding.raw': data.price.sharesOutstanding?.raw || 'NA',
//         'data.price.regularMarketPreviousClose.raw': data.price.regularMarketPreviousClose?.raw || 'NA',
//         'data.price.fiftyTwoWeekHigh.raw': data.price.fiftyTwoWeekHigh?.raw || 'NA',
//         'data.price.exchangeTimezoneName': data.price.exchangeTimezoneName || 'NA',
//         'data.price.bidSize.raw': data.price.bidSize?.raw || 'NA',
//         'data.price.regularMarketChange.raw': data.price.regularMarketChange?.raw || 'NA',
//         'data.price.cryptoTradeable': data.price.cryptoTradeable || 'NA',
//         'data.price.fiftyDayAverage.raw': data.price.fiftyDayAverage?.raw || 'NA',
//         'data.price.exchangeTimezoneShortName': data.price.exchangeTimezoneShortName || 'NA',
//         'data.price.regularMarketPrice.raw': data.price.regularMarketPrice?.raw || 'NA',
//         'data.price.customPriceAlertConfidence': data.price.customPriceAlertConfidence || 'NA',
//         'data.price.marketState': data.price.marketState || 'NA',
//         'data.price.forwardPE.raw': data.price.forwardPE?.raw || 'NA',
//         'data.price.ask.raw': data.price.ask?.raw || 'NA',
//         'data.price.epsTrailingTwelveMonths.raw': data.price.epsTrailingTwelveMonths?.raw || 'NA',
//         'data.price.bid.raw': data.price.bid?.raw || 'NA',
//         'data.price.triggerable': data.price.triggerable || 'NA',
//         'data.price.priceToBook.raw': data.price.priceToBook?.raw || 'NA',
//         'data.price.longName': data.price.longName || 'NA',

//         // Historic Data
//         'data.historic.meta.currency': data.historic?.meta?.currency || 'NA',
//         'data.historic.meta.symbol': data.historic?.meta?.symbol || 'NA',
//         'data.historic.meta.exchangeName': data.historic?.meta?.exchangeName || 'NA',
//         'data.historic.meta.instrumentType': data.historic?.meta?.instrumentType || 'NA',
//         'data.historic.meta.firstTradeDate': data.historic?.meta?.firstTradeDate || 'NA',
//         'data.historic.meta.regularMarketTime': data.historic?.meta?.regularMarketTime || 'NA',
//         'data.historic.meta.gmtoffset': data.historic?.meta?.gmtoffset || 'NA',
//         'data.historic.meta.timezone': data.historic?.meta?.timezone || 'NA',
//         'data.historic.meta.exchangeTimezoneName': data.historic?.meta?.exchangeTimezoneName || 'NA',
//         'data.historic.meta.regularMarketPrice': data.historic?.meta?.regularMarketPrice || 'NA',
//         'data.historic.meta.chartPreviousClose': data.historic?.meta?.chartPreviousClose || 'NA',
//         'data.historic.meta.priceHint': data.historic?.meta?.priceHint || 'NA',
    
//         // Balance Sheet, Earnings, Financial Analytics
//         'data.balanceSheet.maxAge': data.balanceSheet?.maxAge || 'NA',
//         'data.balanceSheet.endDate.raw': data.balanceSheet?.endDate?.raw || 'NA',
//         'data.earnings.maxAge': data.earnings?.maxAge || 'NA',
//         // Note: Handle arrays as needed
//         'data.earnings.earningsChart.quarterly': JSON.stringify(data.earnings?.earningsChart?.quarterly || []),
//         'data.earnings.earningsChart.earningsDate': JSON.stringify(data.earnings?.earningsChart?.earningsDate || []),
//         'data.earnings.financialsChart.yearly': JSON.stringify(data.earnings?.financialsChart?.yearly || []),
//         'data.earnings.financialsChart.quarterly': JSON.stringify(data.earnings?.financialsChart?.quarterly || []),
//         'data.earnings.financialCurrency': data.earnings?.financialCurrency || 'NA',
//         'data.financeAnalytics.maxAge': data.financeAnalytics?.maxAge || 'NA',
//         'data.financeAnalytics.currentPrice.raw': data.financeAnalytics?.currentPrice?.raw || 'NA',
//         'data.financeAnalytics.totalCash.raw': data.financeAnalytics?.totalCash?.raw || 'NA',
//         'data.financeAnalytics.totalCashPerShare.raw': data.financeAnalytics?.totalCashPerShare?.raw || 'NA',
//         'data.financeAnalytics.ebitda.raw': data.financeAnalytics?.ebitda?.raw || 'NA',
//         'data.financeAnalytics.totalDebt.raw': data.financeAnalytics?.totalDebt?.raw || 'NA',
//         'data.financeAnalytics.quickRatio.raw': data.financeAnalytics?.quickRatio?.raw || 'NA',
//         'data.financeAnalytics.currentRatio.raw': data.financeAnalytics?.currentRatio?.raw || 'NA',
//         'data.financeAnalytics.totalRevenue.raw': data.financeAnalytics?.totalRevenue?.raw || 'NA',
//         'data.financeAnalytics.debtToEquity.raw': data.financeAnalytics?.debtToEquity?.raw || 'NA',
//         'data.financeAnalytics.revenuePerShare.raw': data.financeAnalytics?.revenuePerShare?.raw || 'NA',
//         'data.financeAnalytics.returnOnAssets.raw': data.financeAnalytics?.returnOnAssets?.raw || 'NA',
//         'data.financeAnalytics.returnOnEquity.raw': data.financeAnalytics?.returnOnEquity?.raw || 'NA',
//         'data.financeAnalytics.freeCashflow.raw': data.financeAnalytics?.freeCashflow?.raw || 'NA',
//         'data.financeAnalytics.operatingCashflow.raw': data.financeAnalytics?.operatingCashflow?.raw || 'NA',
//         'data.financeAnalytics.revenueGrowth.raw': data.financeAnalytics?.revenueGrowth?.raw || 'NA',
//         'data.financeAnalytics.grossMargins.raw': data.financeAnalytics?.grossMargins?.raw || 'NA',
//         'data.financeAnalytics.ebitdaMargins.raw': data.financeAnalytics?.ebitdaMargins?.raw || 'NA',
//         'data.financeAnalytics.operatingMargins.raw': data.financeAnalytics?.operatingMargins?.raw || 'NA',
//         'data.financeAnalytics.profitMargins.raw': data.financeAnalytics?.profitMargins?.raw || 'NA',
//         'data.financeAnalytics.financialCurrency': data.financeAnalytics?.financialCurrency || 'NA',
    
//         // News Data
//         'data.news.0.uuid': data.news?.[0]?.uuid || 'NA',
//         'data.news.0.title': data.news?.[0]?.title || 'NA',
//         'data.news.0.publisher': data.news?.[0]?.publisher || 'NA',
//         'data.news.0.link': data.news?.[0]?.link || 'NA',
//         'data.news.0.providerPublishTime': data.news?.[0]?.providerPublishTime || 'NA',
//         'data.news.0.type': data.news?.[0]?.type || 'NA',

//         'data.news.1.uuid': data.news?.[1]?.uuid || 'NA',
//         'data.news.1.title': data.news?.[1]?.title || 'NA',
//         'data.news.1.publisher': data.news?.[1]?.publisher || 'NA',
//         'data.news.1.link': data.news?.[1]?.link,
//         'data.news.1.providerPublishTime': data.news?.[1]?.providerPublishTime || 'NA',
//         'data.news.1.type': data.news?.[1]?.type || 'NA',

//         'data.news.2.uuid': data.news?.[2]?.uuid || 'NA',
//         'data.news.2.title': data.news?.[2]?.title || 'NA',
//         'data.news.2.publisher': data.news?.[2]?.publisher || 'NA',
//         'data.news.2.link': data.news?.[2]?.link || 'NA',
//         'data.news.2.providerPublishTime': data.news?.[2]?.providerPublishTime || 'NA',
//         'data.news.2.type': data.news?.[2]?.type || 'NA',

//         'data.news.3.uuid': data.news?.[3]?.uuid || 'NA',
//         'data.news.3.title': data.news?.[3]?.title || 'NA',
//         'data.news.3.publisher': data.news?.[3]?.publisher || 'NA',
//         'data.news.3.link': data.news?.[3]?.link || 'NA',
//         'data.news.3.providerPublishTime': data.news?.[3]?.providerPublishTime || 'NA',
//         'data.news.3.type': data.news?.[3]?.type || 'NA',

//         'data.news.4.uuid': data.news?.[4]?.uuid || 'NA',
//         'data.news.4.title': data.news?.[4]?.title || 'NA',
//         'data.news.4.publisher': data.news?.[4]?.publisher || 'NA',
//         'data.news.4.link': data.news?.[4]?.link || 'NA',
//         'data.news.4.providerPublishTime': data.news?.[4]?.providerPublishTime || 'NA',
//         'data.news.4.type': data.news?.[4]?.type || 'NA',

//         'data.news.5.uuid': data.news?.[5]?.uuid || 'NA',
//         'data.news.5.title': data.news?.[5]?.title || 'NA',
//         'data.news.5.publisher': data.news?.[5]?.publisher || 'NA',
//         'data.news.5.link': data.news?.[5]?.link || 'NA',
//         'data.news.5.providerPublishTime': data.news?.[5]?.providerPublishTime || 'NA',
//         'data.news.5.type': data.news?.[5]?.type || 'NA',

//         'data.news.6.uuid': data.news?.[6]?.uuid || 'NA',
//         'data.news.6.title': data.news?.[6]?.title || 'NA',
//         'data.news.6.publisher': data.news?.[6]?.publisher || 'NA',
//         'data.news.6.link': data.news?.[6]?.link || 'NA',
//         'data.news.6.providerPublishTime': data.news?.[6]?.providerPublishTime || 'NA',
//         'data.news.6.type': data.news?.[6]?.type || 'NA',

//         // Earnings Trends Data
//         'data.earningsTrend.maxAge': data.earningsTrend?.maxAge || 'NA',
//         'data.earningsTrend.period': data.earningsTrend?.period || 'NA',
//         'data.earningsTrend.endDate': data.earningsTrend?.endDate || 'NA',

//         // Earnings Estimate
//         'data.earningsTrend.earningsEstimate.avg': data.earningsTrend?.earningsEstimate?.avg || 'NA',
//         'data.earningsTrend.earningsEstimate.low': data.earningsTrend?.earningsEstimate?.low || 'NA',
//         'data.earningsTrend.earningsEstimate.high': data.earningsTrend?.earningsEstimate?.high || 'NA',
//         'data.earningsTrend.earningsEstimate.numberOfAnalysts': data.earningsTrend?.earningsEstimate?.numberOfAnalysts || 'NA',
//         'data.earningsTrend.earningsEstimate.growth': data.earningsTrend?.earningsEstimate?.growth || 'NA',
        
//         // Revenue Estimate
//         'data.earningsTrend.revenueEstimate.avg': data.earningsTrend?.revenueEstimate?.avg || 'NA',
//         'data.earningsTrend.revenueEstimate.low': data.earningsTrend?.revenueEstimate?.low || 'NA',
//         'data.earningsTrend.revenueEstimate.high': data.earningsTrend?.revenueEstimate?.high || 'NA',
//         'data.earningsTrend.revenueEstimate.numberOfAnalysts': data.earningsTrend?.revenueEstimate?.numberOfAnalysts || 'NA',
        
//         // EPS Trend
//         'data.earningsTrend.epsTrend.current': data.earningsTrend?.epsTrend?.current || 'NA',
//         'data.earningsTrend.epsTrend.7daysAgo': data.earningsTrend?.epsTrend?.['7daysAgo'] || 'NA',
//         'data.earningsTrend.epsTrend.30daysAgo': data.earningsTrend?.epsTrend?.['30daysAgo'] || 'NA',
//         'data.earningsTrend.epsTrend.60daysAgo': data.earningsTrend?.epsTrend?.['60daysAgo'] || 'NA',
//         'data.earningsTrend.epsTrend.90daysAgo': data.earningsTrend?.epsTrend?.['90daysAgo'] || 'NA',
        
//         // EPS Revisions
//         'data.earningsTrend.epsRevisions.upLast7days': data.earningsTrend?.epsRevisions?.upLast7days || 'NA',
//         'data.earningsTrend.epsRevisions.upLast30days': data.earningsTrend?.epsRevisions?.upLast30days || 'NA',
//         'data.earningsTrend.epsRevisions.downLast30days': data.earningsTrend?.epsRevisions?.downLast30days || 'NA',
//         'data.earningsTrend.epsRevisions.downLast90days': data.earningsTrend?.epsRevisions?.downLast90days || 'NA',

//         };


//     // Create CSV data
//     const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords([csvRowData]);

//     const stockSymbol = data.price.symbol || 'default';
//     // const params = {
//     //     Bucket: 'kalicapitaltest',
//     //     Key: `pdf/${stockSymbol}.csv`,
//     //     Body: csvData,
//     //     ContentType: 'text/csv'
//     // };

//     const params = {
//         Bucket: 'kalicapitaltest',
//         Key: `${stockSymbol}.csv`,
//         Body: csvData,
//         ContentType: 'text/csv'
//     };


//     uploadPromises.push(s3.upload(params).promise());

//     try {
//         await Promise.all(uploadPromises);
//         return Response.json('Files uploaded successfully.');
//     } catch (error) {
//         console.error('Error uploading files:', error);
//         return Response.json('Error in file upload.');
//     }
// }

// import AWS from 'aws-sdk';
// import { createObjectCsvStringifier } from 'csv-writer';

// export async function POST(req) {
//     const data = await req.json();
//      // This is the data sent from the front-end
//     console.log('*********************************')
//     console.log('Uploading file to S3...FILE ROUTE HIT');
//     console.log('*********************************')


//     AWS.config.update({
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//         region: 'ap-southeast-2'        
//     });

//     const s3 = new AWS.S3();
//     const uploadPromises = [];
        
//     const csvStringifier = createObjectCsvStringifier({
//         header: [
//             //PRICE: 
//             { id: 'data.price.symbol', title: 'Symbol' },
//             { id: 'data.price.twoHundredDayAverageChangePercent.raw', title: '200 Day Average Change Percent' },
//             { id: 'data.price.fiftyTwoWeekLowChangePercent.raw', title: '52 Week Low Change Percent' },
//             { id: 'data.price.earningsTimestampEnd.raw', title: 'Earnings Timestamp End' },
//             { id: 'data.price.regularMarketDayRange.raw', title: 'Regular Market Day Range' },
//             { id: 'data.price.epsForward.raw', title: 'EPS Forward' },
//             { id: 'data.price.regularMarketDayHigh.raw', title: 'Regular Market Day High' },
//             { id: 'data.price.twoHundredDayAverageChange.raw', title: '200 Day Average Change' },
//             { id: 'data.price.askSize.raw', title: 'Ask Size' },
//             { id: 'data.price.twoHundredDayAverage.raw', title: '200 Day Average' },
//             { id: 'data.price.bookValue.raw', title: 'Book Value' },
//             { id: 'data.price.marketCap.raw', title: 'Market Cap' },
//             { id: 'data.price.fiftyTwoWeekHighChange.raw', title: '52 Week High Change' },
//             { id: 'data.price.fiftyTwoWeekRange.raw', title: '52 Week Range' },
//             { id: 'data.price.fiftyDayAverageChange.raw', title: '50 Day Average Change' },
//             { id: 'data.price.averageDailyVolume3Month.raw', title: 'Average Daily Volume 3 Month' },
//             { id: 'data.price.firstTradeDateMilliseconds', title: 'First Trade Date Milliseconds' },
//             { id: 'data.price.exchangeDataDelayedBy', title: 'Exchange Data Delayed By' },
//             { id: 'data.price.fiftyTwoWeekChangePercent.raw', title: '52 Week Change Percent' },
//             { id: 'data.price.trailingAnnualDividendRate.raw', title: 'Trailing Annual Dividend Rate' },
//             { id: 'data.price.fiftyTwoWeekLow.raw', title: '52 Week Low' },
//             { id: 'data.price.regularMarketVolume.raw', title: 'Regular Market Volume' },
//             { id: 'data.price.market', title: 'Market' },
//             { id: 'data.price.messageBoardId', title: 'Message Board ID' },
//             { id: 'data.price.priceHint', title: 'Price Hint' },
//             { id: 'data.price.sourceInterval', title: 'Source Interval' },
//             { id: 'data.price.regularMarketDayLow.raw', title: 'Regular Market Day Low' },
//             { id: 'data.price.exchange', title: 'Exchange' },
//             { id: 'data.price.shortName', title: 'Short Name' },
//             { id: 'data.price.region', title: 'Region' },
//             { id: 'data.price.fiftyDayAverageChangePercent.raw', title: '50 Day Average Change Percent' },
//             { id: 'data.price.fullExchangeName', title: 'Full Exchange Name' },
//             { id: 'data.price.earningsTimestampStart.raw', title: 'Earnings Timestamp Start' },
//             { id: 'data.price.financialCurrency', title: 'Financial Currency' },
//             { id: 'data.price.gmtOffSetMilliseconds', title: 'GMT Offset Milliseconds' },
//             { id: 'data.price.regularMarketOpen.raw', title: 'Regular Market Open' },
//             { id: 'data.price.regularMarketTime.raw', title: 'Regular Market Time' },
//             { id: 'data.price.regularMarketChangePercent.raw', title: 'Regular Market Change Percent' },
//             { id: 'data.price.trailingAnnualDividendYield.raw', title: 'Trailing Annual Dividend Yield' },
//             { id: 'data.price.quoteType', title: 'Quote Type' },
//             { id: 'data.price.averageDailyVolume10Day.raw', title: 'Average Daily Volume 10 Day' },
//             { id: 'data.price.fiftyTwoWeekLowChange.raw', title: '52 Week Low Change' },
//             { id: 'data.price.fiftyTwoWeekHighChangePercent.raw', title: '52 Week High Change Percent' },
//             { id: 'data.price.typeDisp', title: 'Type Display' },
//             { id: 'data.price.tradeable', title: 'Tradeable' },
//             { id: 'data.price.currency', title: 'Currency' },
//             { id: 'data.price.sharesOutstanding.raw', title: 'Shares Outstanding' },
//             { id: 'data.price.regularMarketPreviousClose.raw', title: 'Regular Market Previous Close' },
//             { id: 'data.price.fiftyTwoWeekHigh.raw', title: '52 Week High' },
//             { id: 'data.price.exchangeTimezoneName', title: 'Exchange Timezone Name' },
//             { id: 'data.price.bidSize.raw', title: 'Bid Size' },
//             { id: 'data.price.regularMarketChange.raw', title: 'Regular Market Change' },
//             { id: 'data.price.cryptoTradeable', title: 'Crypto Tradeable' },
//             { id: 'data.price.fiftyDayAverage.raw', title: '50 Day Average' },
//             { id: 'data.price.exchangeTimezoneShortName', title: 'Exchange Timezone Short Name' },
//             { id: 'data.price.regularMarketPrice.raw', title: 'Regular Market Price' },
//             { id: 'data.price.customPriceAlertConfidence', title: 'Custom Price Alert Confidence' },
//             { id: 'data.price.marketState', title: 'Market State' },
//             { id: 'data.price.forwardPE.raw', title: 'Forward PE' },
//             { id: 'data.price.ask.raw', title: 'Ask' },
//             { id: 'data.price.epsTrailingTwelveMonths.raw', title: 'EPS Trailing Twelve Months' },
//             { id: 'data.price.bid.raw', title: 'Bid' },
//             { id: 'data.price.triggerable', title: 'Triggerable' },
//             { id: 'data.price.priceToBook.raw', title: 'Price to Book' },
//             { id: 'data.price.longName', title: 'Long Name' },
            
//             //HISTORIC (Only including Meta for now, may need to run a function to make the AI useful for historic info)
//             { id: 'data.historic.meta.currency', title: 'Historic Currency' },
//             { id: 'data.historic.meta.symbol', title: 'Historic Symbol' },
//             { id: 'data.historic.meta.exchangeName', title: 'Historic Exchange Name' },
//             { id: 'data.historic.meta.instrumentType', title: 'Historic Instrument Type' },
//             { id: 'data.historic.meta.firstTradeDate', title: 'Historic First Trade Date' },
//             { id: 'data.historic.meta.regularMarketTime', title: 'Historic Regular Market Time' },
//             { id: 'data.historic.meta.gmtoffset', title: 'Historic GMT Offset' },
//             { id: 'data.historic.meta.timezone', title: 'Historic Timezone' },
//             { id: 'data.historic.meta.exchangeTimezoneName', title: 'Historic Exchange Timezone Name' },
//             { id: 'data.historic.meta.regularMarketPrice', title: 'Historic Regular Market Price' },
//             { id: 'data.historic.meta.chartPreviousClose', title: 'Historic Chart Previous Close' },
//             { id: 'data.historic.meta.priceHint', title: 'Historic Price Hint' },
        
//             //Balance Sheet, Earnings, Financial Analytics
//             { id: 'data.balanceSheet.maxAge', title: 'Balance Sheet Max Age' },
//             { id: 'data.balanceSheet.endDate.raw', title: 'Balance Sheet End Date' },
//             { id: 'data.earnings.maxAge', title: 'Earnings Max Age' },
//             { id: 'data.earnings.earningsChart.quarterly', title: 'Earnings Chart Quarterly' }, // Note: This is an array and might need special handling
//             { id: 'data.earnings.earningsChart.earningsDate', title: 'Earnings Chart Earnings Date' }, // Note: This is an array and might need special handling
//             { id: 'data.earnings.financialsChart.yearly', title: 'Financials Chart Yearly' }, // Note: This is an array and might need special handling
//             { id: 'data.earnings.financialsChart.quarterly', title: 'Financials Chart Quarterly' }, // Note: This is an array and might need special handling
//             { id: 'data.earnings.financialCurrency', title: 'Earnings Financial Currency' },
//             { id: 'data.financeAnalytics.maxAge', title: 'Finance Analytics Max Age' },
//             { id: 'data.financeAnalytics.currentPrice.raw', title: 'Current Price' },
//             { id: 'data.financeAnalytics.totalCash.raw', title: 'Total Cash' },
//             { id: 'data.financeAnalytics.totalCashPerShare.raw', title: 'Total Cash Per Share' },
//             { id: 'data.financeAnalytics.ebitda.raw', title: 'EBITDA' },
//             { id: 'data.financeAnalytics.totalDebt.raw', title: 'Total Debt' },
//             { id: 'data.financeAnalytics.quickRatio.raw', title: 'Quick Ratio' },
//             { id: 'data.financeAnalytics.currentRatio.raw', title: 'Current Ratio' },
//             { id: 'data.financeAnalytics.totalRevenue.raw', title: 'Total Revenue' },
//             { id: 'data.financeAnalytics.debtToEquity.raw', title: 'Debt to Equity' },
//             { id: 'data.financeAnalytics.revenuePerShare.raw', title: 'Revenue Per Share' },
//             { id: 'data.financeAnalytics.returnOnAssets.raw', title: 'Return on Assets' },
//             { id: 'data.financeAnalytics.returnOnEquity.raw', title: 'Return on Equity' },
//             { id: 'data.financeAnalytics.freeCashflow.raw', title: 'Free Cashflow' },
//             { id: 'data.financeAnalytics.operatingCashflow.raw', title: 'Operating Cashflow' },
//             { id: 'data.financeAnalytics.revenueGrowth.raw', title: 'Revenue Growth' },
//             { id: 'data.financeAnalytics.grossMargins.raw', title: 'Gross Margins' },
//             { id: 'data.financeAnalytics.ebitdaMargins.raw', title: 'EBITDA Margins' },
//             { id: 'data.financeAnalytics.operatingMargins.raw', title: 'Operating Margins' },
//             { id: 'data.financeAnalytics.profitMargins.raw', title: 'Profit Margins' },
//             { id: 'data.financeAnalytics.financialCurrency', title: 'Finance Analytics Financial Currency' },

//              //News
//              { id: 'data.news.0.uuid', title: 'News 1 UUID' },
//              { id: 'data.news.0.title', title: 'News 1 Title' },
//              { id: 'data.news.0.publisher', title: 'News 1 Publisher' },
//              { id: 'data.news.0.link', title: 'News 1 Link' },
//              { id: 'data.news.0.providerPublishTime', title: 'News 1 Provider Publish Time' },
//              { id: 'data.news.0.type', title: 'News 1 Type' },
         
//              { id: 'data.news.1.uuid', title: 'News 2 UUID' },
//              { id: 'data.news.1.title', title: 'News 2 Title' },
//              { id: 'data.news.1.publisher', title: 'News 2 Publisher' },
//              { id: 'data.news.1.link', title: 'News 2 Link' },
//              { id: 'data.news.1.providerPublishTime', title: 'News 2 Provider Publish Time' },
//              { id: 'data.news.1.type', title: 'News 2 Type' },

//              { id: 'data.news.2.uuid', title: 'News 3 UUID' },
//              { id: 'data.news.2.title', title: 'News 3 Title' },
//              { id: 'data.news.2.publisher', title: 'News 3 Publisher' },
//              { id: 'data.news.2.link', title: 'News 3 Link' },
//              { id: 'data.news.2.providerPublishTime', title: 'News 3 Provider Publish Time' },
//              { id: 'data.news.2.type', title: 'News 3 Type' },

//              { id: 'data.news.3.uuid', title: 'News 4 UUID' },
//              { id: 'data.news.3.title', title: 'News 4 Title' },
//              { id: 'data.news.3.publisher', title: 'News 4 Publisher' },
//              { id: 'data.news.3.link', title: 'News 4 Link' },
//              { id: 'data.news.3.providerPublishTime', title: 'News 4 Provider Publish Time' },
//              { id: 'data.news.3.type', title: 'News 4 Type' },

//              { id: 'data.news.4.uuid', title: 'News 5 UUID' },
//              { id: 'data.news.4.title', title: 'News 5 Title' },
//              { id: 'data.news.4.publisher', title: 'News 5 Publisher' },
//              { id: 'data.news.4.link', title: 'News 5 Link' },
//              { id: 'data.news.4.providerPublishTime', title: 'News 5 Provider Publish Time' },
//              { id: 'data.news.4.type', title: 'News 5 Type' },

//              { id: 'data.news.5.uuid', title: 'News 6 UUID' },
//              { id: 'data.news.5.title', title: 'News 6 Title' },
//              { id: 'data.news.5.publisher', title: 'News 6 Publisher' },
//              { id: 'data.news.5.link', title: 'News 6 Link' },
//              { id: 'data.news.5.providerPublishTime', title: 'News 6 Provider Publish Time' },
//              { id: 'data.news.5.type', title: 'News 6 Type' },

//              { id: 'data.news.6.uuid', title: 'News 7 UUID' },
//              { id: 'data.news.6.title', title: 'News 7 Title' },
//              { id: 'data.news.6.publisher', title: 'News 7 Publisher' },
//              { id: 'data.news.6.link', title: 'News 7 Link' },
//              { id: 'data.news.6.providerPublishTime', title: 'News 7 Provider Publish Time' },
//              { id: 'data.news.6.type', title: 'News 7 Type' },

//             //Earnings Trends
//             { id: 'data.earningsTrend.maxAge', title: 'Earnings Trend Max Age' },
//             { id: 'data.earningsTrend.period', title: 'Earnings Trend Period' },
//             { id: 'data.earningsTrend.endDate', title: 'Earnings Trend End Date' },

//             // Earnings Estimate
//             { id: 'data.earningsTrend.earningsEstimate.avg', title: 'Earnings Estimate Average' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.earningsEstimate.low', title: 'Earnings Estimate Low' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.earningsEstimate.high', title: 'Earnings Estimate High' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.earningsEstimate.numberOfAnalysts', title: 'Earnings Estimate Number Of Analysts' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.earningsEstimate.growth', title: 'Earnings Estimate Growth' }, // This is an object, needs specific handling
            
//             // Revenue Estimate
//             { id: 'data.earningsTrend.revenueEstimate.avg', title: 'Revenue Estimate Average' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.revenueEstimate.low', title: 'Revenue Estimate Low' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.revenueEstimate.high', title: 'Revenue Estimate High' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.revenueEstimate.numberOfAnalysts', title: 'Revenue Estimate Number Of Analysts' }, // This is an object, needs specific handling
            
//             // EPS Trend
//             { id: 'data.earningsTrend.epsTrend.current', title: 'EPS Trend Current' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsTrend.7daysAgo', title: 'EPS Trend 7 Days Ago' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsTrend.30daysAgo', title: 'EPS Trend 30 Days Ago' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsTrend.60daysAgo', title: 'EPS Trend 60 Days Ago' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsTrend.90daysAgo', title: 'EPS Trend 90 Days Ago' }, // This is an object, needs specific handling
            
//             // EPS Revisions
//             { id: 'data.earningsTrend.epsRevisions.upLast7days', title: 'EPS Revisions Up Last 7 Days' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsRevisions.upLast30days', title: 'EPS Revisions Up Last 30 Days' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsRevisions.downLast30days', title: 'EPS Revisions Down Last 30 Days' }, // This is an object, needs specific handling
//             { id: 'data.earningsTrend.epsRevisions.downLast90days', title: 'EPS Revisions Down Last 90 Days' }, // This is an object, needs specific handling
         
//             //Key Statistics
//             { id: 'data.keyStatistics.symbol', title: 'Symbol' },
//             { id: 'data.keyStatistics.twoHundredDayAverageChangePercent.raw', title: '200 Day Average Change Percent' },
//             { id: 'data.keyStatistics.fiftyTwoWeekLowChangePercent.raw', title: '52 Week Low Change Percent' },
//             { id: 'data.keyStatistics.language', title: 'Language' },
//             { id: 'data.keyStatistics.regularMarketDayRange.raw', title: 'Regular Market Day Range' },
//             { id: 'data.keyStatistics.earningsTimestampEnd.raw', title: 'Earnings Timestamp End' },
//             { id: 'data.keyStatistics.epsForward.raw', title: 'EPS Forward' },
//             { id: 'data.keyStatistics.regularMarketDayHigh.raw', title: 'Regular Market Day High' },
//             { id: 'data.keyStatistics.twoHundredDayAverageChange.raw', title: '200 Day Average Change' },
//             { id: 'data.keyStatistics.twoHundredDayAverage.raw', title: '200 Day Average' },
//             { id: 'data.keyStatistics.askSize.raw', title: 'Ask Size' },
//             { id: 'data.keyStatistics.bookValue.raw', title: 'Book Value' },
//             { id: 'data.keyStatistics.marketCap.raw', title: 'Market Cap' },
//             { id: 'data.keyStatistics.fiftyTwoWeekHighChange.raw', title: '52 Week High Change' },
//             { id: 'data.keyStatistics.fiftyTwoWeekRange.raw', title: '52 Week Range' },
//             { id: 'data.keyStatistics.fiftyDayAverageChange.raw', title: '50 Day Average Change' },
//             { id: 'data.keyStatistics.exchangeDataDelayedBy', title: 'Exchange Data Delayed By' },
//             { id: 'data.keyStatistics.firstTradeDateMilliseconds', title: 'First Trade Date Milliseconds' },
//             { id: 'data.keyStatistics.averageDailyVolume3Month.raw', title: 'Average Daily Volume 3 Month' },
//             { id: 'data.keyStatistics.trailingAnnualDividendRate.raw', title: 'Trailing Annual Dividend Rate' },
//             { id: 'data.keyStatistics.fiftyTwoWeekChangePercent.raw', title: '52 Week Change Percent' },
//             { id: 'data.keyStatistics.fiftyTwoWeekLow.raw', title: '52 Week Low' },
//             { id: 'data.keyStatistics.regularMarketVolume.raw', title: 'Regular Market Volume' },
//             { id: 'data.keyStatistics.market', title: 'Market' },
//             { id: 'data.keyStatistics.quoteSourceName', title: 'Quote Source Name' },
//             { id: 'data.keyStatistics.messageBoardId', title: 'Message Board ID' },
//             { id: 'data.keyStatistics.priceHint', title: 'Price Hint' },
//             { id: 'data.keyStatistics.exchange', title: 'Exchange' },
//             { id: 'data.keyStatistics.sourceInterval', title: 'Source Interval' },
//             { id: 'data.keyStatistics.regularMarketDayLow.raw', title: 'Regular Market Day Low' },
//             { id: 'data.keyStatistics.region', title: 'Region' },
//             { id: 'data.keyStatistics.shortName', title: 'Short Name' },
//             { id: 'data.keyStatistics.fiftyDayAverageChangePercent.raw', title: '50 Day Average Change Percent' },
//             { id: 'data.keyStatistics.fullExchangeName', title: 'Full Exchange Name' },
//             { id: 'data.keyStatistics.earningsTimestampStart.raw', title: 'Earnings Timestamp Start' },
//             { id: 'data.keyStatistics.financialCurrency', title: 'Financial Currency' },
//             { id: 'data.keyStatistics.gmtOffSetMilliseconds', title: 'GMT Offset Milliseconds' },
//             { id: 'data.keyStatistics.regularMarketOpen.raw', title: 'Regular Market Open' },
//             { id: 'data.keyStatistics.regularMarketTime.raw', title: 'Regular Market Time' },
//             { id: 'data.keyStatistics.regularMarketChangePercent.raw', title: 'Regular Market Change Percent' },
//             { id: 'data.keyStatistics.trailingAnnualDividendYield.raw', title: 'Trailing Annual Dividend Yield' },
//             { id: 'data.keyStatistics.quoteType', title: 'Quote Type' },
//             { id: 'data.keyStatistics.averageDailyVolume10Day.raw', title: 'Average Daily Volume 10 Day' },
//             { id: 'data.keyStatistics.fiftyTwoWeekLowChange.raw', title: '52 Week Low Change' },
//             { id: 'data.keyStatistics.fiftyTwoWeekHighChangePercent.raw', title: '52 Week High Change Percent' },
//             { id: 'data.keyStatistics.typeDisp', title: 'Type Display' },
//             { id: 'data.keyStatistics.tradeable', title: 'Tradeable' },
//             { id: 'data.keyStatistics.currency', title: 'Currency' },
//             { id: 'data.keyStatistics.sharesOutstanding.raw', title: 'Shares Outstanding' },
//             { id: 'data.keyStatistics.fiftyTwoWeekHigh.raw', title: '52 Week High' },
//             { id: 'data.keyStatistics.regularMarketPreviousClose.raw', title: 'Regular Market Previous Close' },
//             { id: 'data.keyStatistics.exchangeTimezoneName', title: 'Exchange Timezone Name' },
//             { id: 'data.keyStatistics.bidSize.raw', title: 'Bid Size' },
//             { id: 'data.keyStatistics.regularMarketChange.raw', title: 'Regular Market Change' },
//             { id: 'data.keyStatistics.cryptoTradeable', title: 'Crypto Tradeable' },
//             { id: 'data.keyStatistics.fiftyDayAverage.raw', title: '50 Day Average' },
//             { id: 'data.keyStatistics.exchangeTimezoneShortName', title: 'Exchange Timezone Short Name' },
//             { id: 'data.keyStatistics.customPriceAlertConfidence', title: 'Custom Price Alert Confidence' },
//             { id: 'data.keyStatistics.regularMarketPrice.raw', title: 'Regular Market Price' },
//             { id: 'data.keyStatistics.marketState', title: 'Market State' },
//             { id: 'data.keyStatistics.forwardPE.raw', title: 'Forward PE' },
//             { id: 'data.keyStatistics.ask.raw', title: 'Ask' },
//             { id: 'data.keyStatistics.epsTrailingTwelveMonths.raw', title: 'EPS Trailing Twelve Months' },
//             { id: 'data.keyStatistics.bid.raw', title: 'Bid' },
//             { id: 'data.keyStatistics.triggerable', title: 'Triggerable' },
//             { id: 'data.keyStatistics.priceToBook.raw', title: 'Price to Book' },
//             { id: 'data.keyStatistics.longName', title: 'Long Name' },

//         ]
//     });

//         // Preparing the data object to match the CSV structure
//     // Prepare your data object to match the CSV structure
//     const csvRowData = {
//         //Price Data
//         'data.price.symbol': data.price?.symbol || 'NA',
//         'data.price.twoHundredDayAverageChangePercent.raw': data.price.twoHundredDayAverageChangePercent?.raw || 'NA',
//         'data.price.fiftyTwoWeekLowChangePercent.raw': data.price.fiftyTwoWeekLowChangePercent?.raw || 'NA',
//         'data.price.earningsTimestampEnd.raw': data.price.earningsTimestampEnd?.raw || 'NA',
//         'data.price.regularMarketDayRange.raw': data.price.regularMarketDayRange?.raw || 'NA',
//         'data.price.epsForward.raw': data.price.epsForward?.raw || 'NA',
//         'data.price.regularMarketDayHigh.raw': data.price.regularMarketDayHigh?.raw || 'NA',
//         'data.price.twoHundredDayAverageChange.raw': data.price.twoHundredDayAverageChange?.raw || 'NA',
//         'data.price.askSize.raw': data.price.askSize?.raw || 'NA',
//         'data.price.twoHundredDayAverage.raw': data.price.twoHundredDayAverage?.raw || 'NA',
//         'data.price.bookValue.raw': data.price.bookValue?.raw || 'NA',
//         'data.price.marketCap.raw': data.price.marketCap?.raw || 'NA',
//         'data.price.fiftyTwoWeekHighChange.raw': data.price.fiftyTwoWeekHighChange?.raw || 'NA',
//         'data.price.fiftyTwoWeekRange.raw': data.price.fiftyTwoWeekRange?.raw || 'NA',
//         'data.price.fiftyDayAverageChange.raw': data.price.fiftyDayAverageChange?.raw || 'NA',
//         'data.price.averageDailyVolume3Month.raw': data.price.averageDailyVolume3Month?.raw || 'NA',
//         'data.price.firstTradeDateMilliseconds': data.price.firstTradeDateMilliseconds || 'NA',
//         'data.price.exchangeDataDelayedBy': data.price.exchangeDataDelayedBy || 'NA',
//         'data.price.fiftyTwoWeekChangePercent.raw': data.price.fiftyTwoWeekChangePercent?.raw || 'NA',
//         'data.price.trailingAnnualDividendRate.raw': data.price.trailingAnnualDividendRate?.raw || 'NA',
//         'data.price.fiftyTwoWeekLow.raw': data.price.fiftyTwoWeekLow?.raw || 'NA',
//         'data.price.regularMarketVolume.raw': data.price.regularMarketVolume?.raw || 'NA',
//         'data.price.market': data.price.market || 'NA',
//         'data.price.messageBoardId': data.price.messageBoardId || 'NA',
//         'data.price.priceHint': data.price.priceHint || 'NA',
//         'data.price.sourceInterval': data.price.sourceInterval || 'NA',
//         'data.price.regularMarketDayLow.raw': data.price.regularMarketDayLow?.raw || 'NA',
//         'data.price.exchange': data.price.exchange || 'NA',
//         'data.price.shortName': data.price.shortName || 'NA',
//         'data.price.region': data.price.region || 'NA',
//         'data.price.fiftyDayAverageChangePercent.raw': data.price.fiftyDayAverageChangePercent?.raw || 'NA',
//         'data.price.fullExchangeName': data.price.fullExchangeName || 'NA',
//         'data.price.earningsTimestampStart.raw': data.price.earningsTimestampStart?.raw || 'NA',
//         'data.price.financialCurrency': data.price.financialCurrency || 'NA',
//         'data.price.gmtOffSetMilliseconds': data.price.gmtOffSetMilliseconds || 'NA',
//         'data.price.regularMarketOpen.raw': data.price.regularMarketOpen?.raw || 'NA',
//         'data.price.regularMarketTime.raw': data.price.regularMarketTime?.raw || 'NA',
//         'data.price.regularMarketChangePercent.raw': data.price.regularMarketChangePercent?.raw || 'NA',
//         'data.price.trailingAnnualDividendYield.raw': data.price.trailingAnnualDividendYield?.raw || 'NA',
//         'data.price.quoteType': data.price.quoteType || 'NA',
//         'data.price.averageDailyVolume10Day.raw': data.price.averageDailyVolume10Day?.raw || 'NA',
//         'data.price.fiftyTwoWeekLowChange.raw': data.price.fiftyTwoWeekLowChange?.raw || 'NA',
//         'data.price.fiftyTwoWeekHighChangePercent.raw': data.price.fiftyTwoWeekHighChangePercent?.raw || 'NA',
//         'data.price.typeDisp': data.price.typeDisp || 'NA',
//         'data.price.tradeable': data.price.tradeable || 'NA',
//         'data.price.currency': data.price.currency || 'NA',
//         'data.price.sharesOutstanding.raw': data.price.sharesOutstanding?.raw || 'NA',
//         'data.price.regularMarketPreviousClose.raw': data.price.regularMarketPreviousClose?.raw || 'NA',
//         'data.price.fiftyTwoWeekHigh.raw': data.price.fiftyTwoWeekHigh?.raw || 'NA',
//         'data.price.exchangeTimezoneName': data.price.exchangeTimezoneName || 'NA',
//         'data.price.bidSize.raw': data.price.bidSize?.raw || 'NA',
//         'data.price.regularMarketChange.raw': data.price.regularMarketChange?.raw || 'NA',
//         'data.price.cryptoTradeable': data.price.cryptoTradeable || 'NA',
//         'data.price.fiftyDayAverage.raw': data.price.fiftyDayAverage?.raw || 'NA',
//         'data.price.exchangeTimezoneShortName': data.price.exchangeTimezoneShortName || 'NA',
//         'data.price.regularMarketPrice.raw': data.price.regularMarketPrice?.raw || 'NA',
//         'data.price.customPriceAlertConfidence': data.price.customPriceAlertConfidence || 'NA',
//         'data.price.marketState': data.price.marketState || 'NA',
//         'data.price.forwardPE.raw': data.price.forwardPE?.raw || 'NA',
//         'data.price.ask.raw': data.price.ask?.raw || 'NA',
//         'data.price.epsTrailingTwelveMonths.raw': data.price.epsTrailingTwelveMonths?.raw || 'NA',
//         'data.price.bid.raw': data.price.bid?.raw || 'NA',
//         'data.price.triggerable': data.price.triggerable || 'NA',
//         'data.price.priceToBook.raw': data.price.priceToBook?.raw || 'NA',
//         'data.price.longName': data.price.longName || 'NA',

//         // Historic Data
//         'data.historic.meta.currency': data.historic?.meta?.currency || 'NA',
//         'data.historic.meta.symbol': data.historic?.meta?.symbol || 'NA',
//         'data.historic.meta.exchangeName': data.historic?.meta?.exchangeName || 'NA',
//         'data.historic.meta.instrumentType': data.historic?.meta?.instrumentType || 'NA',
//         'data.historic.meta.firstTradeDate': data.historic?.meta?.firstTradeDate || 'NA',
//         'data.historic.meta.regularMarketTime': data.historic?.meta?.regularMarketTime || 'NA',
//         'data.historic.meta.gmtoffset': data.historic?.meta?.gmtoffset || 'NA',
//         'data.historic.meta.timezone': data.historic?.meta?.timezone || 'NA',
//         'data.historic.meta.exchangeTimezoneName': data.historic?.meta?.exchangeTimezoneName || 'NA',
//         'data.historic.meta.regularMarketPrice': data.historic?.meta?.regularMarketPrice || 'NA',
//         'data.historic.meta.chartPreviousClose': data.historic?.meta?.chartPreviousClose || 'NA',
//         'data.historic.meta.priceHint': data.historic?.meta?.priceHint || 'NA',
    
//         // Balance Sheet, Earnings, Financial Analytics
//         'data.balanceSheet.maxAge': data.balanceSheet?.maxAge || 'NA',
//         'data.balanceSheet.endDate.raw': data.balanceSheet?.endDate?.raw || 'NA',
//         'data.earnings.maxAge': data.earnings?.maxAge || 'NA',
//         // Note: Handle arrays as needed
//         'data.earnings.earningsChart.quarterly': JSON.stringify(data.earnings?.earningsChart?.quarterly || []),
//         'data.earnings.earningsChart.earningsDate': JSON.stringify(data.earnings?.earningsChart?.earningsDate || []),
//         'data.earnings.financialsChart.yearly': JSON.stringify(data.earnings?.financialsChart?.yearly || []),
//         'data.earnings.financialsChart.quarterly': JSON.stringify(data.earnings?.financialsChart?.quarterly || []),
//         'data.earnings.financialCurrency': data.earnings?.financialCurrency || 'NA',
//         'data.financeAnalytics.maxAge': data.financeAnalytics?.maxAge || 'NA',
//         'data.financeAnalytics.currentPrice.raw': data.financeAnalytics?.currentPrice?.raw || 'NA',
//         'data.financeAnalytics.totalCash.raw': data.financeAnalytics?.totalCash?.raw || 'NA',
//         'data.financeAnalytics.totalCashPerShare.raw': data.financeAnalytics?.totalCashPerShare?.raw || 'NA',
//         'data.financeAnalytics.ebitda.raw': data.financeAnalytics?.ebitda?.raw || 'NA',
//         'data.financeAnalytics.totalDebt.raw': data.financeAnalytics?.totalDebt?.raw || 'NA',
//         'data.financeAnalytics.quickRatio.raw': data.financeAnalytics?.quickRatio?.raw || 'NA',
//         'data.financeAnalytics.currentRatio.raw': data.financeAnalytics?.currentRatio?.raw || 'NA',
//         'data.financeAnalytics.totalRevenue.raw': data.financeAnalytics?.totalRevenue?.raw || 'NA',
//         'data.financeAnalytics.debtToEquity.raw': data.financeAnalytics?.debtToEquity?.raw || 'NA',
//         'data.financeAnalytics.revenuePerShare.raw': data.financeAnalytics?.revenuePerShare?.raw || 'NA',
//         'data.financeAnalytics.returnOnAssets.raw': data.financeAnalytics?.returnOnAssets?.raw || 'NA',
//         'data.financeAnalytics.returnOnEquity.raw': data.financeAnalytics?.returnOnEquity?.raw || 'NA',
//         'data.financeAnalytics.freeCashflow.raw': data.financeAnalytics?.freeCashflow?.raw || 'NA',
//         'data.financeAnalytics.operatingCashflow.raw': data.financeAnalytics?.operatingCashflow?.raw || 'NA',
//         'data.financeAnalytics.revenueGrowth.raw': data.financeAnalytics?.revenueGrowth?.raw || 'NA',
//         'data.financeAnalytics.grossMargins.raw': data.financeAnalytics?.grossMargins?.raw || 'NA',
//         'data.financeAnalytics.ebitdaMargins.raw': data.financeAnalytics?.ebitdaMargins?.raw || 'NA',
//         'data.financeAnalytics.operatingMargins.raw': data.financeAnalytics?.operatingMargins?.raw || 'NA',
//         'data.financeAnalytics.profitMargins.raw': data.financeAnalytics?.profitMargins?.raw || 'NA',
//         'data.financeAnalytics.financialCurrency': data.financeAnalytics?.financialCurrency || 'NA',
    
//         // News Data
//         'data.news.0.uuid': data.news?.[0]?.uuid || 'NA',
//         'data.news.0.title': data.news?.[0]?.title || 'NA',
//         'data.news.0.publisher': data.news?.[0]?.publisher || 'NA',
//         'data.news.0.link': data.news?.[0]?.link || 'NA',
//         'data.news.0.providerPublishTime': data.news?.[0]?.providerPublishTime || 'NA',
//         'data.news.0.type': data.news?.[0]?.type || 'NA',

//         'data.news.1.uuid': data.news?.[1]?.uuid || 'NA',
//         'data.news.1.title': data.news?.[1]?.title || 'NA',
//         'data.news.1.publisher': data.news?.[1]?.publisher || 'NA',
//         'data.news.1.link': data.news?.[1]?.link,
//         'data.news.1.providerPublishTime': data.news?.[1]?.providerPublishTime || 'NA',
//         'data.news.1.type': data.news?.[1]?.type || 'NA',

//         'data.news.2.uuid': data.news?.[2]?.uuid || 'NA',
//         'data.news.2.title': data.news?.[2]?.title || 'NA',
//         'data.news.2.publisher': data.news?.[2]?.publisher || 'NA',
//         'data.news.2.link': data.news?.[2]?.link || 'NA',
//         'data.news.2.providerPublishTime': data.news?.[2]?.providerPublishTime || 'NA',
//         'data.news.2.type': data.news?.[2]?.type || 'NA',

//         'data.news.3.uuid': data.news?.[3]?.uuid || 'NA',
//         'data.news.3.title': data.news?.[3]?.title || 'NA',
//         'data.news.3.publisher': data.news?.[3]?.publisher || 'NA',
//         'data.news.3.link': data.news?.[3]?.link || 'NA',
//         'data.news.3.providerPublishTime': data.news?.[3]?.providerPublishTime || 'NA',
//         'data.news.3.type': data.news?.[3]?.type || 'NA',

//         'data.news.4.uuid': data.news?.[4]?.uuid || 'NA',
//         'data.news.4.title': data.news?.[4]?.title || 'NA',
//         'data.news.4.publisher': data.news?.[4]?.publisher || 'NA',
//         'data.news.4.link': data.news?.[4]?.link || 'NA',
//         'data.news.4.providerPublishTime': data.news?.[4]?.providerPublishTime || 'NA',
//         'data.news.4.type': data.news?.[4]?.type || 'NA',

//         'data.news.5.uuid': data.news?.[5]?.uuid || 'NA',
//         'data.news.5.title': data.news?.[5]?.title || 'NA',
//         'data.news.5.publisher': data.news?.[5]?.publisher || 'NA',
//         'data.news.5.link': data.news?.[5]?.link || 'NA',
//         'data.news.5.providerPublishTime': data.news?.[5]?.providerPublishTime || 'NA',
//         'data.news.5.type': data.news?.[5]?.type || 'NA',

//         'data.news.6.uuid': data.news?.[6]?.uuid || 'NA',
//         'data.news.6.title': data.news?.[6]?.title || 'NA',
//         'data.news.6.publisher': data.news?.[6]?.publisher || 'NA',
//         'data.news.6.link': data.news?.[6]?.link || 'NA',
//         'data.news.6.providerPublishTime': data.news?.[6]?.providerPublishTime || 'NA',
//         'data.news.6.type': data.news?.[6]?.type || 'NA',

//         // Earnings Trends Data
//         'data.earningsTrend.maxAge': data.earningsTrend?.maxAge || 'NA',
//         'data.earningsTrend.period': data.earningsTrend?.period || 'NA',
//         'data.earningsTrend.endDate': data.earningsTrend?.endDate || 'NA',

//         // Earnings Estimate
//         'data.earningsTrend.earningsEstimate.avg': data.earningsTrend?.earningsEstimate?.avg || 'NA',
//         'data.earningsTrend.earningsEstimate.low': data.earningsTrend?.earningsEstimate?.low || 'NA',
//         'data.earningsTrend.earningsEstimate.high': data.earningsTrend?.earningsEstimate?.high || 'NA',
//         'data.earningsTrend.earningsEstimate.numberOfAnalysts': data.earningsTrend?.earningsEstimate?.numberOfAnalysts || 'NA',
//         'data.earningsTrend.earningsEstimate.growth': data.earningsTrend?.earningsEstimate?.growth || 'NA',
        
//         // Revenue Estimate
//         'data.earningsTrend.revenueEstimate.avg': data.earningsTrend?.revenueEstimate?.avg || 'NA',
//         'data.earningsTrend.revenueEstimate.low': data.earningsTrend?.revenueEstimate?.low || 'NA',
//         'data.earningsTrend.revenueEstimate.high': data.earningsTrend?.revenueEstimate?.high || 'NA',
//         'data.earningsTrend.revenueEstimate.numberOfAnalysts': data.earningsTrend?.revenueEstimate?.numberOfAnalysts || 'NA',
        
//         // EPS Trend
//         'data.earningsTrend.epsTrend.current': data.earningsTrend?.epsTrend?.current || 'NA',
//         'data.earningsTrend.epsTrend.7daysAgo': data.earningsTrend?.epsTrend?.['7daysAgo'] || 'NA',
//         'data.earningsTrend.epsTrend.30daysAgo': data.earningsTrend?.epsTrend?.['30daysAgo'] || 'NA',
//         'data.earningsTrend.epsTrend.60daysAgo': data.earningsTrend?.epsTrend?.['60daysAgo'] || 'NA',
//         'data.earningsTrend.epsTrend.90daysAgo': data.earningsTrend?.epsTrend?.['90daysAgo'] || 'NA',
        
//         // EPS Revisions
//         'data.earningsTrend.epsRevisions.upLast7days': data.earningsTrend?.epsRevisions?.upLast7days || 'NA',
//         'data.earningsTrend.epsRevisions.upLast30days': data.earningsTrend?.epsRevisions?.upLast30days || 'NA',
//         'data.earningsTrend.epsRevisions.downLast30days': data.earningsTrend?.epsRevisions?.downLast30days || 'NA',
//         'data.earningsTrend.epsRevisions.downLast90days': data.earningsTrend?.epsRevisions?.downLast90days || 'NA',

//         };


//     // Create CSV data
//     const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords([csvRowData]);

//     const stockSymbol = data.price.symbol || 'default';
//     const params = {
//         Bucket: 'kalicapitaltest',
//         Key: `pdf/${stockSymbol}.csv`,
//         Body: csvData,
//         ContentType: 'text/csv'
//     };

//     uploadPromises.push(s3.upload(params).promise());

//     try {
//         await Promise.all(uploadPromises);
//         return Response.json('Files uploaded successfully.');
//     } catch (error) {
//         console.error('Error uploading files:', error);
//         return Response.json('Error in file upload.');
//     }
// }