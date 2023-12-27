// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req) {
//     if (req.method === 'POST') {
//         try {
//             const formData = await req.formData();

//             // Log formData details
//             console.log('CREATEASSIST: Received FormData:', formData);
            
//             const assistantName = formData.get('assistantName');
//             const assistantModel = formData.get('assistantModel');
//             const assistantDescription = formData.get('assistantDescription');
//             const fileIds = formData.getAll('fileIds[]');

//             // Log each parameter individually
//             console.log(`Assistant Name: ${assistantName}`);
//             console.log(`Assistant Model: ${assistantModel}`);
//             console.log(`Assistant Description: ${assistantDescription}`);
//             console.log(`CREATEASSIST: File IDs: ${fileIds}`);

//             if (!assistantName || !assistantModel || !assistantDescription) {
//                 throw new Error('Missing required assistant parameters');
//             }

//             // TAVILY FUNCTION: 
//             // Place a simple function here to ensure its working
//             //Then fill with working function 
            
//             const assistantOptions = {
//                 name: assistantName,
//                 instructions: assistantDescription,
//                 // instructions: 'If asked about the DigitalX P/B ratio, it is 1.37. If asked who the DigitalX CEO is, it is Lisa Wade. If asked about anything else, use Tavily to search online',
//                 // instructions: 'reply to everything in reverse',
//                 model: assistantModel,
//                 tools: [{ "type": "retrieval" }, {
//                     "type": "function",
//                     "function": {
//                       "name": "tavily_search",
//                       "description": "Get financially relevant information on companies from the web",
//                       "parameters": {
//                         "type": "object",
//                         "properties": {
//                           "query": {
//                             "type": "string", "description": "The search query to use. For example: 'Latest news on Nvidia stock performance"
//                         }
//                         },
//                         "required": ["query"]
//                       }
//                     }
//                   }],
//             };

//             if (fileIds.length > 0) {
//                 assistantOptions.file_ids = fileIds;
//             }

//             // Log assistant creation options
//             console.log('CREATEASSIST: Assistant Creation Options:', assistantOptions);

//             const assistant = await openai.beta.assistants.create(assistantOptions);
//             const assistantId = assistant.id;

//             // Log the created assistant ID
//             console.log(`CREATEASSIST: Created Assistant ID: ${assistantId}`);

//             return NextResponse.json({ 
//                 message: 'Assistant created successfully', 
//                 assistantId: assistantId 
//             });
//         } catch (error) {
//             // Detailed error logging
//             console.error('Error in createAssistant:', error);
//             return NextResponse.json({ error: error.message || 'An error occurred' });
//         }
//     } else {
//         return NextResponse.json({ error: 'Method Not Allowed' });
//     }
// };


