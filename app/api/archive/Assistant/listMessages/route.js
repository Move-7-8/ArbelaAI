// // Import necessary modules from 'next/server' and 'openai'
// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from "openai";

// // Initialize OpenAI client using the API key from environment variables
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Define an asynchronous POST function to handle incoming requests
// export async function POST(req) {
//   try {
//     // Extract form data from the request
//     const formData = await req.formData();

//     // Retrieve 'threadId' from form data
//     const threadId = formData.get('threadId');

//     // Log the received thread ID for debugging
//     console.log(`LM:`);

//     console.log(`Received request with threadId: ${threadId}`);

//     // Retrieve messages for the given thread ID using the OpenAI API
//     const messages = await openai.beta.threads.messages.list(threadId);
    
//     //Old Code: 
//     // messages.data.forEach((message, index) => {
//     //   console.log(`Message ${index + 1} content:`, message.content);
//     // });

//     //New Code: 
//     const allMessages = [];

//     messages.data.forEach((message) => {
//       // Check if the message content is available and is of type 'text'
//       if (message.content && message.content.length > 0 && message.content[0].type === 'text') {
//         // Create an object with the role and text content
//         const messageObj = {
//           role: message.role,
//           content: message.content[0].text.value
//         };
    
//         // Add the object to the allMessages array
//         allMessages.push(messageObj);
//       }
//     });
        
//     // Log the count of retrieved messages for debugging
//     //Notes for saturday: allMessages is now a list of objects
//     //containing the role and the message content
//     //some is weird/ useless? also it maybe needs to be reversed
//     //older stuff is at the bottom
//     //Need to send to front end and try to get each one to appear as a msg

//     console.log(`Retrieved ${messages.data.length} messages`);
//     console.log('Extracted Messages:', allMessages);

//     // Find the first assistant message
//     const assistantMessage = messages.data.find(message => message.role === 'assistant');

//     if (!assistantMessage) {
//       return NextResponse.json({ error: "No assistant message found" });
//     }

//     // Original code (May be needed for thread creation)
//     const assistantMessageContent = assistantMessage.content.at(0);

//     console.log('Assistant Message Content')
//     console.log(assistantMessageContent)
//     if (!assistantMessageContent) {
//       return NextResponse.json({ error: "No assistant message content found" });
//     }

//     if (assistantMessageContent.type !== "text") {
//       return NextResponse.json({ error: "Assistant message is not text, only text supported in this demo" });
//     }

//     //Old Code:
//     // Return the retrieved messages as a JSON response
//     // return NextResponse.json({ messages: assistantMessageContent.text.value });
//     //New Code: 
//     return NextResponse.json({ messages: allMessages });


//   } catch (error) {
//     // Log any errors that occur during the process
//     console.error(`Error occurred: ${error}`);
//   }
// }
