 'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Charts from '@components/Charts'; 
import CompanyAnalysis from '@components/StockPageComponents/CompanyAnalysis';
import Card from '@components/StockPageComponents/DashboardTopCards';
import StockCard from '@components/StockCard';
import Test from '@components/Test';
import DashboardStockCard from '@components/StockPageComponents/DashboardStockCard';
import TradingChartContainer from '@components/StockPageComponents/DashboardTradingChart';
import Chatbox from '@components/StockPageComponents/DashboardChatBox';
import FinancialStatements from '@components/StockPageComponents/Statements';
import NewsSection from '@components/StockPageComponents/NewsSection';
import SearchBar from '@components/StockPageComponents/SearchBar';
import FileUpload from '@components/ChatComponents/FileUpload';
import { FaComments } from 'react-icons/fa';

const Page = () => {
  const [data, setData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  
  // Search Params
  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker');
  const industry = searchParams.get('industry');
  // const change = searchParams.get('change');
  const volatilityScore = searchParams.get('volatilityScore');
  const liquidityScore = searchParams.get('liquidityScore');
  const [showChatbox, setShowChatbox] = useState(false);

  const toggleChatbox = () => setShowChatbox(!showChatbox);
  
  // From the UseEffect 
  //Useeffect to pull in Financial data with fetch aborting 
  //(because multiple requests were somehow firing)
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    const fetchData = async () => {
      if (!isLoading) {
        setIsLoading(true);
        console.log('Fetching data...');

        try {
          // Make sure to define response here from the fetch API
          const response = await fetch(`/api/companies/[${ticker}]`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'ticker': ticker }),
            signal: signal 
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          // Now you can safely use response to get the JSON result
          const result = await response.json();
          console.log('Complete Data:', result);
  
          // Destructure the data into variables
          const { 
            historic, 
            historic30Days, 
            historic7Days, 
            price, 
            balanceSheet, 
            earnings, 
            financeAnalytics, 
            news, 
            earningsTrend, 
            keyStatistics 
          } = result;

          console.log('Price Data:', price);
          console.log('Historic Yearly Data:', historic); // Data for 1 year
          console.log('Historic 30 Days Data:', historic30Days); // Data for 30 days at 1-hour intervals
          console.log('Historic 7 Days Data:', historic7Days); // Data for 7 days at 30-minute intervals
          console.log('Balance Sheet Data:', balanceSheet);
          console.log('Earnings Data:', earnings);
          console.log('Finance Analytics:', financeAnalytics);
          console.log('News:', news);
          console.log('Earnings Trend:', earningsTrend);
          console.log('Key Statistics:', keyStatistics);


          // Save the complete data to state if needed
          setData(result);
  
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
  }, []); // Empty array means this effect runs once after the first render
  
  // console.log('DATA RECEIVED: ', data);

return (
    <div className="flex flex-wrap w-full h-full">
        {/* Main content container */}
        <div className="flex flex-col w-full mt-20 lg:w-3/4">
            {/* <SearchBar /> */}

            {/* DashboardStockCard and TradingChartContainer Section */}
            <div className="flex flex-col lg:flex-row mt-3">
                <div className="w-full lg:w-1/3 mb-4 flex-1 lg:mb-0">  
                    <DashboardStockCard data={data} industry={industry} volatilityScore={volatilityScore} liquidityScore={liquidityScore} />
                </div>
                <div className="w-full lg:flex-grow overflow-y-scroll lg:h-screen">
                    <TradingChartContainer data={data} />
                    <FinancialStatements data={data} className="mt-4" />
                    <NewsSection data={data} className="mt-4" />
                </div>
            </div>
        </div>

        {/* Conditional Chatbox Popup Icon for small screens */}
        <div className="fixed right-4 bottom-4 z-50 lg:hidden">
            <button 
                onClick={toggleChatbox} 
                className="text-4xl text-black p-3 bg-white rounded-full shadow-lg focus:outline-none"
            >
                <FaComments />
            </button>
        </div>

        {/* Chatbox Component for small screens */}
        {showChatbox && (
            <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden">
                <div className="w-full fixed bottom-0 bg-white h-2/3 overflow-auto">
                    {/* <Chatbox /> */}
                    <Test/>
                    <button onClick={toggleChatbox} className="absolute top-0 right-0 mt-2 mr-2 text-2xl text-gray-700">
                        &times; {/* Close icon */}
                    </button>
                </div>
            </div>
        )}

        {/* Always visible Chatbox for larger screens */}
        <div className="hidden lg:block lg:w-1/4 mt-16 px-4 w-full lg:px-0 mb-4">
            {/* <Chatbox /> */}
            <FileUpload />
            <Test/>
        </div>
    </div>
);
}

export default Page;
