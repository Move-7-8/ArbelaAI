
// // Check that this is not made redundant by checkPDF (They may be doing
// // The exact same thing, so one is probably redundant)
// export async function POST(request) {
//   try {
//     const reqBody = await request.json();
//     const response = await fetch('https://pdf.ai/api/v1/upload/url', {
//       method: 'POST',
//       headers: {
//         'X-API-Key': 'bxh7c609xu51wo12yyj70fyv',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(reqBody),
//     });

//     const data = await response.json();
    
//     return new Response(JSON.stringify(data), {
//       status: response.status,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }
