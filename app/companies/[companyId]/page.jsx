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
  const [data2, setData2] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  
  // Search Params
  const searchParams = useSearchParams();
  // console.log('Page Search Params',searchParams )
  const ticker = searchParams.get('ticker');
  // console.log('Page Ticker',ticker )

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

        try {
          // Initiate both fetch requests simultaneously
          const fetchPromise1 = fetch(`/api/companies/[${ticker}]`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'ticker': ticker }),
            signal: signal 
          });
  
          const fetchPromise2 = fetch(`/api/companies2/[${ticker}]`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'ticker': ticker }),
            signal: signal,
          });
  
          // Wait for both fetch requests to complete
          const [response1, response2] = await Promise.all([fetchPromise1, fetchPromise2]);
  
          // Check if both responses are ok
          if (!response1.ok) {
            throw new Error(`HTTP error! status: ${response1.status}`);
          }
          if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
          }
  
          // Parse JSON from both responses
          const result1 = await response1.json();
          const result2 = await response2.json();
  
          // Update state with the results
          setData(result1);
          setData2(result2);
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
    return () => controller.abort();
  }, [ticker]); 

  console.log('RETURNED DATA:', data2 )
  // CSS for controlling chatbox visibility
  const chatboxVisibility = showChatbox ? 'block' : 'hidden';
  const mobileChatboxStyle = `fixed inset-0 z-40 bg-black bg-opacity-50 ${chatboxVisibility} lg:hidden`;
  const desktopChatboxStyle = "hidden lg:block lg:w-1/4 mt-16 px-4 w-full lg:px-0 mb-4";
return (
   <div className="flex flex-wrap w-full" >
        <div className="flex flex-col w-full mt-20 lg:w-3/4" >
            <div className="flex flex-col lg:flex-row mt-3">
                <div className="w-full lg:w-1/2 mb-4 lg:mb-0">  
                    <DashboardStockCard data={data}  data2={data2} industry={industry} volatilityScore={volatilityScore} liquidityScore={liquidityScore} />
                </div>
                <div className="w-full lg:flex-grow lg:overflow-y-scroll lg:h-screen">
                    <TradingChartContainer data={data}  />
                    <FinancialStatements data={data} data2={data2}  className="mt-4" />
                    <NewsSection data={data}  data2={data2}  className="mt-4" />
                </div>
            </div>
        </div>
        {/* Conditional Chatbox Popup Icon for small screens */}
        {!showChatbox && ( 
            <div className="fixed bottom-0 left-0 bg-white right-0 z-50 lg:hidden flex justify-end items-center p-4 bg-transparent">
  <button 
    onClick={toggleChatbox} 
    className="text-4xl text-black p-3 focus:outline-none"
    style={{ marginRight: 'auto', marginLeft: 'auto' }} // Center the button horizontally
  >
    <FaComments />
  </button>
</div>

        )}
      {/* Mobile chatbox with controlled visibility through CSS */}
      <div className={mobileChatboxStyle}>
        <div className="w-full fixed bottom-0 bg-white h-2/3 overflow-auto">
          <Test data={data} data2={data2}/>
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
