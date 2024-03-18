"use client"
import React, { useState, useEffect } from 'react';
import { MdLink } from 'react-icons/md';

function DashboardStockCard({ cacheData, data, data2, industry, volatilityScore, liquidityScore }) {
    const [isLiveDataLoaded, setIsLiveDataLoaded] = useState(false);
    console.log('Dashboard Stock Card cacheData',cacheData )
    useEffect(() => {
        if (data) {
            setIsLiveDataLoaded(true); // Set to true once data is loaded
        }
    }, [data]); // Depend on data to trigger the effect

    // Prepare your data values, preferring live data if available, otherwise falling back to cache
   
    console.log('Dashboard cacheData', cacheData?.price?.marketCap?.longFmt)
    console.log('Dashboard liveData', data?.price?.marketCap?.longFmt)

    const companyName = data?.keyStatistics?.longName || cacheData?.keyStatistics?.longName || 'Company Name Not Available';
    const ticker = data?.historic?.meta?.symbol || cacheData?.historic?.meta?.symbol || 'Ticker Not Available';
    const marketCap = data?.price?.marketCap?.longFmt || cacheData?.price?.marketCap?.longFmt || 'Not Available';
    // const marketCap = cacheData?.price?.marketCap?.longFmt || 'Not Available';

    const askPrice = data?.financeAnalytics?.currentPrice || cacheData?.financeAnalytics?.currentPrice || 'Not Available';
    const prevClose = data?.price?.regularMarketPreviousClose?.raw || cacheData?.price?.regularMarketPreviousClose?.raw || 'Not Available';
    const regularMarketChange = data?.price?.regularMarketChange?.raw || cacheData?.price?.regularMarketChange?.raw || 'Not Available';

    const description = cacheData?.['get-profile']?.quoteSummary?.result?.[0]?.summaryProfile?.longBusinessSummary ||
    data2?.['get-profile']?.quoteSummary?.result?.[0]?.summaryProfile?.longBusinessSummary || 
    'Not Available';
    const shortDescription = description.length > 200 ? description.substring(0, 200) + '...' : description;
    const link = cacheData?.['get-profile']?.quoteSummary?.result?.[0]?.summaryProfile?.website ||
    data2?.['get-profile']?.quoteSummary?.result?.[0]?.summaryProfile?.website || 
    'Not Available';

    // const [hover, setHover] = useState(false);
    const volume = data?.price?.regularMarketVolume?.longFmt || cacheData?.price?.regularMarketVolume?.longFmt || 'Not Available';

    //New Data for Ratios Connor added:
    //No need for cached data here 
    const EPS = data?.keyStatistics?.epsCurrentYear?.raw || 'N/A'
    const peRatioLagging = data?.keyStatistics?.priceEpsCurrentYear?.raw || 'N/A'
    const peRatioForward = data?.keyStatistics?.forwardPE?.raw || 'N/A'
    const pbRatio = data?.keyStatistics?.priceToBook?.raw || 'N/A'
    const debtToEquityRatio = data?.financeAnalytics?.debtToEquity?.raw || 'N/A'
    const revenuePerShare = data?.financeAnalytics?.revenuePerShare?.raw || 'N/A'
    const returnOnAssets = data?.financeAnalytics?.returnOnAssets?.raw || 'N/A'
    const returnOnEquity = data?.financeAnalytics?.returnOnEquity?.raw || 'N/A'
    const dividendYield = data?.keyStatistics?.trailingAnnualDividendYield?.raw || 'N/A'

    const formatAskPrice = (askPriceObj) => {
        // Check if askPriceObj is an object with a 'raw' property
        if (askPriceObj && typeof askPriceObj === 'object' && 'raw' in askPriceObj) {
            return `$${Number(askPriceObj.raw).toFixed(2)}`; // Use raw value
        }

        // If askPriceObj is a number, format it to three decimal places
        if (!isNaN(askPriceObj)) {
            return `$${Number(askPriceObj).toFixed(3)}`;
        }

        // Return 'Not Available' if askPriceObj is not valid
        return 'N/A';
    };

    // Ensure askPrice and prevClose are numbers
    const currentPrice = (typeof askPrice === 'object' && askPrice.raw) 
                          ? askPrice.raw 
                          : Number(askPrice);
    const previousClose = Number(prevClose);

    // Calculate price change and percentage change
    // Calculate price change and percentage change
    const priceChange = regularMarketChange;

    const numericPriceChange = Number(priceChange) || 0;
    const numericPreviousClose = Number(previousClose) || 0;
    
    // Calculate percentage change safely
    let percentageChange = 0;
    if (numericPreviousClose !== 0) {
    percentageChange = ((numericPriceChange / numericPreviousClose) * 100).toFixed(2);
    } else if (numericPriceChange !== 0) {
    // Handle edge case where previousClose is 0 but there's a priceChange
    percentageChange = Infinity; // Or handle as appropriate for your application
    } else {
    // This handles the case where both priceChange and previousClose are 0
    // Ensuring percentageChange is explicitly set to 0 avoids the NaN issue
    percentageChange = 0;
    }

    // Convert percentageChange to a number for safe comparison and display
    percentageChange = parseFloat(percentageChange);

        // Custom function to format price change
        const formatPriceChange = (change) => {
            // Convert change to a number to ensure numeric operations are valid
            const numericChange = Number(change);
        
            // Return '0' directly if numericChange is 0 to avoid "NaN" display
            if (numericChange === 0) return '0.00'; // Adjusted to return '0.00' for consistency
        
            // Ensure the number is not NaN before proceeding
            if (isNaN(numericChange)) {
                return '0.00'; // Or any fallback value you prefer
            }
        
            // Threshold for deciding the number of decimal places
            const threshold = 0.01;
        
            // If change is smaller than the threshold, use more decimal places
            if (Math.abs(numericChange) < threshold) {
                return numericChange.toFixed(4); // Adjust the number of decimal places as needed
            }
        
            // For larger changes, use two decimal places
            return numericChange.toFixed(2);
        };
                
        // Define styles for positive and negative changes
    const positiveStyle = {
        backgroundColor: 'rgba(53, 168, 83, 0.5)', // green
        color: '#35A853'
    };

    const negativeStyle = {
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // red
        color: 'red'
    };

    const [activeButton, setActiveButton] = useState('button1');

    const handleLinkClick = (e, url) => {
    e.preventDefault(); // Prevent the default anchor tag behavior
    window.open(url, '_blank', 'noopener,noreferrer'); // Open the link in a new tab
    };

    return (
    <div className="flex flex-col flex-1 rounded-md mx-auto lg-height-80vh">
        {/* Align buttons to the left */}
        <div className="flex justify-center mx-4 pb-4">
            <div
                className="rounded-full inline-block"
                style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)', padding: '3px' }}
            >
                <button
                    className={`text-sm px-3 py-1 rounded-full mr-2 ${activeButton === 'button1' ? 'bg-white' : 'bg-transparent'}`}
                    onClick={() => setActiveButton('button1')}
                >
                    Summary
                </button>
                <button
                    className={`text-sm px-3 py-1 rounded-full ${activeButton === 'button2' ? 'bg-white' : 'bg-transparent'}`}
                    onClick={() => setActiveButton('button2')}
                >
                    Ratio
                </button>
            </div>
        </div>
        <style>
            {`
                @media (min-width: 1024px) {
                .lg-height-80vh {
                    min-height: 80vh; /* Allows growth beyond 82vh if content requires, but not smaller */
                }
                }

            `}
        </style>
        <div className="flex flex-1 mx-4 mb-2 flex-col relative rounded-md p-2" style={{ minHeight: '0%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            {/* Blurred Background */}
            <div className="absolute inset-0 bg-opacity-50" style={{ filter: 'blur(1px)' }}></div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow p-4">
                {activeButton === 'button2' && (
                    <div className="flex flex-col flex-grow">
                        {/* Financial Ratios Header */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold mb-2 text-[#3A3C3E]">Financial Ratios</h2>

                    <p className="text-sm text-gray-600">Key financial ratios of the company.</p>
                </div>
                <div className="border-t border-gray-300 mt-1"></div>

                {/* Financial Ratios Display */}
                <div className="flex flex-col flex-grow space-y-4 md:justify-between mt-2">
                    {/* EPS */}
                    <div className="flex justify-between">
                        <span className="uppercase text-xs text-gray-500">EPS:</span>
                        <span className="text-sm">{EPS}</span>
                    </div>
                    {/* PE Ratio (Lagging) */}
                    <div className="flex justify-between">
                        <span className="uppercase text-xs text-gray-500">PE Ratio (Lagging):</span>
                        <span className="text-sm">{peRatioLagging}</span>
                    </div>
                    {/* PE Ratio (Forward) */}
                    <div className="flex justify-between">
                        <span className="uppercase text-xs text-gray-500">PE Ratio (Forward):</span>
                        <span className="text-sm">{peRatioForward}</span>
                    </div>
                    {/* PB Ratio */}
                    <div className="flex justify-between">
                        <span className="uppercase text-xs text-gray-500">PB Ratio:</span>
                        <span className="text-sm">{pbRatio}</span>
                    </div>
                    {/* Debt to Equity Ratio */}
                    <div className="flex justify-between">
                        <span className="uppercase text-xs text-gray-500">Debt to Equity Ratio:</span>
                        <span className="text-sm">{debtToEquityRatio}</span>
                    </div>
                    {/* Revenue per Share */}
                    <div className="flex justify-between">
                        <span className="uppercase text-xs text-gray-500">Revenue per Share:</span>
                        <span className="text-sm">{revenuePerShare}</span>
                    </div>
                    {/* Return on Assets */}
                    <div className="flex justify-between">
                        <span className="uppercase text-xs text-gray-500">Return on Assets:</span>
                        <span className="text-sm">{returnOnAssets}</span>
                    </div>
                    {/* Return on Equity */}
                    <div className="flex justify-between">
                        <span className="uppercase text-xs text-gray-500">Return on Equity:</span>
                        <span className="text-sm">{returnOnEquity}</span>
                    </div>
                </div>
            </div>
        )}

        {activeButton === 'button1' && (
            <div className="flex flex-col flex-grow">
                {!cacheData ? (
                    // Skeleton loaders for company name and description
                    <div className="mb-2">
                        <div className="bg-gray-200 h-6 w-1/2 rounded"></div> {/* Skeleton for Company Name */}
                        <div className="bg-gray-200 h-4 w-3/4 rounded mt-2"></div> {/* Skeleton for Company Description */}
                    </div>
                ) : (
                    // Actual Company Name and Description
                    
                <div className="mb-2">
                <h2 className="text-xl font-bold text-[#3A3C3E]">{`${companyName}  (${ticker})`}</h2>
            <div>
            <p className="text-sm text-gray-600 mt-2">{shortDescription}</p>
        </div>
        
        {link !== 'Not Available' && (
            <div className="mt-2">
                <a href={link} 
                onClick={(e) => handleLinkClick(e, link)}
                className="text-xs relative z-2 bg-gray-200 rounded px-2 py-1 transition-colors duration-300 hover:bg-[#6A849D] hover:text-white">
                Website
                </a>
            </div>
        )}
        </div>
        )}
        <div className="mt-2 flex justify-between items-center w-full">
            {!cacheData ? (
                // Skeleton loader displayed when data is not available
                <>
                    {/* Skeleton for Stock Price */}
                    <div className="bg-gray-200 h-6 w-1/3 rounded"></div>

                    {/* Skeleton for Price Increase */}
                    <div className="flex items-center">
                        <div className="bg-gray-200 h-6 w-16 rounded mr-2"></div>
                        <div className="bg-gray-200 h-6 w-10 rounded"></div>
                    </div>
                </>
            ) : (
                // Actual content displayed when data is available
                <>
                    {/* Stock Price - Left Aligned */}
                    <div>
                        <span className="text-gray-500 uppercase text-xs block mb-2">Price</span>
                        <span className="font-bold text-l text-[#3A3C3E]">{formatAskPrice(askPrice)}</span>
                    </div>

                    {/* Price Increase - Right Aligned */}
                    <div className="flex items-center">
                        <div>
                            <span className="text-gray-500 uppercase text-xs block">Change</span>
                            <div className="flex items-center mt-1">
                                {/* Price Increase Percentage */}
                                <div className="p-2 rounded flex items-center" 
                                    style={{
                                        backgroundColor: priceChange >= 0 ? 'rgba(53, 168, 83, 0.5)' : 'rgba(255, 0, 0, 0.5)',
                                        color: priceChange >= 0 ? '#35A853' : 'red'
                                    }}>
                                    <span className="mr-2 text-white text-xs">{percentageChange >= 0 ? '↑' : '↓'}</span>
                                    <span className="text-white text-xs">{`${percentageChange}%`}</span>
                                </div>
                                {/* Price Increase in Dollars */}
                                <div className="ml-2 text-xs" 
                                    style={{ 
                                        color: priceChange >= 0 ? '#35A853' : 'red' 
                                    }}>
                                    {`${priceChange >= 0 ? '+' : ''}${formatPriceChange(priceChange)}`}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
        <div className="flex flex-col flex-grow space-y-4 md:justify-between">
        {/* Top Divider */}
        <div className="border-t border-gray-300 mt-4"></div>
                    {/* Conditional Rendering for Skeleton or Actual Data */}
                    {!cacheData ? (
                        // Skeleton Loaders
                        <>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex justify-between my-2 sm:space-x-2 md:space-x-4 lg:space-x-6">
                                <span className="bg-gray-200 h-4 sm:w-2/3 md:w-1/2 lg:w-1/2 rounded"></span>
                                <span className="bg-gray-200 h-4 sm:w-2/3 md:w-1/2 lg:w-1/2 rounded"></span>
                            </div>
                        ))}
                        </>
                    ) : (
                    <>
                        <div className="flex justify-between items-center my-2" style={{ maxWidth: '100%' }}>
                        <span className="text-gray-500 uppercase text-xs flex-shrink-0">Sector:</span>
                        <div className="flex-grow text-right ml-4">
                            <span className="text-sm">
                            {industry || 'N/A'}
                            </span>
                        </div>
                        </div>
                        <div className="flex  items-center justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">Market Cap:</span>
                            <span className="text-sm">${marketCap}</span> {/* Added dollar sign here */}
                        </div>
                        <div className="flex items-center justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">24hr Volume:</span>
                            <span className="text-sm">${volume}</span> {/* And here */}
                        </div>
                            <div className="flex items-center justify-between my-2 relative group">
                            <span className="text-gray-500 uppercase text-xs">Dividend Yield:</span>
                            <span className="text-sm">
                            {dividendYield !== undefined ? `${Number(dividendYield).toFixed(2)}%` : 'N/A'}
                            </span>
                            <span className="tooltiptext  border border-3A3C3E  absolute w-48 bg-white text-xs text-black text-center rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full mb-2">
                                Percentage of the share paid in dividends.
                            </span>
                            </div>
                            <div className="flex items-center justify-between my-2 relative group">
                            <span className="text-gray-500 uppercase text-xs">Volatility Score:</span>
                            <span className="text-sm">{volatilityScore}</span>
                            <span className="tooltiptext border border-3A3C3E  absolute w-48 bg-white text-xs text-black text-center rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full mb-2">
                                Ranks assets on a scale of 1-10 on how volatile they are. 
                            </span>
                            </div>
                            <div className="flex items-center justify-between my-2 relative group">
                            <span className="text-gray-500 uppercase text-xs">Liquidity Score:</span>
                            <span className="text-sm">{liquidityScore}</span>
                            <span className="tooltiptext  border border-3A3C3E  absolute w-48 bg-white text-xs text-black text-center rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300  bottom-full mb-2">
                                Ranks assets on a scale of 1-10 on how liquid they are.
                            </span>
                            </div>
                            </>
                        )}
                        </div>
                    </div>   
                    )}     
                </div>      
            </div>
        </div>
    );
}


export default DashboardStockCard;
