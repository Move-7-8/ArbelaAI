"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';


function StockCard({ company }) {
    // Function to truncate the company name if it's too long
    const truncateCompanyName = (name) => {
        return name.length > 20 ? name.substring(0, 20) + "..." : name;
    };

    // Convert the Strings to Numerical
    const Price = +company.Price;
    const MarketCapitalisation = +company.MarketCapitalisation;
    const fiftyTwoWeekHigh = +company.fiftyTwoWeekHigh;
    // console.log('Converted fiftyTwoWeekHigh Front end type:', typeof fiftyTwoWeekHigh, 'Value:', fiftyTwoWeekHigh);

    const fiftyTwoWeekLow = +company.fiftyTwoWeekLow;
    const fiftyTwoWeekChangePercent = +company.fiftyTwoWeekChangePercent;
    const twoHundredDayAverageChangePercent = +company.twoHundredDayAverageChangePercent;
    const fiftyDayAverageChangePercent = +company.fiftyDayAverageChangePercent;
    const averageDailyVolume3Month = +company.averageDailyVolume3Month;
    const regularMarketVolume = +company.regularMarketVolume;
    const priceToBook = +company.priceToBook;
    const trailingAnnualDividendRate = +company.trailingAnnualDividendRate;
    const epsTrailingTwelveMonths = +company.epsTrailingTwelveMonths;
    const LastPrice = +company.LastPrice;
    
    //Calculated 
    const rangeVolatility = +company.RangeVolatility;
    const percentageChangeVolatility = +company.PercentageChangeVolatility;
    const volatility = +company.Volatility;
    const change = +company.Change;
    const liquidity = +company.Liquidity;
    const volatilityScore = +company.VolatilityScore;
    const liquidityScore = +company.LiquidityScore;


    // Relative Calculations
    const linkPath = {
        pathname: `/companies/${company['Company name'].toLowerCase().replace(/ /g, '')}`,
        query: {
            //Direct
            companyName: company["Company name"],
            ticker: company.ASX_code,
            industry: company.GICsindustrygroup,
            price: Price,
            MarketCapitalisation: MarketCapitalisation,
            fiftyTwoWeekHigh: fiftyTwoWeekHigh, 
            fiftyTwoWeekLow: fiftyTwoWeekLow,
            fiftyTwoWeekChangePercent: fiftyTwoWeekChangePercent,
            twoHundredDayAverageChangePercent: twoHundredDayAverageChangePercent, 
            fiftyDayAverageChangePercent: fiftyDayAverageChangePercent,
            averageDailyVolume3Month: averageDailyVolume3Month,
            regularMarketVolume: regularMarketVolume,
            priceToBook: priceToBook,
            trailingAnnualDividendRate: trailingAnnualDividendRate,
            epsTrailingTwelveMonths: epsTrailingTwelveMonths,
            LastPrice: LastPrice,

            //Calculated
            rangeVolatility: rangeVolatility,
            percentageChangeVolatility: percentageChangeVolatility,
            volatility: volatility, 
            change: change,
            liquidity: liquidity,
            volatilityScore: volatilityScore,
            liquidityScore: liquidityScore
        }
    };

    // console.log('company', company["Company name"])
    // console.log('ticker', company.ASX_code)
    // console.log('industry', company.GICsindustrygroup)
    // console.log('price', Price)
    // console.log('change', change)
    // console.log('MarketCap', MarketCapitalisation)
    // console.log('fiftyTwoWeekHigh', fiftyTwoWeekHigh)
    // console.log('fiftyTwoWeekLow', fiftyTwoWeekLow)
    // console.log('fiftyTwoWeekHigh type:', typeof fiftyTwoWeekHigh, 'Value:', fiftyTwoWeekHigh);
    // console.log('fiftyTwoWeekLow type:', typeof fiftyTwoWeekLow, 'Value:', fiftyTwoWeekLow);

    // console.log('fiftyTwoWeekChangePercent', fiftyTwoWeekChangePercent)
    // console.log('twoHundredDayAverageChangePercent', twoHundredDayAverageChangePercent)
    // console.log('fiftyDayAverageChangePercent', fiftyDayAverageChangePercent)
    // console.log('averageDailyVolume3Month', averageDailyVolume3Month)
    // console.log('regularMarketVolume', regularMarketVolume)
    // console.log('priceToBook', priceToBook)

    // console.log('trailingAnnualDividendRate', trailingAnnualDividendRate)
    // console.log('epsTrailingTwelveMonths', epsTrailingTwelveMonths)
    // console.log('LastPrice', company.LastPrice)    
    // console.log('volatility', volatility)
    // console.log('liquidity', liquidity)    
    // // console.log('Volatility Score', stock.volatilityScore)
    // console.log('Volatility Score', volatilityScore)
    // console.log('Liquidity Score', liquidityScore)    

    return (
        <Link 
            href={linkPath} 
            className="cursor-pointer transform transition-transform duration-200 hover:scale-105 w-full max-w-sm mx-auto bg-white/30 border border-gray-200 rounded-lg shadow flex flex-col"
        >
            <div className="px-5 mt-5 flex-grow flex flex-col justify-between">
                <div className="" style={{ height: '30px' }}>
                    <h5 className="text-lg font-semibold tracking-tight text-gray-900">
                        {truncateCompanyName(company['Company name'])}
                    </h5>
                </div>
                <div className="flex items-center mb-5" style={{ height: '25px' }}>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 rounded">
                        {company.ASX_code}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="text-xl text-gray-900 mr-4">
                        ${company['Price']}
                    </span>
                    <span className={`text-xl ${((company['Change (%)'] / company['Price']) >= 0) ? 'text-green-500' : 'text-red-500'}`}>
                        {(company['Change (%)'] / company['Price']).toFixed(2)}%
                    </span>
                </div>
                <div className="mb-10" style={{ height: '25px' }}>
                    <span className="text-sm text-gray-900">
                        {company['GICsindustrygroup']}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default StockCard;




    // // 1. Ranking the Stocks by Volatility
    // company.sort((a, b) => a.volatility - b.volatility);
    // // 2. Dividing into Categories
    // const totalStocks = company.length;
    // const stocksPerScore = totalStocks / 10;  // Assuming 2000 stocks, 200 stocks per score
    // // 3. Assigning Scores
    // company.forEach((company, index) => {
    //     // Determine the score by finding out which decile the stock falls into
    //     // The Math.ceil function is used to ensure scores are from 1 to 10
    //     const score = Math.ceil((index + 1) / stocksPerScore);
    //     company.volatilityScore = score;
    // });