 'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Charts from '@components/Charts'; 
import CompanyAnalysis from '@components/StockPageComponents/CompanyAnalysis';
import Card from '@components/StockPageComponents/DashboardTopCards';
import StockCard from '@components/StockCard';
import DashboardStockCard from '@components/StockPageComponents/DashboardStockCard';
import TradingChartContainer from '@components/StockPageComponents/DashboardTradingChart';
import Chatbox from '@components/StockPageComponents/DashboardChatBox';
import FinancialStatements from '@components/StockPageComponents/Statements';
import NewsSection from '@components/StockPageComponents/NewsSection';


const Page = () => {
  const [data, setData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  
  // Search Params
  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker');
  const industry = searchParams.get('industry');
  const change = searchParams.get('change');
  
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
          const { historic, price, balanceSheet, earnings, financeAnalytics, news, earningsTrend, keyStatistics  } = result;
          // const { historic, price, keyStatistics, balanceSheet  } = result;
          console.log('Price Data:', price);
          console.log('Historic Data:', historic);
          console.log('Balance Sheet Data:', balanceSheet);
          console.log('Earnings Data:', earnings);
          console.log('Finance Analytics:', financeAnalytics);
          console.log('News:', news);
          console.log('Trends:', earningsTrend);
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
   <div className="flex w-full h-full">
            {/* Main content container - 3/4 of the width */}
        <div className="flex flex-col w-full md:w-3/4">
            {/* Top Cards Section */}
            <section className="mt-16 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card color="blue" title="Card 1" data={data} />
                    <Card color="blue" title="Card 2" data={data} />
                    <Card color="blue" title="Card 3" data={data} />
                    <Card color="blue" title="Card 4" data={data} />
                </div>
            </section>

      {/* DashboardStockCard and TradingChartContainer Section */}
      <div className="flex flex-col md:flex-row mt-3">
        <div className="flex w-full md:w-1/3 mb-4 md:mb-0">  
          <DashboardStockCard data={data} industry={industry} />
        </div>
        <div className="flex flex-col flex-grow w-2/3 overflow-y-scroll h-screen">
            <TradingChartContainer data={data} />
            <FinancialStatements data={data} className="mt-4" /> {/* Added margin-top */}
            <NewsSection data={data} className="mt-4" /> {/* Added margin-top */}
        </div>
      </div>
    </div>


        {/* Chatbox Component */}
         <div className="flex-col flex w-1/4  mt-16">
            <Chatbox  />
        </div>
    </div>
);

}

export default Page;
