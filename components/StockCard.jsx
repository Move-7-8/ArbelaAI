"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';


function StockCard({ company }) {
    // Function to truncate the company name if it's too long
    const truncateCompanyName = (Name) => {
        return Name.length > 20 ? Name.substring(0, 20) + "..." : Name;
    };

    // Convert the Strings to Numerical
    const Price = +company.Price;

    const MarketCapitalisation = +company.MarketCapitalisation;
    const fiftyTwoWeekHigh = +company.fiftyTwoWeekHigh;

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
    const change = +((Price - company.LastPrice) / company.LastPrice) * 100;
    const liquidity = +company.Liquidity;
    const volatilityScore = +company.VolatilityScore;
    const liquidityScore = +company.LiquidityScore;

    // Relative Calculations
    const linkPath = {
        pathname: `/companies/${company.Name.toLowerCase().replace(/ /g, '')}`,
        query: {
            companyName: company.Name,
            ticker: company.Stock,
            industry: company.GICsIndustryGroup,
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

    return (
    <Link 
        href={linkPath} 
        className="stock_card cursor-pointer transform transition-transform duration-200 hover:scale-105  w-full max-w-sm mx-auto bg-white/30 border border-gray-200 rounded-lg shadow flex flex-col"
        style={{   minWidth: '270px' }} 
    >
        <div className="px-5 mt-5 flex-grow flex flex-col justify-between">
            <div className="" style={{ height: '30px' }}>
                <h5 className="text-lg font-semibold tracking-tight text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                    {truncateCompanyName(company.Name)}
                </h5>
            </div>
            <div className="flex items-center mb-5" style={{ height: '25px' }}>
                <span style={{ backgroundColor: 'rgba(106, 132, 157, 0.9)' }} className="text-white text-xs font-semibold mr-2 px-2.5 rounded">
                    {company.Stock}
                </span>
            </div>
            <div className="flex items-center">
                <span className="text-xl text-gray-900 mr-4">
                    ${company.Price.toFixed(2)}
                </span>
              <span className="text-xl" style={{ color: change >= 0 ? 'rgba(53, 168, 83, 0.7)' : 'rgba(255, 0, 0, 0.7)' }}>
                {change.toFixed(2)}%
            </span>

            </div>
            <div className="mb-5" style={{ height: '25px' }}>
               <span className="text-xs text-gray-900 overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical'
            }}>
                {company.GICsIndustryGroup}
            </span>
            </div>

        </div>
    </Link>
);
    }
export default StockCard;