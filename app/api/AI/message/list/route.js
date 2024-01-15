import OpenAI from "openai";    

async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get("threadId");

  if (!threadId)
    return new Response(JSON.stringify({ error: "No id provided" }), { status: 400 });

    const openai = new OpenAI(process.env.OPENAI_API_KEY);

  try {
    const response = await openai.beta.threads.messages.list(threadId);

    console.log(response);

    return new Response(JSON.stringify({ messages: response.data }));
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: e }));
  }
}

module.exports = { GET };
