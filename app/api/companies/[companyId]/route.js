import fetch from 'node-fetch'; // Ensure node-fetch is imported

export async function POST(req, res) {
  console.log('BACKEND TEST ROUTE HIT');
  const request_data = await req.json(); // Parsing JSON from the incoming request.
  console.log('REQ: ', request_data);

  const ticker = request_data.ticker; // 

  // Replace 'Your-RapidAPI-Key' and 'Your-RapidAPI-Host' with actual values from RapidAPI
  const apiKey = '3e127537b5mshfdc9b740d2be432p180807jsn2142859ab157';
  const apiHost = 'yahoo-finance127.p.rapidapi.com';
  
  // Array of API endpoint paths
  const endpoints = [
    { key: 'price', path: `price/${ticker}` },
    { key: 'historic', path: `historic/${ticker}/1d/15d` },
    { key: 'balanceSheet', path: `balance-sheet/${ticker}` },
    { key: 'earnings', path: `earnings/${ticker}` },
    { key: 'financeAnalytics', path: `finance-analytics/${ticker}` },
    { key: 'news', path: `news/${ticker}` },
    { key: 'earningsTrend', path: `earnings-trend/${ticker}` },
    { key: 'keyStatistics', path: `key-statistics/${ticker}` }
    ];

  try {
    // Iterate over each endpoint and fetch the data
    const allDataPromises = endpoints.map(async ({ key, path }) => { // Use destructuring to get key and path
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
      return { [key]: jsonData }; // Return an object with a key
    });

    const allData = await Promise.all(allDataPromises);
    const organizedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});

    console.log('Organized Data:', organizedData);
    return new Response(JSON.stringify(organizedData), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}

