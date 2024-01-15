import OpenAI from "openai";    

export async function GET () {

    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    try {
        const thread = await openai.beta.threads.create()
        console.log(thread);

        return Response.json({thread: thread}, {status: 200});
        } catch(e) {
            console.log(e);
            return Response.json({error: 'unknown error'}, {status: 500});
        }
    }