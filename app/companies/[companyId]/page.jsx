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
  const [DBData, setDBData] = useState(null); 

  const [data, setData] = useState(null); 
  const [data2, setData2] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [widthDiff, setWidthDiff] = useState(0);

  const handleWidthChange = (newWidth) => {
    setWidthDiff(newWidth);
  };

  // Add useEffect to log widthDiff whenever it changes
  useEffect(() => {
  }, [widthDiff]);

   // Calculate 75% of widthDiff for marginRight
    const marginRightValue = widthDiff * 0.75;

  // Search Params
  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker');
  // const industry = searchParams.get('industry');
  // const volatilityScore = searchParams.get('volatilityScore');
  // const liquidityScore = searchParams.get('liquidityScore');
  const [showChatbox, setShowChatbox] = useState(false);
  const toggleChatbox = () => setShowChatbox(!showChatbox);

  // Function to fetch data1 with retry logic
  const fetchWithRetry = useCallback(async (url, options, retries = 3, backoff = 300) => {

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 404) {

          return null; 
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;

    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));

        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      } else {
        console.error("Error fetching data:", error.message);
        return null; // or any other error handling mechanism
      }
    }
  }, []);


    // Use Effect to fetch MongoDB Data
    useEffect(() => {
      const fetchMongoDBData = async () => {
        const fetchOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'ticker': ticker }),
        };
  
        try {
          const mongoStartTime = performance.now();
          const resultMongoDB = await fetchWithRetry(`/api/companiesMongo/[companyId]`, fetchOptions);
          const mongoEndTime = performance.now();
          if (resultMongoDB) {
            setDBData(resultMongoDB); // This will store the fetched MongoDB data
          }
        } catch (error) {
          console.error("Failed to fetch MongoDB data, proceeding without MongoDB data:", error);
        }
      };
  
      if (ticker) { // Only fetch MongoDB data if ticker is available
        fetchMongoDBData();
      }
    }, [ticker, fetchWithRetry]);
  
  // Function to fetch 10k link
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
    } catch (error) {
      console.error('There was an error!', error);
    }
  }, [ticker]);

  //Use Effect to fetch Cache Data
  useEffect(() => {
    const fetchCacheData = async () => {
      const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'ticker': ticker }),
      };
  
      try {
        const cacheStartTime = performance.now();
        // Adjust the URL to match your API route structure
        const resultCache = await fetchWithRetry(`/api/companiesCache/[companyId]`, fetchOptions);
        const cacheEndTime = performance.now();
        if (resultCache) {
          setCacheData(resultCache); // This should trigger a render with cache data
        }
      } catch (error) {
        console.error("Failed to fetch cache data, proceeding without cache:", error);
      }
    };
  
    if (ticker) { // Only fetch cache data if ticker is available
      fetchCacheData();
    }
  }, [ticker, fetchWithRetry]);

  
      
  // UseEffect for fetching live data
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

      setData(result1);
      setData2(result2);
    };

    fetchLiveData();
  }, [ticker, fetchWithRetry]); // Proper dependencies


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
                <DashboardStockCard widthDiff={marginRightValue} cacheData={cacheData} data={data} data2={data2} dbData={DBData} />
              </div>
            {/* Statements and Chart Section */}
            <div style={{ marginRight: `${widthDiff}px` }} className="w-full lg:ml-[15.5%] lg:overflow-y-scroll lg:h-screen pb-[65px] lg:pb-0">
              <TradingChartContainer widthDiff={marginRightValue} cacheData={cacheData} data={data} dbData={DBData}/>
              <>
                <FinancialStatements cacheData={cacheData} data={data} data2={data2} dbData={DBData} className="mt-4" />
                <NewsSection cacheData={cacheData} data={data} data2={data2} dbData={DBData} className="mt-4" />
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
          <Test data={data} data2={data2} ticker={ticker} onWidthChange={handleWidthChange}/>
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