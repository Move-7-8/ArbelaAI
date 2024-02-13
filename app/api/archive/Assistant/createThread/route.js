// // Create Thread Route
// // Import necessary modules from 'next/server' and 'openai'
// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import {connectToDB} from '@utils/database'
// import Thread from '@models/thread';

// // Initialize OpenAI client using the API key from environment variables
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Define an asynchronous function to handle POST requests
// export async function POST(req) {
//   // console.log('CREATE THREAD started');
//   if (req.method === 'POST') {
//     try {
//       const formData = await req.formData();
//       const inputMessage = formData.get('inputmessage');
//       const userId = formData.get('userId');
//       const companyName = formData.get('companyName');
//       const currentPageUrl = formData.get('currentPageUrl');
//       // console.log('create thread user id', userId)
//       // Check if the input message is present and a string
//       if (!inputMessage || typeof inputMessage !== 'string') {
//         throw new Error('inputmessage is missing or not a string');
//       }
      
//       // Create a new thread
//       const thread = await openai.beta.threads.create({
//         messages: [
//           {
//             role: "user",
//             content: inputMessage,
//           },
//         ],
//       });
//       const threadId = thread.id;

//       // Get the current date and time
//       const creationDate = new Date();

//       //Save the userId, threadID, company, URL in MongoDB.
//       await Thread.create({
//         user: userId,
//         company: companyName,
//         url: currentPageUrl,
//         threadId: threadId,
//         createdDate: creationDate
//       });
//       // Return the thread ID in the response
//       return NextResponse.json({ threadId });
//     } catch (error) {
//       console.error('Error:', error);
//       // Return a JSON response with the error message
//       return NextResponse.json({ error: error.message });
//     }
//   } else {
//     // Return an error if the request method is not POST
//     return NextResponse.json({ error: 'Method not allowed' });
//   }
// }
