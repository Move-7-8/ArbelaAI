 'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Test from '@components/Test';
import DashboardStockCard from '@components/StockPageComponents/DashboardStockCard';
import TradingChartContainer from '@components/StockPageComponents/DashboardTradingChart';
import FinancialStatements from '@components/StockPageComponents/Statements';
import NewsSection from '@components/StockPageComponents/NewsSection';
import { FaComments } from 'react-icons/fa';

const Page = () => {
  const [data, setData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  
  // Search Params
  const searchParams = useSearchParams();
  console.log('Page Search Params',searchParams )
  const ticker = searchParams.get('ticker');
  console.log('Page Ticker',ticker )

  const industry = searchParams.get('industry');
  const volatilityScore = searchParams.get('volatilityScore');
  const liquidityScore = searchParams.get('liquidityScore');
  const [showChatbox, setShowChatbox] = useState(false);
  const toggleChatbox = () => setShowChatbox(!showChatbox);

  // This CSS class determines whether the chatbox is visible
  const chatboxClass = showChatbox ? "block" : "hidden";
  
  //Useeffect to pull in Financial data with fetch aborting 
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    const fetchData = async () => {
      if (!isLoading) {
        setIsLoading(true);
        console.log('Fetching data...');

        try {
          const response1 = await fetch(`/api/companies/[${ticker}]`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'ticker': ticker }),
            signal: signal 
          });
  
          if (!response1.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const result1 = await response1.json();
          console.log('Complete Data from first API:', result1);
          setData(result1); // Assuming you want to keep this data
  
          // After the first call completes, make the second POST request
          const response2 = await fetch(`/api/companies2/[${ticker}]`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Adjust the body as per the requirements of the second API endpoint
            body: JSON.stringify({ 'ticker': ticker }), // Example, adjust as needed
            signal: signal 
          });

          if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
          }

          const result2 = await response2.json();
          console.log('Complete Data from second API:', result2);
          // Update state with the new data, or combine it with the previous result as needed
          setData(prevData => ({ ...prevData, ...result2 }));
    

        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('There was an error fetching the data!', error);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchData();
  
    // Cleanup function for the effect
    return () => {
      controller.abort(); // Abort the fetch on component unmount
    };
  }, []);
  
  // CSS for controlling chatbox visibility
  const chatboxVisibility = showChatbox ? 'block' : 'hidden';
  const mobileChatboxStyle = `fixed inset-0 z-40 bg-black bg-opacity-50 ${chatboxVisibility} lg:hidden`;
  const desktopChatboxStyle = "hidden lg:block lg:w-1/4 mt-16 px-4 w-full lg:px-0 mb-4";

return (
    <div className="flex flex-wrap w-full h-full">
        <div className="flex flex-col w-full mt-20 lg:w-3/4">
            <div className="flex flex-col lg:flex-row mt-3">
                <div className="w-full lg:w-1/3 mb-4 flex-1 lg:mb-0">  
                    <DashboardStockCard data={data} industry={industry} volatilityScore={volatilityScore} liquidityScore={liquidityScore} />
                </div>
                <div className="w-full lg:flex-grow lg:overflow-y-scroll lg:h-screen">
                    <TradingChartContainer data={data}  />
                    <FinancialStatements data={data} className="mt-4" />
                    <NewsSection data={data} className="mt-4" />
                </div>
            </div>
        </div>
        {/* Conditional Chatbox Popup Icon for small screens */}
        {!showChatbox && ( 
            <div className="fixed right-4 bottom-4 z-50 lg:hidden">
                <button 
                    onClick={toggleChatbox} 
                    className="text-4xl text-black p-3 bg-white rounded-full shadow-lg focus:outline-none"
                >
                    <FaComments />
                </button>
            </div>
        )}
      {/* Mobile chatbox with controlled visibility through CSS */}
      <div className={mobileChatboxStyle}>
        <div className="w-full fixed bottom-0 bg-white h-2/3 overflow-auto">
          <Test data={data}/>
          <button onClick={toggleChatbox} className="absolute top-0 right-0 mt-2 mr-2 text-2xl text-gray-700">
            &times;
          </button>
        </div>
      </div>
      {/* Desktop chatbox always visible */}
      <div className={desktopChatboxStyle}>
        <Test data={data}/>
      </div>
    </div>
  );
};

export default Page;
