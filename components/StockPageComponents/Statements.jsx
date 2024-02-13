import React, { useState } from 'react';
import StatementTable from './StatementTables';

const FinancialStatements = ({ data, data2 }) => {
    const [activeStatement, setActiveStatement] = useState('income');

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
    if (!data) {
        return (
            <div className="animate-pulse">
                <div className="bg-gray-200 h-64 w-full mt-4 rounded"></div>
            </div>
        );
    }

const balanceSheetData = activeStatement === 'balance' && data2 ? {
  endDate: data.balanceSheet.endDate?.fmt || 'N/A',
  TotalAssets: data2?.['get-balance']?.timeSeries?.annualTotalAssets[0]?.reportedValue?.fmt || 'Data not available',
  CashCashEquivalentsFederalFundsSold: data2?.['get-balance']?.timeSeries?.annualCashCashEquivalentsAndFederalFundsSold[0]?.reportedValue?.fmt || 'Data not available',
  CashAndCashEquivalents: data2?.['get-balance']?.timeSeries?.annualCashAndCashEquivalents[0]?.reportedValue?.fmt || 'Data not available',
  MoneyMarketInvestments: data2?.['get-balance']?.timeSeries?.annualMoneyMarketInvestments[0]?.reportedValue?.fmt || 'Data not available',
  SecuritiesAndInvestments: 'Data not available', // Assuming placeholder as instructed
  LongTermEquityInvestment: data2?.['get-balance']?.timeSeries?.annualLongTermEquityInvestment[0]?.reportedValue?.fmt || 'Data not available',
  DerivativeAssets: data2?.['get-balance']?.timeSeries?.annualDerivativeAssets[0]?.reportedValue?.fmt || 'Data not available',
  NetLoan: data2?.['get-balance']?.timeSeries?.annualNetLoan[0]?.reportedValue?.fmt || 'Data not available',
  Receivables: data2?.['get-balance']?.timeSeries?.annualReceivables[0]?.reportedValue?.fmt || 'Data not available',
  PrepaidAssets: data2?.['get-balance']?.timeSeries?.annualPrepaidAssets[0]?.reportedValue?.fmt || 'Data not available',
  NetPPE: data2?.['get-balance']?.timeSeries?.annualNetPPE[0]?.reportedValue?.fmt || 'Data not available',
  GoodwillAndOtherIntangibleAssets: data2?.['get-balance']?.timeSeries?.annualGoodwillAndOtherIntangibleAssets[0]?.reportedValue?.fmt || 'Data not available',
  DeferredAssets: 'Data not available', // Placeholder
  DefinedPensionBenefit: data2?.['get-balance']?.timeSeries?.annualDefinedPensionBenefit[0]?.reportedValue?.fmt || 'Data not available',
  AssetsHeldForSale: data2?.['get-balance']?.timeSeries?.annualAssetsHeldForSale[0]?.reportedValue?.fmt || 'Data not available',
  OtherAssets: data2?.['get-balance']?.timeSeries?.annualOtherAssets[0]?.reportedValue?.fmt || 'Data not available',
  TotalLiabilitiesNetMinorityInterest: data2?.['get-balance']?.timeSeries?.annualTotalLiabilitiesNetMinorityInterest[0]?.reportedValue?.fmt || 'Data not available',
  TotalDeposits: data2?.['get-balance']?.timeSeries?.annualTotalDeposits[0]?.reportedValue?.fmt || 'Data not available',
  PayablesAndAccruedExpenses: 'Data not available', // Placeholder
  CurrentDebtAndCapitalLeaseObligation: 'Data not available', // Placeholder
  TradingLiabilities: data2?.['get-balance']?.timeSeries?.annualTradingLiabilities[0]?.reportedValue?.fmt || 'Data not available',
  DerivativeProductLiabilities: data2?.['get-balance']?.timeSeries?.annualDerivativeProductLiabilities[0]?.reportedValue?.fmt || 'Data not available',
  LongTermDebtAndCapitalLeaseObligation: data2?.['get-balance']?.timeSeries?.annualLongTermDebtAndCapitalLeaseObligation[0]?.reportedValue?.fmt || 'Data not available',
  CurrentProvisions: 'Data not available', // Placeholder
  EmployeeBenefits: 'Data not available', // Placeholder
  CurrentDeferredLiabilities: 'Data not available', // Placeholder
  LiabilitiesOfDiscontinuedOperations: 'Data not available', // Placeholder
  OtherLiabilities: data2?.['get-balance']?.timeSeries?.annualOtherLiabilities[0]?.reportedValue?.fmt || 'Data not available',
  TotalEquityGrossMinorityInterest: data2?.['get-balance']?.timeSeries?.annualTotalEquityGrossMinorityInterest[0]?.reportedValue?.fmt || 'Data not available',
  StockholdersEquity: data2?.['get-balance']?.timeSeries?.annualStockholdersEquity[0]?.reportedValue?.fmt || 'Data not available',
  MinorityInterest: data2?.['get-balance']?.timeSeries?.annualMinorityInterest[0]?.reportedValue?.fmt || 'Data not available',
  TotalCapitalization: data2?.['get-balance']?.timeSeries?.annualTotalCapitalization[0]?.reportedValue?.fmt || 'Data not available',
  CommonStockEquity: data2?.['get-balance']?.timeSeries?.annualCommonStockEquity[0]?.reportedValue?.fmt || 'Data not available',
  NetTangibleAssets: data2?.['get-balance']?.timeSeries?.annualNetTangibleAssets[0]?.reportedValue?.fmt || 'Data not available',
  InvestedCapital: data2?.['get-balance']?.timeSeries?.annualInvestedCapital[0]?.reportedValue?.fmt || 'Data not available',
  TangibleBookValue: data2?.['get-balance']?.timeSeries?.annualTangibleBookValue[0]?.reportedValue?.fmt || 'Data not available',
  TotalDebt: data2?.['get-balance']?.timeSeries?.annualTotalDebt[0]?.reportedValue?.fmt || 'Data not available',
  NetDebt: data2?.['get-balance']?.timeSeries?.annualNetDebt[0]?.reportedValue?.fmt || 'Data not available',
  // Assuming placeholders for share data
  ShareIssued: 'Data not available',
  OrdinarySharesNumber: 'Data not available',
  TreasurySharesNumber: 'Data not available',
}: null;



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
            <div className="flex justify-center  mt-8 mb-4">
                <div className="inline-block rounded-full" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)', padding: '3px' }}>
                    {renderTab("Balance Sheet", "balance")}
                    {renderTab("Income Statement", "income")}
                    {renderTab("Cash Flow", "cash")}
                </div>
            </div>
            {activeStatement === 'balance' && balanceSheetData
                ? <StatementTable data={balanceSheetData} statementType="balance" />
                : activeStatement === 'income' && incomeStatementData
                ? <StatementTable data={incomeStatementData} statementType="income" />
                : activeStatement === 'cash' && cashflowData
                ? <StatementTable data={cashflowData} statementType="cash" />
                : <div>data not available for the selected statement.</div>
            }
        </div>
    );
};

export default FinancialStatements;

