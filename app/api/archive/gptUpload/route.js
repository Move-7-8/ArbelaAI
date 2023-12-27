// //This route is to test pulling a doc from S3 
// //And uploading it to the Vercel Assistant API 
// //This may be able to be done dynamically
// //Using Next dynamic API routing
// //So may be okay not to have this functionality on the front end 

// //Even if possible, how do I get it from here to gptAssistant back end along w the front end input?

// import { NextRequest, NextResponse } from 'next/server';
// // import fetch from 'node-fetch';
// import FormData from 'form-data';

// // const openai = new OpenAI({
// //     apiKey: process.env.OPENAI_API_KEY || '',
// //   });
  
  
//   export async function POST(request) {
//     try {
//         const s3Response = await fetch('http://localhost:3001/api/S3');
//         if (!s3Response.ok) {
//           throw new Error(`S3 API response error: ${s3Response.status}`);
//         }
//             const filesWithPresignedUrls = await s3Response.json();
    
//         const fileData = filesWithPresignedUrls[0];
//         const fileResponse = await fetch(fileData.url);
//         const arrayBuffer = await fileResponse.arrayBuffer(); // Get an ArrayBuffer from the response
//         const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
                
//         const formData = new FormData();
//         const fileMetadata = {
//           contentType: 'application/pdf',
//           filename: fileData.key,
//         };
//         formData.append('file', buffer, fileMetadata);
                            
//         // Send FormData to the upload route
//         const backendResponse = await fetch('http://localhost:3001/api/Assistant/upload', {
//             method: 'POST',
//             body: formData,
//             headers: formData.getHeaders() // Important to include the correct headers
//         });
    
//         // Handle response from your backend
//         if (!backendResponse.ok) {
//             throw new Error(`Upload API response error: ${backendResponse.status}`);
//         }
//         const uploadData = await backendResponse.json();
//         console.log('OpenAI File IDs:', uploadData.fileIds);
    
//         // Return the file IDs to the client
//         return NextResponse.json({ success: true, fileIds: uploadData.fileIds });
    
//         } catch (error) {
//         console.error('Error:', error);
//         return NextResponse.json({ success: false, message: error.message });
//         }
//     }
      
    
    
    
    
