"use client"
import React, { useState, useEffect } from 'react';
import { MdLink } from 'react-icons/md';

function DashboardStockCard({ cacheData, data, dbData, widthDiff }) {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const marginRightValue = widthDiff * 0.25;

    const formatNumber = (value) => {
        if (typeof value !== 'number') {
            return value;
        }
        // Convert values to millions or billions as appropriate
        if (value >= 1e9) {
            return `$${(value / 1e9).toFixed(2)}B`;
        } else if (value >= 1e6) {
            return `$${(value / 1e6).toFixed(2)}M`;
        } else if (value >= 1e3) {
            return `$${(value / 1e3).toFixed(2)}K`;
        } else {
            return `$${value.toFixed(2)}`;
        }
    };
        
    const toggleFullDescription = () => {
        setShowFullDescription(prev => !prev);
    };
    
    const [isLiveDataLoaded, setIsLiveDataLoaded] = useState(false);
    useEffect(() => {
        if (data) {
            setIsLiveDataLoaded(true); // Set to true once data is loaded
        }
    }, [data]); // Depend on data to trigger the effect

    // Prepare your data values, preferring live data if available, otherwise falling back to cache
    console.log('dbData:', dbData);

    const companyName = dbData?.Name || 'Company Name Loading';
    const sector = dbData?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.industry || 'Sector Loading';
    const ticker = dbData?.Stock || 'Ticker Loading';
    const marketCap = dbData?.MarketCapitalisation;
    const formattedMarketCap = formatNumber(marketCap) || 'Loading';
    const volume = dbData?.keyStatistics?.regularMarketVolume?.raw;
    const formattedVolume = formatNumber(volume) || 'Loading';
    const askPrice =  dbData?.LastPrice|| 'Loading';

    const description = dbData?.['get-profile']?.quoteSummary?.result[0]?.summaryProfile?.longBusinessSummary || 'Description Loading...';
    const shortDescription = description.length > 200 ? description.substring(0, 200) + '...' : description;
    const link = dbData?.['get-profile']?.quoteSummary?.result?.[0]?.summaryProfile?.website || 'Loading';

    // const prevClose = cacheData?.responseData?.priceData?.regularMarketPreviousClose?.raw || 'Loading';
    // const regularMarketChange = cacheData?.responseData?.priceData?.RegularMarketChange || 'Loading';

    //New Data for Ratios Connor added:
    //No need for cached data here 
    const EPS = typeof dbData?.['keyStatistics']?.epsCurrentYear?.raw === 'number' ? dbData?.['keyStatistics'].epsCurrentYear.raw.toFixed(2) : 'N/A';
    const peRatioLagging = typeof dbData?.['keyStatistics']?.priceEpsCurrentYear?.raw === 'number' ? dbData?.['keyStatistics'].priceEpsCurrentYear.raw.toFixed(2) : 'N/A';
    const peRatioForward = typeof dbData?.['keyStatistics']?.forwardPE?.raw === 'number' ? dbData?.['keyStatistics'].forwardPE.raw.toFixed(2) : 'N/A';
    const pbRatio = typeof dbData?.['keyStatistics']?.priceToBook?.raw === 'number' ? dbData?.['keyStatistics'].priceToBook.raw.toFixed(2) : 'N/A';
    
    //Return to this later once the data is available
    const debtToEquityRatio = typeof dbData?.['financialanalytics']?.debtToEquity?.raw === 'number' ? dbData?.['financialanalytics'].debtToEquity.raw.toFixed(2) : 'N/A';
    const revenuePerShare = typeof dbData?.['financialanalytics']?.revenuePerShare?.raw === 'number' ? dbData?.['financialanalytics'].revenuePerShare.raw.toFixed(2) : 'N/A';
    const returnOnAssets = typeof dbData?.['financialanalytics']?.returnOnAssets?.raw === 'number' ? dbData?.['financialanalytics'].returnOnAssets.raw.toFixed(2) : 'N/A';
    const returnOnEquity = typeof dbData?.['financialanalytics']?.returnOnEquity?.raw === 'number' ? dbData?.['financialanalytics'].returnOnEquity.raw.toFixed(2) : 'N/A';
    const dividendYield = typeof dbData?.['keyStatistics']?.trailingAnnualDividendYield?.raw === 'number' ? dbData?.['keyStatistics']?.trailingAnnualDividendYield.raw.toFixed(2) : 'N/A';
    
    console.log('financial analytics', dbData?.['financialanalytics']);
    console.log('debt to equity', debtToEquityRatio);

    const priceChange = dbData?.RegularMarketChange;
    const formattedPriceChange = typeof priceChange === 'number' ? priceChange.toFixed(2) : 'Loading';
    const percentageChange = dbData?.regularMarketChangePercent;
    const formattedPercentageChange = typeof percentageChange === 'number' ? `${percentageChange.toFixed(2)}` : 'Loading';

    const formatAskPrice = (askPrice) => {
        // Check if askPriceObj is an object with a 'raw' property
        if (askPrice && typeof askPrice === 'object' && 'raw' in askPrice) {
            return `$${Number(askPrice).toFixed(2)}`; // Use raw value
        }

        // If askPriceObj is a number, format it to three decimal places
        if (!isNaN(askPrice)) {
            return `$${Number(askPrice).toFixed(2)}`;
        }

        // Return 'Not Available' if askPriceObj is not valid
        return 'N/A';
    };

    // Convert percentageChange to a number for safe comparison and display
    // percentageChange = parseFloat(percentageChange);
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

    const formatDescription = (desc) => {
        // Splitting at each period followed by a space and an uppercase letter
        return desc.split(/\. (?=[A-Z])/).map((paragraph, index) => (
            <p key={index} className="text-sm text-gray-600 mt-2">{paragraph.trim() + '.'}</p>
        ));
    };
        
    
 return (
    
    <div style={{ marginRight: `${marginRightValue}px` }} className="flex flex-col flex-1 rounded-md mx-auto lg-height-80vh">
        
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
        {/* <div className="flex flex-1 mx-4 mb-2 flex-col relative rounded-md p-2" style={{ minHeight: '0%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}> */}
        {/* TEST */}
        <div className="flex flex-1 mx-4 mb-2 flex-col relative rounded-md p-2" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        
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
            <div className="flex flex-col">
                {!cacheData ? (
                    <div className="mb-2">
                        <div className="bg-gray-200 h-6 w-1/2 rounded"></div> {/* Skeleton for Company Name */}
                        <div className="bg-gray-200 h-4 w-3/4 rounded mt-2"></div> {/* Skeleton for Company Description */}
                    </div>
                ) : (
                    <div className="mb-2">
                        <h2 className="text-xl font-bold text-[#3A3C3E]">{`${companyName} (${ticker})`}</h2>
                        <div>
                        <div>
                            {showFullDescription ? formatDescription(description) : <p className="text-sm text-gray-600 mt-2">{shortDescription}</p>}
                        </div>
                            {description.length > 200 && (
                                <a onClick={toggleFullDescription}
                                    className="text-xs relative z-2 bg-gray-200 rounded px-2 py-1 mr-2 transition-colors duration-300 hover:bg-[#6A849D] hover:text-white cursor-pointer">
                                    {showFullDescription ? 'Show Less' : 'Show More'}
                                </a>
                            )}
                            {link !== 'Not Available' && (
                                <a href={link} onClick={(e) => handleLinkClick(e, link)}
                                className="text-xs relative z-2 bg-gray-200 rounded px-2 py-1 transition-colors duration-300 hover:bg-[#6A849D] hover:text-white cursor-pointer">
                                Website
                                </a>
                            )}
                        </div>
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
                                        backgroundColor: formattedPriceChange >= 0 ? 'rgba(53, 168, 83, 0.5)' : 'rgba(255, 0, 0, 0.5)',
                                        color: formattedPriceChange >= 0 ? '#35A853' : 'red'
                                    }}>
                                    <span className="mr-2 text-white text-xs">{formattedPercentageChange >= 0 ? '↑' : '↓'}</span>
                                    <span className="text-white text-xs">{`${formattedPercentageChange}%`}</span>
                                </div>
                                {/* Price Increase in Dollars */}
                                <div className="ml-2 text-xs" 
                                    style={{ 
                                        color: formattedPriceChange >= 0 ? '#35A853' : 'red' 
                                    }}>
                                    {`${formattedPriceChange >= 0 ? '+' : ''}${formattedPriceChange}`}
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
                            {sector || 'N/A'}
                            </span>
                        </div>
                        </div>
                        <div className="flex  items-center justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">Market Cap:</span>
                            <span className="text-sm">{formattedMarketCap}</span> {/* Added dollar sign here */}
                        </div>
                        <div className="flex items-center justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">24hr Volume:</span>
                            <span className="text-sm">{formattedVolume}</span> {/* And here */}
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
                            {/* <div className="flex items-center justify-between my-2 relative group">
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
                            </div> */}
                            </>
                        )}
                        </div>
                    </div>   
                    {/* )}      */}
                </div>      
            </div>
        // </div>
    );
}


export default DashboardStockCard;
