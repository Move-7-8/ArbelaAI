import React from 'react';

const TradingChartContainer = () => {
    return (
        <>
            {/* Chart Containers */}
            <div className="trading-chart-container" style={{ width: '100%', height: '200px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <p style={{ textAlign: 'center', lineHeight: '200px', color: '#999' }}>Trading Chart Placeholder</p>
            </div>
            <div className="trading-chart-container" style={{ width: '100%', height: '200px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop: '20px' }}>
                <p style={{ textAlign: 'center', lineHeight: '200px', color: '#999' }}>Trading Chart Placeholder</p>
            </div>

            {/* Buttons Container */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingLeft: '50px', paddingRight: '50px' }}>
                {/* Left Aligned Button */}
                <button className="bg-black text-white rounded-lg py-2 px-4 w-52 transition duration-300 ease-in-out hover:scale-105">
                    Analyse
                </button>

                {/* Right Aligned Button */}
                <button className="bg-black text-white rounded-lg py-2 px-4 w-52 transition duration-300 ease-in-out hover:scale-105">
                    Right Button
                </button>
            </div>

        </>
    );
}




export default TradingChartContainer;
