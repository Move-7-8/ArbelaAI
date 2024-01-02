import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';


export async function GET() {
  // Load the JSON file
  const jsonFilePath = path.join(process.cwd(), 'constants/ASX.json');
  const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
  const companiesData = JSON.parse(fileContent);
  
  const responseData = companiesData; // This represents the entire list of objects from your JSON file.
  
  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  }

  //Pulling Data from the JSON and converting it to numerical 
  //Where necessary
  // let list = []; 
  // list = companiesData.map((company) => {

  // });
  // const companies = companiesData.map(company => company);
  // const tickerList = companiesData.map(company => company.ASX_code);
  // const industryList = companiesData.map(company => company.GICsindustrygroup);
  // const price = companiesData.map(company => +company.Price);
  
  // const MarketCap = companiesData.map(company => +company.MarketCapitalisation);
  // const fiftyTwoWeekHigh = companiesData.map(company => +company.fiftyTwoWeekHigh);
  // console.log('Converted fiftyTwoWeekHigh Back end type:', typeof fiftyTwoWeekHigh, 'Value:', fiftyTwoWeekHigh);

  // const fiftyTwoWeekLow = companiesData.map(company => +company.fiftyTwoWeekLow);
  // const fiftyTwoWeekChangePercent = companiesData.map(company => {
  //   // Check if the property exists and is a string, then replace '%' and convert to number
  //   return typeof company.fiftyTwoWeekChangePercent === 'string'
  //     ? +company.fiftyTwoWeekChangePercent.replace('%', '')
  //     : 0; // Fallback to 0 or some other sensible default
  // });
      
  // const twoHundredDayAverageChangePercent = companiesData.map(company => +company.twoHundredDayAverageChangePercent);
  // const fiftyDayAverageChangePercent = companiesData.map(company => +company.fiftyDayAverageChangePercent);
  // const averageDailyVolume3Month = companiesData.map(company => +company.averageDailyVolume3Month);
  // const regularMarketVolume = companiesData.map(company => +company.regularMarketVolume);
    
  // const priceToBook = companiesData.map(company => +company.priceToBook);
  // const trailingAnnualDividendRate = companiesData.map(company => +company.trailingAnnualDividendRate);
  // const epsTrailingTwelveMonths = companiesData.map(company => +company.epsTrailingTwelveMonths);
  // const LastPrice = companiesData.map(company => +company.LastPrice);
  
  // const volatility = companiesData.map(company => +company.volatility);
  // const liquidity = companiesData.map(company => +company.liquidity);
  // const change = companiesData.map(company => +company.change); 

  // const VolatilityScore = companiesData.map(company => +company.VolatilityScore);
  // const LiquidityScore = companiesData.map(company => +company.LiquidityScore);
  
    // Append calculations to each company object
    // return {
    //   ...company, // Spread existing company data
    //   rangeVolatility,
    //   percentageChangeVolatility,
    //   volatility,
    //   change,
    //   liquidity,
    // };


  // const responseData = {
  //     ticker: tickerList,
  //     industry: industryList,
  //     price: price,
  //     // change: change, 
  //     MarketCap: MarketCap,
  //     fiftyTwoWeekHigh: fiftyTwoWeekHigh, 
  //     fiftyTwoWeekLow: fiftyTwoWeekLow,
  //     fiftyTwoWeekChangePercent: fiftyTwoWeekChangePercent,
  //     twoHundredDayAverageChangePercent: twoHundredDayAverageChangePercent, 
  //     fiftyDayAverageChangePercent: fiftyDayAverageChangePercent,
  //     averageDailyVolume3Month: averageDailyVolume3Month,
  //     regularMarketVolume: regularMarketVolume,
  //     priceToBook: priceToBook,
  //     trailingAnnualDividendRate: trailingAnnualDividendRate,
  //     epsTrailingTwelveMonths: epsTrailingTwelveMonths,
  //     LastPrice: LastPrice, 
  //     volatility: volatility, 
  //     liquidity: liquidity,
  //     change: change,
  //     VolatilityScore: VolatilityScore,
  //     LiquidityScore: LiquidityScore
  // };

