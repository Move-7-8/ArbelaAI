 'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Charts from '@components/Charts'; 
import CompanyAnalysis from '@components/StockPageComponents/CompanyAnalysis';
import Card from '@components/StockPageComponents/DashboardTopCards';
import StockCard from '@components/StockCard';
import DashboardStockCard from '@components/StockPageComponents/DashboardStockCard';
import TradingChartContainer from '@components/StockPageComponents/DashboardTradingChart';
import Chatbox from '@components/StockPageComponents/DashboardChatBox';


const Page = () => {
  const searchParams = useSearchParams();
  
  const companyName = searchParams.get('companyName');
  const ticker = searchParams.get('ticker');
  const industry = searchParams.get('industry');
  const price = searchParams.get('price');
  const change = searchParams.get('change');


  return (
        <div className="flex w-full h-screen">
            {/* Container for the content sections */}
            <div className="w-3/4">  {/* Adjusted to 3/4 of the width */}
                {/* Section for the cards at the top */}
                <section className="mt-16 w-full">
                    <div className="flex justify-start">
                        <Card color="blue" title="Card 1" />
                        <Card color="blue" title="Card 2" />
                        <Card color="blue" title="Card 3" />
                        <Card color="blue" title="Card 4" />
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
