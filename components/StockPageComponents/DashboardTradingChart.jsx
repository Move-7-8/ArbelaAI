import React, { useState } from 'react';



const TradingChartContainer = () => {

    const [activeButton, setActiveButton] = useState('charts'); 

    return (
        <>
                    {/* Buttons Section */}
            <div className="flex justify-center rounded mx-4 pt-2 pb-4">
                <button
                    className={`font-bold px-3 py-1 ${activeButton === 'charts' ? 'underline' : ''} mr-4`}
                    onClick={() => setActiveButton('charts')}
                >
                    Charts
                </button>
                <button
                    className={`font-bold px-3 py-1 ${activeButton === 'balanceSheet' ? 'underline' : ''} mr-4`}
                    onClick={() => setActiveButton('balanceSheet')}
                >
                    Balance Sheet
                </button>
                <button
                    className={`font-bold px-3 py-1 ${activeButton === 'incomeStatement' ? 'underline' : ''}`}
                    onClick={() => setActiveButton('incomeStatement')}
                >
                    Income Statement
                </button>
            </div>
            {/* Chart Containers */}
            <div className="trading-chart-container" style={{ width: '100%', height: '200px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <p style={{ textAlign: 'center', lineHeight: '200px', color: '#999' }}>Trading Chart Placeholder</p>
            </div>
            <div className="trading-chart-container" style={{ width: '100%', height: '160px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop: '20px' }}>
                <p style={{ textAlign: 'center', lineHeight: '200px', color: '#999' }}>Trading Chart Placeholder</p>
            </div>

            {/* Buttons Container */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingLeft: '50px', paddingRight: '50px' }}>
            {/* Left Aligned Button */}
            <button className="text-white rounded-lg py-2 px-4 w-52 transition duration-300 ease-in-out hover:scale-105" 
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                Portfolio
            </button>

            {/* Right Aligned Button */}
            <button className="text-white rounded-lg py-2 px-4 w-52 transition duration-300 ease-in-out hover:scale-105" 
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                Analyse
            </button>
            </div>

        </>
    );
}




export default TradingChartContainer;
