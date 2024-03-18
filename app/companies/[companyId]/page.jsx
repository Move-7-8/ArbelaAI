 'use client';

 import React, { useState, useEffect, useCallback } from 'react';
 import { useSearchParams } from 'next/navigation';

import Test from '@components/Test';
import DashboardStockCard from '@components/StockPageComponents/DashboardStockCard';
import TradingChartContainer from '@components/StockPageComponents/DashboardTradingChart';
import FinancialStatements from '@components/StockPageComponents/Statements';
import NewsSection from '@components/StockPageComponents/NewsSection';
import Image from 'next/image'; // Make sure to import Image from 'next/image'
import chatImage from '../../../public/assets/images/conversation.png'; // Correct path to your image

const Page = () => {
  const [cacheData, setCacheData] = useState(null); 
  const [data, setData] = useState(null); 
  const [data2, setData2] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  


  const [widthDiff, setWidthDiff] = useState(0);

  const handleWidthChange = (newWidth) => {
    setWidthDiff(newWidth);
    console.log(`Width Difference from Page.jsx: ${newWidth}`);
  };

  // Add useEffect to log widthDiff whenever it changes
  useEffect(() => {
    console.log(`Width Difference in Page.jsx: ${widthDiff}px`);
  }, [widthDiff]);

   // Calculate 75% of widthDiff for marginRight
    const marginRightValue = widthDiff * 0.75;


  // Search Params
  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker');
  const industry = searchParams.get('industry');
  const volatilityScore = searchParams.get('volatilityScore');
  const liquidityScore = searchParams.get('liquidityScore');
  const [showChatbox, setShowChatbox] = useState(false);
  const toggleChatbox = () => setShowChatbox(!showChatbox);

  // Utility function to fetch data with retry logic
  const fetchWithRetry = useCallback(async (url, options, retries = 3, backoff = 300) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 404) {
          // Treat 404 differently - maybe return a specific object or null to indicate a cache miss
          console.log('Cache miss, proceeding to fetch live data.');
          return null; // or any other placeholder that indicates a cache miss
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      } else {
        // For actual errors, you might want to throw it, or depending on your logic, handle it gracefully
        console.error("Error fetching data:", error.message);
        return null; // or any other error handling mechanism
      }
    }
  }, []);

  const fetchEdgarData = useCallback(async () => {
    try {
      const response = await fetch('/api/EDGAR', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'ticker': ticker }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const documentUrl = data.documentUrl
      console.log('documentUrl', documentUrl);
      // If you need to do something with the URL or store it in state, do so here
      // e.g., setDocumentUrl(data.documentUrl);
    } catch (error) {
      console.error('There was an error!', error);
    }
  }, [ticker]);
  
  // Effect hook for fetching cached data
  // Effect for fetching cached data
  // Effect for fetching cached data
  useEffect(() => {
    const fetchCacheData = async () => {
      const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'ticker': ticker }),
      };
  
      try {
        const cacheStartTime = performance.now();
        const resultCache = await fetchWithRetry(`/api/companiesCache/[${ticker}]`, fetchOptions);
        const cacheEndTime = performance.now();
        console.log(`Cache fetch time: ${cacheEndTime - cacheStartTime} milliseconds.`);
        setCacheData(resultCache); // This should trigger a render with cache data
      } catch (error) {
        console.error("Failed to fetch cache data, proceeding without cache:", error);
        // Optionally set some state here to indicate cache was not loaded
      }
    };
  
    fetchCacheData();
    fetchEdgarData();

  }, [ticker, fetchWithRetry]);
    
  // Effect for fetching live data
  useEffect(() => {
    const fetchLiveData = async () => {
      const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'ticker': ticker }),
      };

      const liveStartTime = performance.now();
      const promise1 = fetchWithRetry(`/api/companies/[${ticker}]`, fetchOptions);
      const promise2 = fetchWithRetry(`/api/companies2/[${ticker}]`, fetchOptions);

      const [result1, result2] = await Promise.all([promise1, promise2]);
      const liveEndTime = performance.now();
      console.log(`Live fetch time: ${liveEndTime - liveStartTime} milliseconds.`);

      setData(result1);
      setData2(result2);
    };

    fetchLiveData();
  }, [ticker, fetchWithRetry]); // Proper dependencies

  console.log('Cached Data', cacheData)
  console.log('Live Data', data)

  // CSS for controlling chatbox visibility
  const chatboxVisibility = showChatbox ? 'block' : 'hidden';
  const mobileChatboxStyle = `fixed inset-0 z-40 bg-black bg-opacity-50 ${chatboxVisibility} lg:hidden`;
  const desktopChatboxStyle = "hidden lg:block lg:w-1/4 mt-16 px-4 w-full lg:px-0 mb-4";

  

  
return (
    <div className="flex flex-wrap w-full">
        <div className="flex flex-col w-full mt-20 lg:w-3/4">
          <div className="flex flex-wrap lg:flex-nowrap w-full ">
            {/* Spacer for Stock Card */}
            <div className="hidden lg:block lg:w-1/4 lg:h-screen"></div>

              {/* Stock Card */}
              <div className="w-full flex lg:bottom-0 lg:fixed lg:w-1/4 lg:top-20 lg:left-0  lg:overflow-y-auto mb-2">
                <DashboardStockCard widthDiff={marginRightValue} cacheData={cacheData} data={data} data2={data2} industry={industry} volatilityScore={volatilityScore} liquidityScore={liquidityScore} />
              </div>
            {/* Statements and Chart Section */}
            <div className="w-full lg:ml-[15.5%] lg:overflow-y-scroll lg:h-screen pb-[65px] lg:pb-0">
              <TradingChartContainer cacheData={cacheData} data={data} />
              <>
                <FinancialStatements cacheData={cacheData} data={data} data2={data2} className="mt-4" />
                <NewsSection cacheData={cacheData} data={data} data2={data2} className="mt-4" />
              </>
            </div>
            </div>
          </div>
          {/* Conditional Chatbox Popup Icon for small screens */}
          {!showChatbox && ( 
            <div 
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-end items-center"
          style={{
            padding: '0.7rem', // Reduced padding
            height: '65px', // Explicit height, adjust as needed
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '5px',
            boxShadow: '0 -6px 4px rgba(0, 0, 0, 0.1)',      
          }}
        >

        <button onClick={toggleChatbox} className="text-4xl text-black p-3 focus:outline-none" style={{ marginRight: 'auto', marginLeft: 'auto' }}>
            {/* Adjust width and height as necessary */}
            <div className="relative" style={{ width: '32px', height: '32px' }}> {/* Set the size of the parent div */}
                <Image src={chatImage} alt="Chat Icon" layout="fill" objectFit="cover" />
            </div>
        </button>
        </div>

        )}
      {/* Mobile chatbox with controlled visibility through CSS */}
      <div className={mobileChatboxStyle}>
        <div className="w-full fixed bottom-0 bg-white h-2/3 overflow-auto">
          <Test data={data} data2={data2} onWidthChange={handleWidthChange}/>
          <button onClick={toggleChatbox} className="absolute top-0 right-0 mt-2 mr-2 text-2xl text-gray-700">
            &times;
          </button>
        </div>
      </div>
      {/* Desktop chatbox always visible */}
      <div className={desktopChatboxStyle}>
        <Test data={data} onWidthChange={handleWidthChange}/>
      </div>
    </div>
  );
};


export default Page;