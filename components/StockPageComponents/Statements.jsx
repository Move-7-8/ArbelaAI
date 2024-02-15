import React, { useState } from 'react';
import StatementTable from './StatementTables';

const FinancialStatements = ({ data, data2 }) => {
    console.log('data2', data2)
    const [activeStatement, setActiveStatement] = useState('income');

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

    //NEW FIELDS
    InvestmentInFinancialAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestmentinFinancialAssets, defaultReportedValue),
    OtherEquityAdjustments: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherEquityAdjustments, defaultReportedValue),
    TradingSecurities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTradingSecurities, defaultReportedValue),
    HedgingAssetsCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualHedgingAssetsCurrent, defaultReportedValue),
    CurrentDeferredTaxesLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentDeferredTaxesLiabilities, defaultReportedValue),
    Inventory: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInventory, defaultReportedValue),
    CurrentLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentLiabilities, defaultReportedValue),
    FinishedGoods: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualFinishedGoods, defaultReportedValue),
    ConstructionInProgress: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualConstructionInProgress, defaultReportedValue),
    InvestmentsAndAdvances: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestmentsAndAdvances, defaultReportedValue),
    CurrentDeferredRevenue: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentDeferredRevenue, defaultReportedValue),
    LongTermProvisions: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLongTermProvisions, defaultReportedValue),
    ShareIssued: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualShareIssued, defaultReportedValue),
    PrepaidAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPrepaidAssets, defaultReportedValue), // Duplicate, already present
    MachineryFurnitureEquipment: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualMachineryFurnitureEquipment, defaultReportedValue),
    ReceivablesAdjustmentsAllowances: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualReceivablesAdjustmentsAllowances, defaultReportedValue),
    CurrentDebt: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentDebt, defaultReportedValue),
    OtherCapitalStock: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherCapitalStock, defaultReportedValue),
    TotalNonCurrentLiabilitiesNetMinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalNonCurrentLiabilitiesNetMinorityInterest, defaultReportedValue),
    GainsLossesNotAffectingRetainedEarnings: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualGainsLossesNotAffectingRetainedEarnings, defaultReportedValue),
    TotalEquityGrossMinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalEquityGrossMinorityInterest, defaultReportedValue),
    OtherIntangibleAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherIntangibleAssets, defaultReportedValue),
    OtherNonCurrentAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherNonCurrentAssets, defaultReportedValue),
    AccumulatedDepreciation: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAccumulatedDepreciation, defaultReportedValue),
    NetPPE: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetPPE, defaultReportedValue),
    CurrentDeferredAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentDeferredAssets, defaultReportedValue),
    Leases: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLeases, defaultReportedValue),
    AssetsHeldForSaleCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAssetsHeldForSaleCurrent, defaultReportedValue),
    TotalLiabilitiesNetMinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalLiabilitiesNetMinorityInterest, defaultReportedValue),
    CurrentAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentAssets, defaultReportedValue),
    TangibleBookValue: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTangibleBookValue, defaultReportedValue),
    CapitalLeaseObligations: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCapitalLeaseObligations, defaultReportedValue),
    CashCashEquivalentsAndShortTermInvestments: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCashCashEquivalentsAndShortTermInvestments, defaultReportedValue),
    TradeandOtherPayablesNonCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTradeandOtherPayablesNonCurrent, defaultReportedValue),
    CommonStockEquity: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCommonStockEquity, defaultReportedValue),
    PensionandOtherPostRetirementBenefitPlansCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPensionandOtherPostRetirementBenefitPlansCurrent, defaultReportedValue),
    CashFinancial: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCashFinancial, defaultReportedValue),
    OtherCurrentLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherCurrentLiabilities, defaultReportedValue),
    CurrentDeferredTaxesAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentDeferredTaxesAssets, defaultReportedValue),
    LongTermCapitalLeaseObligation: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLongTermCapitalLeaseObligation, defaultReportedValue),
    NonCurrentPensionAndOtherPostretirementBenefitPlans: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentPensionAndOtherPostretirementBenefitPlans, defaultReportedValue),
    LoansReceivable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLoansReceivable, defaultReportedValue),
    CurrentCapitalLeaseObligation: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentCapitalLeaseObligation, defaultReportedValue),
    RetainedEarnings: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualRetainedEarnings, defaultReportedValue),
    CommonStock: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCommonStock, defaultReportedValue),
    DividendsPayable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDividendsPayable, defaultReportedValue),
    CurrentProvisions: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentProvisions, defaultReportedValue),
    GrossPPE: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualGrossPPE, defaultReportedValue),
    NetTangibleAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetTangibleAssets, defaultReportedValue),
    NonCurrentDeferredTaxesAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredTaxesAssets, defaultReportedValue),
    OtherProperties: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherProperties, defaultReportedValue),
    NonCurrentDeferredAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredAssets, defaultReportedValue),
    OtherReceivables: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherReceivables, defaultReportedValue),
    PayablesAndAccruedExpenses: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPayablesAndAccruedExpenses, defaultReportedValue),
    OtherShortTermInvestments: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherShortTermInvestments, defaultReportedValue),
    NonCurrentAccountsReceivable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentAccountsReceivable, defaultReportedValue),
    InvestedCapital: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestedCapital, defaultReportedValue),
    OtherCurrentBorrowings: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherCurrentBorrowings, defaultReportedValue),
    Goodwill: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualGoodwill, defaultReportedValue),
    CurrentDeferredLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentDeferredLiabilities, defaultReportedValue),
    NetDebt: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetDebt, defaultReportedValue),
    OtherCurrentAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherCurrentAssets, defaultReportedValue),
    CapitalStock: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCapitalStock, defaultReportedValue),
    OtherInvestments: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherInvestments, defaultReportedValue),
    AccountsReceivable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAccountsReceivable, defaultReportedValue),
    ForeignCurrencyTranslationAdjustments: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualForeignCurrencyTranslationAdjustments, defaultReportedValue),
    TotalCapitalization: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalCapitalization, defaultReportedValue),
    OtherPayable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherPayable, defaultReportedValue),
    Payables: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPayables, defaultReportedValue),
    TotalNonCurrentAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalNonCurrentAssets, defaultReportedValue),
    AccountsPayable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAccountsPayable, defaultReportedValue),
    NonCurrentDeferredRevenue: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredRevenue, defaultReportedValue),
    CurrentDebtAndCapitalLeaseObligation: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentDebtAndCapitalLeaseObligation, defaultReportedValue),
    LandAndImprovements: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLandAndImprovements, defaultReportedValue),
    InvestmentsinAssociatesatCost: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestmentsinAssociatesatCost, defaultReportedValue),
    WorkingCapital: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualWorkingCapital, defaultReportedValue),
    NonCurrentDeferredLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredLiabilities, defaultReportedValue),
    EmployeeBenefits: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualEmployeeBenefits, defaultReportedValue),
    OrdinarySharesNumber: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOrdinarySharesNumber, defaultReportedValue),
    LongTermDebt: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLongTermDebt, defaultReportedValue),
    TotalAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalAssets, defaultReportedValue),
    InventoriesAdjustmentsAllowances: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInventoriesAdjustmentsAllowances, defaultReportedValue),
    StockholdersEquity: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualStockholdersEquity, defaultReportedValue),
    NonCurrentDeferredTaxesLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentDeferredTaxesLiabilities, defaultReportedValue),
    Properties: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualProperties, defaultReportedValue),
    InvestmentProperties: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestmentProperties, defaultReportedValue),
    HeldToMaturitySecurities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualHeldToMaturitySecurities, defaultReportedValue),
    FinancialAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualFinancialAssets, defaultReportedValue),
    DuefromRelatedPartiesNonCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDuefromRelatedPartiesNonCurrent, defaultReportedValue),
    RawMaterials: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualRawMaterials, defaultReportedValue),
    NonCurrentAccruedExpenses: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentAccruedExpenses, defaultReportedValue),
    DuetoRelatedPartiesNonCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDuetoRelatedPartiesNonCurrent, defaultReportedValue),
    InterestPayable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInterestPayable, defaultReportedValue),
    CashEquivalents: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCashEquivalents, defaultReportedValue),
    TaxesReceivable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTaxesReceivable, defaultReportedValue),
    AvailableForSaleSecurities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAvailableForSaleSecurities, defaultReportedValue),
    NonCurrentPrepaidAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentPrepaidAssets, defaultReportedValue),
    DerivativeProductLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDerivativeProductLiabilities, defaultReportedValue),
    TreasurySharesNumber: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTreasurySharesNumber, defaultReportedValue),
    FixedAssetsRevaluationReserve: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualFixedAssetsRevaluationReserve, defaultReportedValue),
    InvestmentsInOtherVenturesUnderEquityMethod: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestmentsInOtherVenturesUnderEquityMethod, defaultReportedValue),
    AdditionalPaidInCapital: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAdditionalPaidInCapital, defaultReportedValue),
    DuetoRelatedPartiesCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDuetoRelatedPartiesCurrent, defaultReportedValue),
    DefinedPensionBenefit: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDefinedPensionBenefit, defaultReportedValue),
    MinimumPensionLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualMinimumPensionLiabilities, defaultReportedValue),
    CurrentAccruedExpenses: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentAccruedExpenses, defaultReportedValue),
    RestrictedCommonStock: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualRestrictedCommonStock, defaultReportedValue),
    BuildingsAndImprovements: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualBuildingsAndImprovements, defaultReportedValue),
    CommercialPaper: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCommercialPaper, defaultReportedValue),
    PreferredStock: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPreferredStock, defaultReportedValue),
    OtherNonCurrentLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherNonCurrentLiabilities, defaultReportedValue),
    OtherEquityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherEquityInterest, defaultReportedValue),
    GeneralPartnershipCapital: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualGeneralPartnershipCapital, defaultReportedValue),
    InvestmentsinJointVenturesatCost: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestmentsinJointVenturesatCost, defaultReportedValue),
    LineOfCredit: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLineOfCredit, defaultReportedValue),
    IncomeTaxPayable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualIncomeTaxPayable, defaultReportedValue),
    PreferredSharesNumber: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPreferredSharesNumber, defaultReportedValue),
    InvestmentsinSubsidiariesatCost: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestmentsinSubsidiariesatCost, defaultReportedValue),
    LimitedPartnershipCapital: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLimitedPartnershipCapital, defaultReportedValue),
    OtherInventories: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherInventories, defaultReportedValue),
    RestrictedCash: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualRestrictedCash, defaultReportedValue),
    FinancialAssetsDesignatedasFairValueThroughProfitorLossTotal: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualFinancialAssetsDesignatedasFairValueThroughProfitorLossTotal, defaultReportedValue),
    PreferredSecuritiesOutsideStockEquity: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPreferredSecuritiesOutsideStockEquity, defaultReportedValue),
    PreferredStockEquity: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPreferredStockEquity, defaultReportedValue),
    DuefromRelatedPartiesCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDuefromRelatedPartiesCurrent, defaultReportedValue),
    AllowanceForDoubtfulAccountsReceivable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAllowanceForDoubtfulAccountsReceivable, defaultReportedValue),
    UnrealizedGainLoss: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualUnrealizedGainLoss, defaultReportedValue),
    TotalTaxPayable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalTaxPayable, defaultReportedValue),
    LiabilitiesHeldforSaleNonCurrent: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLiabilitiesHeldforSaleNonCurrent, defaultReportedValue),
    TotalPartnershipCapital: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalPartnershipCapital, defaultReportedValue),
    AccruedInterestReceivable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAccruedInterestReceivable, defaultReportedValue),
    WorkInProcess: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualWorkInProcess, defaultReportedValue),
    GrossAccountsReceivable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualGrossAccountsReceivable, defaultReportedValue),
    NonCurrentNoteReceivables: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNonCurrentNoteReceivables, defaultReportedValue),
    NotesReceivable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNotesReceivable, defaultReportedValue),
    CurrentNotesPayable: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCurrentNotesPayable, defaultReportedValue),
    TreasuryStock: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTreasuryStock, defaultReportedValue),
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
    } : null;


    const cashflowData = activeStatement === 'cash' && data.financeAnalytics  ? {
        endDate: data.balanceSheet.endDate?.fmt || 'N/A',
        operatingCashflow: data.financeAnalytics.operatingCashflow?.longFmt || 'Data not available',
        totalCash: data.financeAnalytics.totalCash?.longFmt || 'Data not available',
        totalCashPerShare: data.financeAnalytics.totalCashPerShare?.fmt || 'Data not available',
        totalDebt: data.financeAnalytics.totalDebt?.longFmt || 'Data not available',
        debtToEquity: data.financeAnalytics.debtToEquity?.fmt || 'Data not available',
        freeCashflow: data.financeAnalytics.freeCashflow?.longFmt || 'Data not available',
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

