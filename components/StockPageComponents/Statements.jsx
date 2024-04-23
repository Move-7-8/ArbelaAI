import React, { useState } from 'react';
import StatementTable from './StatementTables';

const FinancialStatements = ({ data, data2, cacheData, dbData }) => {
    const [activeStatement, setActiveStatement] = useState('income');

    const renderTab = (title, statementType) => {
        const isActive = activeStatement === statementType;
        const buttonClass = `text-sm mr-2 px-3 py-1 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`;
        return (
            <button className={buttonClass} onClick={() => setActiveStatement(statementType)}>
                {title}
            </button>
        );
    };

    if (!cacheData || !data2) {
        return (
            <div className="animate-pulse">
                <div className="bg-gray-200 h-64 w-full mt-4 rounded"></div>
            </div>
        );
    }

    const defaultReportedValue = { reportedValue: { fmt: 'Data not available' } };

    const findFirstValidData = (array, defaultValue) => {
        if (!Array.isArray(array) || array.length === 0) return defaultValue.reportedValue.fmt;
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] && array[i].reportedValue && typeof array[i].reportedValue.fmt === 'string') {
                return array[i].reportedValue.fmt;
            }
        }
        return defaultValue.reportedValue.fmt;
    };

    const incomeStatementData = activeStatement === 'income' && dbData ? {
        endDate: dbData?.['get-balance']?.balanceSheetHistory?.balanceSheetStatements?.[0]?.endDate?.fmt || 'N/A',
        TrailingBasicAverageShares: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingBasicAverageShares, defaultReportedValue),
    
        TrailingBasicEPS: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingBasicEPS, defaultReportedValue),
    
        TrailingCostOfRevenue: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingCostOfRevenue, defaultReportedValue),
    
        TrailingDilutedAverageShares: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingDilutedAverageShares, defaultReportedValue),
    
        TrailingDilutedEPS: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingDilutedEPS, defaultReportedValue),
        
        TrailingGrossProfit: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingGrossProfit, defaultReportedValue),
        
        TrailingInterestExpense: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingInterestExpense, defaultReportedValue),
        
        TrailingNetIncome: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingNetIncome, defaultReportedValue),
        
        TrailingNetIncomeCommonStockholders: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingNetIncomeCommonStockholders, defaultReportedValue),
        
        TrailingNetIncomeContinuousOperations: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingNetIncomeContinuousOperations, defaultReportedValue),
        
        TrailingOperatingExpense: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingOperatingExpense, defaultReportedValue),
    
        TrailingOperatingIncome: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingOperatingIncome, defaultReportedValue),
        
        TrailingOtherIncomeExpense: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingOtherIncomeExpense, defaultReportedValue),
        
        TrailingPretaxIncome: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingPretaxIncome, defaultReportedValue),
        
        TrailingResearchAndDevelopment: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingResearchAndDevelopment, defaultReportedValue),
        
        TrailingSellingGeneralAndAdministration: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingSellingGeneralAndAdministration, defaultReportedValue),
        
        TrailingTaxProvision: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingTaxProvision, defaultReportedValue),
        
        TrailingTotalRevenue: findFirstValidData(
            dbData?.['get-income']?.timeSeries?.trailingTotalRevenue, defaultReportedValue),
} : null;

    const balanceSheetData = activeStatement === 'balance' && dbData ? {
        endDate: dbData?.['get-balance']?.balanceSheetHistory?.balanceSheetStatements?.[0]?.endDate?.fmt || 'N/A',
        InvestmentInFinancialAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInvestmentinFinancialAssets, defaultReportedValue),
        OtherEquityAdjustments: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherEquityAdjustments, defaultReportedValue),
        TradingSecurities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTradingSecurities, defaultReportedValue),
        HedgingAssetsCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualHedgingAssetsCurrent, defaultReportedValue),
        CurrentDeferredTaxesLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentDeferredTaxesLiabilities, defaultReportedValue),
        Inventory: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInventory, defaultReportedValue),
        CurrentLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentLiabilities, defaultReportedValue),
        FinishedGoods: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualFinishedGoods, defaultReportedValue),
        ConstructionInProgress: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualConstructionInProgress, defaultReportedValue),
        InvestmentsAndAdvances: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInvestmentsAndAdvances, defaultReportedValue),
        CurrentDeferredRevenue: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentDeferredRevenue, defaultReportedValue),
        LongTermProvisions: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLongTermProvisions, defaultReportedValue),
        ShareIssued: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualShareIssued, defaultReportedValue),
        PrepaidAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualPrepaidAssets, defaultReportedValue), // Duplicate, already present
        MachineryFurnitureEquipment: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualMachineryFurnitureEquipment, defaultReportedValue),
        ReceivablesAdjustmentsAllowances: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualReceivablesAdjustmentsAllowances, defaultReportedValue),
        CurrentDebt: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentDebt, defaultReportedValue),
        OtherCapitalStock: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherCapitalStock, defaultReportedValue),
        TotalNonCurrentLiabilitiesNetMinorityInterest: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTotalNonCurrentLiabilitiesNetMinorityInterest, defaultReportedValue),
        GainsLossesNotAffectingRetainedEarnings: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualGainsLossesNotAffectingRetainedEarnings, defaultReportedValue),
        TotalEquityGrossMinorityInterest: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTotalEquityGrossMinorityInterest, defaultReportedValue),
        OtherIntangibleAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherIntangibleAssets, defaultReportedValue),
        OtherNonCurrentAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherNonCurrentAssets, defaultReportedValue),
        AccumulatedDepreciation: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualAccumulatedDepreciation, defaultReportedValue),
        NetPPE: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNetPPE, defaultReportedValue),
        CurrentDeferredAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentDeferredAssets, defaultReportedValue),
        Leases: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLeases, defaultReportedValue),
        AssetsHeldForSaleCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualAssetsHeldForSaleCurrent, defaultReportedValue),
        TotalLiabilitiesNetMinorityInterest: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTotalLiabilitiesNetMinorityInterest, defaultReportedValue),
        CurrentAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentAssets, defaultReportedValue),
        TangibleBookValue: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTangibleBookValue, defaultReportedValue),
        CapitalLeaseObligations: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCapitalLeaseObligations, defaultReportedValue),
        CashCashEquivalentsAndShortTermInvestments: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCashCashEquivalentsAndShortTermInvestments, defaultReportedValue),
        TradeandOtherPayablesNonCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTradeandOtherPayablesNonCurrent, defaultReportedValue),
        CommonStockEquity: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCommonStockEquity, defaultReportedValue),
        PensionandOtherPostRetirementBenefitPlansCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualPensionandOtherPostRetirementBenefitPlansCurrent, defaultReportedValue),
        CashFinancial: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCashFinancial, defaultReportedValue),
        OtherCurrentLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherCurrentLiabilities, defaultReportedValue),
        CurrentDeferredTaxesAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentDeferredTaxesAssets, defaultReportedValue),
        LongTermCapitalLeaseObligation: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLongTermCapitalLeaseObligation, defaultReportedValue),
        NonCurrentPensionAndOtherPostretirementBenefitPlans: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentPensionAndOtherPostretirementBenefitPlans, defaultReportedValue),
        LoansReceivable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLoansReceivable, defaultReportedValue),
        CurrentCapitalLeaseObligation: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentCapitalLeaseObligation, defaultReportedValue),
        RetainedEarnings: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualRetainedEarnings, defaultReportedValue),
        CommonStock: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCommonStock, defaultReportedValue),
        DividendsPayable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualDividendsPayable, defaultReportedValue),
        CurrentProvisions: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentProvisions, defaultReportedValue),
        GrossPPE: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualGrossPPE, defaultReportedValue),
        NetTangibleAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNetTangibleAssets, defaultReportedValue),
        NonCurrentDeferredTaxesAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredTaxesAssets, defaultReportedValue),
        OtherProperties: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherProperties, defaultReportedValue),
        NonCurrentDeferredAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredAssets, defaultReportedValue),
        OtherReceivables: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherReceivables, defaultReportedValue),
        PayablesAndAccruedExpenses: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualPayablesAndAccruedExpenses, defaultReportedValue),
        OtherShortTermInvestments: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherShortTermInvestments, defaultReportedValue),
        NonCurrentAccountsReceivable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentAccountsReceivable, defaultReportedValue),
        InvestedCapital: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInvestedCapital, defaultReportedValue),
        OtherCurrentBorrowings: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherCurrentBorrowings, defaultReportedValue),
        Goodwill: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualGoodwill, defaultReportedValue),
        CurrentDeferredLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentDeferredLiabilities, defaultReportedValue),
        NetDebt: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNetDebt, defaultReportedValue),
        OtherCurrentAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherCurrentAssets, defaultReportedValue),
        CapitalStock: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCapitalStock, defaultReportedValue),
        OtherInvestments: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherInvestments, defaultReportedValue),
        AccountsReceivable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualAccountsReceivable, defaultReportedValue),
        ForeignCurrencyTranslationAdjustments: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualForeignCurrencyTranslationAdjustments, defaultReportedValue),
        TotalCapitalization: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTotalCapitalization, defaultReportedValue),
        OtherPayable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherPayable, defaultReportedValue),
        Payables: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualPayables, defaultReportedValue),
        TotalNonCurrentAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTotalNonCurrentAssets, defaultReportedValue),
        AccountsPayable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualAccountsPayable, defaultReportedValue),
        NonCurrentDeferredRevenue: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredRevenue, defaultReportedValue),
        CurrentDebtAndCapitalLeaseObligation: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentDebtAndCapitalLeaseObligation, defaultReportedValue),
        LandAndImprovements: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLandAndImprovements, defaultReportedValue),
        InvestmentsinAssociatesatCost: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInvestmentsinAssociatesatCost, defaultReportedValue),
        WorkingCapital: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualWorkingCapital, defaultReportedValue),
        NonCurrentDeferredLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredLiabilities, defaultReportedValue),
        EmployeeBenefits: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualEmployeeBenefits, defaultReportedValue),
        OrdinarySharesNumber: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOrdinarySharesNumber, defaultReportedValue),
        LongTermDebt: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLongTermDebt, defaultReportedValue),
        TotalAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTotalAssets, defaultReportedValue),
        InventoriesAdjustmentsAllowances: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInventoriesAdjustmentsAllowances, defaultReportedValue),
        StockholdersEquity: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualStockholdersEquity, defaultReportedValue),
        NonCurrentDeferredTaxesLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentDeferredTaxesLiabilities, defaultReportedValue),
        Properties: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualProperties, defaultReportedValue),
        InvestmentProperties: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInvestmentProperties, defaultReportedValue),
        HeldToMaturitySecurities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualHeldToMaturitySecurities, defaultReportedValue),
        FinancialAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualFinancialAssets, defaultReportedValue),
        DuefromRelatedPartiesNonCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualDuefromRelatedPartiesNonCurrent, defaultReportedValue),
        RawMaterials: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualRawMaterials, defaultReportedValue),
        NonCurrentAccruedExpenses: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentAccruedExpenses, defaultReportedValue),
        DuetoRelatedPartiesNonCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualDuetoRelatedPartiesNonCurrent, defaultReportedValue),
        InterestPayable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInterestPayable, defaultReportedValue),
        CashEquivalents: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCashEquivalents, defaultReportedValue),
        TaxesReceivable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTaxesReceivable, defaultReportedValue),
        AvailableForSaleSecurities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualAvailableForSaleSecurities, defaultReportedValue),
        NonCurrentPrepaidAssets: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentPrepaidAssets, defaultReportedValue),
        DerivativeProductLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualDerivativeProductLiabilities, defaultReportedValue),
        TreasurySharesNumber: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTreasurySharesNumber, defaultReportedValue),
        FixedAssetsRevaluationReserve: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualFixedAssetsRevaluationReserve, defaultReportedValue),
        InvestmentsInOtherVenturesUnderEquityMethod: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInvestmentsInOtherVenturesUnderEquityMethod, defaultReportedValue),
        AdditionalPaidInCapital: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualAdditionalPaidInCapital, defaultReportedValue),
        DuetoRelatedPartiesCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualDuetoRelatedPartiesCurrent, defaultReportedValue),
        DefinedPensionBenefit: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualDefinedPensionBenefit, defaultReportedValue),
        MinimumPensionLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualMinimumPensionLiabilities, defaultReportedValue),
        CurrentAccruedExpenses: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentAccruedExpenses, defaultReportedValue),
        RestrictedCommonStock: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualRestrictedCommonStock, defaultReportedValue),
        BuildingsAndImprovements: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualBuildingsAndImprovements, defaultReportedValue),
        CommercialPaper: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCommercialPaper, defaultReportedValue),
        PreferredStock: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualPreferredStock, defaultReportedValue),
        OtherNonCurrentLiabilities: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherNonCurrentLiabilities, defaultReportedValue),
        OtherEquityInterest: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherEquityInterest, defaultReportedValue),
        GeneralPartnershipCapital: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualGeneralPartnershipCapital, defaultReportedValue),
        InvestmentsinJointVenturesatCost: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInvestmentsinJointVenturesatCost, defaultReportedValue),
        LineOfCredit: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLineOfCredit, defaultReportedValue),
        IncomeTaxPayable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualIncomeTaxPayable, defaultReportedValue),
        PreferredSharesNumber: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualPreferredSharesNumber, defaultReportedValue),
        InvestmentsinSubsidiariesatCost: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualInvestmentsinSubsidiariesatCost, defaultReportedValue),
        LimitedPartnershipCapital: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLimitedPartnershipCapital, defaultReportedValue),
        OtherInventories: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualOtherInventories, defaultReportedValue),
        RestrictedCash: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualRestrictedCash, defaultReportedValue),
        FinancialAssetsDesignatedasFairValueThroughProfitorLossTotal: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualFinancialAssetsDesignatedasFairValueThroughProfitorLossTotal, defaultReportedValue),
        PreferredSecuritiesOutsideStockEquity: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualPreferredSecuritiesOutsideStockEquity, defaultReportedValue),
        PreferredStockEquity: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualPreferredStockEquity, defaultReportedValue),
        DuefromRelatedPartiesCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualDuefromRelatedPartiesCurrent, defaultReportedValue),
        AllowanceForDoubtfulAccountsReceivable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualAllowanceForDoubtfulAccountsReceivable, defaultReportedValue),
        UnrealizedGainLoss: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualUnrealizedGainLoss, defaultReportedValue),
        TotalTaxPayable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTotalTaxPayable, defaultReportedValue),
        LiabilitiesHeldforSaleNonCurrent: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLiabilitiesHeldforSaleNonCurrent, defaultReportedValue),
        TotalPartnershipCapital: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTotalPartnershipCapital, defaultReportedValue),
        AccruedInterestReceivable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualAccruedInterestReceivable, defaultReportedValue),
        WorkInProcess: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualWorkInProcess, defaultReportedValue),
        GrossAccountsReceivable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualGrossAccountsReceivable, defaultReportedValue),
        NonCurrentNoteReceivables: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNonCurrentNoteReceivables, defaultReportedValue),
        NotesReceivable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualNotesReceivable, defaultReportedValue),
        CurrentNotesPayable: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualCurrentNotesPayable, defaultReportedValue),
        TreasuryStock: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualTreasuryStock, defaultReportedValue),
        LiabilitiesOfDiscontinuedOperations: findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualLiabilitiesOfDiscontinuedOperations, defaultReportedValue),
        SecuritiesAndInvestments:findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualSecuritiesAndInvestments, defaultReportedValue),
        DeferredAssets:findFirstValidData(dbData?.['get-balance']?.timeSeries?.annualDeferredAssets, defaultReportedValue)
} : null;

    const cashflowData = activeStatement === 'cash' && dbData ? {
        endDate: dbData?.['get-balance']?.balanceSheetHistory?.balanceSheetStatements?.[0]?.endDate?.fmt || 'N/A',
        BeginningCashPosition: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingBeginningCashPosition, defaultReportedValue),
        CapitalExpenditure: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingCapitalExpenditure, defaultReportedValue),
        CashDividendsPaid: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingCashDividendsPaid, defaultReportedValue),
        CashFlowFromContinuingFinancingActivities: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingCashFlowFromContinuingFinancingActivities, defaultReportedValue),
        ChangeInAccountPayable: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingChangeInAccountPayable, defaultReportedValue),
        ChangeInCashSupplementalAsReported: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingChangeInCashSupplementalAsReported, defaultReportedValue),
        ChangeInInventory: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingChangeInInventory, defaultReportedValue),
        ChangeInWorkingCapital: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingChangeInWorkingCapital, defaultReportedValue),
        ChangesInAccountReceivables: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingChangesInAccountReceivables, defaultReportedValue),
        CommonStockIssuance: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingCommonStockIssuance, defaultReportedValue),
        DeferredIncomeTax: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingDeferredIncomeTax, defaultReportedValue),
        DepreciationAndAmortization: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingDepreciationAndAmortization, defaultReportedValue),
        EndCashPosition: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingEndCashPosition, defaultReportedValue),
        FreeCashFlow: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingFreeCashFlow, defaultReportedValue),
        InvestingCashFlow: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingInvestingCashFlow, defaultReportedValue),
        NetIncome: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingNetIncome, defaultReportedValue),
        NetOtherFinancingCharges: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingNetOtherFinancingCharges, defaultReportedValue),
        NetOtherInvestingChanges: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingNetOtherInvestingChanges, defaultReportedValue),
        OperatingCashFlow: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingOperatingCashFlow, defaultReportedValue),
        OtherNonCashItems: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingOtherNonCashItems, defaultReportedValue),
        PurchaseOfBusiness: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingPurchaseOfBusiness, defaultReportedValue),
        PurchaseOfInvestment: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingPurchaseOfInvestment, defaultReportedValue),
        RepaymentOfDebt: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingRepaymentOfDebt, defaultReportedValue),
        RepurchaseOfCapitalStock: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingRepurchaseOfCapitalStock, defaultReportedValue),
        SaleOfInvestment: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingSaleOfInvestment, defaultReportedValue),
        StockBasedCompensation: findFirstValidData(dbData?.['get-cashflow']?.timeSeries?.trailingStockBasedCompensation, defaultReportedValue),
} : null;

    return (
        <div>
            <div className="flex justify-center mt-8 mb-4">
                <div className="inline-flex rounded-full bg-gray-200 p-1 space-x-2">
                    {renderTab("Balance Sheet", "balance")}
                    {renderTab("Income Statement", "income")}
                    {renderTab("Cash Flow", "cash")}
                </div>
            </div>
            <div className="flex flex-col space-y-4 mb-4 p-4 sm:p-0">
                {activeStatement === 'balance' && balanceSheetData
                    ? <StatementTable data={balanceSheetData} statementType="balance" />
                    : activeStatement === 'income' && incomeStatementData
                    ? <StatementTable data={incomeStatementData} statementType="income" />
                    : activeStatement === 'cash' && cashflowData
                    ? <StatementTable data={cashflowData} statementType="cash" />
                    : <div className="text-center">Data not available for the selected statement.</div>
                }
            </div>
        </div>
    );
};

export default FinancialStatements;