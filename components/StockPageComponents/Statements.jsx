import React, { useState } from 'react';
import StatementTable from './StatementTables';

const FinancialStatements = ({ data, data2 }) => {
    const [activeStatement, setActiveStatement] = useState('balance');

        // Log the entire data object
    // console.log('Full Data:', data);

    // Check if balanceSheet and financeAnalytics are present in the data
    // console.log('Balance Sheet Data:', data?.balanceSheet);
    // console.log('Finance Analytics Data:', data?.financeAnalytics);
    


const renderTab = (title, statementType) => {

         const isActive = activeStatement === statementType;
    const buttonClass = `text-sm mr-2 px-3 py-1 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`;

       
      

        return (
            <button
                className={buttonClass}
       
                onClick={() => setActiveStatement(statementType)}
            >
                {title}
            </button>
        );
    };

    // If data is not available, render skeleton loader
    if (!data2) {
        return (
            <div className="animate-pulse">
                <div className="bg-gray-200 h-64 w-full mt-4 rounded"></div>
            </div>
        );
    }
const findFirstValidData = (array, defaultValue) => {
  if (!Array.isArray(array)) return defaultValue.reportedValue.fmt;
  for (let item of array) {
    if (item && item.reportedValue && typeof item.reportedValue.fmt === 'string') {
      return item.reportedValue.fmt;
    }
  }
  return defaultValue.reportedValue.fmt; // Ensure this returns a string
};

const defaultReportedValue = { reportedValue: { fmt: 'Data not available' } };

const balanceSheetData = activeStatement === 'balance' && data2 ? {
  endDate: data.balanceSheet.endDate?.fmt || 'N/A',
  TotalAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalAssets, defaultReportedValue),
  CashCashEquivalentsFederalFundsSold: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCashCashEquivalentsAndFederalFundsSold, defaultReportedValue),
  CashAndCashEquivalents: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCashAndCashEquivalents, defaultReportedValue),
  MoneyMarketInvestments: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualMoneyMarketInvestments, defaultReportedValue),
  LongTermEquityInvestment: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLongTermEquityInvestment, defaultReportedValue),
  DerivativeAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDerivativeAssets, defaultReportedValue),
  NetLoan: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetLoan, defaultReportedValue),
  Receivables: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualReceivables, defaultReportedValue),
  PrepaidAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPrepaidAssets, defaultReportedValue),
  NetPPE: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetPPE, defaultReportedValue),
  GoodwillAndOtherIntangibleAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualGoodwillAndOtherIntangibleAssets, defaultReportedValue),
  DefinedPensionBenefit: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDefinedPensionBenefit, defaultReportedValue),
  AssetsHeldForSale: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAssetsHeldForSale, defaultReportedValue),
  OtherAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherAssets, defaultReportedValue),
  TotalLiabilitiesNetMinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalLiabilitiesNetMinorityInterest, defaultReportedValue),
  TotalDeposits: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalDeposits, defaultReportedValue),
  TradingLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTradingLiabilities, defaultReportedValue),
  DerivativeProductLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDerivativeProductLiabilities, defaultReportedValue),
  LongTermDebtAndCapitalLeaseObligation: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLongTermDebtAndCapitalLeaseObligation, defaultReportedValue),
  OtherLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherLiabilities, defaultReportedValue),
  TotalEquityGrossMinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalEquityGrossMinorityInterest, defaultReportedValue),
  StockholdersEquity: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualStockholdersEquity, defaultReportedValue),
  MinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualMinorityInterest, defaultReportedValue),
  TotalCapitalization: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalCapitalization, defaultReportedValue),
  CommonStockEquity: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCommonStockEquity, defaultReportedValue),
  NetTangibleAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetTangibleAssets, defaultReportedValue),
  InvestedCapital: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestedCapital, defaultReportedValue),
  TangibleBookValue: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTangibleBookValue, defaultReportedValue),
  TotalDebt: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalDebt, defaultReportedValue),
  NetDebt: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetDebt, defaultReportedValue),
  // Static placeholders
  SecuritiesAndInvestments: 'Data not available',
  DeferredAssets: 'Data not available',
  PayablesAndAccruedExpenses: 'Data not available',
  CurrentDebtAndCapitalLeaseObligation: 'Data not available',
  CurrentProvisions: 'Data not available',
  EmployeeBenefits: 'Data not available',
  CurrentDeferredLiabilities: 'Data not available',
  LiabilitiesOfDiscontinuedOperations: 'Data not available',
  ShareIssued: 'Data not available',
  OrdinarySharesNumber: 'Data not available',
  TreasurySharesNumber: 'Data not available',
} : null;



// const balanceSheetData = activeStatement === 'balance' && data2 ? {
//   endDate: data.balanceSheet.endDate?.fmt || 'N/A',
//   TotalAssets: safeAccessArray(data2?.['get-balance']?.timeSeries?.annualTotalAssets, 0, defaultReportedValue).reportedValue.fmt,
//   CashCashEquivalentsFederalFundsSold: safeAccessArray(data2?.['get-balance']?.timeSeries?.annualCashCashEquivalentsAndFederalFundsSold, 0, defaultReportedValue).reportedValue.fmt,
//   CashAndCashEquivalents: data2?.['get-balance']?.timeSeries?.annualCashAndCashEquivalents[0]?.reportedValue?.fmt || 'Data not available',
//   MoneyMarketInvestments: data2?.['get-balance']?.timeSeries?.annualMoneyMarketInvestments[0]?.reportedValue?.fmt || 'Data not available',
//   SecuritiesAndInvestments: 'Data not available', // Assuming placeholder as instructed
//   LongTermEquityInvestment: data2?.['get-balance']?.timeSeries?.annualLongTermEquityInvestment[0]?.reportedValue?.fmt || 'Data not available',
//   DerivativeAssets: data2?.['get-balance']?.timeSeries?.annualDerivativeAssets[0]?.reportedValue?.fmt || 'Data not available',
//   NetLoan: data2?.['get-balance']?.timeSeries?.annualNetLoan[0]?.reportedValue?.fmt || 'Data not available',
//   Receivables: data2?.['get-balance']?.timeSeries?.annualReceivables[0]?.reportedValue?.fmt || 'Data not available',
//   PrepaidAssets: data2?.['get-balance']?.timeSeries?.annualPrepaidAssets[0]?.reportedValue?.fmt || 'Data not available',
//   NetPPE: data2?.['get-balance']?.timeSeries?.annualNetPPE[0]?.reportedValue?.fmt || 'Data not available',
//   GoodwillAndOtherIntangibleAssets: data2?.['get-balance']?.timeSeries?.annualGoodwillAndOtherIntangibleAssets[0]?.reportedValue?.fmt || 'Data not available',
//   DeferredAssets: 'Data not available', // Placeholder
//   DefinedPensionBenefit: data2?.['get-balance']?.timeSeries?.annualDefinedPensionBenefit[0]?.reportedValue?.fmt || 'Data not available',
//   AssetsHeldForSale: data2?.['get-balance']?.timeSeries?.annualAssetsHeldForSale[0]?.reportedValue?.fmt || 'Data not available',
//   OtherAssets: data2?.['get-balance']?.timeSeries?.annualOtherAssets[0]?.reportedValue?.fmt || 'Data not available',
//   TotalLiabilitiesNetMinorityInterest: data2?.['get-balance']?.timeSeries?.annualTotalLiabilitiesNetMinorityInterest[0]?.reportedValue?.fmt || 'Data not available',
//   TotalDeposits: data2?.['get-balance']?.timeSeries?.annualTotalDeposits[0]?.reportedValue?.fmt || 'Data not available',
//   PayablesAndAccruedExpenses: 'Data not available', // Placeholder
//   CurrentDebtAndCapitalLeaseObligation: 'Data not available', // Placeholder
//   TradingLiabilities: data2?.['get-balance']?.timeSeries?.annualTradingLiabilities[0]?.reportedValue?.fmt || 'Data not available',
//   DerivativeProductLiabilities: data2?.['get-balance']?.timeSeries?.annualDerivativeProductLiabilities[0]?.reportedValue?.fmt || 'Data not available',
//   LongTermDebtAndCapitalLeaseObligation: data2?.['get-balance']?.timeSeries?.annualLongTermDebtAndCapitalLeaseObligation[0]?.reportedValue?.fmt || 'Data not available',
//   CurrentProvisions: 'Data not available', // Placeholder
//   EmployeeBenefits: 'Data not available', // Placeholder
//   CurrentDeferredLiabilities: 'Data not available', // Placeholder
//   LiabilitiesOfDiscontinuedOperations: 'Data not available', // Placeholder
//   OtherLiabilities: data2?.['get-balance']?.timeSeries?.annualOtherLiabilities[0]?.reportedValue?.fmt || 'Data not available',
//   TotalEquityGrossMinorityInterest: data2?.['get-balance']?.timeSeries?.annualTotalEquityGrossMinorityInterest[0]?.reportedValue?.fmt || 'Data not available',
//   StockholdersEquity: data2?.['get-balance']?.timeSeries?.annualStockholdersEquity[0]?.reportedValue?.fmt || 'Data not available',
//   MinorityInterest: data2?.['get-balance']?.timeSeries?.annualMinorityInterest[0]?.reportedValue?.fmt || 'Data not available',
//   TotalCapitalization: data2?.['get-balance']?.timeSeries?.annualTotalCapitalization[0]?.reportedValue?.fmt || 'Data not available',
//   CommonStockEquity: data2?.['get-balance']?.timeSeries?.annualCommonStockEquity[0]?.reportedValue?.fmt || 'Data not available',
//   NetTangibleAssets: data2?.['get-balance']?.timeSeries?.annualNetTangibleAssets[0]?.reportedValue?.fmt || 'Data not available',
//   InvestedCapital: data2?.['get-balance']?.timeSeries?.annualInvestedCapital[0]?.reportedValue?.fmt || 'Data not available',
//   TangibleBookValue: data2?.['get-balance']?.timeSeries?.annualTangibleBookValue[0]?.reportedValue?.fmt || 'Data not available',
//   TotalDebt: data2?.['get-balance']?.timeSeries?.annualTotalDebt[0]?.reportedValue?.fmt || 'Data not available',
//   NetDebt: data2?.['get-balance']?.timeSeries?.annualNetDebt[0]?.reportedValue?.fmt || 'Data not available',
//   // Assuming placeholders for share data
//   ShareIssued: 'Data not available',
//   OrdinarySharesNumber: 'Data not available',
//   TreasurySharesNumber: 'Data not available',
// }: null;



 const incomeStatementData = activeStatement === 'income' && data.financeAnalytics ? {
    endDate: data.balanceSheet.endDate?.fmt || 'N/A',
    totalRevenue: data.financeAnalytics.totalRevenue?.longFmt || 'Data not available',
    grossProfits: data.financeAnalytics.grossProfits?.longFmt || 'Data not available',
    ebitda: data.financeAnalytics.ebitda?.longFmt || 'Data not available',
    operatingMargins: data.financeAnalytics.operatingMargins?.fmt || 'Data not available',
    profitMargins: data.financeAnalytics.profitMargins?.fmt || 'Data not available',
    earningsGrowth: data.financeAnalytics.earningsGrowth?.fmt || 'Data not available',
    revenueGrowth: data.financeAnalytics.revenueGrowth?.fmt || 'Data not available',
    operatingCashflow: data.financeAnalytics.operatingCashflow?.longFmt || 'Data not available',
    returnOnAssets: data.financeAnalytics.returnOnAssets?.fmt || 'Data not available',
    returnOnEquity: data.financeAnalytics.returnOnEquity?.fmt || 'Data not available',
    revenuePerShare: data.financeAnalytics.revenuePerShare?.fmt || 'Data not available',
    totalCash: data.financeAnalytics.totalCash?.longFmt || 'Data not available',
    totalCashPerShare: data.financeAnalytics.totalCashPerShare?.fmt || 'Data not available',
    totalDebt: data.financeAnalytics.totalDebt?.longFmt || 'Data not available',
    debtToEquity: data.financeAnalytics.debtToEquity?.fmt || 'Data not available',
    currentRatio: data.financeAnalytics.currentRatio?.fmt || 'Data not available',
    quickRatio: data.financeAnalytics.quickRatio?.fmt || 'Data not available',
    freeCashflow: data.financeAnalytics.freeCashflow?.longFmt || 'Data not available',
    grossMargins: data.financeAnalytics.grossMargins?.fmt || 'Data not available',
    ebitdaMargins: data.financeAnalytics.ebitdaMargins?.fmt || 'Data not available',
    // Add other fields if available
} : null;


 const cashflowData = activeStatement === 'cash' && data.financeAnalytics  ? {
    endDate: data.balanceSheet.endDate?.fmt || 'N/A',
    operatingCashflow: data.financeAnalytics.operatingCashflow?.longFmt || 'Data not available',
    totalCash: data.financeAnalytics.totalCash?.longFmt || 'Data not available',
    totalCashPerShare: data.financeAnalytics.totalCashPerShare?.fmt || 'Data not available',
    totalDebt: data.financeAnalytics.totalDebt?.longFmt || 'Data not available',
    debtToEquity: data.financeAnalytics.debtToEquity?.fmt || 'Data not available',
    freeCashflow: data.financeAnalytics.freeCashflow?.longFmt || 'Data not available',


    // Add other fields if available
} : null;







return (
<div>
    <div className="flex justify-center mt-8 mb-4">
        <div className="inline-flex rounded-full bg-gray-200 p-1 space-x-2"> {/* Use inline-flex and space-x for consistent spacing */}
            {renderTab("Balance Sheet", "balance")}
            {renderTab("Income Statement", "income")}
            {renderTab("Cash Flow", "cash")}
        </div>
    </div>
    <div className="flex flex-col space-y-4 mb-4"> {/* This is good for vertical spacing */}
        {activeStatement === 'balance' && balanceSheetData
            ? <StatementTable data={balanceSheetData} statementType="balance" />
            : activeStatement === 'income' && incomeStatementData
            ? <StatementTable data={incomeStatementData} statementType="income" />
            : activeStatement === 'cash' && cashflowData
            ? <StatementTable data={cashflowData} statementType="cash" />
            : <div className="text-center">Data not available for the selected statement.</div> // Center-align the fallback text
        }
    </div>
</div>

);

};

export default FinancialStatements;

