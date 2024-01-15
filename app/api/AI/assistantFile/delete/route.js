import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST (request) {

    const body = await request.json(); // Parse the JSON body
    const fileId = body.fileIds; // Extract fileId from the body
    console.log('file ID', fileId);
    // if (!assistantId) 
    //     return Response.json(
    //     { error: 'No assistant id provided' }, 
    //     { status: 400 }
    //     )
    
    if(!fileId) 
        return Response.json({error: 'No file Id provided'}, {status: 400})
        
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    try {
        
        for (const file of fileId) {
            const deletedFile = await openai.files.del(
            file
        );
        }


        return Response.json(deletedFile);
    } catch (e) {
        console.log(e);
        return Response.json({error: 'unknown error'}, {status: 500});
    }
    
}