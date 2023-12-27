'use client';
import React, { useState } from 'react';

import { useSearchParams } from 'next/navigation';
import Charts from '@components/Charts'; // Assuming Charts component is in the same directory
import CompanyAnalysis from '@components/CompanyAnalysis'; // Assuming Charts component is in the same directory

const Page = () => {
  const searchParams = useSearchParams();
  
  const companyName = searchParams.get('companyName');
  const ticker = searchParams.get('ticker');
  const industry = searchParams.get('industry');
  const price = searchParams.get('price');
  const change = searchParams.get('change');

  return (
    <div className="flex flex-col md:flex-row mt-20 max-w-full h-full">
      <div className="w-full md:w-1/4 flex flex-col space-y-4">
            <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
                <h1 className="text-1xl font-semibold mb-4">{companyName}</h1>
                <div className="border-t border-gray-200 pt-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center ">
            <span className="text-gray-700 font-medium">Ticker:</span>
            <span className="text-gray-700">{ticker}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 font-medium">Industry:</span>
            <span className="text-gray-700 whitespace-normal">{industry}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 font-medium">Price:</span>
            <span className="text-gray-700">${price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Change (1d):</span>
            <span className={`text-700 ${parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{change}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Market Cap: </span>
            <span className="text-gray-700">$239,560,113</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Revenue: </span>
            <span className="text-gray-700">$19,001,985</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">PE Ratio: </span>
            <span className="text-gray-700">4.50</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">EPS: </span>
            <span className="text-gray-700">5.90</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Volume: </span>
            <span className="text-gray-700">59,441,002</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md h-70 max-h-fit mt-4 overflow-y-auto">
          <h2 className="text-1xl font-semibold mb-4">Company Description</h2>
            <p className="text-gray-600">
            AdAlta Limited is an Australia-based clinical-stage drug discovery company. The Company is engaged in the development of therapeutic products from its i-body platform. The Company has five active development programs ranging from discovery to Phase II clinical trials with applications in the fields of inflammation/fibrosis and immuno-oncology.            </p>
            </div>
        </div>

        <div className="w-full overflow-hidden md:w-3/4 flex flex-col mt-4 space-y-4 md:mt-0 md:ml-4 flex-grow">
      <div className='flex-grow'>
        <CompanyAnalysis/>
      </div>
    </div>
    </div>
);
}

export default Page;
