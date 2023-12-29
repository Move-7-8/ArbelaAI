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


const Page = () => {
  const [data, setData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  
  // Search Params
  const searchParams = useSearchParams();
  const companyName = searchParams.get('companyName');
  const ticker = searchParams.get('ticker');
  const industry = searchParams.get('industry');
  const price = searchParams.get('price');
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
          const { historic, balanceSheet, earnings, financeAnalytics, news, earningsTrend, keyStatistics  } = result;
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
        <div className="flex w-full h-screen">
            {/* Container for the content sections */}
            <div className="w-3/4">  {/* Adjusted to 3/4 of the width */}
                {/* Section for the cards at the top */}
                <section className="mt-16 w-full">
                    <div className="flex justify-start">
                        <Card color="green" title="Card 1" />
                        <Card color="blue" title="Card 2" />
                        <Card color="yellow" title="Card 3" />
                        <Card color="red" title="Card 4" />
                    </div>
                </section>

                {/* Section for StockCard and TradingChartContainer */}
                <section className="flex mt-3 w-full">
                    <div className="w-1/3">  
                        <DashboardStockCard />
                    </div>
                    <div className="w-2/3">  
                        <TradingChartContainer />
                    </div>
                </section>
            </div>

            {/* Chatbox Component */}
            <div className="w-1/4 mt-16">
                <Chatbox />
            </div>
        </div>
    );
}

export default Page;
