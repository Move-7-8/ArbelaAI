//I have no idea why this file structure works
//But it apparently needs to be this way according 
//To the tutorial I'm following

import { IncomingForm } from 'formidable';
import OpenAI from "openai";
import { createReadStream } from 'fs';
// const AWS = require('aws-sdk');


// Configure AWS
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'ap-southeast-2'
// });

// const s3 = new AWS.S3();

// async function handler(req, res) {
//     const bucketName = 'kalicapitaltest';
//     console.log('S3 Route Hit')

//     try {
//         const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
//         const files = response.Contents.map(file => file.Key);
//         res.status(200).json({ files });
//         console.log('S3 List Done');
//         console.log(files)
//     } catch (error) {
//         console.error('S3 List Error:', error);
//         res.status(500).json({ error: 'Error listing files from S3' });
//     }
// }

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    console.log('upload running');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const form = new IncomingForm();
    console.log('form: ', form)

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error parsing the form data.' });
        }

        try {
            const fileArray = Array.isArray(files.file) ? files.file : [files.file];
            const file = fileArray[0];
            console.log('file: ', file)
            if (!file || !file.filepath) {
                console.error("No file or file path found");
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const fileStream = createReadStream(file.filepath);

            const openai = new OpenAI(process.env.OPENAI_API_KEY);
            const response = await openai.files.create({
                file: fileStream,
                purpose: "assistants",
            });
            // console.log('open AI response: ', response)
            return res.status(200).json({ file: response });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: 'Unknown error' });
        }
    });
}
