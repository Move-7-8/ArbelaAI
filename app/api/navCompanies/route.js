import { connectToDB } from '@utils/database';
import Stock from '@models/stock';

export async function POST(request) {
    console.log('NavCompanies POST request received');
    await connectToDB();

    const request_data = await request.json(); // Parsing JSON from the incoming request.
    const { limit = 10, offset = 0, searchText = '' } = request_data;

    console.log('Limit: ', limit);
    console.log('Offset: ', offset);
    console.log('Search Text: ', searchText);

    // Define the fields you need
    const fieldsNeeded = {
        Name: 1,
        Stock: 1,
        MarketCapitalisation: 1,
        Price: 1,
        LastPrice: 1,
        regularMarketChangePercent: 1,
        priceToBook: 1,
        'get-profile.quoteSummary.result.summaryProfile.industry': 1,  // Projecting the specific nested field
        _id: 0  // Exclude _id if not needed
    };

    // Define a query with optional search text. If searchText is provided, search by Name or Ticker.
    let query = {
        ...searchText ? {
            $or: [
                { Name: { $regex: searchText, $options: 'i' } },
                { Stock: { $regex: searchText, $options: 'i' } }  // Assuming 'Stock' field holds the ticker.
            ]
        } : {},
        "get-profile.quoteSummary.result.summaryProfile.industry": { $regex: /.+/, $exists: true }  // Changed regex
    };

    // Use aggregate instead of find to allow complex projections and additional operations
    const pipeline = [
        { '$match': query },
        { '$project': fieldsNeeded },
        { '$skip': offset },
        { '$limit': limit }
    ];

    try {
        const companiesData = await Stock.aggregate(pipeline).exec();
        console.log('Companies Data Result: ', companiesData);
        console.log('Query Used:', query);  // Additional debug information

        return new Response(JSON.stringify(companiesData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Failed Query:', query);  // Log failed query for debugging
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
