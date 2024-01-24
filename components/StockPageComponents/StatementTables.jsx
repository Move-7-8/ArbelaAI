import React from 'react';


const StatementTable = ({ data, statementType }) => {
  if (!data) {
    return <div>No data available</div>;
  }

  // Extract endDate here so it's available for all statement types
  const { endDate } = data;
  console.log(endDate);

  let rows = [];

  if (statementType === 'balance') {
  // Extract balance sheet values directly
const {
  cash,
  netReceivables,
  totalCurrentAssets,
  longTermInvestments,
  otherCurrentAssets,
  intangibleAssets,
  otherAssets,
  totalAssets,
  accountsPayable,
  longTermDebt,
  totalCurrentLiabilities,
  totalLiab,
  commonStock,
  retainedEarnings,
  treasuryStock,
  otherStockholderEquity,
  totalStockholderEquity,
  netTangibleAssets,
  shortTermInvestments, // Add this line
  propertyPlantEquipment, // Add this line
  goodWill, // Add this line
  deferredLongTermAssetCharges, // Add this line
  shortLongTermDebt, // Add this line
  otherCurrentLiab, // Add this line
  otherLiab, // Add this line
  minorityInterest // Add this line
} = data;

  

  // Define the rows of the table
  // Update rows for the balance sheet
    rows = [ 
    { label: "Total Assets", value: totalAssets },
    { label: "Cash", value: cash },
    { label: "Short Term Investments", value: shortTermInvestments },
    { label: "Net Receivables", value: netReceivables },
    { label: "Other Current Assets", value: otherCurrentAssets },
    { label: "Total Current Assets", value: totalCurrentAssets },
    { label: "Long Term Investments", value: longTermInvestments },
    { label: "Property Plant Equipment", value: propertyPlantEquipment },
    { label: "GoodWill", value: goodWill },
    { label: "Intangible Assets", value: intangibleAssets },
    { label: "Other Assets", value: otherAssets },
    { label: "Deferred Long Term Asset Charges", value: deferredLongTermAssetCharges },
    { label: "Accounts Payable", value: accountsPayable },
    { label: "Short/Long Term Debt", value: shortLongTermDebt },
    { label: "Other Current Liabilities", value: otherCurrentLiab },
    { label: "Long Term Debt", value: longTermDebt },
    { label: "Other Liabilities", value: otherLiab },
    { label: "Minority Interest", value: minorityInterest },
    { label: "Total Current Liabilities", value: totalCurrentLiabilities },
    { label: "Total Liabilities", value: totalLiab },
    { label: "Common Stock", value: commonStock },
    { label: "Retained Earnings", value: retainedEarnings },
    { label: "Treasury Stock", value: treasuryStock },
    { label: "Other Stockholder Equity", value: otherStockholderEquity },
    { label: "Total Stockholder Equity", value: totalStockholderEquity },
    { label: "Net Tangible Assets", value: netTangibleAssets }
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
          textAlign: 'center', 
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
                  textAlign: 'center', 
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
