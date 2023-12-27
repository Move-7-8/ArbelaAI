// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//   try {
//     // Extract thread ID and input content from form data
//     const formData = await req.formData();
//     const threadId = formData.get('threadId');
//     const input = formData.get('input');

//     // Log the received thread ID and input for debugging purposes
//     console.log(`inside add_Message -Thread ID: ${threadId}`);
//     console.log(`inside add_Message -Input: ${input}`);

//     // Validate the input data
//     if (typeof input !== 'string') {
//       throw new Error('Input is not a string');
//     }

//     // If input is provided, create a new message in the thread using the OpenAI API
//     if (input) {
//       await openai.beta.threads.messages.create(threadId, {
//         role: "user",
//         content: input,
//       });
//       console.log("add_Message successfully");
//       return NextResponse.json({ message: "Message created successfully" });
//     }

//     // Respond with a message indicating no action was performed if input is empty
//     return NextResponse.json({ message: 'No action performed' });
//   } catch (error) {
//     // Error handling with detailed logging
//     if (error instanceof Error) {
//       console.error('Error:', error.message);
//       return NextResponse.json({ error: error.message });
//     } else {
//       console.error('Unknown error:', error);
//       return NextResponse.json({ error: 'An unknown error occurred' });
//     }
//   }
// }
