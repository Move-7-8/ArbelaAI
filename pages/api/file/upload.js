//I have no idea why this file structure works
//But it apparently needs to be this way according 
//To the tutorial I'm following

import { IncomingForm } from 'formidable';
import OpenAI from "openai";
import { createReadStream } from 'fs';

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

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error parsing the form data.' });
        }

        try {
            const fileArray = Array.isArray(files.file) ? files.file : [files.file];
            const file = fileArray[0];

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

            return res.status(200).json({ file: response });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: 'Unknown error' });
        }
    });
}
