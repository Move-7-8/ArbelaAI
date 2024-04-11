
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
  console.log('Companies POST request received')
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






// import { connectToDB } from '@utils/database';
// import Stock from '@models/stock';

// function getSortCriteriaById(sortById) {
//   const sortMap = {
//     2: { MarketCapitalisation: -1 }, // Market Cap UP
//     3: { MarketCapitalisation: 1 },  // Market Cap DOWN
//     4: { Liquidity: -1 },            // Liquidity UP
//     5: { Liquidity: 1 },             // Liquidity DOWN
//     6: { Volatility: -1 },           // Volatility UP
//     7: { Volatility: 1 },            // Volatility DOWN
//   };
//   return sortMap[sortById] || {}; // Default to no sorting if the ID is not found
// }

// export async function POST(request) {
//   await connectToDB();
//   const requestData = await request.json();
//   console.log("Received request data:", requestData);

//   const { limit, offset, searchText, category, sortbyId } = requestData;

//   let query = {
//     MarketCapitalisation: { $ne: 'N/A' },
//     Name: { $exists: true, $ne: "" } // Ensure the company has a name
//   };

//   if (searchText) {
//     query.$or = [
//       { Name: { $regex: searchText, $options: 'i' } },
//       { Ticker: { $regex: searchText, $options: 'i' } },
//     ];
//   }

//   if (category && category !== 'All Industries') {
//     query.GICsIndustryGroup = { $regex: category, $options: 'i' };
//   }

//   console.log("Constructed query:", query);

//   let sortCriteria = getSortCriteriaById(sortbyId);
//   const companiesData = await Stock.find(query).sort(sortCriteria).skip(offset).limit(limit).lean();
  
//   console.log("Found companies data:", companiesData);

//   return new Response(JSON.stringify(companiesData), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }
