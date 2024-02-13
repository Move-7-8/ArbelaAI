export async function POST(req, res) {
    console.log('BACKEND COMPANY2 ROUTE HIT');
    const request_data = await req.json(); // Parsing JSON from the incoming request.
    console.log('COMPANY2 REQ: ', request_data);
  
    const ticker = request_data.ticker; // 
    console.log('COMPANY2 TICKER: ', ticker);
  
    // Replace 'Your-RapidAPI-Key' and 'Your-RapidAPI-Host' with actual values from RapidAPI
    const apiKey = process.env.RAPID_API_KEY
    const apiHost = process.env.RAPID_API_HOST_2
    console.log('COMPANY2 API KEY: ', apiHost);
    // Array of API endpoint paths
    const paramsMap = {
      
      //2. For companies page (METHOD: POST with the tickers as Requests)
      //a. Get Profile endpoint 
      //Website, Description, 
      'get-profile': {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-profile',
        params: {
          symbol: ticker,
          region: 'AU',
          lang: 'en-US'
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        }
      },
    
      //b. Get News endpoint  
        //Recent news articles, 
        'get-news': {
          method: 'POST',
          url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list',
          params: {
            region: 'AU',
            snippetCount: '4',
            s: ticker
          },
          headers: {
            'content-type': 'text/plain',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost
            },
          data: 'Pass in the value of uuids field returned right in this endpoint to load the next page, or leave empty to load first page'
        },
        
      //c. Get similarities
      //Filter for only Aus stocks
      'get-similar': {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-similarities',
        params: {symbol: ticker},
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
      }
      },
      
      //d. Get Balance Sheet
    'get-balance': {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-balance-sheet',
        params: {symbol: ticker},
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        }
      },
  };

  try {
    // Convert paramsMap into an array of fetch promises
    const fetchPromises = Object.entries(paramsMap).map(([key, endpoint]) => {
        const url = new URL(endpoint.url);
        Object.keys(endpoint.params).forEach(key => url.searchParams.append(key, endpoint.params[key]));

        return fetch(url.toString(), {
            method: endpoint.method,
            headers: endpoint.headers,
            body: endpoint.method === 'POST' ? JSON.stringify(endpoint.data) : null
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request for ${key} failed with status: ${response.status}`);
            }
            return response.json().then(data => ({ key, data }));
        });
    });

    // Use Promise.all to wait for all the fetch requests to complete
    const results = await Promise.all(fetchPromises);
    console.log('COMPANY2 RESULTS', results);
    // Convert the results array back into an object
    const resultObject = results.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
    }, {});

    // Send the combined result back
    return new Response(JSON.stringify(resultObject), { status: 200 });

} catch (error) {
    console.error('Error:', error);
    return new Response('Server Error', { status: 500 });

}
}
  //1. For Catalog page, to use with filters/ sort by (METHOD: GET)
      //a. get-movers 
      //May need to apply a filter to ensure that only Australian stocks are called   
    //   'get-movers': {
    //     method: 'GET',
    //     url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-movers',
    //     params: {
    //     region: 'AU',
    //     lang: 'en-US',
    //     start: '0',
    //     count: '6'
    //   }, 
    //   headers: {
    //     'X-RapidAPI-Key': apiKey,
    //     'X-RapidAPI-Host': apiHost
    //   }
    // },
        //i. Daily Gainers
        //ii. Daily Losers
        //iii. Most Active