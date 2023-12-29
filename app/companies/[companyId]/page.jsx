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

  const searchParams = useSearchParams();
  const companyName = searchParams.get('companyName');
  const ticker = searchParams.get('ticker');
  const industry = searchParams.get('industry');
  const price = searchParams.get('price');
  const change = searchParams.get('change');

  //Use effect to pull in Financial data with fetch aborting 
  //(because multiple requests were somehow firing)

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (!isLoading) {
        setIsLoading(true); 
        console.log('Fetching data...');
        try {
          const response = await fetch(`/api/companies/[${ticker}]`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'ticker': ticker }),
            signal: signal 
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const result = await response.json();
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
  }, []);

  console.log('DATA RECEIVED: ', data);

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
