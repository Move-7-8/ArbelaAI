// pages/api/stock_info.js
export default async function GET(req, res) {
  // Extract parameters from the incoming request
  const { ticker } = req.query;

  // Call the Python script using child_process.spawn or exec
  const spawn = require('child_process').spawn;
  const process = spawn('python', ['./path/to/your/script.py', ticker]);

  // Collect data from script
  let data = '';
  for await (const chunk of process.stdout) {
    data += chunk;
  }

  // Handle script completion
  let error = '';
  for await (const chunk of process.stderr) {
    error += chunk;
  }

  process.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: 'Error in Python script', error: error });
    }
    // Send back the result from Python script
    res.status(200).json(JSON.parse(data));
  });
}



// import fs from 'fs';
// import path from 'path';
// import { NextRequest } from 'next/server';


// export async function GET() {
//   // Load the JSON file
//   const jsonFilePath = path.join(process.cwd(), 'public/assets/data/ASX_List.json');
//   const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
//   const companiesData = JSON.parse(fileContent);
//   const tickerList = companiesData.map(company => company.ASX_code);
//   const industryList = companiesData.map(company => company.GICsindustrygroup);
//   const price = companiesData.map(company => company.Price);
//   const change = companiesData.map(company => company["Change (%)"]);

//   const responseData = {
//     companies: companiesData,
//     additional: tickerList,
//     industry: industryList,
//     price: price,
//     change: change
//   };

//   return new Response(JSON.stringify(responseData), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }


