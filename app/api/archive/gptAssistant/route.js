// // import { Configuration, OpenAIApi } from "openai-edge";
// import { OpenAIStream, StreamingTextResponse, experimental_AssistantResponse } from "ai";
// import OpenAI from 'openai';
// import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';
// // import FormData from 'form-data'; // Ensure you have 'form-data' installed and imported

// export const runtime = 'edge';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || '',
// });


// export async function POST(request) {

//     // Receives the threadId (if exists), the user input messages, and the fileId
//     const input = await request.json();
//     // const { message, fileId } = await request.json();

//     console.log("===============================");
//     console.log("input:", input);

//     console.log("===============================");

//     let fileIds = input.file;
//     console.log("fileIds:", fileIds);

//     // try {
//     //     for (const fileData of filesWithPresignedUrls) {
//     //         const fileResponse = await fetch(fileData.url);

//     //         if (!fileResponse.ok) {
//     //             throw new Error(`Error fetching file from S3: ${fileResponse.statusText}`);
//     //         }

//             // const arrayBuffer = await fileResponse.arrayBuffer();
//             // const buffer = Buffer.from(arrayBuffer);
//             // console.log("===============================");
//             // console.log("Buffer size:", buffer.length);
//             // console.log("===============================");

//     //         const formData = new FormData();
//     //         formData.append('file', buffer, {
//     //             filename: fileData.key, // Set the filename
//     //             contentType: 'application/pdf', // Set the correct MIME type
//     //             knownLength: buffer.length // Set the known length of the buffer
//     //         });
//     //         formData.append('purpose', 'assistants');

//     //         // OpenAI API call
//     //         const openaiResponse = await fetch('https://api.openai.com/v1/files', {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//     //                 ...formData.getHeaders()
//     //             },
//     //             body: formData
//     //         });

//     //         const openaiData = await openaiResponse.json();
//     //         if (openaiResponse.ok) {
//     //             fileIds.push(openaiData.id);
//     //         } else {
//     //             console.error('Error uploading file to OpenAI:', openaiData);
//     //         }
//     //     }
//     // } catch (error) {
//     //     console.error('Error:', error);
//     //     throw error;
//     // }

//     // Create a thread if needed
//     const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

//     // Add a message to the thread
//     const createdMessage = await openai.beta.threads.messages.create(threadId, {
//         role: 'user',
//         content: input.message,
//         file_ids: fileIds // Use the array of file IDs
//     });

//     console.log('createdMessage');
//     console.log(createdMessage);

//     // ... Rest of your code ...
//     console.log(createdMessage)
//     return experimental_AssistantResponse(
//       { threadId, messageId: createdMessage.id },
//       async ({ threadId, sendMessage }) => {

// // Run the assistant on the thread
// const run = await openai.beta.threads.runs.create(threadId, {
//     assistant_id:
//     process.env.ASSISTANT_ID ??
//     (() => {
//         throw new Error('ASSISTANT_ID is not set');
//     })(),
// });
  
//         async function waitForRun(run) {

//           // Poll for status change
//           while (run.status === 'queued' || run.status === 'in_progress') {

//             // delay for 500ms:
//             await new Promise(resolve => setTimeout(resolve, 500));
  
//             run = await openai.beta.threads.runs.retrieve(threadId, run.id);
//           }
  
//           // Check the run status
//           if (
//             run.status === 'cancelled' ||
//             run.status === 'cancelling' ||
//             run.status === 'failed' ||
//             run.status === 'expired'
//           ) {
//             throw new Error(run.status);
//           }
  
//           if (run.status === 'requires_action') {
//             if (run.required_action?.type === 'submit_tool_outputs') {
//               const tool_outputs =
//                 run.required_action.submit_tool_outputs.tool_calls.map(
//                   toolCall => {
//                     const parameters = JSON.parse(toolCall.function.arguments);
  
//                     switch (toolCall.function.name) {
//                       case 'getRoomTemperature': {
//                         const temperature =
//                           homeTemperatures[
//                             parameters.room
//                           ];
  
//                         return {
//                           tool_call_id: toolCall.id,
//                           output: temperature.toString(),
//                         };
//                       }
  
//                       case 'setRoomTemperature': {
//                         homeTemperatures[
//                           parameters.room
//                         ] = parameters.temperature;
  
//                         return {
//                           tool_call_id: toolCall.id,
//                           output: `temperature set successfully`,
//                         };
//                       }
  
//                       default:
//                         throw new Error(
//                           `Unknown tool call function: ${toolCall.function.name}`,
//                         );
//                     }
//                   },
//                 );
  
//               run = await openai.beta.threads.runs.submitToolOutputs(
//                 threadId,
//                 run.id,
//                 { tool_outputs },
//               );
  
//               await waitForRun(run);
//             }
//           }
//         }
  
//         await waitForRun(run);
//     // Get new thread messages
//       // Get new thread messages (after our message)
//       const responseMessages = (
//         await openai.beta.threads.messages.list(threadId, {
//           after: createdMessage.id,
//           order: 'asc',
//         })
//       ).data;
      
//       // Send the messages
//       for (const message of responseMessages) {
//         sendMessage({
//           id: message.id,
//           role: 'assistant',
//           content: message.content.filter(content => content.type === 'text'),
//         });
//       }})}
      

















//   // const responseMessages = await openai.beta.threads.messages.list(threadId, {
//     //       after: createdMessage.id,
//     //       order: 'asc',
//     //   });
    
//     //   // Format the response messages and return as HTTP response
//     //   const formattedMessages = responseMessages.data.map(message => ({
//     //       id: message.id,
//     //       role: 'assistant',
//     //       content: message.content.filter(content => content.type === 'text'),
//     //   }));
    
//     //   console.log('formatted messages: ')
//     //   console.log(formattedMessages)
    
//     //     // Send the response
//     //     return NextResponse.json({ success: true, formattedMessages: formattedMessages });
//     //   }
//     //   )
      
//     // }
    
