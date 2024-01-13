import { NextRequest, NextApiResponse } from "next";
import {IncomingForm} from 'formidable'
import OpenAI from "openai";
import { createReadStream } from 'fs'

export const config = {
    api: {
        bodyParser: false
    },
};

export default async function handler(req, res) {
    console.log('upload running');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const form = new IncomingForm(); 

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'error passing the form data.'});
        }

        try {
        const fileArray = Array.isArray(files.file) ? files.file : [files.file];
        const  file  = fileArray[0];
        
        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return
        }

        const fileStream = createReadStream(file.path);

        const openai = new OpenAI(process.env.OPENAI_API_KEY);
        const respnse = await openai.files.create({
            file: fileStream,
            purpose: "assistants",
        });
        
        res.status(200).json({ file: response });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'unknown error' });
        }
    });

}