import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET (request) {

    const searchParams = request.nextUrl.searchParams;
    const assistantId = searchParams.get('assistantId');
    const fileId = searchParams.get('fileId');

    if (!assistantId) 
        return Response.json(
        { error: 'No assistant id provided' }, 
        { status: 400 }
        )
    
    if(!fileId) 
        return Response.json({error: 'No file Id provided'}, {status: 400})
        
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    try {
        const deletedFile = await openai.assistants.files.delete(
            assistantId, 
            fileId
        );
        console.log(deletedFile);

        return Response.json(deletedFile);
    } catch (e) {
        console.log(e);
        return Response.json({error: 'unknown error'}, {status: 500});
    }
    
}