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
    if (!data2) {
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

        endDate: data2?.['get-balance']?.balanceSheetHistory?.balanceSheetStatements?.[0]?.endDate?.fmt || 'N/A',

        // TotalAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalAssets, defaultReportedValue),
        // CashCashEquivalentsFederalFundsSold: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCashCashEquivalentsAndFederalFundsSold, defaultReportedValue),
        // CashAndCashEquivalents: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCashAndCashEquivalents, defaultReportedValue),
        // MoneyMarketInvestments: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualMoneyMarketInvestments, defaultReportedValue),
        // LongTermEquityInvestment: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLongTermEquityInvestment, defaultReportedValue),
        // DerivativeAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDerivativeAssets, defaultReportedValue),
        // NetLoan: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetLoan, defaultReportedValue),
        // Receivables: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualReceivables, defaultReportedValue),
        // PrepaidAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualPrepaidAssets, defaultReportedValue),
        // NetPPE: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetPPE, defaultReportedValue),
        // GoodwillAndOtherIntangibleAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualGoodwillAndOtherIntangibleAssets, defaultReportedValue),
        // DefinedPensionBenefit: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDefinedPensionBenefit, defaultReportedValue),
        // AssetsHeldForSale: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualAssetsHeldForSale, defaultReportedValue),
        // OtherAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherAssets, defaultReportedValue),
        // TotalLiabilitiesNetMinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalLiabilitiesNetMinorityInterest, defaultReportedValue),
        // TotalDeposits: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalDeposits, defaultReportedValue),
        // TradingLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTradingLiabilities, defaultReportedValue),
        // DerivativeProductLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDerivativeProductLiabilities, defaultReportedValue),
        // LongTermDebtAndCapitalLeaseObligation: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLongTermDebtAndCapitalLeaseObligation, defaultReportedValue),
        // OtherLiabilities: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualOtherLiabilities, defaultReportedValue),
        // TotalEquityGrossMinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalEquityGrossMinorityInterest, defaultReportedValue),
        // StockholdersEquity: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualStockholdersEquity, defaultReportedValue),
        // MinorityInterest: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualMinorityInterest, defaultReportedValue),
        // TotalCapitalization: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalCapitalization, defaultReportedValue),
        // CommonStockEquity: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualCommonStockEquity, defaultReportedValue),
        // NetTangibleAssets: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetTangibleAssets, defaultReportedValue),
        // InvestedCapital: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualInvestedCapital, defaultReportedValue),
        // TangibleBookValue: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTangibleBookValue, defaultReportedValue),
        // TotalDebt: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualTotalDebt, defaultReportedValue),
        // NetDebt: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualNetDebt, defaultReportedValue),

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
        LiabilitiesOfDiscontinuedOperations: findFirstValidData(data2?.['get-balance']?.timeSeries?.annualLiabilitiesOfDiscontinuedOperations, defaultReportedValue),
        SecuritiesAndInvestments:findFirstValidData(data2?.['get-balance']?.timeSeries?.annualSecuritiesAndInvestments, defaultReportedValue),
        DeferredAssets:findFirstValidData(data2?.['get-balance']?.timeSeries?.annualDeferredAssets, defaultReportedValue)
    } : null;

    const incomeStatementData = activeStatement === 'income' && data2 ? {

        endDate: data2?.['get-balance']?.balanceSheetHistory?.balanceSheetStatements?.[0]?.endDate?.fmt || 'N/A',
        TrailingBasicAverageShares: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingBasicAverageShares, defaultReportedValue),
        TrailingBasicEPS: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingBasicEPS, defaultReportedValue),
        TrailingCostOfRevenue: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingCostOfRevenue, defaultReportedValue),
        TrailingDilutedAverageShares: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingDilutedAverageShares, defaultReportedValue),
        TrailingDilutedEPS: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingDilutedEPS, defaultReportedValue),
        TrailingGrossProfit: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingGrossProfit, defaultReportedValue),
        TrailingInterestExpense: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingInterestExpense, defaultReportedValue),
        TrailingNetIncome: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingNetIncome, defaultReportedValue),
        TrailingNetIncomeCommonStockholders: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingNetIncomeCommonStockholders, defaultReportedValue),
        TrailingNetIncomeContinuousOperations: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingNetIncomeContinuousOperations, defaultReportedValue),
        TrailingOperatingExpense: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingOperatingExpense, defaultReportedValue),
        TrailingOperatingIncome: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingOperatingIncome, defaultReportedValue),
        TrailingOtherIncomeExpense: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingOtherIncomeExpense, defaultReportedValue),
        TrailingPretaxIncome: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingPretaxIncome, defaultReportedValue),
        TrailingResearchAndDevelopment: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingResearchAndDevelopment, defaultReportedValue),
        TrailingSellingGeneralAndAdministration: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingSellingGeneralAndAdministration, defaultReportedValue),
        TrailingTaxProvision: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingTaxProvision, defaultReportedValue),
        TrailingTotalRevenue: findFirstValidData(data2?.['get-income']?.timeSeries?.trailingTotalRevenue, defaultReportedValue),
        } : null;


    const cashflowData = activeStatement === 'cash' && data2  ? {

        endDate: data2?.['get-balance']?.balanceSheetHistory?.balanceSheetStatements?.[0]?.endDate?.fmt || 'N/A',
        BeginningCashPosition: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingBeginningCashPosition, defaultReportedValue),
        CapitalExpenditure: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingCapitalExpenditure, defaultReportedValue),
        CashDividendsPaid: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingCashDividendsPaid, defaultReportedValue),
        CashFlowFromContinuingFinancingActivities: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingCashFlowFromContinuingFinancingActivities, defaultReportedValue),
        ChangeInAccountPayable: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingChangeInAccountPayable, defaultReportedValue),
        ChangeInCashSupplementalAsReported: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingChangeInCashSupplementalAsReported, defaultReportedValue),
        ChangeInInventory: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingChangeInInventory, defaultReportedValue),
        ChangeInWorkingCapital: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingChangeInWorkingCapital, defaultReportedValue),
        ChangesInAccountReceivables: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingChangesInAccountReceivables, defaultReportedValue),
        CommonStockIssuance: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingCommonStockIssuance, defaultReportedValue),
        DeferredIncomeTax: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingDeferredIncomeTax, defaultReportedValue),
        DepreciationAndAmortization: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingDepreciationAndAmortization, defaultReportedValue),
        EndCashPosition: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingEndCashPosition, defaultReportedValue),
        FreeCashFlow: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingFreeCashFlow, defaultReportedValue),
        InvestingCashFlow: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingInvestingCashFlow, defaultReportedValue),
        NetIncome: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingNetIncome, defaultReportedValue),
        NetOtherFinancingCharges: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingNetOtherFinancingCharges, defaultReportedValue),
        NetOtherInvestingChanges: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingNetOtherInvestingChanges, defaultReportedValue),
        OperatingCashFlow: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingOperatingCashFlow, defaultReportedValue),
        OtherNonCashItems: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingOtherNonCashItems, defaultReportedValue),
        PurchaseOfBusiness: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingPurchaseOfBusiness, defaultReportedValue),
        PurchaseOfInvestment: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingPurchaseOfInvestment, defaultReportedValue),
        RepaymentOfDebt: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingRepaymentOfDebt, defaultReportedValue),
        RepurchaseOfCapitalStock: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingRepurchaseOfCapitalStock, defaultReportedValue),
        SaleOfInvestment: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingSaleOfInvestment, defaultReportedValue),
        StockBasedCompensation: findFirstValidData(data2?.['get-cashflow']?.timeSeries?.trailingStockBasedCompensation, defaultReportedValue),
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
    <div className="flex flex-col space-y-4 mb-4 p-4 sm:p-0"> {/* This is good for vertical spacing */}
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

