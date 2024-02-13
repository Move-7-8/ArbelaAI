import OpenAI from "openai";    

export async function POST (req) {
    const {message, threadId} = await req.json();
    // console.log('thread ID:', threadId)
    // console.log('Message:', message)

    if (!message || !threadId) 
        return Response.json(
        { error: 'No message or threadId provided' }, 
        { status: 400 }
        )

    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    try {
        const threadMessage = await openai.beta.threads.messages.create(
            threadId, 
            {
                role: 'user',
                content: message
            });

        console.log(threadMessage);

        return Response.json({message: threadMessage}, {status: 200});
        } catch(e) {    
            console.log(e);
            return Response.json({error: e}, {status: 500});
        }
}