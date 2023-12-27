import React from 'react';
import { Chart } from 'react-google-charts';

const Charts = () => {
    const data1 = [
        ['Month', 'Close', { role: 'tooltip' }],
        ['Jan', 130, 'Jan\nClose:130'],
        ['Feb', 70, 'Feb\nClose:70'],
        ['Mar', 120, 'Mar\nClose:120'],
        ['Apr', 115, 'Apr\nClose:115'],
        ['May', 100, 'May\nClose:100'],
        ['Jun', 110, 'Jun\nClose:110'],
        ['Jul', 90, 'Jul\nClose:90'],
        ['Aug', 85, 'Aug\nClose:85'],
        ['Sep', 95, 'Sep\nClose:95'],
        ['Oct', 100, 'Oct\nClose:100']
    ];

    const data2 = [
        ['Month', 'Close', { role: 'tooltip' }],
        ['Jan', 110, 'Jan\nClose:110'],
        ['Feb', 90, 'Feb\nClose:90'],
        ['Mar', 105, 'Mar\nClose:105'],
        ['Apr', 100, 'Apr\nClose:100'],
        ['May', 95, 'May\nClose:95'],
        ['Jun', 98, 'Jun\nClose:98'],
        ['Jul', 92, 'Jul\nClose:92'],
        ['Aug', 93, 'Aug\nClose:93'],
        ['Sep', 97, 'Sep\nClose:97'],
        ['Oct', 99, 'Oct\nClose:99']
    ];

    const data3 = [
        ['Month', 'Volume', { role: 'tooltip' }],
        ['Jan', 210, 'Jan\nVolume:210'],
        ['Feb', 190, 'Feb\nVolume:190'],
        ['Mar', 180, 'Mar\nVolume:180'],
        ['Apr', 205, 'Apr\nVolume:205'],
        ['May', 195, 'May\nVolume:195'],
        ['Jun', 202, 'Jun\nVolume:202'],
        ['Jul', 192, 'Jul\nVolume:192'],
        ['Aug', 198, 'Aug\nVolume:198'],
        ['Sep', 197, 'Sep\nVolume:197'],
        ['Oct', 200, 'Oct\nVolume:200']
    ];

    const options = {
        legend: 'none',
        areaOpacity: 0.1,
        lineWidth: 2,
        colors: ['#800080'],
        backgroundColor: {
            fill: '#FFFFFF',
            fillOpacity: 0.3
          },
    
        hAxis: { textPosition: 'none' }, // Removes horizontal axis labels
        vAxis: { textPosition: 'none' }, // Removes vertical axis labels
        chartArea: { width: '70%', height: '50%',     
     }, // Removed chart background
        // tooltip: { isHtml: true },
        pointSize: 0,
    };

    const optionsPrice = {
        ...options, // spread the common options
        title: 'Price (3Y)',
    };

    const optionsRevenue = {
        ...options,
        title: 'Revenue (3Y)',
    };

    const optionsVolume = {
        ...options,
        title: 'Volume (3Y)',
    };


    return (
        <div className="flex flex-col  md:flex-row md:space-x-2 w-full items-center justify-center"> 
            <div className="flex flex-col mt-4 items-center justify-center company_chart price_chart flex-shrink-1">
                        <Chart
                            chartType="AreaChart"
                            data={data1}
                            options={optionsPrice}
                            width="100%"
                        />
                </div>
    
                <div className="flex flex-col mt-4 items-center justify-center company_chart revenue_chart flex-shrink-1">
                    <Chart
                        chartType="AreaChart"
                        data={data2}
                        options={optionsRevenue}
                        width="100%"
                    />
                </div>
    
                <div className="flex flex-col mt-4 items-center justify-center company_chart volume_chart flex-shrink-1">
                <Chart
                    chartType="AreaChart"
                    data={data3}
                    options={optionsVolume}
                    width="100%"
                />
                </div>
            </div>
        // </div>
    );
}

export default Charts;
