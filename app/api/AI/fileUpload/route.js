import AWS from 'aws-sdk';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { connectToDB } from '@utils/database';
import Stock from '@models/stock';

// Path: app/api/AI/fileUpload/route.js
export async function POST(req) {
    const data = await req.json();
    console.log('File Upload Data:', data);
    const ticker = data.ticker;
    console.log('File Upload Ticker:', ticker); 
    await connectToDB(); // Ensure MongoDB is connected
    const MongoData = await Stock.findOne({ Stock: ticker });
    const DBStockData = MongoData._doc;
    console.log('DBStockData Industry:', DBStockData?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.industry);

    if (MongoData) {

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
        
        function wrapText(text, font, fontSize, maxWidth) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0];
        
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
                if (width < maxWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine); // Push the last line into lines
            return lines;
        }
        
        // Assuming maxWidth is the width of the page minus margins
        const maxWidth = page.getWidth() - 100; // Adjust according to your margins (50 units from both left and right)
        // Wrap the Business Summary text
        const businessSummaryText = `Business Summary: ${DBStockData?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.longBusinessSummary || 'NA'}`;
        const wrappedBusinessSummary = wrapText(businessSummaryText, timesRomanFont, fontSize, maxWidth);

        // Use the wrapped lines instead of the original single line for the business summary
        wrappedBusinessSummary.forEach(line => {
            if (yPosition < 10) { // Check if near the bottom of the page (10 units margin)
                page = pdfDoc.addPage(); // Add a new page if needed
                yPosition = page.getHeight() - 40; // Reset y position for the new page
            }

            page.drawText(line, {
                x: xPosition,
                y: yPosition,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0),
            });

            yPosition -= 18; // Adjust spacing as needed for wrapped lines
        });

        const findFirstValidData = (array, defaultValue) => {
            if (!Array.isArray(array)) return defaultValue.reportedValue.fmt;
            // Iterate backwards through the array to find the highest value
            for (let i = array.length - 1; i >= 0; i--) {
            const item = array[i];
            if (item && item.reportedValue && typeof item.reportedValue.fmt === 'string') {
                return item.reportedValue.fmt;
            }
            }
            return defaultValue.reportedValue.fmt; // Ensure this returns a string
        };
        
        const defaultReportedValue = { reportedValue: { fmt: 'Data not available' } };

        // Define a function to add a section title
        function addSectionTitle(page, title, xPos, yPos, font, size, color) {
            page.drawText(title, {
                x: xPos,
                y: yPos,
                size: size,
                font: font,
                color: color,
            });
        }

        const lines = [


            //get-profile'
            'Title:Get Profile',
                        
            `Industry: ${DBStockData?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.industry || 'NA'}`,
            `Website: ${DBStockData?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.website }`,
            `fullTimeEmployees: ${DBStockData?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.fullTimeEmployees }`,

            //Balance-Sheet
            'Title:Balance Sheet',

            `Investment In Financial Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInvestmentinFinancialAssets, defaultReportedValue) || 'NA') }`,
            `Other Equity Adjustments: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherEquityAdjustments, defaultReportedValue) || 'NA') }`,
            `Trading Securities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTradingSecurities, defaultReportedValue) || 'NA') }`,
            `Hedging Assets Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualHedgingAssetsCurrent, defaultReportedValue) || 'NA') }`,
            `Current Deferred Taxes Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentDeferredTaxesLiabilities, defaultReportedValue) || 'NA') }`,
            `Inventory: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInventory, defaultReportedValue) || 'NA') }`,
            `Current Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentLiabilities, defaultReportedValue) || 'NA') }`,
            `Finished Goods: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualFinishedGoods, defaultReportedValue) || 'NA') }`,
            `Construction In Progress: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualConstructionInProgress, defaultReportedValue) || 'NA') }`,
            `Investments And Advances: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInvestmentsAndAdvances, defaultReportedValue) || 'NA') }`,
            `Current Deferred Revenue: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentDeferredRevenue, defaultReportedValue) || 'NA') }`,
            `Long Term Provisions: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLongTermProvisions, defaultReportedValue) || 'NA') }`,
            `Share Issued: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualShareIssued, defaultReportedValue) || 'NA') }`,
            `Machinery Furniture Equipment: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualMachineryFurnitureEquipment, defaultReportedValue) || 'NA') }`,
            `Receivables Adjustments Allowances: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualReceivablesAdjustmentsAllowances, defaultReportedValue) || 'NA') }`,
            `Current Debt: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentDebt, defaultReportedValue) || 'NA') }`,
            `Other Capital Stock: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherCapitalStock, defaultReportedValue) || 'NA') }`,
            `Total Non Current Liabilities Net Minority Interest: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTotalNonCurrentLiabilitiesNetMinorityInterest, defaultReportedValue) || 'NA') }`,
            `Gains Losses Not Affecting Retained Earnings: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualGainsLossesNotAffectingRetainedEarnings, defaultReportedValue) || 'NA') }`,
            `Other Intangible Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherIntangibleAssets, defaultReportedValue) || 'NA') }`,
            `Other Non Current Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherNonCurrentAssets, defaultReportedValue) || 'NA') }`,
            `Accumulated Depreciation: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualAccumulatedDepreciation, defaultReportedValue) || 'NA') }`,
            `Net PPE: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNetPPE, defaultReportedValue) || 'NA') }`,
            `Current Deferred Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentDeferredAssets, defaultReportedValue) || 'NA') }`,
            `Leases: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLeases, defaultReportedValue) || 'NA') }`,
            `Assets Held For Sale Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualAssetsHeldForSaleCurrent, defaultReportedValue) || 'NA') }`,
            `Total Liabilities Net Minority Interest: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTotalLiabilitiesNetMinorityInterest, defaultReportedValue) || 'NA') }`,
            `Current Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentAssets, defaultReportedValue) || 'NA') }`,
            `Tangible Book Value: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTangibleBookValue, defaultReportedValue) || 'NA') }`, // Duplicate, already present
            `Capital Lease Obligations: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCapitalLeaseObligations, defaultReportedValue) || 'NA') }`,
            `Cash Cash Equivalents And Short Term Investments: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCashCashEquivalentsAndShortTermInvestments, defaultReportedValue) || 'NA') }`,
            `Trade and Other Payables Non Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTradeandOtherPayablesNonCurrent, defaultReportedValue) || 'NA') }`,
            `Common Stock Equity: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCommonStockEquity, defaultReportedValue) || 'NA') }`,
            `Pension and Other Post Retirement Benefit Plans Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualPensionandOtherPostRetirementBenefitPlansCurrent, defaultReportedValue) || 'NA') }`,
            `Cash Financial: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCashFinancial, defaultReportedValue) || 'NA') }`,
            `Other Current Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherCurrentLiabilities, defaultReportedValue) || 'NA') }`,
            `Current Deferred Taxes Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentDeferredTaxesAssets, defaultReportedValue) || 'NA') }`,
            `Long Term Capital Lease Obligation: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLongTermCapitalLeaseObligation, defaultReportedValue) || 'NA') }`,
            `Non Current Pension And Other Postretirement Benefit Plans: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentPensionAndOtherPostretirementBenefitPlans, defaultReportedValue) || 'NA') }`,
            `Loans Receivable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLoansReceivable, defaultReportedValue) || 'NA') }`,
            `Current Capital Lease Obligation: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentCapitalLeaseObligation, defaultReportedValue) || 'NA') }`,
            `Retained Earnings: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualRetainedEarnings, defaultReportedValue) || 'NA') }`,
            `Common Stock: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCommonStock, defaultReportedValue) || 'NA') }`,
            `Dividends Payable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualDividendsPayable, defaultReportedValue) || 'NA') }`,
            `Current Provisions: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentProvisions, defaultReportedValue) || 'NA') }`,
            `Gross PPE: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualGrossPPE, defaultReportedValue) || 'NA') }`,
            `Net Tangible Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNetTangibleAssets, defaultReportedValue) || 'NA') }`,
            `Non Current Deferred Taxes Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredTaxesAssets, defaultReportedValue) || 'NA') }`,
            `Other Properties: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherProperties, defaultReportedValue) || 'NA') }`,
            `Non Current Deferred Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredAssets, defaultReportedValue) || 'NA') }`,
            `Other Receivables: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherReceivables, defaultReportedValue) || 'NA') }`,
            `Payables And Accrued Expenses: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualPayablesAndAccruedExpenses, defaultReportedValue) || 'NA') }`,
            `Other Short Term Investments: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherShortTermInvestments, defaultReportedValue) || 'NA') }`,
            `Non Current Accounts Receivable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentAccountsReceivable, defaultReportedValue) || 'NA') }`,
            `Invested Capital: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInvestedCapital, defaultReportedValue) || 'NA') }`, // Duplicate, already present
            `Other Current Borrowings: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherCurrentBorrowings, defaultReportedValue) || 'NA') }`,
            `Goodwill: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualGoodwill, defaultReportedValue) || 'NA') }`,
            `Current Deferred Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentDeferredLiabilities, defaultReportedValue) || 'NA') }`,
            `Net Debt: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNetDebt, defaultReportedValue) || 'NA') }`, // Duplicate, already present
            `Other Current Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherCurrentAssets, defaultReportedValue) || 'NA') }`,
            `Capital Stock: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCapitalStock, defaultReportedValue) || 'NA') }`,
            `Other Investments: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherInvestments, defaultReportedValue) || 'NA') }`,
            `Accounts Receivable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualAccountsReceivable, defaultReportedValue) || 'NA') }`,
            `Foreign Currency Translation Adjustments: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualForeignCurrencyTranslationAdjustments, defaultReportedValue) || 'NA') }`,
            `Total Capitalization: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTotalCapitalization, defaultReportedValue) || 'NA') }`, // Duplicate, already present
            `Other Payable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherPayable, defaultReportedValue) || 'NA') }`,
            `Payables: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualPayables, defaultReportedValue) || 'NA') }`,
            `Total Non Current Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTotalNonCurrentAssets, defaultReportedValue) || 'NA') }`,
            `Accounts Payable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualAccountsPayable, defaultReportedValue) || 'NA') }`,
            `Non Current Deferred Revenue: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredRevenue, defaultReportedValue) || 'NA') }`,
            `Current Debt And Capital Lease Obligation: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentDebtAndCapitalLeaseObligation, defaultReportedValue) || 'NA') }`,
            `Land And Improvements: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLandAndImprovements, defaultReportedValue) || 'NA') }`,
            `Investments in Associates at Cost: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInvestmentsinAssociatesatCost, defaultReportedValue) || 'NA') }`,
            `Working Capital: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualWorkingCapital, defaultReportedValue) || 'NA') }`,
            `Non Current Deferred Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredLiabilities, defaultReportedValue) || 'NA') }`,
            `Employee Benefits: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualEmployeeBenefits, defaultReportedValue) || 'NA') }`,
            `Ordinary Shares Number: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOrdinarySharesNumber, defaultReportedValue) || 'NA') }`,
            `Long Term Debt: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLongTermDebt, defaultReportedValue) || 'NA') }`,
            `Total Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTotalAssets, defaultReportedValue) || 'NA') }`,
            `Inventories Adjustments Allowances: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInventoriesAdjustmentsAllowances, defaultReportedValue) || 'NA') }`,
            `Stockholders Equity: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualStockholdersEquity, defaultReportedValue) || 'NA') }`,
            `Non Current Deferred Taxes Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredTaxesLiabilities, defaultReportedValue) || 'NA') }`,
            `Properties: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualProperties, defaultReportedValue) || 'NA') }`,
            `Investment Properties: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInvestmentProperties, defaultReportedValue) || 'NA') }`,
            `Held To Maturity Securities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualHeldToMaturitySecurities, defaultReportedValue) || 'NA') }`,
            `Financial Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualFinancialAssets, defaultReportedValue) || 'NA') }`,
            `Due from Related Parties Non Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualDuefromRelatedPartiesNonCurrent, defaultReportedValue) || 'NA') }`,
            `Raw Materials: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualRawMaterials, defaultReportedValue) || 'NA') }`,
            `Non Current Accrued Expenses: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentAccruedExpenses, defaultReportedValue) || 'NA') }`,
            `Due to Related Parties Non Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualDuetoRelatedPartiesNonCurrent, defaultReportedValue) || 'NA') }`,
            `Interest Payable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInterestPayable, defaultReportedValue) || 'NA') }`,
            `Cash Equivalents: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCashEquivalents, defaultReportedValue) || 'NA') }`,
            `Taxes Receivable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTaxesReceivable, defaultReportedValue) || 'NA') }`,
            `Available For Sale Securities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualAvailableForSaleSecurities, defaultReportedValue) || 'NA') }`,
            `Non Current Prepaid Assets: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentPrepaidAssets, defaultReportedValue) || 'NA') }`,
            `Derivative Product Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualDerivativeProductLiabilities, defaultReportedValue) || 'NA') }`,
            `Treasury Shares Number: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTreasurySharesNumber, defaultReportedValue) || 'NA') }`,
            `Fixed Assets Revaluation Reserve: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualFixedAssetsRevaluationReserve, defaultReportedValue) || 'NA') }`,
            `Investments In Other Ventures Under Equity Method: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInvestmentsInOtherVenturesUnderEquityMethod, defaultReportedValue) || 'NA') }`,
            `Additional Paid In Capital: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualAdditionalPaidInCapital, defaultReportedValue) || 'NA') }`,
            `Due to Related Parties Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualDuetoRelatedPartiesCurrent, defaultReportedValue) || 'NA') }`,
            `Defined Pension Benefit: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualDefinedPensionBenefit, defaultReportedValue) || 'NA') }`,
            `Minimum Pension Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualMinimumPensionLiabilities, defaultReportedValue) || 'NA') }`,
            `Current Accrued Expenses: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentAccruedExpenses, defaultReportedValue) || 'NA') }`,
            `Restricted Common Stock: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualRestrictedCommonStock, defaultReportedValue) || 'NA') }`,
            `Buildings And Improvements: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualBuildingsAndImprovements, defaultReportedValue) || 'NA') }`,
            `Commercial Paper: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCommercialPaper, defaultReportedValue) || 'NA') }`,
            `Preferred Stock: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualPreferredStock, defaultReportedValue) || 'NA') }`,
            `Other Non Current Liabilities: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherNonCurrentLiabilities, defaultReportedValue) || 'NA') }`,
            `Other Equity Interest: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherEquityInterest, defaultReportedValue) || 'NA') }`,
            `General Partnership Capital: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualGeneralPartnershipCapital, defaultReportedValue) || 'NA') }`,
            `Investments in Joint Ventures at Cost: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInvestmentsinJointVenturesatCost, defaultReportedValue) || 'NA') }`,
            `Line Of Credit: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLineOfCredit, defaultReportedValue) || 'NA') }`,
            `Income Tax Payable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualIncomeTaxPayable, defaultReportedValue) || 'NA') }`,
            `Preferred Shares Number: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualPreferredSharesNumber, defaultReportedValue) || 'NA') }`,
            `Investments in Subsidiaries at Cost: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualInvestmentsinSubsidiariesatCost, defaultReportedValue) || 'NA') }`,
            `Limited Partnership Capital: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLimitedPartnershipCapital, defaultReportedValue) || 'NA') }`,
            `Other Inventories: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualOtherInventories, defaultReportedValue) || 'NA') }`,
            `Restricted Cash: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualRestrictedCash, defaultReportedValue) || 'NA') }`,
            `Financial Assets Designated as Fair Value Through Profit or Loss Total: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualFinancialAssetsDesignatedasFairValueThroughProfitorLossTotal, defaultReportedValue) || 'NA') }`,
            `Preferred Securities Outside Stock Equity: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualPreferredSecuritiesOutsideStockEquity, defaultReportedValue) || 'NA') }`,
            `Preferred Stock Equity: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualPreferredStockEquity, defaultReportedValue) || 'NA') }`,
            `Due from Related Parties Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualDuefromRelatedPartiesCurrent, defaultReportedValue) || 'NA') }`,
            `Allowance For Doubtful Accounts Receivable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualAllowanceForDoubtfulAccountsReceivable, defaultReportedValue) || 'NA') }`,
            `Unrealized Gain Loss: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualUnrealizedGainLoss, defaultReportedValue) || 'NA') }`,
            `Total Tax Payable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTotalTaxPayable, defaultReportedValue) || 'NA') }`,
            `Liabilities Held for Sale Non Current: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualLiabilitiesHeldforSaleNonCurrent, defaultReportedValue) || 'NA') }`,
            `Total Partnership Capital: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTotalPartnershipCapital, defaultReportedValue) || 'NA') }`,
            `Accrued Interest Receivable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualAccruedInterestReceivable, defaultReportedValue) || 'NA') }`,
            `Work In Process: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualWorkInProcess, defaultReportedValue) || 'NA') }`,
            `Gross Accounts Receivable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualGrossAccountsReceivable, defaultReportedValue) || 'NA') }`,
            `Non Current Note Receivables: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNonCurrentNoteReceivables, defaultReportedValue) || 'NA') }`,
            `Notes Receivable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualNotesReceivable, defaultReportedValue) || 'NA') }`,
            `Current Notes Payable: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualCurrentNotesPayable, defaultReportedValue) || 'NA') }`,
            `Treasury Stock: ${ (findFirstValidData(DBStockData?.['get-balance']?.timeSeries?.annualTreasuryStock, defaultReportedValue) || 'NA') }`,
            
            //Income Statement 
            'Title:Income Statement',

            `Trailing Basic Average Shares: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingBasicAverageShares, defaultReportedValue) || 'NA') }`,
            `Trailing Basic EPS: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingBasicEPS, defaultReportedValue) || 'NA') }`,
            `Trailing Cost Of Revenue: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingCostOfRevenue, defaultReportedValue) || 'NA') }`,
            `Trailing Diluted Average Shares: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingDilutedAverageShares, defaultReportedValue) || 'NA') }`,
            `Trailing Diluted EPS: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingDilutedEPS, defaultReportedValue) || 'NA') }`,
            `Trailing Gross Profit: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingGrossProfit, defaultReportedValue) || 'NA') }`,
            `Trailing Interest Expense: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingInterestExpense, defaultReportedValue) || 'NA') }`,
            `Trailing Net Income: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingNetIncome, defaultReportedValue) || 'NA') }`,
            `Trailing Net Income Common Stockholders: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingNetIncomeCommonStockholders, defaultReportedValue) || 'NA') }`,
            `Trailing Net Income Continuous Operations: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingNetIncomeContinuousOperations, defaultReportedValue) || 'NA') }`,
            `Trailing Operating Expense: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingOperatingExpense, defaultReportedValue) || 'NA') }`,
            `Trailing Operating Income: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingOperatingIncome, defaultReportedValue) || 'NA') }`,
            `Trailing Other Income Expense: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingOtherIncomeExpense, defaultReportedValue) || 'NA') }`,
            `Trailing Pretax Income: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingPretaxIncome, defaultReportedValue) || 'NA') }`,
            `Trailing Research And Development: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingResearchAndDevelopment, defaultReportedValue) || 'NA') }`,
            `Trailing Selling General And Administration: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingSellingGeneralAndAdministration, defaultReportedValue) || 'NA') }`,
            `Trailing Tax Provision: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingTaxProvision, defaultReportedValue) || 'NA') }`,
            `Trailing Total Revenue: ${ (findFirstValidData(DBStockData?.['get-income']?.timeSeries?.trailingTotalRevenue, defaultReportedValue) || 'NA') }`,

            
            //Cash Flow Statement
            'Title:Cash Flow Statement',

            `Beginning Cash Position: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingBeginningCashPosition, defaultReportedValue) || 'NA') }`,
            `Capital Expenditure: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingCapitalExpenditure, defaultReportedValue) || 'NA') }`,
            `Cash Dividends Paid: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingCashDividendsPaid, defaultReportedValue) || 'NA') }`,
            `Cash Flow From Continuing Financing Activities: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingCashFlowFromContinuingFinancingActivities, defaultReportedValue) || 'NA') }`,
            `Change In Account Payable: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingChangeInAccountPayable, defaultReportedValue) || 'NA') }`,
            `Change In Cash Supplemental As Reported: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingChangeInCashSupplementalAsReported, defaultReportedValue) || 'NA') }`,
            `Change In Inventory: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingChangeInInventory, defaultReportedValue) || 'NA') }`,
            `Change In Working Capital: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingChangeInWorkingCapital, defaultReportedValue) || 'NA') }`,
            `Changes In Account Receivables: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingChangesInAccountReceivables, defaultReportedValue) || 'NA') }`,
            `Common Stock Issuance: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingCommonStockIssuance, defaultReportedValue) || 'NA') }`,
            `Deferred Income Tax: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingDeferredIncomeTax, defaultReportedValue) || 'NA') }`,
            `Depreciation And Amortization: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingDepreciationAndAmortization, defaultReportedValue) || 'NA') }`,
            `End Cash Position: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingEndCashPosition, defaultReportedValue) || 'NA') }`,
            `Free Cash Flow: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingFreeCashFlow, defaultReportedValue) || 'NA') }`,
            `Investing Cash Flow: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingInvestingCashFlow, defaultReportedValue) || 'NA') }`,
            `Net Income: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingNetIncome, defaultReportedValue) || 'NA') }`,
            `Net Other Financing Charges: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingNetOtherFinancingCharges, defaultReportedValue) || 'NA') }`,
            `Net Other Investing Changes: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingNetOtherInvestingChanges, defaultReportedValue) || 'NA') }`,
            `Operating Cash Flow: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingOperatingCashFlow, defaultReportedValue) || 'NA') }`,
            `Other Non Cash Items: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingOtherNonCashItems, defaultReportedValue) || 'NA') }`,
            `Purchase Of Business: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingPurchaseOfBusiness, defaultReportedValue) || 'NA') }`,
            `Purchase Of Investment: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingPurchaseOfInvestment, defaultReportedValue) || 'NA') }`,
            `Repayment Of Debt: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingRepaymentOfDebt, defaultReportedValue) || 'NA') }`,
            `Repurchase Of Capital Stock: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingRepurchaseOfCapitalStock, defaultReportedValue) || 'NA') }`,
            `Sale Of Investment: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingSaleOfInvestment, defaultReportedValue) || 'NA') }`,
            `Stock Based Compensation: ${ (findFirstValidData(DBStockData?.['get-cashflow']?.timeSeries?.trailingStockBasedCompensation, defaultReportedValue) || 'NA') }`,
            

            // Price Data
            'Title:Price Data',

            `Symbol: ${DBStockData.Stock || 'NA'}`,
            `200 Day Average Change Percent: ${DBStockData.twoHundredDayAverageChangePercent || 'NA'}`,
            `52 Week Change Percent: ${DBStockData.fiftyTwoWeekChangePercent || 'NA'}`,
            `Earnings Timestamp End: ${DBStockData.earningsTimestampEnd || 'NA'}`,
            `Regular Market Day Range: ${DBStockData.regularMarketDayRange || 'NA'}`,
            `EPS Forward: ${DBStockData.epsForward || 'NA'}`,
            `Regular Market Day High: ${DBStockData.regularMarketDayHigh || 'NA'}`,
            `200 Day Average Change: ${DBStockData.twoHundredDayAverageChange || 'NA'}`,
            `Ask Size: ${DBStockData.askSize || 'NA'}`,
            `200 Day Average: ${DBStockData.twoHundredDayAverage || 'NA'}`,
            `Book Value: ${DBStockData.bookValue || 'NA'}`,
            `Market Cap: ${DBStockData.marketCap || 'NA'}`,
            `52 Week High Change: ${DBStockData.fiftyTwoWeekHighChange || 'NA'}`,
            `52 Week Range: ${DBStockData.fiftyTwoWeekRange || 'NA'}`,
            `50 Day Average Change: ${DBStockData.fiftyDayAverageChange || 'NA'}`,
            `Average Daily Volume 3 Month: ${DBStockData.averageDailyVolume3Month || 'NA'}`,
            `First Trade Date Milliseconds: ${DBStockData.firstTradeDateMilliseconds || 'NA'}`,
            `Exchange Data Delayed By: ${DBStockData.exchangeDataDelayedBy || 'NA'}`,
            `52 Week Change Percent: ${DBStockData.fiftyTwoWeekChangePercent || 'NA'}`,
            `Trailing Annual Dividend Rate: ${DBStockData.trailingAnnualDividendRate || 'NA'}`,
            `52 Week Low: ${DBStockData.fiftyTwoWeekLow || 'NA'}`,
            `Regular Market Volume: ${DBStockData.regularMarketVolume || 'NA'}`,
            `Market: ${DBStockData.market || 'NA'}`,
            `Message Board ID: ${DBStockData.messageBoardId || 'NA'}`,
            `Price Hint: ${DBStockData.priceHint || 'NA'}`,
            `Source Interval: ${DBStockData.sourceInterval || 'NA'}`,
            `Regular Market Day Low: ${DBStockData.regularMarketDayLow || 'NA'}`,
            `Exchange: ${DBStockData.exchange || 'NA'}`,
            `Short Name: ${DBStockData.shortName || 'NA'}`,
            `Region: ${DBStockData.region || 'NA'}`,
            `50 Day Average Change Percent: ${DBStockData.fiftyDayAverageChangePercent || 'NA'}`,
            `Full Exchange Name: ${DBStockData.fullExchangeName || 'NA'}`,
            `Earnings Timestamp Start: ${DBStockData.earningsTimestampStart?.raw || 'NA'}`,
            `Financial Currency: ${DBStockData.financialCurrency || 'NA'}`,
            `GMT Offset Milliseconds: ${DBStockData.gmtOffSetMilliseconds || 'NA'}`,
            `Regular Market Open: ${DBStockData.regularMarketOpen || 'NA'}`,
            `Regular Market Time: ${DBStockData.regularMarketTime || 'NA'}`,
            `Regular Market Change Percent: ${DBStockData.regularMarketChangePercent || 'NA'}`,
            `Trailing Annual Dividend Yield: ${DBStockData.trailingAnnualDividendYield || 'NA'}`,
            `Quote Type: ${DBStockData.quoteType || 'NA'}`,
            `Average Daily Volume 10 Day: ${DBStockData.averageDailyVolume10Day || 'NA'}`,
            `52 Week Low Change: ${DBStockData.fiftyTwoWeekLowChange || 'NA'}`,
            `52 Week High Change Percent: ${DBStockData.fiftyTwoWeekHighChangePercent || 'NA'}`,
            `Type Display: ${DBStockData.typeDisp || 'NA'}`,
            `Tradeable: ${DBStockData.tradeable || 'NA'}`,
            `Currency: ${DBStockData.currency || 'NA'}`,
            `Shares Outstanding: ${DBStockData.sharesOutstanding || 'NA'}`,
            `Regular Market Previous Close: ${DBStockData.regularMarketPreviousClose || 'NA'}`,
            `52 Week High: ${DBStockData.fiftyTwoWeekHigh || 'NA'}`,
            `Exchange Timezone Name: ${DBStockData.exchangeTimezoneName || 'NA'}`,
            `Bid Size: ${DBStockData.bidSize || 'NA'}`,
            `Regular Market Change: ${DBStockData.regularMarketChange?.raw || 'NA'}`,
            `Crypto Tradeable: ${DBStockData.cryptoTradeable || 'NA'}`,
            `50 Day Average: ${DBStockData.fiftyDayAverage || 'NA'}`,
            `Exchange Timezone Short Name: ${DBStockData.exchangeTimezoneShortName || 'NA'}`,
            `Regular Market Price: ${DBStockData.regularMarketPrice || 'NA'}`,
            `Custom Price Alert Confidence: ${DBStockData.customPriceAlertConfidence || 'NA'}`,
            `Market State: ${DBStockData.marketState || 'NA'}`,
            `Forward PE: ${DBStockData.forwardPE || 'NA'}`,
            `Ask: ${DBStockData.ask || 'NA'}`,
            `EPS Trailing Twelve Months: ${DBStockData.epsTrailingTwelveMonths || 'NA'}`,
            // `Bid: ${DBStockData || 'NA'}`,
            `Triggerable: ${DBStockData.triggerable || 'NA'}`,
            `Price to Book: ${DBStockData.priceToBook || 'NA'}`,
            `Long Name: ${DBStockData.longName || 'NA'}`,
                    
            // News Data
            'Title:News Data',


            `News 1 Title: ${DBStockData?.['get-news']?.data?.main?.stream[0]?.content?.title || 'NA'}`,
            `News 1 Link: ${DBStockData?.['get-news']?.data?.main?.stream[0]?.content?.clickThroughUrl?.url || 'NA'}`,
            
            `News 2 Title: ${DBStockData?.['get-news']?.data?.main?.stream[1]?.content?.title || 'NA'}`,
            `News 2 Link: ${DBStockData?.['get-news']?.data?.main?.stream[1]?.content?.clickThroughUrl?.url || 'NA'}`,
            
            `News 3 Title: ${DBStockData?.['get-news']?.data?.main?.stream[2]?.content?.title || 'NA'}`,
            `News 3 Link: ${DBStockData?.['get-news']?.data?.main?.stream[2]?.content?.clickThroughUrl?.url || 'NA'}`,

            `News 4 Title: ${DBStockData?.['get-news']?.data?.main?.stream[3]?.content?.title || 'NA'}`,
            `News 4 Link: ${DBStockData?.['get-news']?.data?.main?.stream[3]?.content?.clickThroughUrl?.url || 'NA'}`,


            //Key Statistics 
            'Title:Key Statistics',

            `Symbol: ${DBStockData.keyStatistics.symbol || 'NA'}`,
            `200 Day Average Change Percent: ${DBStockData.keyStatistics.twoHundredDayAverageChangePercent?.raw || 'NA'}`,
            `52 Week Low Change Percent: ${DBStockData.keyStatistics.fiftyTwoWeekLowChangePercent?.raw || 'NA'}`,
            `Language: ${DBStockData.keyStatistics.language || 'NA'}`,
            `Regular Market Day Range: ${DBStockData.keyStatistics.regularMarketDayRange?.raw || 'NA'}`,
            `Earnings Timestamp End: ${DBStockData.keyStatistics.earningsTimestampEnd?.raw || 'NA'}`,
            `EPS Forward: ${DBStockData.keyStatistics.epsForward?.raw || 'NA'}`,
            `Regular Market Day High: ${DBStockData.keyStatistics.regularMarketDayHigh?.raw || 'NA'}`,
            `200 Day Average Change: ${DBStockData.keyStatistics.twoHundredDayAverageChange?.raw || 'NA'}`,
            `200 Day Average: ${DBStockData.keyStatistics.twoHundredDayAverage?.raw || 'NA'}`,
            `Ask Size: ${DBStockData.keyStatistics.askSize?.raw || 'NA'}`,
            `Book Value: ${DBStockData.keyStatistics.bookValue?.raw || 'NA'}`,
            `Market Cap: ${DBStockData.keyStatistics.marketCap?.raw || 'NA'}`,
            `52 Week High Change: ${DBStockData.keyStatistics.fiftyTwoWeekHighChange?.raw || 'NA'}`,
            `52 Week Range: ${DBStockData.keyStatistics.fiftyTwoWeekRange?.raw || 'NA'}`,
            `50 Day Average Change: ${DBStockData.keyStatistics.fiftyDayAverageChange?.raw || 'NA'}`,
            `Exchange Data Delayed By: ${DBStockData.keyStatistics.exchangeDataDelayedBy || 'NA'}`,
            `First Trade Date Milliseconds: ${DBStockData.keyStatistics.firstTradeDateMilliseconds || 'NA'}`,
            `Average Daily Volume 3 Month: ${DBStockData.keyStatistics.averageDailyVolume3Month?.raw || 'NA'}`,
            `Trailing Annual Dividend Rate: ${DBStockData.keyStatistics.trailingAnnualDividendRate?.raw || 'NA'}`,
            `52 Week Change Percent: ${DBStockData.keyStatistics.fiftyTwoWeekChangePercent?.raw || 'NA'}`,
            `52 Week Low: ${DBStockData.keyStatistics.fiftyTwoWeekLow?.raw || 'NA'}`,
            `Regular Market Volume: ${DBStockData.keyStatistics.regularMarketVolume?.raw || 'NA'}`,
            `Market: ${DBStockData.keyStatistics.market || 'NA'}`,
            `Quote Source Name: ${DBStockData.keyStatistics.quoteSourceName || 'NA'}`,
            `Message Board ID: ${DBStockData.keyStatistics.messageBoardId || 'NA'}`,
            `Price Hint: ${DBStockData.keyStatistics.priceHint || 'NA'}`,
            `Exchange: ${DBStockData.keyStatistics.exchange || 'NA'}`,
            `Source Interval: ${DBStockData.keyStatistics.sourceInterval || 'NA'}`,
            `Regular Market Day Low: ${DBStockData.keyStatistics.regularMarketDayLow?.raw || 'NA'}`,
            `Region: ${DBStockData.keyStatistics.region || 'NA'}`,
            `Short Name: ${DBStockData.keyStatistics.shortName || 'NA'}`,
            `50 Day Average Change Percent: ${DBStockData.keyStatistics.fiftyDayAverageChangePercent?.raw || 'NA'}`,
            `Full Exchange Name: ${DBStockData.keyStatistics.fullExchangeName || 'NA'}`,
            `Earnings Timestamp Start: ${DBStockData.keyStatistics.earningsTimestampStart?.raw || 'NA'}`,
            `Financial Currency: ${DBStockData.keyStatistics.financialCurrency || 'NA'}`,
            `GMT Offset Milliseconds: ${DBStockData.keyStatistics.gmtOffSetMilliseconds || 'NA'}`,
            `Regular Market Open: ${DBStockData.keyStatistics.regularMarketOpen?.raw || 'NA'}`,
            `Regular Market Time: ${DBStockData.keyStatistics.regularMarketTime?.raw || 'NA'}`,
            `Regular Market Change Percent: ${DBStockData.keyStatistics.regularMarketChangePercent?.raw || 'NA'}`,
            `Trailing Annual Dividend Yield: ${DBStockData.keyStatistics.trailingAnnualDividendYield?.raw || 'NA'}`,
            `Quote Type: ${DBStockData.keyStatistics.quoteType || 'NA'}`,
            `Average Daily Volume 10 Day: ${DBStockData.keyStatistics.averageDailyVolume10Day?.raw || 'NA'}`,
            `52 Week Low Change: ${DBStockData.keyStatistics.fiftyTwoWeekLowChange?.raw || 'NA'}`,
            `52 Week High Change Percent: ${DBStockData.keyStatistics.fiftyTwoWeekHighChangePercent?.raw || 'NA'}`,
            `Type Display: ${DBStockData.keyStatistics.typeDisp || 'NA'}`,
            `Tradeable: ${DBStockData.keyStatistics.tradeable || 'NA'}`,
            `Currency: ${DBStockData.keyStatistics.currency || 'NA'}`,
            `Shares Outstanding: ${DBStockData.keyStatistics.sharesOutstanding?.raw || 'NA'}`,
            `52 Week High: ${DBStockData.keyStatistics.fiftyTwoWeekHigh?.raw || 'NA'}`,
            `Regular Market Previous Close: ${DBStockData.keyStatistics.regularMarketPreviousClose?.raw || 'NA'}`,
            `Exchange Timezone Name: ${DBStockData.keyStatistics.exchangeTimezoneName || 'NA'}`,
            `Bid Size: ${DBStockData.keyStatistics.bidSize?.raw || 'NA'}`,
            `Regular Market Change: ${DBStockData.keyStatistics.regularMarketChange?.raw || 'NA'}`,
            `Crypto Tradeable: ${DBStockData.keyStatistics.cryptoTradeable || 'NA'}`,
            `50 Day Average: ${DBStockData.keyStatistics.fiftyDayAverage?.raw || 'NA'}`,
            `Exchange Timezone Short Name: ${DBStockData.keyStatistics.exchangeTimezoneShortName || 'NA'}`,
            `Custom Price Alert Confidence: ${DBStockData.keyStatistics.customPriceAlertConfidence || 'NA'}`,
            `Regular Market Price: ${DBStockData.keyStatistics.regularMarketPrice?.raw || 'NA'}`,
            `Market State: ${DBStockData.keyStatistics.marketState || 'NA'}`,
            `Forward PE: ${DBStockData.keyStatistics.forwardPE?.raw || 'NA'}`,
            `Ask: ${DBStockData.keyStatistics.ask?.raw || 'NA'}`,
            `EPS Trailing Twelve Months: ${DBStockData.keyStatistics.epsTrailingTwelveMonths?.raw || 'NA'}`,
            `Bid: ${DBStockData.keyStatistics.bid?.raw || 'NA'}`,
            `Triggerable: ${DBStockData.keyStatistics.triggerable || 'NA'}`,
            `Price to Book: ${DBStockData.keyStatistics.priceToBook?.raw || 'NA'}`,
            `Long Name: ${DBStockData.keyStatistics.longName || 'NA'}`,

            // Add the rest of your lines here...
        ];
        
        console.log('lines', lines);
        // Iterate through lines and draw text, handling titles differently
        lines.forEach(line => {
            if (line.startsWith('Title:')) {
                // This line is a title, so strip 'Title:' and format it differently
                const title = line.substring(6); // Remove 'Title:' prefix
                const titleSize = 16; // Larger font size for titles
                const titleColor = rgb(0, 0, 0.8); // Different color for titles, for example

                if (yPosition < 10) {
                    page = pdfDoc.addPage();
                    yPosition = page.getHeight() - 40;
                }

                addSectionTitle(page, title, xPosition, yPosition, timesRomanFont, titleSize, titleColor);
                yPosition -= 22; // Extra space after a title
            } else {
                // Regular line, draw as before
                if (yPosition < 10) {
                    page = pdfDoc.addPage();
                    yPosition = page.getHeight() - 40;
                }
                
                page.drawText(line, {
                    x: xPosition,
                    y: yPosition,
                    size: fontSize,
                    font: timesRomanFont,
                    color: rgb(0, 0, 0),
                });
                
                yPosition -= 18; // Standard spacing for regular lines
            }
        });

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // Upload the generated PDF to S3
        const stockSymbol = DBStockData.Stock || 'default';
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
    } else {
        return Response.json({ error: 'No data found for the given stock symbol.' });
    }

}

