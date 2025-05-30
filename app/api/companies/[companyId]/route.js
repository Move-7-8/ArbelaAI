import fetch from 'node-fetch'; // Ensure node-fetch is imported

export async function POST(req, res) {
  const request_data = await req.json(); // Parsing JSON from the incoming request.
  const ticker = request_data.ticker; 
  console.log('company route ticker', ticker)


  // Replace 'Your-RapidAPI-Key' and 'Your-RapidAPI-Host' with actual values from RapidAPI
  const apiKey = process.env.RAPID_API_KEY
  const apiHost = process.env.RAPID_API_HOST
  
  // Array of API endpoint paths
  const endpoints = [
    { key: 'price', path: `price/${ticker}` },
    { key: 'historic', path: `historic/${ticker}/1d/1y` },
    { key: 'historic30Days', path: `historic/${ticker}/1h/30d` }, // 30 days at 1-hour intervals
    { key: 'historic7Days', path: `historic/${ticker}/30m/7d` }, // 7 days at 30-minute intervals
    { key: 'financeAnalytics', path: `finance-analytics/${ticker}` },
    { key: 'keyStatistics', path: `key-statistics/${ticker}` }
  ];

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  try {
    // Initialize an empty array to hold the fetched data
    const allData = [];

    // Loop through each endpoint, wait for a delay, and then fetch the data
    for (const { key, path } of endpoints) {
      await delay(50); // Wait for 200ms before each request, adjust this value as needed

      const apiUrl = `https://yahoo-finance127.p.rapidapi.com/${path}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const jsonData = await response.json();
      allData.push({ [key]: jsonData }); // Accumulate fetched data
    }

    const organizedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});

    return new Response(JSON.stringify(organizedData), { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}
