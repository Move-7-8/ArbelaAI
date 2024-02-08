export async function POST(req, res) {
    console.log('BACKEND TEST ROUTE HIT');
    const request_data = await req.json(); // Parsing JSON from the incoming request.
    console.log('REQ: ', request_data);
  
    const ticker = request_data.ticker; // 
  
    // Replace 'Your-RapidAPI-Key' and 'Your-RapidAPI-Host' with actual values from RapidAPI
    const apiKey = process.env.RAPID_API_KEY
    const apiHost = process.env.RAPID_API_HOST
  
// Array of API endpoint paths
//1. For Catalog, to use with filters/ sort by (GET)
    //a. get-movers   
        //i. Daily Gainers
        //ii. Daily Losers
        //iii. Most Active

//2. For companies (PUT with the tickers as Requests)
  //a. Get Profile endpoint 
    //Website, Description, 

  //b. Get News endpoint  
    //Recent news articles, 

  //c. Get News endpoint  
    //Recent news articles, 

  //d. Get similarities

  //e. Get Balance Sheet

const endpoints = [
    { key: 'price', path: `price/${ticker}` },
    { key: 'historic', path: `historic/${ticker}/1d/1y` },
];
try {
    // Iterate over each endpoint and fetch the data
    const allDataPromises = endpoints.map(async ({ key, path }) => { // Use destructuring to get key and path
        const apiUrl = `https://yahoo-finance127.p.rapidapi.com/${path}`;
        console.log(`Requesting URL: ${apiUrl}`); // Log the URL being requested

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
      // return new Response ({ [key]: jsonData }); // Return an object with a key
      return { [key]: jsonData }; // Return an object with a key
    });
      
      const allData = await Promise.all(allDataPromises);
      const organizedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});
      
      // console.log('Organized Data:', organizedData);
      return new Response(JSON.stringify(organizedData), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}

