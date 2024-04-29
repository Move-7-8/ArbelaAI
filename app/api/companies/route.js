import { connectToDB } from '@utils/database';
import Stock from '@models/stock';

export async function POST(request) {
    await connectToDB();

    const request_data = await request.json();
    const { limit = 12, offset = 0, searchText, category, sortby } = request_data;

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
        _id: 0  // Exclude _id if not needed, or set to 1 if needed
    };

    // Construct the match stage
    let matchStage = {
        MarketCapitalisation: { $ne: 'N/A' },
        regularMarketChangePercent: { $ne: 'N/A', $exists: true, $type: 'number', $lt: 1000 },
        Name: { $ne: 'Unknown Company', $type: 'string' },
        priceToBook: { $ne: 'N/A', $exists: true, $type: 'number', $gte: 0 }
    };

    // if (category && category.name && category.name[0] !== 'All Industries') {
    //     matchStage['get-profile.quoteSummary.result.summaryProfile.industry'] = { $regex: category.name[0], $options: 'i' };
    // }
    if (category && category.name && category.name !== 'All Industries') {
        matchStage['get-profile.quoteSummary.result.summaryProfile.industry'] = { $regex: category.name, $options: 'i' };
    }
    
    if (searchText) {
        matchStage.$or = [
            { Name: { $regex: searchText, $options: 'i' } },
            { Ticker: { $regex: searchText, $options: 'i' } }
        ];
    }

    // Construct the sort stage
    let sortStage = {};
    switch (sortby) {
        case 'Alphabetical UP':
            sortStage.Name = 1;
            break;
        case 'High Market Cap UP':
            sortStage.MarketCapitalisation = -1;
            break;
        case 'Low Market Cap DOWN':
            sortStage.MarketCapitalisation = 1;
            break;
        case 'Gainers UP':
            sortStage.regularMarketChangePercent = -1;
            break;
        case 'Losers DOWN':
            sortStage.regularMarketChangePercent = 1;
            break;
        case 'Growth Stocks UP':
            sortStage.priceToBook = -1;
            break;
        case 'Value Stocks UP':
            sortStage.priceToBook = 1;
            break;
        default:
            sortStage = { _id: 1 }; // Default sort by document ID or another field
            break;
    }

    const pipeline = [
        { '$match': matchStage },
        { '$sort': sortStage },
        { '$project': fieldsNeeded },
        { '$skip': offset },
        { '$limit': limit }
    ];

    try {
        const companiesData = await Stock.aggregate(pipeline).exec();

        return new Response(JSON.stringify(companiesData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch ( error) {
        console.error('Error fetching data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
