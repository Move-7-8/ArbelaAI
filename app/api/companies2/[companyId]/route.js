export async function POST(req, res) {
    // console.log('BACKEND COMPANY2 ROUTE HIT');
    const request_data = await req.json(); // Parsing JSON from the incoming request.
  
    const ticker = request_data.ticker; // 
  
    const apiKey = process.env.RAPID_API_KEY
    const apiHost2 = process.env.RAPID_API_HOST_2
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
          'X-RapidAPI-Host': apiHost2
        }
      },

      //c. Get Income Statement  
      'get-income': {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-financials',
        params: {
          symbol: ticker, 
          currencyCode: 'AUD'
        
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost2
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
            'X-RapidAPI-Host': apiHost2
            },
          data: 'Pass in the value of uuids field returned right in this endpoint to load the next page, or leave empty to load first page'
        },
        
      //c. Get similarities
      'get-cashflow': {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-cash-flow',
        params: {
          symbol: ticker, 
          currencyCode: 'AUD'
        
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost2
        }
      },

      //d. Get Balance Sheet
      'get-balance': {
          method: 'GET',
          url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-balance-sheet',
          params: {
            symbol: ticker, 
            currencyCode: 'AUD'
          
          },
            headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost2
          }
        },
  };

      console.log('ROUTE ticker', ticker);
      try {
        const fetchPromises = Object.entries(paramsMap).map(([key, endpoint]) => {
            const url = new URL(endpoint.url);
            Object.keys(endpoint.params).forEach(paramKey => url.searchParams.append(paramKey, endpoint.params[paramKey]));

            return fetch(url.toString(), {
                method: endpoint.method,
                headers: endpoint.headers,
                body: endpoint.method === 'POST' ? JSON.stringify(endpoint.data) : null
            })
            .then(response => {
                if (response.status === 302) {
                    console.log(`Redirect occurred for ${key}. Handling redirect...`);
                    return null; // Or handle the redirect appropriately
                }
                if (!response.ok) {
                    throw new Error(`API request for ${key} failed with status: ${response.status}`);
                }
                return response.json().then(data => ({ key, data }));
            })
            .catch(error => {
                console.error(`Error fetching ${key}:`, error);
                return null; // Skip this result but continue with others
            });
        });

        const results = await Promise.all(fetchPromises);
        console.log('RESULTS:', results);
        const filteredResults = results.filter(result => result !== null); // Remove failed requests

        const resultObject = filteredResults.reduce((acc, { key, data }) => {
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
    //     'X-RapidAPI-Host': apiHost2
    //   }
    // },
        //i. Daily Gainers
        //ii. Daily Losers
        //iii. Most Active