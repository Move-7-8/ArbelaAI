// import fetch from 'node-fetch'; // Ensure node-fetch is imported

// export async function POST(req, res) {
  // console.log('BACKEND TEST ROUTE HIT');
  // const request_data = await req.json(); // Parsing JSON from the incoming request.
  // console.log('REQ: ', request_data);



//   // const ticker = request_data.ticker;
//   const ticker = 'CBA.AX'; // Commonwealth Bank's ticker symbol on the ASX

//   // Replace 'Your-RapidAPI-Key' and 'Your-RapidAPI-Host' with actual values from RapidAPI
//   const apiKey = '3e127537b5mshfdc9b740d2be432p180807jsn2142859ab157';
//   const apiHost = 'yahoo-finance127.p.rapidapi.com';
//   const apiUrl = `https://yahoo-finance127.p.rapidapi.com/key-statistics/CBA.AX`;

//   try {
//     // Make a request to the Yahoo Finance API
//     const response = await fetch(apiUrl, {
//       method: 'GET', // GET method
//       headers: {
//         'X-RapidAPI-Key': apiKey,
//         'X-RapidAPI-Host': apiHost,
//         'Content-Type': 'application/json'
//       }
//     });

//     // Checking if the request was successful
//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`); // If not successful, throw an error
//     }

//     const data = await response.json(); // Parse the JSON data from the response

//     // Logging and returning the response
//     console.log('Data:', data);
//     // console.log('Max Age:', data.maxAge);
//     // console.log('First Yearly Financial:', data.financialsChart.yearly[0]);
//     // console.log('Currency:', data.financialCurrency);

//     return new Response(JSON.stringify(data), { status: 200 }); // Send the data back to the client

//   } catch (error) {
//     // Handle any errors
//     console.error('Error:', error);
//     return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
//   }
// }






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


