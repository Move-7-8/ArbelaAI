import fetch from 'node-fetch'; // Ensure node-fetch is imported


export async function POST(req, res) {
  console.log('BACKEND TEST ROUTE HIT');
  const request_data = await req.json(); // Parsing JSON from the incoming request.
  console.log('REQ: ', request_data);

  // const ticker = request_data.ticker;
  const ticker = request_data.ticker; // 

  // Replace 'Your-RapidAPI-Key' and 'Your-RapidAPI-Host' with actual values from RapidAPI
  const apiKey = '3e127537b5mshfdc9b740d2be432p180807jsn2142859ab157';
  const apiHost = 'yahoo-finance127.p.rapidapi.com';
  const apiUrl = `https://yahoo-finance127.p.rapidapi.com/key-statistics/${ticker}`;

  try {
    // Make a request to the Yahoo Finance API
    const response = await fetch(apiUrl, {
      method: 'GET', // GET method
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
        'Content-Type': 'application/json'
      }
    });

    // Checking if the request was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`); // If not successful, throw an error
    }

    const data = await response.json(); // Parse the JSON data from the response

    // Logging and returning the response
    console.log('Data:', data);
    // console.log('Max Age:', data.maxAge);
    // console.log('First Yearly Financial:', data.financialsChart.yearly[0]);
    // console.log('Currency:', data.financialCurrency);

    return new Response(JSON.stringify(data), { status: 200 }); // Send the data back to the client

  } catch (error) {
    // Handle any errors
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}
