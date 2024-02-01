import React, { useState } from 'react';
import StatementTable from './StatementTables';

const FinancialStatements = ({ data }) => {
    const [activeStatement, setActiveStatement] = useState('income');

        // Log the entire data object
    console.log('Full Data:', data);

    // Check if balanceSheet and financeAnalytics are present in the data
    console.log('Balance Sheet Data:', data?.balanceSheet);
    console.log('Finance Analytics Data:', data?.financeAnalytics);
    


const renderTab = (title, statementType) => {

         const isActive = activeStatement === statementType;
    const buttonClass = `text-sm mr-2 px-3 py-1 rounded ${isActive ? 'bg-white' : 'bg-transparent'}`;

       
      

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


// Extract balance sheet data with conditions
const balanceSheetData = activeStatement === 'balance' && data.balanceSheet ? {
    endDate: data.balanceSheet.endDate?.fmt || 'N/A',
    cash: data.balanceSheet.cash?.longFmt || 'Data not available',
    shortTermInvestments: data.balanceSheet.shortTermInvestments?.longFmt || 'Data not available',
    netReceivables: data.balanceSheet.netReceivables?.longFmt || 'Data not available',
    otherCurrentAssets: data.balanceSheet.otherCurrentAssets?.longFmt || 'Data not available',
    totalCurrentAssets: data.balanceSheet.totalCurrentAssets?.longFmt || 'Data not available',
    longTermInvestments: data.balanceSheet.longTermInvestments?.longFmt || 'Data not available',
    propertyPlantEquipment: data.balanceSheet.propertyPlantEquipment?.longFmt || 'Data not available',
    goodWill: data.balanceSheet.goodWill?.longFmt || 'Data not available',
    intangibleAssets: data.balanceSheet.intangibleAssets?.longFmt || 'Data not available',
    otherAssets: data.balanceSheet.otherAssets?.longFmt || 'Data not available',
    deferredLongTermAssetCharges: data.balanceSheet.deferredLongTermAssetCharges?.longFmt || 'Data not available',
    totalAssets: data.balanceSheet.totalAssets?.longFmt || 'Data not available',
    accountsPayable: data.balanceSheet.accountsPayable?.longFmt || 'Data not available',
    shortLongTermDebt: data.balanceSheet.shortLongTermDebt?.longFmt || 'Data not available',
    otherCurrentLiab: data.balanceSheet.otherCurrentLiab?.longFmt || 'Data not available',
    longTermDebt: data.balanceSheet.longTermDebt?.longFmt || 'Data not available',
    otherLiab: data.balanceSheet.otherLiab?.longFmt || 'Data not available',
    minorityInterest: data.balanceSheet.minorityInterest?.longFmt || 'Data not available',
    totalCurrentLiabilities: data.balanceSheet.totalCurrentLiabilities?.longFmt || 'Data not available',
    totalLiab: data.balanceSheet.totalLiab?.longFmt || 'Data not available',
    commonStock: data.balanceSheet.commonStock?.longFmt || 'Data not available',
    retainedEarnings: data.balanceSheet.retainedEarnings?.longFmt || 'Data not available',
    treasuryStock: data.balanceSheet.treasuryStock?.longFmt || 'Data not available',
    otherStockholderEquity: data.balanceSheet.otherStockholderEquity?.longFmt || 'Data not available',
    totalStockholderEquity: data.balanceSheet.totalStockholderEquity?.longFmt || 'Data not available',
    netTangibleAssets: data.balanceSheet.netTangibleAssets?.longFmt || 'Data not available'
} : null;


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
                <div className="inline-block" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)', padding: '3px', borderRadius: '8px' }}>
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

