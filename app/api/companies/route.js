import { connectToDB } from '@utils/database';
import Stock from '@models/stock';

export async function POST(request) {
  console.log('Companies POST request received');
  await connectToDB();

  const request_data = await request.json();
  const { limit, offset, searchText, category, sortby } = request_data;
  console.log('Request data:', request_data);

  // Default query including mandatory fields
  let query = {
    MarketCapitalisation: { $ne: 'N/A' },
    regularMarketChangePercent: { $ne: 'N/A', $exists: true, $type: 'number', $lt: 1000 },
    Name: { $ne: 'Unknown Company', $type: 'string' },
    priceToBook: { $ne: 'N/A', $exists: true, $type: 'number', $gte: 0 }
  };

  // Build query for text search
  let textQuery = {};
  if (searchText) {
    textQuery = {
      $or: [
        { Name: { $regex: searchText, $options: 'i' } },
        { Ticker: { $regex: searchText, $options: 'i' } }
      ]
    };
  }

  // Build query for category
  let categoryQuery = {};
  if (category && category.name !== 'All Industries') {
    categoryQuery = {
      GICsIndustryGroup: { $regex: category.name, $options: 'i' }
    };
  }

  // Combine text and category queries using $and only if both are present
  if (searchText && category && category.name !== 'All Industries') {
    query.$and = [textQuery, categoryQuery];
  } else {
    // Merge textQuery and categoryQuery into the base query if only one is present
    Object.assign(query, textQuery, categoryQuery);
  }

  // Sort criteria based on the sortby parameter
  let sortCriteria = {};
  switch (sortby) {
    case 'Alphabetical UP':
      sortCriteria = { Name: 1 };
      break;
    case 'High Market Cap UP':
      sortCriteria = { MarketCapitalisation: -1 };
      break;
    case 'Low Market Cap DOWN':
      sortCriteria = { MarketCapitalisation: 1 };
      break;
    case 'Gainers UP':
      sortCriteria = { regularMarketChangePercent: -1 };
      break;
    case 'Losers DOWN':
      sortCriteria = { regularMarketChangePercent: 1 };
      break;
    case 'Growth Stocks UP':
      sortCriteria = { priceToBook: -1 };
      break;
    case 'Value Stocks UP':
      sortCriteria = { priceToBook: 1 };
      break;
    default:
      // Apply default sorting if no sortby is specified
      break;
  }

  const companiesData = await Stock.find(query).sort(sortCriteria).skip(offset).limit(limit).lean();
  return new Response(JSON.stringify(companiesData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}




// //api/companies/route.js

// import fs from 'fs';
// import path from 'path';
// import { NextRequest } from 'next/server';

// import {connectToDB} from '@utils/database'
// import Stock from '@models/stock';

// export async function GET() {
//   await connectToDB();

//   const companiesData = await Stock.find({})
  
//   const responseData = companiesData; // This represents the entire list of objects from your JSON file.
//   // console.log('back end response data', responseData);
//   return new Response(JSON.stringify(responseData), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

// }

// export async function POST(request) {
//   console.log('Companies POST request received')
//   await connectToDB();

//   const request_data = await request.json(); // Parsing JSON from the incoming request.
//   const limit = request_data.limit;
//   const offset = request_data.offset;
//   const searchText = request_data.searchText; 
//   const category = request_data.category; 
//   const sortby = request_data.sortby;

//   console.log('Category: ', category);

//   let query = {};
//   let sortCriteria = {}; // Define a variable to hold your sort criteria
  
//   // Exclude stocks where MarketCapitalisation is 'N/A'
//   query.MarketCapitalisation = { $ne: 'N/A' };
  
//   query.regularMarketChangePercent = { 
//     $ne: 'N/A', 
//     $exists: true, 
//     $type: 'number',
//     $lt: 1000  // Ensure that regularMarketChangePercent is less than 1000%
//   };
  
//   query.Name = { $ne: 'Unknown Company', $type: 'string' };
  
//   query.priceToBook = { 
//     $ne: 'N/A', 
//     $exists: true, 
//     $type: 'number',
//     $gte: 0 // Ensure that priceToBook is greater than or equal to 0
//   };
  
//   // If there is searchText, add conditions for searching by Name or Ticker.
//   // if (searchText) {
//   //   query.$or = [
//   //     { Name: { $regex: searchText, $options: 'i' } },
//   //     { Ticker: { $regex: searchText, $options: 'i' } },
//   //   ];
//   // }

//   // // Special condition for "All Industries" to not filter by any categories
//   // if (category && category.name !== 'All Industries') {
//   //   const industryName = typeof category === 'object' ? category.name : category;
//   //   query.GICsIndustryGroup = { $regex: industryName, $options: 'i' };
//   // }

//   //TEST: 
// // Setup the query to combine both filters effectively
// let textQuery = {};
// if (searchText) {
//   textQuery = {
//     $or: [
//       { Name: { $regex: searchText, $options: 'i' } },
//       { Ticker: { $regex: searchText, $options: 'i' } }
//     ]
//   };
// }

// let categoryQuery = {};
// if (category && category.name !== 'All Industries') {
//   categoryQuery = { GICsIndustryGroup: { $regex: category.name, $options: 'i' } };
// }

// // Combine both text and category queries using $and only if both are present
// if (searchText && category && category.name !== 'All Industries') {
//   query = { $and: [textQuery, categoryQuery] };
// } else if (searchText) {
//   query = textQuery;
// } else if (category && category.name !== 'All Industries') {
//   query = categoryQuery;
// }
  
//   // Special condition for "All Industries" to not filter by any categories
//   if (category && category.name !== 'All Industries') {
//     const industryName = typeof category === 'object' ? category.name : category;
//     if (query.$or) {
//       // Apply the industry filter alongside the existing $or condition for search text
//       query = { $and: [query, { GICsIndustryGroup: { $regex: industryName, $options: 'i' } }] };
//     } else {
//       // Only the category filter is applied
//       query.GICsIndustryGroup = { $regex: industryName, $options: 'i' };
//     }
//   }
  
  
//   // Determine sort criteria based on sortby value
//   if (sortby === 'Alphabetical UP') {
//     sortCriteria = { Name: 1 }; // Sort by Name in ascending order
//   } else if (sortby === 'High Market Cap UP') {
//     sortCriteria = { MarketCapitalisation: -1 }; // Sort by MarketCapitalisation in descending order
//   } else if (sortby === 'Low Market Cap DOWN') {
//     sortCriteria = { MarketCapitalisation: 1}; // Sort by MarketCapitalisation in descending order
//   } else if (sortby === 'Gainers UP') {
//     sortCriteria = { regularMarketChangePercent: -1 }; // Sort by MarketCapitalisation in descending order
//   } else if (sortby === 'Losers DOWN') {
//     sortCriteria = { regularMarketChangePercent: 1}; // Sort by MarketCapitalisation in descending order
//   } else if (sortby === 'Growth Stocks UP') {
//     sortCriteria = { priceToBook: -1 }; // Sort by MarketCapitalisation in descending order
//   } else if (sortby === 'Value Stocks UP') {
//     sortCriteria = { priceToBook: 1}; // Sort by MarketCapitalisation in descending order
//   } 


//   // Execute the query with sorting
//   const companiesData = await Stock.find(query).sort(sortCriteria).skip(offset).limit(limit).lean();


//   // Prepare and return the response.
//   return new Response(JSON.stringify(companiesData), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }
