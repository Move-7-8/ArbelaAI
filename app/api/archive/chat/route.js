// export async function POST(request) {
//     try {
//         console.log("Received POST request for chat."); // Log at the start of the function
//         const reqBody = await request.json();
//         const {docId, message } = reqBody[0];
//         console.log("CHAT: Parsed request body:", reqBody); // Log parsed request body

//         if (!docId || !message) {
//             console.warn("docId or message missing from request."); // Warn if docId or message is missing
//             return new Response(JSON.stringify({ error: "docId and message are required." }), {
//                 status: 400,
//                 headers: { 'Content-Type': 'application/json' },
//             });
//         }

//         console.log("Sending request to external API with docId:", docId, "and message:", message); // Log before making external API call

//         // const apiResponse = await fetch(`https://api.askyourpdf.com/v1/chat/${docId}?model_name=GPT3`, {
//         const apiResponse = await fetch(`https://api.askyourpdf.com/v1/chat/37f31a28-9d09-4cbb-a403-6f623cd1f278?model_name=GPT3`, {

//             method: 'POST',
//             headers: {
//               'x-api-key': 'ask_ff52ea5e1feb49aad44a295af3218d74',  // Replaced with my actual API key
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify([{
//                 sender: "User",
//                 message,
//               }]),
//                       });
      
      
//         console.log("CHAT: Received response from external API with status:", apiResponse.status); // Log status of the external API response
        
//         const data = await apiResponse.json();
//         console.log("CHAT: API response data:", data); // Log the parsed data from the external API
        
//         return new Response(JSON.stringify(data), {
//             status: apiResponse.status,
//             headers: { 'Content-Type': 'application/json' },
//         });

//     } catch (error) {
//         console.error("Error occurred:", error.message); // Log any errors
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 500,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     }
// };
