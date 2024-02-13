import React from 'react';


const StatementTable = ({ data, statementType }) => {
  if (!data) {
    return <div>No data available</div>;
  }

  // Extract endDate here so it's available for all statement types
  const { endDate } = data;
  // console.log(endDate);

  let rows = [];

  if (statementType === 'balance') {
  // Extract balance sheet values directly
const {
TotalAssets,
    CashCashEquivalentsFederalFundsSold,
    CashAndCashEquivalents,
    MoneyMarketInvestments,
    SecuritiesAndInvestments,
    LongTermEquityInvestment,
    DerivativeAssets,
    NetLoan,
    Receivables,
    PrepaidAssets,
    NetPPE,
    GoodwillAndOtherIntangibleAssets,
    DeferredAssets,
    DefinedPensionBenefit,
    AssetsHeldForSale,
    OtherAssets,
    TotalLiabilitiesNetMinorityInterest,
    TotalDeposits,
    PayablesAndAccruedExpenses,
    CurrentDebtAndCapitalLeaseObligation,
    TradingLiabilities,
    DerivativeProductLiabilities,
    LongTermDebtAndCapitalLeaseObligation,
    CurrentProvisions,
    EmployeeBenefits,
    CurrentDeferredLiabilities,
    LiabilitiesOfDiscontinuedOperations,
    OtherLiabilities,
    TotalEquityGrossMinorityInterest,
    StockholdersEquity,
    MinorityInterest,
    TotalCapitalization,
    CommonStockEquity,
    NetTangibleAssets,
    InvestedCapital,
    TangibleBookValue,
    TotalDebt,
    NetDebt,
    ShareIssued,
    OrdinarySharesNumber,
    TreasurySharesNumber,
} = data;

  

  // Define the rows of the table
  // Update rows for the balance sheet
    rows = [ 
    { label: "Total Assets", value: TotalAssets },
    { label: "Cash, Cash Equivalents & Federal Funds Sold", value: CashCashEquivalentsFederalFundsSold },
    { label: "Cash And Cash Equivalents", value: CashAndCashEquivalents },
    { label: "Money Market Investments", value: MoneyMarketInvestments },
    { label: "Securities and Investments", value: SecuritiesAndInvestments },
    { label: "Long Term Equity Investment", value: LongTermEquityInvestment },
    { label: "Derivative Assets", value: DerivativeAssets },
    { label: "Net Loan", value: NetLoan },
    { label: "Receivables", value: Receivables },
    { label: "Prepaid Assets", value: PrepaidAssets },
    { label: "Net PPE", value: NetPPE },
    { label: "Goodwill And Other Intangible Assets", value: GoodwillAndOtherIntangibleAssets },
    { label: "Deferred Assets", value: DeferredAssets },
    { label: "Defined Pension Benefit", value: DefinedPensionBenefit },
    { label: "Assets Held for Sale", value: AssetsHeldForSale },
    { label: "Other Assets", value: OtherAssets },
    { label: "Total Liabilities", value: TotalLiabilitiesNetMinorityInterest },
    { label: "Total Deposits", value: TotalDeposits },
    { label: "Payables And Accrued Expenses", value: PayablesAndAccruedExpenses },
    { label: "Current Debt And Capital Lease Obligation", value: CurrentDebtAndCapitalLeaseObligation },
    { label: "Trading Liabilities", value: TradingLiabilities },
    { label: "Derivative Product Liabilities", value: DerivativeProductLiabilities },
    { label: "Long Term Debt And Capital Lease Obligation", value: LongTermDebtAndCapitalLeaseObligation },
    { label: "Current Provisions", value: CurrentProvisions },
    { label: "Employee Benefits", value: EmployeeBenefits },
    { label: "Current Deferred Liabilities", value: CurrentDeferredLiabilities },
    { label: "Liabilities of Discontinued Operations", value: LiabilitiesOfDiscontinuedOperations },
    { label: "Other Liabilities", value: OtherLiabilities },
    { label: "Total Equity Gross Minority Interest", value: TotalEquityGrossMinorityInterest },
    { label: "Stockholders Equity", value: StockholdersEquity },
    { label: "Minority Interest", value: MinorityInterest },
    { label: "Total Capitalization", value: TotalCapitalization },
    { label: "Common Stock Equity", value: CommonStockEquity },
    { label: "Net Tangible Assets", value: NetTangibleAssets },
    { label: "Invested Capital", value: InvestedCapital },
    { label: "Tangible Book Value", value: TangibleBookValue },
    { label: "Total Debt", value: TotalDebt },
    { label: "Net Debt", value: NetDebt },
    // Assuming placeholders for share data
    { label: "Share Issued", value: ShareIssued },
    { label: "Ordinary Shares Number", value: OrdinarySharesNumber },
    { label: "Treasury Shares Number", value: TreasurySharesNumber },
].filter(row => row.value !== 'Data not available' && row.value !== null);

  } else if (statementType === 'income') {
    // Extract income statement values
      const {
    totalRevenue,
    grossProfits,
    ebitda,
    operatingMargins,
    profitMargins,
    earningsGrowth,
    returnOnAssets,
    returnOnEquity,
    revenuePerShare,
    totalCashPerShare,
    totalDebt,
    debtToEquity,
    currentRatio,
    quickRatio,

    // ... other income statement variables as needed ...
  } = data;
    // Define the rows of the income statement table
    rows = [
    { label: "Total Revenue", value: totalRevenue },
    { label: "Gross Profits", value: grossProfits },
    { label: "EBITDA", value: ebitda },
    { label: "Operating Margins", value: operatingMargins },
    { label: "Profit Margins", value: profitMargins },
    { label: "Earnings Growth", value: earningsGrowth },
    { label: "Return on Assets", value: returnOnAssets },
    { label: "Return on Equity", value: returnOnEquity },
    { label: "Revenue Per Share", value: revenuePerShare },
    { label: "Total Cash Per Share", value: totalCashPerShare },
    { label: "Total Debt", value: totalDebt },
    { label: "Debt to Equity", value: debtToEquity },
    { label: "Current Ratio", value: currentRatio },
    { label: "Quick Ratio", value: quickRatio },

    // ... other income statement rows as needed ...
  ].filter(row => row.value !== 'Data not available' && row.value !== null);

  } else if (statementType === 'cash') {
    // Extract cash flow statement values
    const {
      operatingCashflow,
      totalCash,
      totalCashPerShare,
      totalDebt,
      debtToEquity,
      freeCashflow,
    } = data;

    // Define the rows of the cash flow statement table
    rows = [
      { label: "Operating Cashflow", value: operatingCashflow },
      { label: "Total Cash", value: totalCash },
      { label: "Total Cash Per Share", value: totalCashPerShare },
      { label: "Total Debt", value: totalDebt },
      { label: "Debt to Equity", value: debtToEquity },
      { label: "Free Cashflow", value: freeCashflow },
      // ... other cash flow statement rows as needed ...
    ].filter(row => row.value !== 'Data not available' && row.value !== null);
  }

  // Check if there are any rows to display
  if (rows.length === 0) {
    return <div>No data available for the selected statement.</div>;
  }


return (
<table className="statement-table p-4" style={{ 
    width: '100%', 
    borderCollapse: 'collapse',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // More opaque background
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Box shadow
}}>
  <thead>
    <tr>
      <th style={{ 
          textAlign: 'left', 
          backgroundColor: 'rgba(200, 200, 200, 0.2)', // Updated background color
          padding: '10px', 
          fontSize: '14px'
      }}>
        Breakdown
      </th>
      <th style={{ 
          textAlign: 'right', 
          backgroundColor: 'rgba(200, 200, 200, 0.2)', // Updated background color
          padding: '10px', 
          fontSize: '14px'
      }}>
        {endDate || ''}
      </th>
    </tr>
  </thead>
<tbody>
        {rows.map((row, index) => {
          // Highlight specific rows
          const isHighlighted = row.label === "Total Assets" || row.label === "Total Liabilities" || row.label === "Total Stockholder Equity";
          const rowStyle = isHighlighted ? { backgroundColor: 'rgba(101, 81, 186, 0.1)' } : null; // Increased opacity to 80%

          return (
            <tr key={index} style={rowStyle}>
              <td style={{ 
                  textAlign: 'left', 
                  padding: '8px', 
                  fontSize: '12px'
              }}>
                {row.label}
              </td>
              <td style={{ 
                  textAlign: 'right', 
                  padding: '8px', 
                  fontSize: '12px'
              }}>
                {row.value || 'N/A'}
              </td>
            </tr>
          );
        })}
      </tbody>
</table>



  );
};


export default StatementTable;
