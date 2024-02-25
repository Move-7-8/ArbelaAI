//api/companies/route.js

import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

import {connectToDB} from '@utils/database'
import Stock from '@models/stock';

export async function GET() {
  await connectToDB();

  const companiesData = await Stock.find({})
  
  const responseData = companiesData; // This represents the entire list of objects from your JSON file.
  // console.log('back end response data', responseData);
  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

}

export async function POST(request) {
  await connectToDB();

  const request_data = await request.json(); // Parsing JSON from the incoming request.
  const limit = request_data.limit;
  const offset = request_data.offset;
  const searchText = request_data.searchText; 
  const category = request_data.category; 
  const sortby = request_data.sortby;

  console.log('Sort By: ', sortby);

  let query = {};
  let sortCriteria = {}; // Define a variable to hold your sort criteria
  
  // Exclude stocks where MarketCapitalisation is 'N/A'
  query.MarketCapitalisation = { $ne: 'N/A' };

  // If there is searchText, add conditions for searching by Name or Ticker.
  if (searchText) {
    query.$or = [
      { Name: { $regex: searchText, $options: 'i' } },
      { Ticker: { $regex: searchText, $options: 'i' } },
    ];
  }

  // Special condition for "All Industries" to not filter by any categories
  if (category && category.name !== 'All Industries') {
    const industryName = typeof category === 'object' ? category.name : category;
    query.GICsIndustryGroup = { $regex: industryName, $options: 'i' };
  }
  
  // Determine sort criteria based on sortby value
  if (sortby === 'Alphabetical UP') {
    sortCriteria = { Name: 1 }; // Sort by Name in ascending order
  } else if (sortby === 'Size UP') {
    sortCriteria = { MarketCapitalisation: -1 }; // Sort by MarketCapitalisation in descending order
  } else if (sortby === 'Size DOWN') {
    sortCriteria = { MarketCapitalisation: 1}; // Sort by MarketCapitalisation in descending order
  } else if (sortby === 'Liquidity UP') {
    sortCriteria = { Liquidity: -1 }; // Sort by MarketCapitalisation in descending order
  } else if (sortby === 'Liquidity DOWN') {
    sortCriteria = { Liquidity: 1}; // Sort by MarketCapitalisation in descending order
  } else if (sortby === 'Volatility UP') {
    sortCriteria = { Volatility: -1 }; // Sort by MarketCapitalisation in descending order
  } else if (sortby === 'Volatility DOWN') {
    sortCriteria = { Volatility: 1}; // Sort by MarketCapitalisation in descending order
  } 



  // Execute the query with sorting
  const companiesData = await Stock.find(query).sort(sortCriteria).skip(offset).limit(limit).lean();


  // Prepare and return the response.
  return new Response(JSON.stringify(companiesData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}















//OLD CODE
//   let query = {};

//   // If there is searchText, add conditions for searching by Name or Ticker.
//   if (searchText) {
//     query.$or = [
//       { Name: { $regex: searchText, $options: 'i' } },
//       { Ticker: { $regex: searchText, $options: 'i' } },
//     ];
//   }

//   // Special condition for "All Industries" to not filter by any categories
//   if (category && category.name !== 'All Industries') {
//     const industryName = typeof category === 'object' ? category.name : category;
//     query.GICsIndustryGroup = { $regex: industryName, $options: 'i' };
//   }
  
//   // console.log('Final Query: ', JSON.stringify(query, null, 2));

//   // Execute a single query with the constructed conditions.
//   const companiesData = await Stock.find(query).skip(offset).limit(limit).lean();
//   // console.log('Companies Data Result: ', companiesData);

  


//   // Prepare and return the response.
//   return new Response(JSON.stringify(companiesData), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }
