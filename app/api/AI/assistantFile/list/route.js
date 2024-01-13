import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET (request) {
    const searchParams = request.nextUrl.searchParams;
    const assistantId = searchParams.get('assistantId');

    if (!assistantId) 
        return Response.json(
        { error: 'No assistant id provided' }, 
        { status: 400 }
        )
    
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    try {
        const assistantFiles = await openai.assistants.files.list(
            assistantId, 
        );
        console.log(assistantFiles);

        return Response.json({assistantFiles: assistantFiles}, {status: 200});
    } catch (e) {
        console.log(e);
        return Response.json({error: 'unknown error'}, {status: 500});

    }
}

