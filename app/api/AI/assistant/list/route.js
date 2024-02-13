import OpenAI from "openai";

export async function GET() {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    try {
        const response = await openai.beta.assistants.list({
            order: 'desc',
            limit: 100,
        });

        const assistants = response.data; 
        
        return Response.json({ assistants: assistants });
    } catch (e) {
        console.log(e);
        return Response.json({ error: e });
    }
}