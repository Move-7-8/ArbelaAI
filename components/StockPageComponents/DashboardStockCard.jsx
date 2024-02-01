"use client"


import { useState } from 'react';



function DashboardStockCard({ data, industry,volatilityScore, liquidityScore }) {

  
    const companyName = data?.keyStatistics?.longName || 'Company Name Not Available';
    const marketCap = data?.price?.marketCap?.longFmt || 'Not Available';
    const askPrice = data?.financeAnalytics?.currentPrice|| 'Not Available';
    const prevClose = data?.historic?.meta?.chartPreviousClose || 'Not Available';
    const volume = data?.price?.regularMarketVolume?.longFmt || 'Not Available';

    //New Data for Ratios Connor added: 
    const EPS = data?.keyStatistics?.epsCurrentYear?.raw || 'N/A'
    const peRatioLagging = data?.keyStatistics?.priceEpsCurrentYear?.raw || 'N/A'
    const peRatioForward = data?.keyStatistics?.forwardPE?.raw || 'Not Available'
    const pbRatio = data?.keyStatistics?.priceToBook?.raw || 'Not Available'
    const debtToEquityRatio = data?.financeAnalytics?.debtToEquity?.raw || 'Not Available'
    const revenuePerShare = data?.financeAnalytics?.revenuePerShare?.raw || 'Not Available'
    const returnOnAssets = data?.financeAnalytics?.returnOnAssets?.raw || 'Not Available'
    const returnOnEquity = data?.financeAnalytics?.returnOnEquity?.raw || 'Not Available'
    const dividendYield = data?.keyStatistics?.trailingAnnualDividendYield?.raw || 'Not Available'


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

    // Calculate price change and percentage change
    const priceChange = currentPrice - previousClose;
    const percentageChange = previousClose !== 0 
                             ? ((priceChange / previousClose) * 100).toFixed(2) 
                             : 'N/A';

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
    
        <div className="flex flex-col flex-1 rounded-md mx-auto lg-height-85vh">
            {/* Align buttons to the left */}
        <div className="flex justify-center rounded mx-4 pr-2 pb-2">
          <button
                className={`w-24 px-3 py-1 rounded-lg shadow hover:scale-105 transition-transform duration-300 mr-4 ${activeButton === 'button1' ? '' : 'bg-gray-100'}`}
                style={{ backgroundColor: activeButton === 'button1' ? 'rgba(169, 169, 169, 0.2)' : '' }} // Increased opacity for active button
                onClick={() => setActiveButton('button1')}
            >
                Summary
            </button>
            <button
                className={`w-24 px-3 py-1 rounded-lg shadow hover:scale-105 transition-transform duration-300 ${activeButton === 'button2' ? '' : 'bg-gray-100'}`}
                style={{ backgroundColor: activeButton === 'button2' ? 'rgba(169, 169, 169, 0.2)' : '' }} // Increased opacity for active button
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
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50" style={{  filter: 'blur(1px)' }}></div>


        {/* Content */}
            <div className="p-4 flex-col flex flex-grow relative">
                {activeButton === 'button2' && (
        <div className="flex flex-col flex-grow">
            {/* Ratio Headers and Values */}
            <div className="mb-4">
                <h2 className="text-xl font-bold">Financial Ratios</h2>
                <p className="text-sm text-gray-600 2xl:mt-5">Key financial ratios of the company.</p>
            </div>
            <div className="border-t border-gray-300 mt-4 "></div>
            {/* Financial Ratios Display */}
            <div className="flex flex-col flex-grow space-y-9 2xl:space-y-14">
                <div className="flex justify-between my-2">
                    <span className="text-sm text-gray-500" style={{ minWidth: '100px' }}>EPS:</span>
                    <span className="text-sm" >{EPS}</span>
                </div>
                <div className="flex justify-between">
                    <span className=" text-sm text-gray-500">PE Ratio (Lagging):</span>
                    <span className="text-sm">{peRatioLagging}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">PE Ratio (Forward):</span>
                    <span className="text-sm">{peRatioForward}</span>
                </div>
                <div className="flex justify-between">
                    <span className=" text-sm text-gray-500">PB Ratio:</span>
                    <span className="text-sm">{pbRatio}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Debt to Equity Ratio:</span>
                    <span className="text-sm">{debtToEquityRatio}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Revenue per Share:</span>
                    <span className="text-sm">{revenuePerShare}</span>
                </div>
               <div className="flex justify-between">
                <span className="text-sm text-gray-500" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: '100px' }}>
                    Return on Assets:
                </span>
                <span className="text-sm">{returnOnAssets}</span>
            </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Return on Equity:</span>
                    <span className="text-sm">{returnOnEquity}</span>
                </div>
            </div>
        </div>
      )}

{activeButton === 'button1' && (
    <div className="flex flex-col flex-grow">
        {!data ? (
            // Skeleton loaders for company name and description
            <div className="mb-4">
                <div className="bg-gray-200 h-6 w-1/2 rounded"></div> {/* Skeleton for Company Name */}
                <div className="bg-gray-200 h-4 mt-2 w-3/4 rounded"></div> {/* Skeleton for Company Description */}
            </div>
        ) : (
            // Actual Company Name and Description
            <div className="mb-4">
                <h2 className="text-xl font-bold">{companyName}</h2>
                <p className="text-sm text-gray-600 2xl:mt-5">This is a short description about the company.</p>
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
                        <span className="text-gray-500 uppercase text-xs block">Price</span>
                        <span className="text-black font-bold text-l">{formatAskPrice(askPrice)}</span>
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
                                    <span className="mr-2 text-white text-xs">{priceChange >= 0 ? '↑' : '↓'}</span>
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

                {!data ? (
                        // Skeleton loaders for each data field
                        <>
                            <div className="border-t border-gray-300 mt-4 "></div>
                            <div className="flex justify-between my-2">
                                <span className="text-sm text-gray-500" style={{ minWidth: '100px' }}>Sector:</span>
                                <div className="bg-gray-200 h-4 flex-1 rounded"></div>
                            </div>
                            <div className="flex justify-between my-7 2xl:my-10">
                                <span className="text-sm text-gray-500">Market Cap:</span>
                                <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                            </div>
                            <div className="flex justify-between my-7 2xl:my-10">
                                <span className="text-sm text-gray-500">Volume:</span>
                                <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                            </div>
                            <div className="flex justify-between my-7 2xl:my-10">
                                <span className="text-sm text-gray-500">Dividend Yield:</span>
                                <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                            </div>
                            <div className="flex justify-between my-7 2xl:my-10">
                                <span className="text-sm text-gray-500">Volatility Score:</span>
                                <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                            </div>
                            <div className="flex justify-between mt-7 2xl:my-10">
                                <span className=" text-sm text-gray-500">Dividend Score:</span>
                                <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                            </div>
                        </>
                    ) : (
            // Actual data fields
            <>
                <div className="border-t border-gray-300 mt-4"></div>
                    <div className="flex justify-between my-2">
                        <span className="text-gray-500 text-sm" style={{ minWidth: '100px' }}>Sector:</span>
                                                <span className="flex-1 text-right text-sm" style={{
                            maxWidth: 'calc(100% - 100px)',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {industry || 'Not Available'}
                        </span>

                         </div>
                            <div className="flex justify-between my-5 2xl:my-10">
                            <span className="text-gray-500 text-sm">Market Cap:</span>
                            <span className="text-sm">{marketCap}</span>
                        </div>
                        <div className="flex justify-between my-5 2xl:my-10">
                            <span className="text-gray-500 text-sm">Volume:</span>
                            <span className="text-sm">{volume}</span>
                        </div>
                        <div className="flex justify-between my-5 2xl:my-10">
                            <span className="text-gray-500 text-sm">Dividend Yield:</span>
                            <span className="text-sm">{dividendYield}</span>
                        </div>
                        <div className="flex justify-between my-5 2xl:my-10">
                            <span className="text-gray-500 text-sm">Volatility Score:</span>
                            <span className="text-sm">{volatilityScore}</span>
                        </div>
                        <div className="flex justify-between my-5 2xl:my-10">
                            <span className="text-gray-500 text-sm">Dividend Score:</span>
                            <span className="text-sm">{liquidityScore}</span>
                        </div>
                        </>
                    )}
            </div>
            )}     
        </div>      
        
    </div>
    {/* Buttons Container */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
    {/* Left Aligned Button */}
    <button className="text-white rounded-lg py-1 px-3 w-32 transition duration-300 ease-in-out hover:scale-105 mb-4 ml-4 mr-4" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        Portfolio
    </button>

    {/* Right Aligned Button */}
    <button className="text-white rounded-lg py-1 px-3 w-32 transition duration-300 ease-in-out hover:scale-105 mb-4 ml-4 mr-4" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        Analyse
    </button>
</div>


</div>
    );
}


export default DashboardStockCard;
