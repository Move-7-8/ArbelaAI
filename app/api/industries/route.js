import { NextRequest } from 'next/server';
import { connectToDB } from '@utils/database';
import Stock from '@models/stock';

export async function GET(request) {

    
    // Check if the request is for unique industries
    const url = new URL(request.url);
    const uniqueIndustries = url.searchParams.get('uniqueIndustries');

    if (uniqueIndustries) {
        // Using MongoDB's aggregation framework to extract unique industries
        const industries = await Stock.aggregate([
            {
                $match: {"get-profile.quoteSummary.result.summaryProfile.industry": {$exists: true}}
            },
            {
                $group: {
                    _id: "$get-profile.quoteSummary.result.summaryProfile.industry"
                }
            },
            {
                $sort: {_id: 1} // Sorting alphabetically
            }
        ]).exec();

        // Log the results of the aggregation

        // Map to return only the industry names
        const industryNames = industries.map(ind => ind._id);
        return new Response(JSON.stringify(industryNames), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        // Log when the request does not have the correct parameters
        console.log("Request for unique industries failed; parameter 'uniqueIndustries' not provided.");
        return new Response(JSON.stringify({"message": "No unique industries parameter provided"}), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
