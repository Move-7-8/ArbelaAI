//api/industries/route.js

import { NextRequest } from 'next/server';
import {connectToDB} from '@utils/database'
import Stock from '@models/stock';

export async function GET(request) {
    await connectToDB();
    
    // Check if the request is for unique industries
    const url = new URL(request.url);
    const uniqueIndustries = url.searchParams.get('uniqueIndustries');
    
    if (uniqueIndustries) {
      const industries = await Stock.distinct("GICsIndustryGroup"); // Assuming "GICsIndustryGroup" is the field name
      return new Response(JSON.stringify(industries), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Your existing code to return companies data
    }
  }
  