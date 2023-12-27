import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';


export async function GET() {
  // Load the JSON file
  const jsonFilePath = path.join(process.cwd(), 'public/assets/data/ASX_List.json');
  const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
  const companiesData = JSON.parse(fileContent);
  const tickerList = companiesData.map(company => company.ASX_code);
  const industryList = companiesData.map(company => company.GICsindustrygroup);
  const price = companiesData.map(company => company.Price);
  const change = companiesData.map(company => company["Change (%)"]);

  const responseData = {
    companies: companiesData,
    additional: tickerList,
    industry: industryList,
    price: price,
    change: change
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


