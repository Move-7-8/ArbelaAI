"use client"

import Link from 'next/link';
import { useState } from 'react';


function DashboardStockCard({ company }) {



    const [activeButton, setActiveButton] = useState('button1');

    // Dummy data for the stock price, increase in price, and percentage
    const stockPrice = 150.00;
    const priceIncrease = 0.59; 
    const percentageIncrease = 2.07; 

 return (
        <div className="rounded-md mx-auto">
            {/* Align buttons to the left */}
            <div className="flex justify-start bg-white  rounded pr-2 pb-2">
                <button
                    className={`font-bold px-3 py-1 ${activeButton === 'button1' ? 'underline' : ''} mr-4`}
                    onClick={() => setActiveButton('button1')}
                >
                    Button 1
                </button>
                <button
                    className={`font-bold px-3 py-1 ${activeButton === 'button2' ? 'underline' : ''}`}
                    onClick={() => setActiveButton('button2')}
                >
                    Button 2
                </button>
            </div>


             <div className="p-4 rounded-md m-4" style={{ backgroundColor: 'rgba(193, 195, 254, 0.3)' }}>
                {activeButton === 'button1' && (
                    <div>
                        <div className="flex justify-between my-5">
                            <span className="text-gray-500">Row 1:</span>
                            <span>Value 1</span>
                        </div>
                        <div className="flex justify-between my-6">
                            <span className="text-gray-500">Row 2:</span>
                            <span>Value 2</span>
                        </div>
                        <div className="flex justify-between my-6">
                            <span className="text-gray-500">Row 3:</span>
                            <span>Value 3</span>
                        </div>
                        <div className="flex justify-between my-6">
                            <span className="text-gray-500">Row 4:</span>
                            <span>Value 4</span>
                        </div>
                        <div className="flex justify-between my-6">
                            <span className="text-gray-500">Row 5:</span>
                        <span>Value 5</span>
                        </div>
                        <div className="flex justify-between my-6">
                            <span className="text-gray-500">Row 6:</span>
                            <span>Value 6</span>
                        </div>
                        <div className="flex justify-between my-6">
                            <span className="text-gray-500">Row 7:</span>
                            <span>Value 7</span>
                        </div>
                    </div>
                )}
              {/* Faint Black Line Separator */}
                <div className="border-t border-gray-300 mt-4"></div>
                 {/* Price and Increase Display */}
                <div className="mt-4 flex justify-between items-center w-full">
                    {/* Stock Price - Left Aligned */}
                    <span className="text-black font-bold text-2xl">{`$${stockPrice.toFixed(2)}`}</span>

                    {/* Price Increase - Right Aligned */}
                    <div className="flex items-center">
                        {/* Price Increase Percentage */}
                        <div className="p-2 rounded flex items-center" style={{ backgroundColor: 'rgba(53, 168, 83, 0.5)' }}>
                            <span className="mr-2 text-white text-sm">↑</span> {/* Replace with actual icon */}
                            <span className="text-white text-sm">{`${percentageIncrease}%`}</span>
                        </div>

                        {/* Price Increase in Dollars */}
                        <span className="ml-2 text-sm" style={{ color: '#35A853' }}>{`+${priceIncrease.toFixed(2)}`}</span>
                    </div>
                </div>
                {activeButton === 'button2' && (
                    <div>
                        {/* Content for button 2 */}
                        <p>Content for Button 2</p>
                    </div>
                )}
            </div>
        </div>
    );
}


export default DashboardStockCard;
