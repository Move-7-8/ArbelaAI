import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET (request) {
    const searchParams = request.nextUrl.searchParams;
    const assistantId = searchParams.get('assistantId');
    const fileId = searchParams.get('fileId');
    console.log('assistant ID: ', assistantId);
    console.log('file ID: ', fileId);
    if (!assistantId || !fileId) 
        return Response.json(
        { error: 'No assistant id provided' }, 
        { status: 400 }
        )
    
    if(!fileId) 
        return Response.json({error: 'No file Id provided'}, {status: 400})
        
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    try {
        const assistantFile = await openai.beta.assistants.files.create(
            assistantId, 
            {
                file_id: fileId,
            }
        );
        console.log('assistantFile', assistantFile);

        return Response.json({assistantFile: assistantFile}, {status: 200});
    } catch (e) {
        console.log(e);
        return Response.json({error: 'unknown error'}, {status: 500});
    }
    
}