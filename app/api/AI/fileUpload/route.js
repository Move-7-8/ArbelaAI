import AWS from 'aws-sdk';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Path: app/api/AI/fileUpload/route.js
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
    const businessSummaryText = `Business Summary: ${data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.longBusinessSummary || 'NA'}`;
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
    console.log(`Total Assets: ${findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTotalAssets, defaultReportedValue) || 'NA'}`);

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

        `Industry: ${data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.industry || 'NA'}`,
        `Website: ${data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.website }`,
        `fullTimeEmployees: ${data.data2?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.fullTimeEmployees }`,

        //Balance-Sheet
        'Title:Balance Sheet',

        `Investment In Financial Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInvestmentinFinancialAssets, defaultReportedValue) || 'NA') }`,
        `Other Equity Adjustments: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherEquityAdjustments, defaultReportedValue) || 'NA') }`,
        `Trading Securities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTradingSecurities, defaultReportedValue) || 'NA') }`,
        `Hedging Assets Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualHedgingAssetsCurrent, defaultReportedValue) || 'NA') }`,
        `Current Deferred Taxes Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentDeferredTaxesLiabilities, defaultReportedValue) || 'NA') }`,
        `Inventory: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInventory, defaultReportedValue) || 'NA') }`,
        `Current Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentLiabilities, defaultReportedValue) || 'NA') }`,
        `Finished Goods: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualFinishedGoods, defaultReportedValue) || 'NA') }`,
        `Construction In Progress: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualConstructionInProgress, defaultReportedValue) || 'NA') }`,
        `Investments And Advances: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInvestmentsAndAdvances, defaultReportedValue) || 'NA') }`,
        `Current Deferred Revenue: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentDeferredRevenue, defaultReportedValue) || 'NA') }`,
        `Long Term Provisions: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLongTermProvisions, defaultReportedValue) || 'NA') }`,
        `Share Issued: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualShareIssued, defaultReportedValue) || 'NA') }`,
        `Machinery Furniture Equipment: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualMachineryFurnitureEquipment, defaultReportedValue) || 'NA') }`,
        `Receivables Adjustments Allowances: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualReceivablesAdjustmentsAllowances, defaultReportedValue) || 'NA') }`,
        `Current Debt: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentDebt, defaultReportedValue) || 'NA') }`,
        `Other Capital Stock: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherCapitalStock, defaultReportedValue) || 'NA') }`,
        `Total Non Current Liabilities Net Minority Interest: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTotalNonCurrentLiabilitiesNetMinorityInterest, defaultReportedValue) || 'NA') }`,
        `Gains Losses Not Affecting Retained Earnings: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualGainsLossesNotAffectingRetainedEarnings, defaultReportedValue) || 'NA') }`,
        `Other Intangible Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherIntangibleAssets, defaultReportedValue) || 'NA') }`,
        `Other Non Current Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherNonCurrentAssets, defaultReportedValue) || 'NA') }`,
        `Accumulated Depreciation: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualAccumulatedDepreciation, defaultReportedValue) || 'NA') }`,
        `Net PPE: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNetPPE, defaultReportedValue) || 'NA') }`,
        `Current Deferred Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentDeferredAssets, defaultReportedValue) || 'NA') }`,
        `Leases: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLeases, defaultReportedValue) || 'NA') }`,
        `Assets Held For Sale Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualAssetsHeldForSaleCurrent, defaultReportedValue) || 'NA') }`,
        `Total Liabilities Net Minority Interest: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTotalLiabilitiesNetMinorityInterest, defaultReportedValue) || 'NA') }`,
        `Current Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentAssets, defaultReportedValue) || 'NA') }`,
        `Tangible Book Value: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTangibleBookValue, defaultReportedValue) || 'NA') }`, // Duplicate, already present
        `Capital Lease Obligations: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCapitalLeaseObligations, defaultReportedValue) || 'NA') }`,
        `Cash Cash Equivalents And Short Term Investments: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCashCashEquivalentsAndShortTermInvestments, defaultReportedValue) || 'NA') }`,
        `Trade and Other Payables Non Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTradeandOtherPayablesNonCurrent, defaultReportedValue) || 'NA') }`,
        `Common Stock Equity: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCommonStockEquity, defaultReportedValue) || 'NA') }`,
        `Pension and Other Post Retirement Benefit Plans Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualPensionandOtherPostRetirementBenefitPlansCurrent, defaultReportedValue) || 'NA') }`,
        `Cash Financial: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCashFinancial, defaultReportedValue) || 'NA') }`,
        `Other Current Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherCurrentLiabilities, defaultReportedValue) || 'NA') }`,
        `Current Deferred Taxes Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentDeferredTaxesAssets, defaultReportedValue) || 'NA') }`,
        `Long Term Capital Lease Obligation: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLongTermCapitalLeaseObligation, defaultReportedValue) || 'NA') }`,
        `Non Current Pension And Other Postretirement Benefit Plans: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentPensionAndOtherPostretirementBenefitPlans, defaultReportedValue) || 'NA') }`,
        `Loans Receivable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLoansReceivable, defaultReportedValue) || 'NA') }`,
        `Current Capital Lease Obligation: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentCapitalLeaseObligation, defaultReportedValue) || 'NA') }`,
        `Retained Earnings: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualRetainedEarnings, defaultReportedValue) || 'NA') }`,
        `Common Stock: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCommonStock, defaultReportedValue) || 'NA') }`,
        `Dividends Payable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualDividendsPayable, defaultReportedValue) || 'NA') }`,
        `Current Provisions: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentProvisions, defaultReportedValue) || 'NA') }`,
        `Gross PPE: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualGrossPPE, defaultReportedValue) || 'NA') }`,
        `Net Tangible Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNetTangibleAssets, defaultReportedValue) || 'NA') }`,
        `Non Current Deferred Taxes Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredTaxesAssets, defaultReportedValue) || 'NA') }`,
        `Other Properties: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherProperties, defaultReportedValue) || 'NA') }`,
        `Non Current Deferred Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredAssets, defaultReportedValue) || 'NA') }`,
        `Other Receivables: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherReceivables, defaultReportedValue) || 'NA') }`,
        `Payables And Accrued Expenses: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualPayablesAndAccruedExpenses, defaultReportedValue) || 'NA') }`,
        `Other Short Term Investments: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherShortTermInvestments, defaultReportedValue) || 'NA') }`,
        `Non Current Accounts Receivable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentAccountsReceivable, defaultReportedValue) || 'NA') }`,
        `Invested Capital: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInvestedCapital, defaultReportedValue) || 'NA') }`, // Duplicate, already present
        `Other Current Borrowings: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherCurrentBorrowings, defaultReportedValue) || 'NA') }`,
        `Goodwill: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualGoodwill, defaultReportedValue) || 'NA') }`,
        `Current Deferred Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentDeferredLiabilities, defaultReportedValue) || 'NA') }`,
        `Net Debt: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNetDebt, defaultReportedValue) || 'NA') }`, // Duplicate, already present
        `Other Current Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherCurrentAssets, defaultReportedValue) || 'NA') }`,
        `Capital Stock: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCapitalStock, defaultReportedValue) || 'NA') }`,
        `Other Investments: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherInvestments, defaultReportedValue) || 'NA') }`,
        `Accounts Receivable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualAccountsReceivable, defaultReportedValue) || 'NA') }`,
        `Foreign Currency Translation Adjustments: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualForeignCurrencyTranslationAdjustments, defaultReportedValue) || 'NA') }`,
        `Total Capitalization: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTotalCapitalization, defaultReportedValue) || 'NA') }`, // Duplicate, already present
        `Other Payable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherPayable, defaultReportedValue) || 'NA') }`,
        `Payables: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualPayables, defaultReportedValue) || 'NA') }`,
        `Total Non Current Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTotalNonCurrentAssets, defaultReportedValue) || 'NA') }`,
        `Accounts Payable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualAccountsPayable, defaultReportedValue) || 'NA') }`,
        `Non Current Deferred Revenue: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredRevenue, defaultReportedValue) || 'NA') }`,
        `Current Debt And Capital Lease Obligation: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentDebtAndCapitalLeaseObligation, defaultReportedValue) || 'NA') }`,
        `Land And Improvements: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLandAndImprovements, defaultReportedValue) || 'NA') }`,
        `Investments in Associates at Cost: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInvestmentsinAssociatesatCost, defaultReportedValue) || 'NA') }`,
        `Working Capital: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualWorkingCapital, defaultReportedValue) || 'NA') }`,
        `Non Current Deferred Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredLiabilities, defaultReportedValue) || 'NA') }`,
        `Employee Benefits: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualEmployeeBenefits, defaultReportedValue) || 'NA') }`,
        `Ordinary Shares Number: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOrdinarySharesNumber, defaultReportedValue) || 'NA') }`,
        `Long Term Debt: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLongTermDebt, defaultReportedValue) || 'NA') }`,
        `Total Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTotalAssets, defaultReportedValue) || 'NA') }`,
        `Inventories Adjustments Allowances: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInventoriesAdjustmentsAllowances, defaultReportedValue) || 'NA') }`,
        `Stockholders Equity: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualStockholdersEquity, defaultReportedValue) || 'NA') }`,
        `Non Current Deferred Taxes Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredTaxesLiabilities, defaultReportedValue) || 'NA') }`,
        `Properties: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualProperties, defaultReportedValue) || 'NA') }`,
        `Investment Properties: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInvestmentProperties, defaultReportedValue) || 'NA') }`,
        `Held To Maturity Securities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualHeldToMaturitySecurities, defaultReportedValue) || 'NA') }`,
        `Financial Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualFinancialAssets, defaultReportedValue) || 'NA') }`,
        `Due from Related Parties Non Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualDuefromRelatedPartiesNonCurrent, defaultReportedValue) || 'NA') }`,
        `Raw Materials: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualRawMaterials, defaultReportedValue) || 'NA') }`,
        `Non Current Accrued Expenses: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentAccruedExpenses, defaultReportedValue) || 'NA') }`,
        `Due to Related Parties Non Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualDuetoRelatedPartiesNonCurrent, defaultReportedValue) || 'NA') }`,
        `Interest Payable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInterestPayable, defaultReportedValue) || 'NA') }`,
        `Cash Equivalents: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCashEquivalents, defaultReportedValue) || 'NA') }`,
        `Taxes Receivable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTaxesReceivable, defaultReportedValue) || 'NA') }`,
        `Available For Sale Securities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualAvailableForSaleSecurities, defaultReportedValue) || 'NA') }`,
        `Non Current Prepaid Assets: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentPrepaidAssets, defaultReportedValue) || 'NA') }`,
        `Derivative Product Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualDerivativeProductLiabilities, defaultReportedValue) || 'NA') }`,
        `Treasury Shares Number: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTreasurySharesNumber, defaultReportedValue) || 'NA') }`,
        `Fixed Assets Revaluation Reserve: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualFixedAssetsRevaluationReserve, defaultReportedValue) || 'NA') }`,
        `Investments In Other Ventures Under Equity Method: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInvestmentsInOtherVenturesUnderEquityMethod, defaultReportedValue) || 'NA') }`,
        `Additional Paid In Capital: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualAdditionalPaidInCapital, defaultReportedValue) || 'NA') }`,
        `Due to Related Parties Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualDuetoRelatedPartiesCurrent, defaultReportedValue) || 'NA') }`,
        `Defined Pension Benefit: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualDefinedPensionBenefit, defaultReportedValue) || 'NA') }`,
        `Minimum Pension Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualMinimumPensionLiabilities, defaultReportedValue) || 'NA') }`,
        `Current Accrued Expenses: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentAccruedExpenses, defaultReportedValue) || 'NA') }`,
        `Restricted Common Stock: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualRestrictedCommonStock, defaultReportedValue) || 'NA') }`,
        `Buildings And Improvements: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualBuildingsAndImprovements, defaultReportedValue) || 'NA') }`,
        `Commercial Paper: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCommercialPaper, defaultReportedValue) || 'NA') }`,
        `Preferred Stock: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualPreferredStock, defaultReportedValue) || 'NA') }`,
        `Other Non Current Liabilities: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherNonCurrentLiabilities, defaultReportedValue) || 'NA') }`,
        `Other Equity Interest: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherEquityInterest, defaultReportedValue) || 'NA') }`,
        `General Partnership Capital: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualGeneralPartnershipCapital, defaultReportedValue) || 'NA') }`,
        `Investments in Joint Ventures at Cost: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInvestmentsinJointVenturesatCost, defaultReportedValue) || 'NA') }`,
        `Line Of Credit: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLineOfCredit, defaultReportedValue) || 'NA') }`,
        `Income Tax Payable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualIncomeTaxPayable, defaultReportedValue) || 'NA') }`,
        `Preferred Shares Number: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualPreferredSharesNumber, defaultReportedValue) || 'NA') }`,
        `Investments in Subsidiaries at Cost: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualInvestmentsinSubsidiariesatCost, defaultReportedValue) || 'NA') }`,
        `Limited Partnership Capital: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLimitedPartnershipCapital, defaultReportedValue) || 'NA') }`,
        `Other Inventories: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualOtherInventories, defaultReportedValue) || 'NA') }`,
        `Restricted Cash: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualRestrictedCash, defaultReportedValue) || 'NA') }`,
        `Financial Assets Designated as Fair Value Through Profit or Loss Total: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualFinancialAssetsDesignatedasFairValueThroughProfitorLossTotal, defaultReportedValue) || 'NA') }`,
        `Preferred Securities Outside Stock Equity: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualPreferredSecuritiesOutsideStockEquity, defaultReportedValue) || 'NA') }`,
        `Preferred Stock Equity: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualPreferredStockEquity, defaultReportedValue) || 'NA') }`,
        `Due from Related Parties Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualDuefromRelatedPartiesCurrent, defaultReportedValue) || 'NA') }`,
        `Allowance For Doubtful Accounts Receivable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualAllowanceForDoubtfulAccountsReceivable, defaultReportedValue) || 'NA') }`,
        `Unrealized Gain Loss: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualUnrealizedGainLoss, defaultReportedValue) || 'NA') }`,
        `Total Tax Payable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTotalTaxPayable, defaultReportedValue) || 'NA') }`,
        `Liabilities Held for Sale Non Current: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualLiabilitiesHeldforSaleNonCurrent, defaultReportedValue) || 'NA') }`,
        `Total Partnership Capital: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTotalPartnershipCapital, defaultReportedValue) || 'NA') }`,
        `Accrued Interest Receivable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualAccruedInterestReceivable, defaultReportedValue) || 'NA') }`,
        `Work In Process: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualWorkInProcess, defaultReportedValue) || 'NA') }`,
        `Gross Accounts Receivable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualGrossAccountsReceivable, defaultReportedValue) || 'NA') }`,
        `Non Current Note Receivables: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNonCurrentNoteReceivables, defaultReportedValue) || 'NA') }`,
        `Notes Receivable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualNotesReceivable, defaultReportedValue) || 'NA') }`,
        `Current Notes Payable: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualCurrentNotesPayable, defaultReportedValue) || 'NA') }`,
        `Treasury Stock: ${ (findFirstValidData(data.data2?.['get-balance']?.timeSeries?.annualTreasuryStock, defaultReportedValue) || 'NA') }`,
        
        //Income Statement 
        'Title:Income Statement',

        `Trailing Basic Average Shares: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingBasicAverageShares, defaultReportedValue) || 'NA') }`,
        `Trailing Basic EPS: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingBasicEPS, defaultReportedValue) || 'NA') }`,
        `Trailing Cost Of Revenue: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingCostOfRevenue, defaultReportedValue) || 'NA') }`,
        `Trailing Diluted Average Shares: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingDilutedAverageShares, defaultReportedValue) || 'NA') }`,
        `Trailing Diluted EPS: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingDilutedEPS, defaultReportedValue) || 'NA') }`,
        `Trailing Gross Profit: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingGrossProfit, defaultReportedValue) || 'NA') }`,
        `Trailing Interest Expense: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingInterestExpense, defaultReportedValue) || 'NA') }`,
        `Trailing Net Income: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingNetIncome, defaultReportedValue) || 'NA') }`,
        `Trailing Net Income Common Stockholders: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingNetIncomeCommonStockholders, defaultReportedValue) || 'NA') }`,
        `Trailing Net Income Continuous Operations: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingNetIncomeContinuousOperations, defaultReportedValue) || 'NA') }`,
        `Trailing Operating Expense: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingOperatingExpense, defaultReportedValue) || 'NA') }`,
        `Trailing Operating Income: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingOperatingIncome, defaultReportedValue) || 'NA') }`,
        `Trailing Other Income Expense: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingOtherIncomeExpense, defaultReportedValue) || 'NA') }`,
        `Trailing Pretax Income: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingPretaxIncome, defaultReportedValue) || 'NA') }`,
        `Trailing Research And Development: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingResearchAndDevelopment, defaultReportedValue) || 'NA') }`,
        `Trailing Selling General And Administration: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingSellingGeneralAndAdministration, defaultReportedValue) || 'NA') }`,
        `Trailing Tax Provision: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingTaxProvision, defaultReportedValue) || 'NA') }`,
        `Trailing Total Revenue: ${ (findFirstValidData(data.data2?.['get-income']?.timeSeries?.trailingTotalRevenue, defaultReportedValue) || 'NA') }`,

        
        //Cash Flow Statement
        'Title:Cash Flow Statement',

        `Beginning Cash Position: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingBeginningCashPosition, defaultReportedValue) || 'NA') }`,
        `Capital Expenditure: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingCapitalExpenditure, defaultReportedValue) || 'NA') }`,
        `Cash Dividends Paid: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingCashDividendsPaid, defaultReportedValue) || 'NA') }`,
        `Cash Flow From Continuing Financing Activities: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingCashFlowFromContinuingFinancingActivities, defaultReportedValue) || 'NA') }`,
        `Change In Account Payable: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingChangeInAccountPayable, defaultReportedValue) || 'NA') }`,
        `Change In Cash Supplemental As Reported: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingChangeInCashSupplementalAsReported, defaultReportedValue) || 'NA') }`,
        `Change In Inventory: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingChangeInInventory, defaultReportedValue) || 'NA') }`,
        `Change In Working Capital: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingChangeInWorkingCapital, defaultReportedValue) || 'NA') }`,
        `Changes In Account Receivables: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingChangesInAccountReceivables, defaultReportedValue) || 'NA') }`,
        `Common Stock Issuance: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingCommonStockIssuance, defaultReportedValue) || 'NA') }`,
        `Deferred Income Tax: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingDeferredIncomeTax, defaultReportedValue) || 'NA') }`,
        `Depreciation And Amortization: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingDepreciationAndAmortization, defaultReportedValue) || 'NA') }`,
        `End Cash Position: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingEndCashPosition, defaultReportedValue) || 'NA') }`,
        `Free Cash Flow: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingFreeCashFlow, defaultReportedValue) || 'NA') }`,
        `Investing Cash Flow: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingInvestingCashFlow, defaultReportedValue) || 'NA') }`,
        `Net Income: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingNetIncome, defaultReportedValue) || 'NA') }`,
        `Net Other Financing Charges: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingNetOtherFinancingCharges, defaultReportedValue) || 'NA') }`,
        `Net Other Investing Changes: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingNetOtherInvestingChanges, defaultReportedValue) || 'NA') }`,
        `Operating Cash Flow: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingOperatingCashFlow, defaultReportedValue) || 'NA') }`,
        `Other Non Cash Items: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingOtherNonCashItems, defaultReportedValue) || 'NA') }`,
        `Purchase Of Business: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingPurchaseOfBusiness, defaultReportedValue) || 'NA') }`,
        `Purchase Of Investment: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingPurchaseOfInvestment, defaultReportedValue) || 'NA') }`,
        `Repayment Of Debt: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingRepaymentOfDebt, defaultReportedValue) || 'NA') }`,
        `Repurchase Of Capital Stock: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingRepurchaseOfCapitalStock, defaultReportedValue) || 'NA') }`,
        `Sale Of Investment: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingSaleOfInvestment, defaultReportedValue) || 'NA') }`,
        `Stock Based Compensation: ${ (findFirstValidData(data.data2?.['get-cashflow']?.timeSeries?.trailingStockBasedCompensation, defaultReportedValue) || 'NA') }`,
        

        // Price Data
        'Title:Price Data',

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
                
        // News Data
        'Title:News Data',


        `News 1 Title: ${data.data2?.['get-news']?.data?.main?.stream[0]?.content?.title || 'NA'}`,
        `News 1 Link: ${data.data2?.['get-news']?.data?.main?.stream[0]?.content?.clickThroughUrl?.url || 'NA'}`,
        
        `News 2 Title: ${data.data2?.['get-news']?.data?.main?.stream[1]?.content?.title || 'NA'}`,
        `News 2 Link: ${data.data2?.['get-news']?.data?.main?.stream[1]?.content?.clickThroughUrl?.url || 'NA'}`,
        
        `News 3 Title: ${data.data2?.['get-news']?.data?.main?.stream[2]?.content?.title || 'NA'}`,
        `News 3 Link: ${data.data2?.['get-news']?.data?.main?.stream[2]?.content?.clickThroughUrl?.url || 'NA'}`,

        `News 4 Title: ${data.data2?.['get-news']?.data?.main?.stream[3]?.content?.title || 'NA'}`,
        `News 4 Link: ${data.data2?.['get-news']?.data?.main?.stream[3]?.content?.clickThroughUrl?.url || 'NA'}`,


        //Key Statistics 
        'Title:Key Statistics',

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

