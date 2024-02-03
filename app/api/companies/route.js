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

  console.log('Limit: ', limit);
  console.log('Offset: ', offset);
  console.log('Search Text: ', searchText);
  console.log('Category: ', category);

  let query = {};

  // If there is searchText, add conditions for searching by Name or Ticker.
  if (searchText) {
    query.$or = [
      { Name: { $regex: searchText, $options: 'i' } },
      { Ticker: { $regex: searchText, $options: 'i' } },
    ];
  }

  // If there is a category, add a condition for the category.
  if (category) {
    // Ensure that category is treated as a string value representing the industry name.
    // If category is an object, use category.name; otherwise, use category directly.
    const industryName = typeof category === 'object' ? category.name : category;
    query.GICsIndustryGroup = { $regex: industryName, $options: 'i' };
  }
  
  console.log('Final Query: ', JSON.stringify(query, null, 2));

  // Execute a single query with the constructed conditions.
  const companiesData = await Stock.find(query).skip(offset).limit(limit).lean();
  console.log('Companies Data Result: ', companiesData);

  // Prepare and return the response.
  return new Response(JSON.stringify(companiesData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
