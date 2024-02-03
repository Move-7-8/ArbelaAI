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

  console.log('Limit: ', limit);
  console.log('Offset: ', offset);
  console.log('Search Text: ', searchText);


  let query = {};
  if (searchText) {
    query = {
      $or: [
        { Name: { $regex: searchText, $options: 'i' } },
        { Ticker: { $regex: searchText, $options: 'i' } }
      ]
    };
  }

  console.log('Companies Data Query: ', JSON.stringify(query, null, 2));
  const companiesData = await Stock.find({ 'Name' : { $regex: searchText, $options: 'i' }}).skip(offset).limit(limit).lean();
  // const companiesData = await Stock.find({DigitalX}).skip(offset).limit(limit).lean();

  console.log('Companies Data Result: ', companiesData);

  
  const responseData = companiesData;
  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  }

