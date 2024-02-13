import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { select, scaleLinear, axisBottom, axisLeft } from 'd3';

const TradingChartContainer = ({ data }) => {

    const [timeFrame, setTimeFrame] = useState('1y'); // Default to 1 year
    const [isDataLoading, setDataLoading] = useState(true);

    // Function to process closing prices
    const processClosingPrices = (closingPrices) => {
        return closingPrices.map((price, i, arr) => {
            if (price !== null) {
                return price;
            }
            for (let j = i - 1; j >= 0; j--) {
                if (arr[j] !== null) {
                    return arr[j];
                }
            }
            return 0; // Default to 0 if no non-null value is found
        });
    };

    // Function to get data based on the selected time frame
    const getDataForTimeFrame = (timeFrame) => {
        switch (timeFrame) {
            case '7d':
                return {
                    volumes: data?.historic7Days?.indicators?.quote[0]?.volume.map(vol => vol === null ? 0 : vol) || [],
                    timestamps: data?.historic7Days?.timestamp || [],
                    closingPrices: processClosingPrices(data?.historic7Days?.indicators?.quote[0]?.close || []),
                     askPriceRaw: data?.historic7Days?.financeAnalytics?.currentPrice?.raw,
                     prevClose: data?.historic7Days?.meta?.chartPreviousClose
                };
            case '30d':
                return {
                    volumes: data?.historic30Days?.indicators?.quote[0]?.volume.map(vol => vol === null ? 0 : vol) || [],
                    timestamps: data?.historic30Days?.timestamp || [],
                    closingPrices: processClosingPrices(data?.historic30Days?.indicators?.quote[0]?.close || []),
                    askPriceRaw: data?.historic30Days?.financeAnalytics?.currentPrice?.raw,
                    prevClose: data?.historic30Days?.meta?.chartPreviousClose
                };
            case '1y':
            default:
                return {
                    volumes: data?.historic?.indicators?.quote[0]?.volume.map(vol => vol === null ? 0 : vol) || [],
                    timestamps: data?.historic?.timestamp || [],
                    closingPrices: processClosingPrices(data?.historic?.indicators?.quote[0]?.close || []),
                    askPriceRaw: data?.financeAnalytics?.currentPrice?.raw,
                    prevClose:data?.historic?.meta?.chartPreviousClose,
                };
        }
    };

    // Get the data for the currently selected time frame
    const { volumes, timestamps, closingPrices, askPriceRaw, prevClose } = getDataForTimeFrame(timeFrame);




    // // Replace null values with the last available non-null value
    // closingPrices = closingPrices.map((price, i, arr) => {
    //     if (price !== null) {
    //         return price;
    //     }
    //     // Find the most recent non-null value
    //     for (let j = i - 1; j >= 0; j--) {
    //         if (arr[j] !== null) {
    //             return arr[j];
    //         }
    //     }
    //     // Default to 0 if no non-null value is found
    //     return 0;
    // });


    const minValue = d3.min(closingPrices);
    const maxValue = d3.max(closingPrices);
    const buffer = (maxValue - minValue) * 0.30; // For example, a 5% buffer

 



    


    const maxClosingPrice = closingPrices.length > 0 ? Math.max(...closingPrices) : 0;

    const chartRef = useRef(null);


    const drawChart = () => {
        // Clear existing chart
        d3.select(chartRef.current).selectAll('*').remove();

        if (data) {


             if (chartRef.current && data) {
                const margins = { top: 20, right: 30, bottom: 30, left: 50 };
                const chartWidth = chartRef.current.clientWidth - margins.left - margins.right;
                const chartHeight = chartRef.current.clientHeight - margins.top - margins.bottom;
                const baseColor = askPriceRaw > prevClose ? '53, 168, 83' : 
                                askPriceRaw < prevClose ? '255, 0, 0' : 
                               '53, 168, 83' ; 

                setTimeout(() => {
                setDataLoading(false);
            }, 2000);



            const svg = d3.select(chartRef.current)
                        .append('svg')
                        .attr('width', chartWidth + margins.left + margins.right)
                        .attr('height', chartHeight + margins.top + margins.bottom)
                        .append('g')
                        .attr('transform', `translate(${margins.left}, ${margins.top})`);

            // Assuming timestamps and closingPrices are arrays with your data
            // Filter out weekends
                const dates = timestamps
                .map(ts => new Date(ts * 1000))
                .filter(date => date.getDay() !== 0 && date.getDay() !== 6);
            



            // Use d3.scalePoint for the xScale
            const xScale = d3.scalePoint()
                            .domain(dates.map(d => d.getTime())) // Use getTime() for unique values
                            .range([0, chartWidth])
                            .padding(0.5);

                const yScale = d3.scaleLinear()
                                .domain([minValue - buffer, maxValue + buffer])
                                .range([chartHeight, 0]);


            const timeFormat = d3.timeFormat("%m-%d");


            const hoverLine = svg.append("line")
                                .style("stroke", "grey") // Grey color
                                .style("stroke-width", 1)
                                .style("stroke-dasharray", "3, 3") // Dotted style
                                .style("opacity", 0); // Initially hidden


                // Define focus for the tooltip
            const focus = svg.append("g")
                            .style("display", "none");



            // Define gradient for the area
            const gradientId = "area-gradient";
            svg.append("defs").append("linearGradient")
            .attr("id", gradientId)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", yScale(d3.max(closingPrices)))
            .attr("x2", 0).attr("y2", yScale(d3.min(closingPrices)))
            .selectAll("stop")
            .data([
                { offset: "0%", color: `rgba(${baseColor}, 0.8)` }, // Start with a darker color at the line
                { offset: "30%", color: `rgba(${baseColor}, 0.3)` }, // Begin fading out quickly
                { offset: "70%", color: `rgba(${baseColor}, 0.1)` }, // Nearly transparent midway
            ])
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("style", d => `stop-color: ${d.color}`);


        // Append an invisible rect for mouse tracking
        svg.append("rect")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mousemove", mousemove)
        .on("mouseover", () => {
            focus.style("display", null);
            hoverLine.style("opacity", 1); // Show hover line
        })
        .on("mouseout", () => {
            focus.style("display", "none");
            hoverLine.style("opacity", 0); // Hide hover line
            tooltip.style("opacity", 0); // Hide tooltip
        });


            const area = d3.area()
                            .x(d => xScale(d.date) + xScale.bandwidth() / 2)
                            .y0(chartHeight)
                            .y1(d => yScale(d.value));


    

        // Append the circle to the focus group
            focus.append("circle")
                .attr("r", 5)
                .attr("fill", `rgba(${baseColor}, 0.5)`);

            // Adjust the number of ticks on the x-axis
            const numberOfTicks = 5; // Choose how many ticks you want to display
            const tickInterval = Math.ceil(dates.length / numberOfTicks);
            const tickValues = dates.filter((_, i) => i % tickInterval === 0).map(d => d.getTime());

            svg.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale).tickValues(tickValues).tickFormat(d => d3.timeFormat("%b %d")(new Date(d))))
            .selectAll("text")
            .style("text-anchor", "middle") // Center align text
            .attr("transform", ""); // Remove rotation




            // Define the format for y-axis (prices)
            const priceFormat = d3.format(".3f");

            const yRange = d3.max(closingPrices) - d3.min(closingPrices);
            const optimalTicks = Math.max(Math.floor(chartHeight / 50), 2);
                // Manually add grid lines
            // Generate unique tick values
        const yTicks = Array.from(new Set(yScale.ticks(optimalTicks).map(tick => tick.toFixed(3))));   
            yTicks.forEach(tick => {
                svg.append("line")
                .attr("x1", 0)
                .attr("x2", chartWidth)
                .attr("y1", yScale(tick))
                .attr("y2", yScale(tick))
                .style("stroke", "lightgrey")
                .style("opacity", 0.7);
            });
    // Append the y-axis with unique ticks and formatted values
    svg.append("g")
    .call(d3.axisLeft(yScale)
            .tickValues(yTicks) // Use unique tick values
            .tickFormat(d3.format(".3f"))) // Format each tick value
    .call(g => g.select(".domain").remove()); // Remove the Y-axis line


            

    function mousemove(event) {
        const mouseX = d3.pointer(event, this)[0];
        const closestDate = xScale.domain().reduce((a, b) => {
            return Math.abs(xScale(a) - mouseX) < Math.abs(xScale(b) - mouseX) ? a : b;
        });
        const index = dates.findIndex(d => d.getTime() === closestDate);

        if (index >= 0 && index < dates.length) {
            const d = lineData[index]; // Define 'd' here at the start

                    // Update the position of the focus circle
            focus.attr("transform", `translate(${xScale(d.date) + xScale.bandwidth() / 2}, ${yScale(d.value)})`)
                .style("display", null);

            // Update hover line's position and display it
            hoverLine.attr("x1", xScale(d.date) + xScale.bandwidth() / 2)
                    .attr("x2", xScale(d.date) + xScale.bandwidth() / 2)
                    .attr("y1", yScale(d.value))
                    .attr("y2", chartHeight)
                    .style("opacity", 1);

            // Update tooltip content and position
            const dateFormat = d3.timeFormat("%b %d");
            const price = `AUD $${d.value.toFixed(3)}`;
            const date = dateFormat(d.date);
            const volume = volumes[index];

            tooltip.html(`<div class='text-black'>${price}</div>
                        <div class='text-gray-500'>${date}</div>
                        <div class='text-gray-500'>Volume: ${volume.toLocaleString()}</div>`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`)
                .style("opacity", 1);


    }
}


    // Line and Area Generators
        const line = d3.line()
                        .x(d => xScale(d.date) + xScale.bandwidth() / 2)
                        .y(d => yScale(d.value));

        const lineData = dates.map((date, i) => ({
            date: date,
            value: closingPrices[i]
        }));

        const yVolumeScale = d3.scaleLinear()
                        .domain([0, d3.max(volumes)]) // Assuming 'volumes' is an array of volume data
                        .range([chartHeight, chartHeight * 0.8]); // Adjust the range to control the height of the bars

        const barWidth = chartWidth / volumes.length * 0.6; // Adjust bar width as desired

        svg.selectAll(".bar")
        .data(volumes)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(dates[i]))
        .attr("y", d => yVolumeScale(d))
        .attr("width", barWidth)
        .attr("height", d => chartHeight - yVolumeScale(d))
        .attr("fill", "rgba(211, 211, 211, 0.7)");



        // Tooltip container
        const tooltip = d3.select(chartRef.current)
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)
                        .style("background", "white")
                        .style("padding", "5px")
                        .style("border", "1px solid #ddd")
                        .style("border-radius", "5px")
                        .style("text-align", "left")
                        .style("position", "absolute")
                        .style("pointer-events", "none")
                        .style("font-size", "12px"); // Smaller font size


        // Append area for the gradient effect under the line
        svg.append('path')
            .datum(lineData)
            .attr('fill', `url(#${gradientId})`) // Use the gradient for fill
            .attr('d', area);

        // Append line on top of the area
        svg.append('path')
            .datum(lineData)
            .attr('fill', 'none')
            .attr('stroke', `rgba(${baseColor}, 0.5)`)
            .attr('stroke-width', 2)
            .attr('d', line);

            }

           
        }
    };
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            // Assuming the data is now fully loaded and ready
            drawChart(); // Draw the chart
            setDataLoading(false); // Update loading state
        }

        // Handle window resize
        const handleResize = () => {
            if (!isDataLoading) {
                drawChart();
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [data, isDataLoading]); // Add isDataLoading as a dependency

const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
    setDataLoading(true); // Indicate loading while the chart is being redrawn
};

    const [activeButton, setActiveButton] = useState('charts'); 

    return (
    <>
            {/* Buttons Section */}
<div className="flex justify-end mx-4 pb-4">
            <div 
                className="rounded-full inline-block" 
                style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)', padding: '3px' }}
            >
                <button 
                    className={`text-sm mr-2 px-3 py-1 rounded-full ${timeFrame === '1y' ? 'bg-white' : 'bg-transparent'}`} 
                    onClick={() => handleTimeFrameChange('1y')}
                >
                    1 Year
                </button>
                <button 
                    className={`text-sm mr-2 px-3 py-1 rounded-full ${timeFrame === '30d' ? 'bg-white' : 'bg-transparent'}`} 
                    onClick={() => handleTimeFrameChange('30d')}
                >
                    30 Days
                </button>
                <button 
                    className={`text-sm px-3 py-1 rounded-full ${timeFrame === '7d' ? 'bg-white' : 'bg-transparent'}`} 
                    onClick={() => handleTimeFrameChange('7d')}
                >
                    7 Days
                </button>
            </div>
        </div>


        {isDataLoading ? (
            // Skeleton loader
            <div className="animate-pulse">
                <div className="bg-gray-200 h-64 w-full rounded"></div>
            </div>
        ) : (
            // Chart container
            <div className="trading-chart-container flex min-h-[15%] lg:min-h-[40%]" ref={chartRef} style={{ width: '100%' }}>
                {/* Chart will be attached to this div */}
            </div>
        )}
    </>
);
}




export default TradingChartContainer;
