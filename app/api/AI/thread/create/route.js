import OpenAI from "openai";

export async function POST(req, res) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  try {
    const thread = await openai.beta.threads.create({
      // Add any required parameters for thread creation here
    });
    console.log("Thread created:", thread.id);

        return Response.json({thread: thread}, {status: 200});
        } catch(e) {
            console.log(e);
            return Response.json({error: 'unknown error'}, {status: 500});
        }
    }