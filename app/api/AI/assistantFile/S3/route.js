import AWS from 'aws-sdk';

export async function POST (request) {
    console.log("===============================");
    console.log("S3 Route hit")
    console.log("===============================");
    try {
        const req = await request.json()
        const fileKey = req.key;

        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-southeast-2'        
        });

        const s3 = new AWS.S3();
        
        // Introduce a delay of 10 seconds
        console.log('Timer has started')

        await new Promise(resolve => setTimeout(resolve, 10000)); // 10000 milliseconds = 10 seconds
        console.log('10 Seconds has passed')

        // Get the file from S3
        const file = await s3.getObject({
            Bucket: 'kalicapitaltest',
            Key: fileKey,
        }).promise();

        // Set appropriate headers for the file
        const headers = {
            'Content-Type': file.ContentType,
            'Content-Length': file.ContentLength,
            'Content-Disposition': `attachment; filename="${fileKey}"`,
        };

        // Send the file data in the response
        return new Response(file.Body, {
            status: 200,
            headers: headers,
        });

    } catch (error) {
        console.log('Our error', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
        

//         // Create a pre-signed URL for the specific file
//         const url = await s3.getSignedUrlPromise('getObject', {
//             Bucket: 'kalicapitaltest',
//             Key: fileKey,
//             Expires: 60 * 5 // URL expires in 5 minutes, you can adjust this value
//         });

//         console.log(`Pre-signed URL: ${url}`);
//         return new Response(JSON.stringify({ key: fileKey, url: url }), {
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
