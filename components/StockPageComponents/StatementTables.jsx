import {useState} from 'react';
import { FaChevronDown } from 'react-icons/fa';


const StatementTable = ({ data, statementType }) => {

    const [visibleSections, setVisibleSections] = useState({
      assets: true,
      liabilities: true,
      equity: true,
      revenue: true,
      operatingExpenses: true,
      income: true,
      eps: true, 
      operatingActivities: true,
      investingActivities: true,
      financingActivities: true,
      supplementalInformation: true, 
        });
  
      const toggleSection = (section) => {
        setVisibleSections((prevVisibleSections) => ({
          ...prevVisibleSections,
          [section]: !prevVisibleSections[section],
        }));
      };

  
  if (!data) {
    return <div>No data available</div>;
  }

  const { endDate } = data;

  let rows = [];

  if (statementType === 'balance') {
    // Extract Balance Sheet Values
    const {
      //ASSETS
      TotalAssets,
      CashCashEquivalentsFederalFundsSold,
      MoneyMarketInvestments,
      SecuritiesAndInvestments,
      LongTermEquityInvestment,
      DerivativeAssets,
      NetLoan,
      Receivables,
      GoodwillAndOtherIntangibleAssets,
      DeferredAssets,
      DefinedPensionBenefit,
      AssetsHeldForSale,
      OtherAssets,
      InvestmentInFinancialAssets,
      TradingSecurities,
      HedgingAssetsCurrent,
      Inventory,
      FinishedGoods,
      ConstructionInProgress,
      InvestmentsAndAdvances,
      PrepaidAssets,
      MachineryFurnitureEquipment,
      ReceivablesAdjustmentsAllowances,
      OtherIntangibleAssets,
      OtherNonCurrentAssets,
      NetPPE, // Net Property, Plant, and Equipment
      CurrentDeferredAssets,
      Leases,
      AssetsHeldForSaleCurrent,
      CurrentAssets,
      TangibleBookValue,
      CashCashEquivalentsAndShortTermInvestments,
      CashFinancial,
      CurrentDeferredTaxesAssets,
      LoansReceivable,
      GrossPPE, // Gross Property, Plant, and Equipment
      NonCurrentDeferredTaxesAssets,
      OtherProperties,
      NonCurrentDeferredAssets,
      OtherReceivables,
      OtherShortTermInvestments,
      NonCurrentAccountsReceivable,
      Goodwill,
      OtherCurrentAssets,
      TotalNonCurrentAssets,
      LandAndImprovements,
      InvestmentsinAssociatesatCost,
      AccountsReceivable,
      OtherInvestments,
      InventoriesAdjustmentsAllowances,
      Properties,
      InvestmentProperties,
      HeldToMaturitySecurities,
      FinancialAssets,
      DuefromRelatedPartiesNonCurrent,
      RawMaterials,
      CashEquivalents,
      TaxesReceivable,
      AvailableForSaleSecurities,
      NonCurrentPrepaidAssets,
      InvestmentsInOtherVenturesUnderEquityMethod,
      DuetoRelatedPartiesCurrent,
      BuildingsAndImprovements,
      CommercialPaper,
      InvestmentsinJointVenturesatCost,
      InvestmentsinSubsidiariesatCost,
      OtherInventories,
      RestrictedCash,
      FinancialAssetsDesignatedasFairValueThroughProfitorLossTotal,
      DuefromRelatedPartiesCurrent, // Check for potential duplicate
      AllowanceForDoubtfulAccountsReceivable,
      AccruedInterestReceivable,
      WorkInProcess,
      GrossAccountsReceivable,
      NonCurrentNoteReceivables,
      NotesReceivable,
      TreasuryStock,

      //LIABILITIES
      TotalDeposits,
      TradingLiabilities,
      LongTermDebtAndCapitalLeaseObligation,
      LiabilitiesOfDiscontinuedOperations,
      OtherLiabilities,
      TotalLiabilitiesNetMinorityInterest,
      CurrentDeferredTaxesLiabilities,
      CurrentLiabilities,
      CurrentDeferredRevenue,
      LongTermProvisions,
      CurrentDebt,
      TotalNonCurrentLiabilitiesNetMinorityInterest,
      AccumulatedDepreciation, // Though typically contra-asset, included here for completeness
      CapitalLeaseObligations,
      TradeandOtherPayablesNonCurrent,
      OtherCurrentLiabilities,
      LongTermCapitalLeaseObligation,
      NonCurrentPensionAndOtherPostretirementBenefitPlans,
      CurrentCapitalLeaseObligation,
      DividendsPayable,
      CurrentProvisions,
      PayablesAndAccruedExpenses,
      OtherCurrentBorrowings,
      CurrentDeferredLiabilities,
      NetDebt,
      CapitalStock,
      OtherPayable,
      Payables,
      AccountsPayable,
      NonCurrentDeferredRevenue,
      CurrentDebtAndCapitalLeaseObligation,
      NonCurrentDeferredLiabilities,
      EmployeeBenefits,
      LongTermDebt,
      NonCurrentDeferredTaxesLiabilities,
      NonCurrentAccruedExpenses,
      DuetoRelatedPartiesNonCurrent,
      InterestPayable,
      DerivativeProductLiabilities,
      MinimumPensionLiabilities,
      CurrentAccruedExpenses,
      OtherNonCurrentLiabilities,
      IncomeTaxPayable,
      LineOfCredit,
      TotalTaxPayable,
      LiabilitiesHeldforSaleNonCurrent,
      CurrentNotesPayable,
  
      //EQUITY
      MinorityInterest,
      TotalDebt,
      OtherEquityAdjustments,
      ShareIssued,
      OtherCapitalStock,
      GainsLossesNotAffectingRetainedEarnings,
      TotalEquityGrossMinorityInterest,
      CommonStockEquity,
      CommonStock, // Note: This appears twice, ensure duplicates are handled or removed if unintended
      NetTangibleAssets,
      InvestedCapital,
      ForeignCurrencyTranslationAdjustments,
      TotalCapitalization,
      WorkingCapital,
      OrdinarySharesNumber, // Note: This appears three times, ensure duplicates are handled or removed if unintended
      RetainedEarnings,
      PensionandOtherPostRetirementBenefitPlansCurrent,
      StockholdersEquity,
      TreasurySharesNumber,
      FixedAssetsRevaluationReserve,
      AdditionalPaidInCapital,
      RestrictedCommonStock,
      PreferredStock,
      OtherEquityInterest,
      GeneralPartnershipCapital,
      LimitedPartnershipCapital,
      PreferredSharesNumber,
      PreferredSecuritiesOutsideStockEquity,
      PreferredStockEquity,
      UnrealizedGainLoss,
      TotalPartnershipCapital,
  

  } = data;

  // Balance sheet
  rows = [ 
  // Assets
  { label: "Cash, Cash Equivalents & Federal Funds Sold", value: CashCashEquivalentsFederalFundsSold },
  { label: "Money Market Investments", value: MoneyMarketInvestments },
  { label: "Securities and Investments", value: SecuritiesAndInvestments },
  { label: "Long Term Equity Investment", value: LongTermEquityInvestment },
  { label: "Derivative Assets", value: DerivativeAssets },
  { label: "Net Loan", value: NetLoan },
  { label: "Receivables", value: Receivables },
  { label: "Goodwill And Other Intangible Assets", value: GoodwillAndOtherIntangibleAssets },
  { label: "Deferred Assets", value: DeferredAssets },
  { label: "Defined Pension Benefit", value: DefinedPensionBenefit },
  { label: "Assets Held for Sale", value: AssetsHeldForSale },
  { label: "Other Assets", value: OtherAssets },
  { label: "Investment In Financial Assets", value: InvestmentInFinancialAssets },
  { label: "Trading Securities", value: TradingSecurities },
  { label: "Hedging Assets Current", value: HedgingAssetsCurrent },
  { label: "Inventory", value: Inventory },
  { label: "Finished Goods", value: FinishedGoods },
  { label: "Construction In Progress", value: ConstructionInProgress },
  { label: "Investments And Advances", value: InvestmentsAndAdvances },
  { label: "Prepaid Assets", value: PrepaidAssets },
  { label: "Machinery, Furniture, Equipment", value: MachineryFurnitureEquipment },
  { label: "Receivables Adjustments Allowances", value: ReceivablesAdjustmentsAllowances },
  { label: "Other Intangible Assets", value: OtherIntangibleAssets },
  { label: "Other Non-Current Assets", value: OtherNonCurrentAssets },
  { label: "Net Property, Plant, and Equipment", value: NetPPE },
  { label: "Current Deferred Assets", value: CurrentDeferredAssets },
  { label: "Leases", value: Leases },
  { label: "Assets Held For Sale Current", value: AssetsHeldForSaleCurrent },
  { label: "Current Assets", value: CurrentAssets },
  { label: "Cash, Cash Equivalents & Short Term Investments", value: CashCashEquivalentsAndShortTermInvestments },
  { label: "Cash Financial", value: CashFinancial },
  { label: "Current Deferred Taxes Assets", value: CurrentDeferredTaxesAssets },
  { label: "Loans Receivable", value: LoansReceivable },
  { label: "Gross Property, Plant, and Equipment", value: GrossPPE },
  { label: "Non-Current Deferred Taxes Assets", value: NonCurrentDeferredTaxesAssets },
  { label: "Other Properties", value: OtherProperties },
  { label: "Non-Current Deferred Assets", value: NonCurrentDeferredAssets },
  { label: "Other Receivables", value: OtherReceivables },
  { label: "Other Short Term Investments", value: OtherShortTermInvestments },
  { label: "Non-Current Accounts Receivable", value: NonCurrentAccountsReceivable },
  { label: "Goodwill", value: Goodwill },
  { label: "Other Current Assets", value: OtherCurrentAssets },
  { label: "Total Non-Current Assets", value: TotalNonCurrentAssets },
  { label: "Land And Improvements", value: LandAndImprovements },
  { label: "Investments in Associates at Cost", value: InvestmentsinAssociatesatCost },
  { label: "Accounts Receivable", value: AccountsReceivable },
  { label: "Other Investments", value: OtherInvestments },
  { label: "Inventories Adjustments Allowances", value: InventoriesAdjustmentsAllowances },
  { label: "Properties", value: Properties },
  { label: "Investment Properties", value: InvestmentProperties },
  { label: "Held To Maturity Securities", value: HeldToMaturitySecurities },
  { label: "Financial Assets", value: FinancialAssets },
  { label: "Due from Related Parties Non-Current", value: DuefromRelatedPartiesNonCurrent },
  { label: "Raw Materials", value: RawMaterials },
  { label: "Cash Equivalents", value: CashEquivalents },
  { label: "Taxes Receivable", value: TaxesReceivable },
  { label: "Available For Sale Securities", value: AvailableForSaleSecurities },
  { label: "Non-Current Prepaid Assets", value: NonCurrentPrepaidAssets },
  { label: "Investments In Other Ventures Under Equity Method", value: InvestmentsInOtherVenturesUnderEquityMethod },
  { label: "Dueto Related Parties Current", value: DuetoRelatedPartiesCurrent },
  { label: "Buildings And Improvements", value: BuildingsAndImprovements },
  { label: "Commercial Paper", value: CommercialPaper },
  { label: "Investments in Joint Ventures at Cost", value: InvestmentsinJointVenturesatCost },
  { label: "Investments in Subsidiaries at Cost", value: InvestmentsinSubsidiariesatCost },
  { label: "Other Inventories", value: OtherInventories },
  { label: "Restricted Cash", value: RestrictedCash },
  { label: "Financial Assets Designated as Fair Value Through Profit or Loss Total", value: FinancialAssetsDesignatedasFairValueThroughProfitorLossTotal },
  { label: "Due from Related Parties Current", value: DuefromRelatedPartiesCurrent },
  { label: "Allowance For Doubtful Accounts Receivable", value: AllowanceForDoubtfulAccountsReceivable },
  { label: "Accrued Interest Receivable", value: AccruedInterestReceivable },
  { label: "Work In Process", value: WorkInProcess },
  { label: "Gross Accounts Receivable", value: GrossAccountsReceivable },
  { label: "Non-Current Note Receivables", value: NonCurrentNoteReceivables },
  { label: "Notes Receivable", value: NotesReceivable },
  { label: "Treasury Stock", value: TreasuryStock },
  { label: "Total Assets", value: TotalAssets },

  // Liabilities
  { label: "Total Deposits", value: TotalDeposits },
  { label: "Trading Liabilities", value: TradingLiabilities },
  { label: "Long Term Debt And Capital Lease Obligation", value: LongTermDebtAndCapitalLeaseObligation },
  { label: "Liabilities of Discontinued Operations", value: LiabilitiesOfDiscontinuedOperations },
  { label: "Other Liabilities", value: OtherLiabilities },
  { label: "Current Deferred Taxes Liabilities", value: CurrentDeferredTaxesLiabilities },
  { label: "Current Liabilities", value: CurrentLiabilities },
  { label: "Current Deferred Revenue", value: CurrentDeferredRevenue },
  { label: "Long Term Provisions", value: LongTermProvisions },
  { label: "Current Debt", value: CurrentDebt },
  { label: "Total Non-Current Liabilities Net Minority Interest", value: TotalNonCurrentLiabilitiesNetMinorityInterest },
  { label: "Accumulated Depreciation", value: AccumulatedDepreciation }, // Often considered in asset valuation, but structurally a contra asset reducing asset value
  { label: "Capital Lease Obligations", value: CapitalLeaseObligations },
  { label: "Trade and Other Payables Non-Current", value: TradeandOtherPayablesNonCurrent },
  { label: "Other Current Liabilities", value: OtherCurrentLiabilities },
  { label: "Long Term Capital Lease Obligation", value: LongTermCapitalLeaseObligation },
  { label: "Non-Current Pension And Other Postretirement Benefit Plans", value: NonCurrentPensionAndOtherPostretirementBenefitPlans },
  { label: "Current Capital Lease Obligation", value: CurrentCapitalLeaseObligation },
  { label: "Dividends Payable", value: DividendsPayable },
  { label: "Current Provisions", value: CurrentProvisions },
  { label: "Payables And Accrued Expenses", value: PayablesAndAccruedExpenses },
  { label: "Other Current Borrowings", value: OtherCurrentBorrowings },
  { label: "Current Deferred Liabilities", value: CurrentDeferredLiabilities },
  { label: "Net Debt", value: NetDebt },
  { label: "Capital Stock", value: CapitalStock },
  { label: "Other Payable", value: OtherPayable },
  { label: "Payables", value: Payables },
  { label: "Accounts Payable", value: AccountsPayable },
  { label: "Non-Current Deferred Revenue", value: NonCurrentDeferredRevenue },
  { label: "Current Debt And Capital Lease Obligation", value: CurrentDebtAndCapitalLeaseObligation },
  { label: "Non-Current Deferred Liabilities", value: NonCurrentDeferredLiabilities },
  { label: "Employee Benefits", value: EmployeeBenefits },
  { label: "Long Term Debt", value: LongTermDebt },
  { label: "Non-Current Deferred Taxes Liabilities", value: NonCurrentDeferredTaxesLiabilities },
  { label: "Non-Current Accrued Expenses", value: NonCurrentAccruedExpenses },
  { label: "Due to Related Parties Non-Current", value: DuetoRelatedPartiesNonCurrent },
  { label: "Interest Payable", value: InterestPayable },
  { label: "Derivative Product Liabilities", value: DerivativeProductLiabilities },
  { label: "Minimum Pension Liabilities", value: MinimumPensionLiabilities },
  { label: "Current Accrued Expenses", value: CurrentAccruedExpenses },
  { label: "Other Non-Current Liabilities", value: OtherNonCurrentLiabilities },
  { label: "Income Tax Payable", value: IncomeTaxPayable },
  { label: "Line Of Credit", value: LineOfCredit },
  { label: "Total Tax Payable", value: TotalTaxPayable },
  { label: "Liabilities Held for Sale Non-Current", value: LiabilitiesHeldforSaleNonCurrent },
  { label: "Current Notes Payable", value: CurrentNotesPayable },
  { label: "Total Liabilities", value: TotalLiabilitiesNetMinorityInterest },

  // Equity
  { label: "Minority Interest", value: MinorityInterest },
  { label: "Tangible Book Value", value: TangibleBookValue },
  { label: "Total Debt", value: TotalDebt },
  { label: "Other Equity Adjustments", value: OtherEquityAdjustments },
  { label: "Share Issued", value: ShareIssued },
  { label: "Other Capital Stock", value: OtherCapitalStock },
  { label: "Gains/Losses Not Affecting Retained Earnings", value: GainsLossesNotAffectingRetainedEarnings },
  { label: "Total Equity Gross Minority Interest", value: TotalEquityGrossMinorityInterest },
  { label: "Common Stock Equity", value: CommonStockEquity },
  { label: "Common Stock", value: CommonStock },
  { label: "Net Tangible Assets", value: NetTangibleAssets },
  { label: "Invested Capital", value: InvestedCapital },
  { label: "Common Stock", value: CommonStock },
  { label: "Foreign Currency Translation Adjustments", value: ForeignCurrencyTranslationAdjustments },
  { label: "Total Capitalization", value: TotalCapitalization },
  { label: "Working Capital", value: WorkingCapital },
  { label: "Ordinary Shares Number", value: OrdinarySharesNumber },
  { label: "Retained Earnings", value: RetainedEarnings },
  { label: "Pension and Other Post Retirement Benefit Plans Current", value: PensionandOtherPostRetirementBenefitPlansCurrent },
  { label: "Ordinary Shares Number", value: OrdinarySharesNumber },
  { label: "Treasury Shares Number", value: TreasurySharesNumber },
  { label: "Fixed Assets Revaluation Reserve", value: FixedAssetsRevaluationReserve },
  { label: "Additional Paid In Capital", value: AdditionalPaidInCapital },
  { label: "Restricted Common Stock", value: RestrictedCommonStock },
  { label: "Preferred Stock", value: PreferredStock },
  { label: "Other Equity Interest", value: OtherEquityInterest },
  { label: "General Partnership Capital", value: GeneralPartnershipCapital },
  { label: "Limited Partnership Capital", value: LimitedPartnershipCapital },
  { label: "Preferred Shares Number", value: PreferredSharesNumber },
  { label: "Ordinary Shares Number", value: OrdinarySharesNumber },
  { label: "Preferred Securities Outside Stock Equity", value: PreferredSecuritiesOutsideStockEquity },
  { label: "Preferred Stock Equity", value: PreferredStockEquity },
  { label: "Unrealized Gain/Loss", value: UnrealizedGainLoss },
  { label: "Total Partnership Capital", value: TotalPartnershipCapital },
  { label: "Stockholders Equity", value: StockholdersEquity },

  ].filter(row => row.value !== 'Data not available' && row.value !== null); // Assuming the filter applies to the entire array

    } else if (statementType === 'income') {
    // Extract Income Statement Values
      const {
        TrailingBasicAverageShares,
        TrailingBasicEPS,
        TrailingCostOfRevenue,
        TrailingDilutedAverageShares,
        TrailingDilutedEPS,
        TrailingGrossProfit,
        TrailingInterestExpense,
        TrailingNetIncome,
        TrailingNetIncomeCommonStockholders,
        TrailingNetIncomeContinuousOperations,
        TrailingOperatingExpense,
        TrailingOperatingIncome,
        TrailingOtherIncomeExpense,
        TrailingPretaxIncome,
        TrailingResearchAndDevelopment,
        TrailingSellingGeneralAndAdministration,
        TrailingTaxProvision,
        TrailingTotalRevenue

  } = data;

    // Income Statement
    rows = [
    // Revenue Section
    { label: "Total Revenue", value: TrailingTotalRevenue },
    { label: "Cost of Revenue", value: TrailingCostOfRevenue },
    //Revenue Section TOTAL LINE:
    { label: "Gross Profit", value: TrailingGrossProfit },

    // Operating Expenses Section
    { label: "Research and Development", value: TrailingResearchAndDevelopment },
    { label: "Selling General and Administration", value: TrailingSellingGeneralAndAdministration },
      //Operating Expenses Section TOTAL LINE:
    { label: "Total Operating Expense", value: TrailingOperatingExpense },

    // Income Section
    { label: "Operating Income", value: TrailingOperatingIncome },
    { label: "Interest Expense", value: TrailingInterestExpense },
    { label: "Other Income Expense", value: TrailingOtherIncomeExpense },
    { label: "Pretax Income", value: TrailingPretaxIncome },
    { label: "Tax Provision", value: TrailingTaxProvision },
    //Income Section TOTAL LINE:
    { label: "Net Income", value: TrailingNetIncome },
    { label: "Net Income Continuous Operations", value: TrailingNetIncomeContinuousOperations },
    { label: "Net Income Common Stockholders", value: TrailingNetIncomeCommonStockholders },

    // Earnings Per Share (EPS) Section
    { label: "Basic Average Shares", value: TrailingBasicAverageShares },
    { label: "Diluted Average Shares", value: TrailingDilutedAverageShares },
    { label: "Basic EPS", value: TrailingBasicEPS },
    { label: "Diluted EPS", value: TrailingDilutedEPS },
  
  ].filter(row => row.value !== 'Data not available' && row.value !== null);

  } else if (statementType === 'cash') {
    // Extract cash flow statement values
    const {
      BeginningCashPosition,
      CapitalExpenditure,
      CashDividendsPaid,
      CashFlowFromContinuingFinancingActivities,
      ChangeInAccountPayable,
      ChangeInCashSupplementalAsReported,
      ChangeInInventory,
      ChangeInWorkingCapital,
      ChangesInAccountReceivables,
      CommonStockIssuance,
      DeferredIncomeTax,
      DepreciationAndAmortization,
      EndCashPosition,
      FreeCashFlow,
      InvestingCashFlow,
      NetIncome,
      NetOtherFinancingCharges,
      NetOtherInvestingChanges,
      OperatingCashFlow,
      OtherNonCashItems,
      PurchaseOfBusiness,
      PurchaseOfInvestment,
      RepaymentOfDebt,
      RepurchaseOfCapitalStock,
      SaleOfInvestment,
      StockBasedCompensation,
          } = data;

    // Cash Flow Statement
    rows = [
      // Operating Activities
      { label: "Net Income", value: NetIncome },
      { label: "Depreciation And Amortization", value: DepreciationAndAmortization },
      { label: "Deferred Income Tax", value: DeferredIncomeTax },
      { label: "Stock Based Compensation", value: StockBasedCompensation },
      { label: "Change In Working Capital", value: ChangeInWorkingCapital },
      { label: "Changes In Account Receivables", value: ChangesInAccountReceivables },
      { label: "Change In Inventory", value: ChangeInInventory },
      { label: "Change In Account Payable", value: ChangeInAccountPayable },
      { label: "Other Non-Cash Items", value: OtherNonCashItems },
      { label: "Operating Cash Flow", value: OperatingCashFlow },

      // Investing Activities
      { label: "Capital Expenditure", value: CapitalExpenditure },
      { label: "Investing Cash Flow", value: InvestingCashFlow },
      { label: "Purchase Of Business", value: PurchaseOfBusiness },
      { label: "Purchase Of Investment", value: PurchaseOfInvestment },
      { label: "Sale Of Investment", value: SaleOfInvestment },
      { label: "Net Other Investing Changes", value: NetOtherInvestingChanges },

      // Financing Activities
      { label: "Cash Dividends Paid", value: CashDividendsPaid },
      { label: "Common Stock Issuance", value: CommonStockIssuance },
      { label: "Repayment Of Debt", value: RepaymentOfDebt },
      { label: "Repurchase Of Capital Stock", value: RepurchaseOfCapitalStock },
      { label: "Cash Flow From Continuing Financing Activities", value: CashFlowFromContinuingFinancingActivities },
      { label: "Net Other Financing Charges", value: NetOtherFinancingCharges },

      // Supplemental Information
      { label: "Free Cash Flow", value: FreeCashFlow },
      { label: "Change In Cash Supplemental As Reported", value: ChangeInCashSupplementalAsReported },
      { label: "Beginning Cash Position", value: BeginningCashPosition },
      { label: "End Cash Position", value: EndCashPosition },
            
    ].filter(row => row.value !== 'Data not available' && row.value !== null);
  }

  // Check if there are any rows to display
  if (rows.length === 0) {
    return <div>No data available for the selected statement.</div>;
  }

  // Functions to categorise balance sheet rows (to add colours): 
  //ASSETS
  const isAssetRow = (label) => {
    const assetsLabels = [
      "Total Assets",
      "Cash, Cash Equivalents & Federal Funds Sold",
      "Cash And Cash Equivalents",
      "Money Market Investments",
      "Securities and Investments",
      "Long Term Equity Investment",
      "Derivative Assets",
      "Net Loan",
      "Receivables",
      "Prepaid Assets",
      "Net PPE",
      "Goodwill And Other Intangible Assets",
      "Deferred Assets",
      "Defined Pension Benefit",
      "Assets Held for Sale",
      "Other Assets",
      "Investment In Financial Assets", // Added
      "Trading Securities", // Added
      "Hedging Assets Current", // Added
      "Inventory", // Added
      "Finished Goods", // Added
      "Construction In Progress", // Added
      "Investments And Advances", // Added
      "Machinery, Furniture, Equipment", // Added
      "Receivables Adjustments Allowances", // Added
      "Other Intangible Assets", // Added
      "Other Non-Current Assets", // Added
      "Net Property, Plant, and Equipment", // Newly added
      "Current Deferred Assets", // Newly added
      "Leases", // Newly added
      "Assets Held For Sale Current", // Newly added
      "Current Assets", // Newly added
      "Cash, Cash Equivalents & Short Term Investments", // Newly added
      "Cash Financial", // Newly added
      "Current Deferred Taxes Assets", // Newly added
      "Loans Receivable", // Newly added
      "Gross Property, Plant, and Equipment", // Newly added
      "Non-Current Deferred Taxes Assets", // Newly added
      "Other Properties", // Newly added
      "Non-Current Deferred Assets", // Newly added
      "Other Receivables", // Newly added
      "Other Short Term Investments", // Newly added
      "Non-Current Accounts Receivable", // Newly added
      "Goodwill", // Newly added
      "Other Current Assets", // Newly added
      "Total Non-Current Assets", // Newly added
      "Land And Improvements", // Newly added
      "Investments in Associates at Cost", // Newly added
      "Accounts Receivable", // Newly added
      "Other Investments", // Newly added
      "Inventories Adjustments Allowances", // Newly added
      "Properties", // Newly added
      "Investment Properties", // Newly added
      "Held To Maturity Securities", // Newly added
      "Financial Assets", // Newly added
      "Due from Related Parties Non-Current", // Newly added
      "Raw Materials", // Newly added
      "Cash Equivalents", // Newly added
      "Taxes Receivable", // Newly added
      "Available For Sale Securities", // Newly added
      "Non-Current Prepaid Assets", // Newly added
      "Investments In Other Ventures Under Equity Method", // Newly added
      "Due to Related Parties Current", // Newly added
      "Buildings And Improvements", // Newly added
      "Commercial Paper", // Newly added
      "Investments in Joint Ventures at Cost", // Newly added
      "Investments in Subsidiaries at Cost", // Newly added
      "Other Inventories", // Newly added
      "Restricted Cash", // Newly added
      "Financial Assets Designated as Fair Value Through Profit or Loss Total", // Newly added
      "Due from Related Parties Current", // Newly added
      "Allowance For Doubtful Accounts Receivable", // Newly added
      "Accrued Interest Receivable", // Newly added
      "Work In Process", // Newly added
      "Gross Accounts Receivable", // Newly added
      "Non-Current Note Receivables", // Newly added
      "Notes Receivable", // Newly added
      "Treasury Stock", // Newly added


      ];
    return assetsLabels.includes(label);
  };

  //LIABILITIES
  const isLiabilityRow = (label) => {
    const liabilitiesLabels = [
      "Total Liabilities",
      "Total Deposits",
      "Payables And Accrued Expenses",
      "Current Debt And Capital Lease Obligation",
      "Trading Liabilities",
      "Derivative Product Liabilities",
      "Long Term Debt And Capital Lease Obligation",
      "Current Provisions",
      "Employee Benefits",
      "Current Deferred Liabilities",
      "Liabilities of Discontinued Operations",
      "Other Liabilities",
      "Total Liabilities Net Minority Interest", // Newly added
      "Current Deferred Taxes Liabilities", // Newly added
      "Current Liabilities", // Newly added
      "Current Deferred Revenue", // Newly added
      "Long Term Provisions", // Newly added
      "Current Debt", // Newly added
      "Total Non-Current Liabilities Net Minority Interest", // Newly added
      "Accumulated Depreciation", // Newly added, note on classification
      "Capital Lease Obligations", // Newly added
      "Trade and Other Payables Non-Current", // Newly added
      "Other Current Liabilities", // Newly added
      "Long Term Capital Lease Obligation", // Newly added
      "Non-Current Pension And Other Postretirement Benefit Plans", // Newly added
      "Current Capital Lease Obligation", // Newly added
      "Dividends Payable", // Newly added
      "Other Current Borrowings",
      "Net Debt",
      "Capital Stock",
      "Other Payable",
      "Payables",
      "Accounts Payable",
      "Non-Current Deferred Revenue",
      "Non-Current Deferred Liabilities",
      "Long Term Debt",
      "Non-Current Deferred Taxes Liabilities",
      "Non-Current Accrued Expenses",
      "Due to Related Parties Non-Current",
      "Interest Payable",
      "Minimum Pension Liabilities",
      "Current Accrued Expenses",
      "Other Non-Current Liabilities",
      "Income Tax Payable",
      "Line Of Credit",
      "Total Tax Payable",
      "Liabilities Held for Sale Non-Current",
      "Current Notes Payable",

    ];
    return liabilitiesLabels.includes(label);
  };
  
  //EQUITY
  const isEquityRow = (label) => {
    const equityLabels = [
      "Total Equity Gross Minority Interest",
      "Stockholders Equity",
      "Minority Interest",
      "Total Capitalisation",
      "Common Stock Equity",
      "Net Tangible Assets",
      "Invested Capital",
      "Tangible Book Value",
      "Total Debt",
      "Share Issued",
      "Ordinary Shares Number",
      "Treasury Shares Number",
      "Other Equity Adjustments",
      "Gains/Losses Not Affecting Retained Earnings",
      "Common Stock",
      "Foreign Currency Translation Adjustments",
      "Total Capitalization", // Note: Check for duplicate or similar labels like "Total Capitalisation"
      "Working Capital",
      "Retained Earnings",
      "Pension and Other Post Retirement Benefit Plans Current", // Note: Typically considered a liability
      "Preferred Stock",
      "Additional Paid In Capital",
      "Restricted Common Stock",
      "Other Equity Interest",
      "General Partnership Capital",
      "Limited Partnership Capital",
      "Preferred Shares Number",
      "Preferred Securities Outside Stock Equity",
      "Preferred Stock Equity",
      "Unrealized Gain/Loss",
      "Total Partnership Capital",
      "Other Capital Stock",
      "Fixed Assets Revaluation Reserve",

    ];
    return equityLabels.includes(label);
  };

  // Define functions to check if a row belongs to a specific Income Statement section

    const isRevenueRow = (label) => {
      return ['Total Revenue', 'Cost of Revenue', 'Gross Profit'].includes(label);
    };

    const isOperatingExpenseRow = (label) => {
      return ['Research and Development', 'Selling General and Administration', 'Total Operating Expense'].includes(label);
    };

    const isIncomeRow = (label) => {
      return ['Operating Income', 'Interest Expense', 'Other Income Expense', 'Pretax Income', 'Tax Provision', 'Net Income', 'Net Income Continuous Operations', 'Net Income Common Stockholders'].includes(label);
    };

    const isEpsRow = (label) => {
      return ['Basic Average Shares', 'Diluted Average Shares', 'Basic EPS', 'Diluted EPS'].includes(label);
    };

      const isOperatingActivityRow = (label) => {
    const operatingActivitiesLabels = [
      "Net Income",
      "Depreciation And Amortization",
      "Deferred Income Tax",
      "Stock Based Compensation",
      "Change In Working Capital",
      "Changes In Account Receivables",
      "Change In Inventory",
      "Change In Account Payable",
      "Other Non-Cash Items",
      "Operating Cash Flow", // This might be your total line
    ];
    return operatingActivitiesLabels.includes(label);
  };

  const isInvestingActivityRow = (label) => {
    const investingActivitiesLabels = [
      "Capital Expenditure",
      "Investing Cash Flow",
      "Purchase Of Business",
      "Purchase Of Investment",
      "Sale Of Investment",
      "Net Other Investing Changes", // This might be your total line
    ];
    return investingActivitiesLabels.includes(label);
  };

  const isFinancingActivityRow = (label) => {
    const financingActivitiesLabels = [
      "Cash Dividends Paid",
      "Common Stock Issuance",
      "Repayment Of Debt",
      "Repurchase Of Capital Stock",
      "Cash Flow From Continuing Financing Activities",
      "Net Other Financing Charges", // This might be your total line
    ];
    return financingActivitiesLabels.includes(label);
  };

  const isSupplementalInformationRow = (label) => {
  const supplementalInformationLabels = [
    "Free Cash Flow",
    "Change In Cash Supplemental As Reported",
    "Beginning Cash Position",
    "End Cash Position",
  ];
  return supplementalInformationLabels.includes(label);
};


  
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
              fontSize: '15px'
          }}>
            Breakdown
          </th>
          <th style={{ 
              textAlign: 'right', 
              backgroundColor: 'rgba(200, 200, 200, 0.2)', // Updated background color
              padding: '10px', 
              fontSize: '15px'
          }}>
            {endDate || ''}
          </th>
        </tr>
      </thead>
      <tbody>
        {/* Conditional Rendering for Balance Sheet Sections */}
        {statementType === 'balance' && (
          <>
        {/* Assets Section Header with Toggle */}
        <tr onClick={() => toggleSection('assets')} className="cursor-pointer bg-gray-100">
          <td className="font-bold text-sm text-gray-800 p-2">Assets</td>
          <td className="p-2 flex justify-end">
            <FaChevronDown className={`transition-transform ${visibleSections.assets ? 'rotate-180' : 'rotate-0'}`} />
          </td>
        </tr>

        {visibleSections.assets && rows.filter(row => isAssetRow(row.label)).map(renderRow)}

        {/* Liabilities Section Header with Toggle */}
        <tr onClick={() => toggleSection('liabilities')} className="cursor-pointer bg-gray-100">
          <td className="font-bold text-sm text-gray-800 p-2">Liabilities</td>
          <td className="p-2 flex justify-end">
            <FaChevronDown className={`transition-transform ${visibleSections.liabilities ? 'rotate-180' : 'rotate-0'}`} />
          </td>
        </tr>
        {visibleSections.liabilities && rows.filter(row => isLiabilityRow(row.label)).map(renderRow)}

        {/* Equity Section Header with Toggle */}
        <tr onClick={() => toggleSection('equity')} className="cursor-pointer bg-gray-100">
          <td className="font-bold text-sm text-gray-800 p-2">Equity</td>
          <td className="p-2 flex justify-end">
            <FaChevronDown className={`transition-transform ${visibleSections.equity ? 'rotate-180' : 'rotate-0'}`} />
          </td>
        </tr>
        {visibleSections.equity && rows.filter(row => isEquityRow(row.label)).map(renderRow)}

     
          </>
        )}
  
        {/* Non-Balance Sheet Rows (Income Statement and Cash Flow Statement) */}

        {/* Income Statement Sections */}
          {statementType === 'income' && (
            <>
              {/* Revenue Section */}
              <tr onClick={() => toggleSection('revenue')} className="cursor-pointer bg-gray-100">
                <td className="font-bold text-sm text-gray-800 p-2">Revenue</td>
                <td className="p-2 flex justify-end">
                  <FaChevronDown className={`transition-transform ${visibleSections.revenue ? 'rotate-180' : 'rotate-0'}`} />
                </td>
              </tr>
              {visibleSections.revenue && rows.filter(row => row.label === "Total Revenue" || row.label === "Cost of Revenue" || row.label === "Gross Profit").map(renderRow)}

              {/* Operating Expenses Section */}
              <tr onClick={() => toggleSection('operatingExpenses')} className="cursor-pointer bg-gray-100">
                <td className="font-bold text-sm text-gray-800 p-2">Operating Expenses</td>
                <td className="p-2 flex justify-end">
                  <FaChevronDown className={`transition-transform ${visibleSections.operatingExpenses ? 'rotate-180' : 'rotate-0'}`} />
                </td>
              </tr>
              {visibleSections.operatingExpenses && rows.filter(row => isOperatingExpenseRow(row.label)).map(renderRow)}

              {/* Income Section */}
              <tr onClick={() => toggleSection('income')} className="cursor-pointer bg-gray-100">
                <td className="font-bold text-sm text-gray-800 p-2">Income</td>
                <td className="p-2 flex justify-end">
                  <FaChevronDown className={`transition-transform ${visibleSections.income ? 'rotate-180' : 'rotate-0'}`} />
                </td>
              </tr>
              {visibleSections.income && rows.filter(row => isIncomeRow(row.label)).map(renderRow)}


              {/* Earnings Per Share (EPS) Section */}
              <tr onClick={() => toggleSection('eps')} className="cursor-pointer bg-gray-100">
                <td className="font-bold text-sm text-gray-800 p-2">Earnings Per Share</td>
                <td className="p-2 flex justify-end">
                  <FaChevronDown className={`transition-transform ${visibleSections.eps ? 'rotate-180' : 'rotate-0'}`} />
                </td>
              </tr>
              {visibleSections.eps && rows.filter(row => row.label.includes("EPS") || row.label.includes("Shares")).map(renderRow)}
            </>
          )}

      {statementType === 'cash' && (
  <>
    {/* Operating Activities Section with Toggle */}
    <tr onClick={() => toggleSection('operatingActivities')} className="cursor-pointer bg-gray-100">
      <td className="font-bold text-sm text-gray-800 p-2">Operating Activities</td>
      <td className="p-2 flex justify-end">
        <FaChevronDown className={`transition-transform ${visibleSections.operatingActivities ? 'rotate-180' : 'rotate-0'}`} />
      </td>
    </tr>
    {visibleSections.operatingActivities && rows.filter(row => isOperatingActivityRow(row.label)).map(renderRow)}

    {/* Investing Activities Section with Toggle */}
    <tr onClick={() => toggleSection('investingActivities')} className="cursor-pointer bg-gray-100">
      <td className="font-bold text-sm text-gray-800 p-2">Investing Activities</td>
      <td className="p-2 flex justify-end">
        <FaChevronDown className={`transition-transform ${visibleSections.investingActivities ? 'rotate-180' : 'rotate-0'}`} />
      </td>
    </tr>
    {visibleSections.investingActivities && rows.filter(row => isInvestingActivityRow(row.label)).map(renderRow)}

    {/* Financing Activities Section with Toggle */}
    <tr onClick={() => toggleSection('financingActivities')} className="cursor-pointer bg-gray-100">
      <td className="font-bold text-sm text-gray-800 p-2">Financing Activities</td>
      <td className="p-2 flex justify-end">
        <FaChevronDown className={`transition-transform ${visibleSections.financingActivities ? 'rotate-180' : 'rotate-0'}`} />
      </td>
    </tr>
    {visibleSections.financingActivities && rows.filter(row => isFinancingActivityRow(row.label)).map(renderRow)}

    {/* Supplemental Information Section with Toggle */}
    <tr onClick={() => toggleSection('supplementalInformation')} className="cursor-pointer bg-gray-100">
      <td className="font-bold text-sm text-gray-800 p-2">Supplemental Information</td>
      <td className="p-2 flex justify-end">
        <FaChevronDown className={`transition-transform ${visibleSections.supplementalInformation ? 'rotate-180' : 'rotate-0'}`} />
      </td>
    </tr>
    {visibleSections.supplementalInformation && rows.filter(row => isSupplementalInformationRow(row.label)).map(renderRow)}
  </>
)}


      </tbody>
    </table>
  );
  
  // Helper function to render rows to avoid repetition
  function renderRow(row, index) {
    let rowStyle = {};
  
    if (isAssetRow(row.label)) {
      rowStyle.backgroundColor = 'rgba(53, 168, 83, 0.1)';
    } else if (isLiabilityRow(row.label)) {
      rowStyle.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    } else if (isEquityRow(row.label)) {
      rowStyle.backgroundColor = 'rgba(106, 132, 157, 0.1)';
    }
  
    if (row.label === "Total Assets") {
      rowStyle.backgroundColor = 'rgba(53, 168, 83, 0.2)';
    } else if (row.label === "Total Liabilities") {
      rowStyle.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    } else if (row.label === "Stockholders Equity") {
      rowStyle.backgroundColor = 'rgba(106, 132, 157, 0.2)';
    }

      // Highlighting for Income Statement Sections
    if (statementType === 'income') {
    if (isRevenueRow(row.label)) {
        rowStyle.backgroundColor = 'rgba(224, 208, 139, 0.1)'; // Updated color for Revenue
    
        } else if (isOperatingExpenseRow(row.label)) {
            rowStyle.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        } else if (isIncomeRow(row.label)) {
            rowStyle.backgroundColor = 'rgba(53, 168, 83, 0.1)'; // Light green for Income rows
            // Highlighting Total lines with stronger colors specifically for the Income Statement
            if (row.label === "Gross Profit" || row.label === "Total Operating Expense" || row.label === "Net Income" || row.label === "Net Income Continuous Operations" || row.label === "Net Income Common Stockholders") {
                rowStyle.backgroundColor = 'rgba(53, 168, 83, 0.3)'; // Darker green for specific total lines
            }
        } else if (isEpsRow(row.label)) {
            rowStyle.backgroundColor = 'rgba(106, 132, 157, 0.1)';
        }
    } else if (statementType === 'cash') {
        if (isIncomeRow(row.label)) {
            // Optionally set a different color or leave it without special coloring
            rowStyle.backgroundColor = ''; // No specific color for "Net Income" in Cash Flow
        }
    }

     // Adding color coding for cash flow sections
  if (statementType === 'cash') {
    if (isOperatingActivityRow(row.label)) {
      rowStyle.backgroundColor = 'rgba(224, 208, 139, 0.1)';  // Yellow for operating activities
    } else if (isInvestingActivityRow(row.label)) {
      rowStyle.backgroundColor = 'rgba(53, 168, 83, 0.1)'; // Orange for investing activities
    } else if (isFinancingActivityRow(row.label)) {
      rowStyle.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // Light blue for financing activities
    } else if (isSupplementalInformationRow(row.label)) {
      rowStyle.backgroundColor = 'rgba(106, 132, 157, 0.1)';// Purple for supplemental information
    }
  }


    // Highlighting Total lines with stronger colors
    if (statementType === 'income') {
        if (row.label === "Gross Profit") {
             rowStyle.backgroundColor = 'rgba(224, 208, 139, 0.2)';
        } else if (row.label === "Total Operating Expense") {
            rowStyle.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        } else if (row.label === "Net Income" || row.label === "Net Income Continuous Operations" || row.label === "Net Income Common Stockholders") {
            rowStyle.backgroundColor = 'rgba(53, 168, 83, 0.2)'; // Green for Net Income related rows
        }
    }

  

    return (
      <tr key={index} style={rowStyle}>
        <td style={{ textAlign: 'left', padding: '8px', fontSize: '12px' }}>
          {row.label}
        </td>
        <td style={{ textAlign: 'right', padding: '8px', fontSize: '12px' }}>
          {row.value || 'N/A'}
        </td>
      </tr>
    );
  }}
  


export default StatementTable;
