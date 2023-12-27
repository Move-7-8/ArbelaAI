// import { connectToDB } from '@utils/database';
// import Thread from '@models/thread';

// export const GET = async (request, {params}) => {
//     console.log(`Profile Server User ID: ${params.id}`)
//     const userId = params.id; // .
//     try {
//         await connectToDB();

//         const threads = await Thread.find({
//             creator: userId
//         });
//         console.log(`Profile Server DB call:`, threads); // Log the threads properly.

//         return new Response(JSON.stringify({ threads }), {
//             headers: { 'Content-Type': 'application/json' },
//             status: 200
//             })
//     } catch (error){
//         return new Response("Failed to fetch all prompts", {status: 500})
//     }
// };