"use client"


import { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { MdLink } from 'react-icons/md';



function DashboardStockCard({ data,data2, industry,volatilityScore, liquidityScore }) {

    const companyName = data?.keyStatistics?.longName || 'Company Name Not Available';
    const ticker = data?.historic?.meta?.symbol  || 'Company Name Not Available';
    const marketCap = data?.price?.marketCap?.longFmt || 'Not Available';
    const askPrice = data?.financeAnalytics?.currentPrice|| 'Not Available';
    const prevClose = data?.historic?.meta?.chartPreviousClose || 'Not Available';
    const description = data2?.['get-profile']?.quoteSummary?.result?.[0]?.summaryProfile?.longBusinessSummary || 'Not Available';
    const firstSentence = description.split('.')[0] + '.';
    const link = data2?.['get-profile']?.quoteSummary?.result?.[0]?.summaryProfile?.website || 'Not Available';

    console.log(link)

    const [hover, setHover] = useState(false);

   
    console.log('finaldata', data2)

    const volume = data?.price?.regularMarketVolume?.longFmt || 'Not Available';

    //New Data for Ratios Connor added: 
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
            return `$${Number(askPriceObj.raw).toFixed(3)}`; // Use raw value
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

    // console.log('current price 2', currentPrice)
    // console.log('previous close 2', previousClose)
    // Calculate price change and percentage change
    const priceChange = currentPrice - previousClose;
    const percentageChange = parseFloat((((currentPrice - previousClose) / previousClose) * 100).toFixed(2));

        // Custom function to format price change
    const formatPriceChange = (change) => {
        // Threshold for deciding the number of decimal places
        const threshold = 0.01;

        // If change is smaller than the threshold, use more decimal places
        if (Math.abs(change) < threshold) {
            return change.toFixed(4); // Adjust the number of decimal places as needed
        }

        // For larger changes, use two decimal places
        return change.toFixed(2);
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


 return (
    
        <div className="flex flex-col flex-1 rounded-md mx-auto lg-height-85vh" >
            {/* Align buttons to the left */}
        <div className="flex justify-center rounded mx-4 pr-2 pb-2">
        <button
            className={`w-28 px-3 py-1 rounded-full text-sm shadow hover:scale-105 transition-transform duration-300 mr-4 uppercase border ${activeButton === 'button1' ? 'bg-[#6A849D] text-white border-[#6A849D]' : 'bg-white text-[#6A849D] border-[#6A849D]'}`}
            onClick={() => setActiveButton('button1')}
        >
            Summary
        </button>
        <button
            className={`w-28 px-3 py-1 rounded-full shadow text-sm hover:scale-105 transition-transform duration-300 uppercase border ${activeButton === 'button2' ? 'bg-[#6A849D] text-white border-[#6A849D]' : 'bg-white text-[#6A849D] border-[#6A849D]'}`}
            onClick={() => setActiveButton('button2')}
        >
            Ratio
        </button>
        </div>
  <style>
    {`
      @media (min-width: 1024px) {
        .lg-height-85vh {
          height: 85vh;
        }
      }
    `}
  </style>

    <div className="flex mx-4 mb-4 flex-col  relative rounded-md  p-2" style={{minHeight:'100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        {/* Blurred Background */}
        <div className="absolute inset-0 bg-opacity-50" style={{  filter: 'blur(1px)' }}></div>


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
                        <span className="text-sm text-gray-500">Return on Equity:</span>
                        <span className="text-sm">{returnOnEquity}</span>
                    </div>
                </div>
            </div>
        )}

{activeButton === 'button1' && (
    <div className="flex flex-col flex-grow">
        {!data || !data2 ? (
            // Skeleton loaders for company name and description
            <div className="mb-2">
                <div className="bg-gray-200 h-6 w-1/2 rounded"></div> {/* Skeleton for Company Name */}
                <div className="bg-gray-200 h-4 mt-2 w-3/4 rounded mt-2"></div> {/* Skeleton for Company Description */}
            </div>
        ) : (
            // Actual Company Name and Description
            
        <div className="mb-2">
         <div className="flex items-center text-xl font-bold text-[#3A3C3E]">
          <span className="flex items-center">
    {companyName} - {ticker}
    {link !== 'Not Available' && (
      <a href={link} target="_blank" rel="noopener noreferrer" 
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}
         style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}>
        <MdLink size={16} style={{ color: hover ? '#6A849D' : '#3A3C3E' }} />
      </a>
    )}
  </span>
      </div>
      <div className="flex items-center mt-2">
        <p className="text-sm text-gray-600 flex-grow">{firstSentence}</p> {/* Company description */}
      </div>
        </div>
        )}


        {/* Price and Increase Display */}
        <div className="mt-2 flex justify-between items-center w-full">
            {!data ? (
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
                        <span className="text-black font-bold text-l text-[#3A3C3E]">{formatAskPrice(askPrice)}</span>
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
            {!data ? (
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
            // Actual data fields
            <>
                 <div className="flex justify-between my-2">
                     
                        <span className="text-gray-500 uppercase text-xs" style={{ minWidth: '100px' }}>Sector:</span>
                            <span className="text-sm" style={{
                            maxWidth: 'calc(100% - 100px)',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {industry || 'N/A'}
                        </span>

                         </div>
                           <div className="flex justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">Market Cap:</span>
                            <span className="text-sm">{marketCap}</span>
                        </div>
                        <div className="flex justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">Volume:</span>
                            <span className="text-sm">{volume}</span>
                        </div>
                        <div className="flex justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">Dividend Yield:</span>
                            <span className="text-sm">{dividendYield}</span>
                        </div>
                        <div className="flex justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">Volatility Score:</span>
                            <span className="text-sm">{volatilityScore}</span>
                        </div>
                        <div className="flex justify-between my-2">
                            <span className="text-gray-500 uppercase text-xs">Dividend Score:</span>
                            <span className="text-sm">{liquidityScore}</span>
                        </div>
                        </>
                    )}
            </div>
             </div>   
  
            )}     
        </div>      
          
    </div>
    {/* Buttons Container */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
    <button className="uppercase text-sm rounded-full py-1 px-3 w-32 transition duration-300 ease-in-out hover:scale-105 mb-4 ml-4 mr-4 border border-[#FF6665] text-[#FF6665]" 
            style={{ backgroundColor: 'white' }}>
        Portfolio
    </button>


    {/* Right Aligned Button */}
   <button className="text-white text-sm uppercase rounded-full py-1 px-3 w-32 transition duration-300 ease-in-out hover:scale-105 mb-4 ml-4 mr-4" 
        style={{ backgroundColor: '#FF6665' }}>
        Analyse
    </button>

</div>


</div>
    );
}


export default DashboardStockCard;
