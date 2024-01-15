import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET (request) {
    console.log('Run retrieve route hit')
    const searchParams = request.nextUrl.searchParams;
    const threadId = searchParams.get('threadId');
    const runId = searchParams.get('runId');

    if(!threadId) 
        return Response.json({error: 'No thread Id provided'}, {status: 400})
    if(!runId) 
        return Response.json({error: 'No run Id provided'}, {status: 400})

    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    try {
        const run = await openai.beta.threads.runs.retrieve(threadId, runId);
        console.log(run);

        return Response.json({run: run}, {status: 200});
    } catch (e) {
        console.log(e);
        return Response.json({error: 'unknown error'}, {status: 500});

    }
}