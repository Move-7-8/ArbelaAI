// import AWS from 'aws-sdk';

// export const GET = async () => {
//     console.log("===============================");
//     console.log("S3 Route hit")
//     console.log("===============================");
//     try {
//         AWS.config.update({
//             accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//             secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//             region: 'ap-southeast-2'        
//         });

//         const s3 = new AWS.S3();
//         const listResponse = await s3.listObjectsV2({
//             Bucket: 'kalicapitaltest'
//         }).promise();

//         // Map through the files and create pre-signed URLs
//         const filesWithPresignedUrls = await Promise.all(
//             listResponse.Contents.map(async (file) => {
//                 const url = await s3.getSignedUrlPromise('getObject', {
//                     Bucket: 'kalicapitaltest',
//                     Key: file.Key,
//                     Expires: 60 * 5 // URL expires in 5 minutes, you can adjust this value
//                 });
//                 return {
//                     key: file.Key,
//                     url: url
//                 };
//             })
//         );

//         console.log(filesWithPresignedUrls);
//         return new Response(JSON.stringify(filesWithPresignedUrls), {
//             status: 200,
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//     } catch (error) {
//         console.log('Our error', error);
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 500,
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//     }
// };
