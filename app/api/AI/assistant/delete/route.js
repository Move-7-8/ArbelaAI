import OpenAI from 'openai'

export async function POST(request) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    try {
        const { assistantIds } = await request.json();

        for (const assistantId of assistantIds) {
            await openai.beta.assistants.del(assistantId);
        }

        return new Response(JSON.stringify({ message: 'All specified assistants deleted successfully' }), { status: 200 });
    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
