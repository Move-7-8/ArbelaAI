 import OpenAI from 'openai' 

    export async function GET() {
        console.log('create assistant')
        const openai = new OpenAI(process.env.OPENAI_API_KEY);
        console.log('TEST openAI', openai)
        console.log('TEST Key', process.env.OPENAI_API_KEY)

        try {
            const assistant = await openai.beta.assistants.create({
                instructions: 
                `You are a professional stock analyst.
                I will ask you questions about the stock market, and you will answer them. 
                You can use the documents I provide you to help you answer the questions. 
                If you're not  certain of the answer, you can say 'I don't know'. `, 
                name: 'Stock Analyst',
                tools: [{type: 'retrieval'}],
                model: 'gpt-4-1106-preview',
            });
            console.log(assistant)

            return Response.json({ assistant: assistant})

        } catch (e) {
            console.log(e)
             return Response.json({ error: e })
        }
    }