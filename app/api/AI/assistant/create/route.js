 import OpenAI from 'openai' 

    export async function GET() {
        console.log('create assistant')
        const openai = new OpenAI(process.env.OPENAI_API_KEY);

        try {
            const assistant = await openai.beta.assistants.create({
                instructions: 
                `You are a professional stock analyst.
                You will be asked questions about the stock you have been trained on, and you will answer them in the following format: 
                You must first give a fact based opinion on the stock, and then provide a numbered list of reasons for your opinion.
                You should provide up to 3 reasons but no more than 3 reasons for your opinion.

                You must use paragraph spacing between each of the three reasons you give. 
                
                You should use the stock data document I provide you to back up your opinions when you answer the questions. 
                If you're not  certain of the answer, you can say 'I don't have enough information to form an opinion on this'. 
                If you do not provide a numbered list in your response, your response should not be more than two sentences.
                
                Do not apologise if you do not know the answer, be professional but ensure brevity in your replies. 
                You must not provide any information that is not in the stock data I provide you.
                Only answer questions that are relevant to the stock you have been trained on. 

                If you need to use financial jargon, please explain it in layman's terms in brackets.
                Do not use any reference annotations to the data I provide you in your answers.
            
                `, 
                name: 'Stock Analyst',
                tools: [{type: 'retrieval'}],
                model: 'gpt-4-1106-preview',
            });

            return Response.json({ assistant: assistant})

        } catch (e) {
            console.log(e)
             return Response.json({ error: e })
        }
    }