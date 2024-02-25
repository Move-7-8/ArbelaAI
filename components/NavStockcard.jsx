import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const NavStockCard = ({ searchResults, isCardVisible, setIsCardVisible }) => {
  const cardRef = useRef(null);

  const truncateCompanyName = (name) => {
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsCardVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsCardVisible]);

  return (
    <ul ref={cardRef} className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg z-30">
      {searchResults.map((company) => {
        const linkPath = {
          pathname: `/companies/${company.Name.toLowerCase().replace(/ /g, '')}`,
          query: {
            companyName: company.Name,
            ticker: company.Stock,
            industry: company.GICsIndustryGroup,
            price: company.Price,
            MarketCapitalisation: company.MarketCapitalisation,
            fiftyTwoWeekHigh: company.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: company.fiftyTwoWeekLow,
            fiftyTwoWeekChangePercent: company.fiftyTwoWeekChangePercent,
            twoHundredDayAverageChangePercent: company.twoHundredDayAverageChangePercent,
            fiftyDayAverageChangePercent: company.fiftyDayAverageChangePercent,
            averageDailyVolume3Month: company.averageDailyVolume3Month,
            regularMarketVolume: company.regularMarketVolume,
            priceToBook: company.priceToBook,
            trailingAnnualDividendRate: company.trailingAnnualDividendRate,
            epsTrailingTwelveMonths: company.epsTrailingTwelveMonths,
            LastPrice: company.LastPrice,
            rangeVolatility: company.rangeVolatility,
            percentageChangeVolatility: company.percentageChangeVolatility,
            volatility: company.volatility,
            change: ((+company.Price - +company.LastPrice) / +company.LastPrice) * 100, // Calculated change
            liquidity: company.liquidity,
            volatilityScore: company.VolatilityScore,
            liquidityScore: company.LiquidityScore,
          }
        };

        return (
          <li key={company.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <Link href={linkPath} passHref>
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">{truncateCompanyName(company.Name)}</span>
                <span className="text-sm text-gray-500">{company.Stock}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavStockCard;
