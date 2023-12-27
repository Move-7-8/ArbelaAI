import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { createReadStream } from 'fs';
import OpenAI from "openai";

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function POST(request) {

  // Logging the start of the upload process
  console.log(`odeley guey`);

  // Retrieving the file from the form data
  const data = await request.formData();
  const files = data.getAll('file'); // Assuming 'file' is the name attribute in the FormData

  // Check if a file was provided in the request
  if (files.length === 0) {
    console.log('No files found in the request');
    return NextResponse.json({ success: false, message: 'No files found' });
  }

  let fileIds = [];

  // Convert file to buffer and write to a temporary location
  for (let file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `/tmp/${file.name}`;
    await writeFile(path, buffer);
    console.log(`File written to ${path}`);

    try {
      const fileForRetrieval = await openai.files.create({
        file: createReadStream(path),
        purpose: "assistants",
      });
      console.log(`UPLOAD: File uploaded to OpenAI, ID: ${fileForRetrieval.id}`);
      fileIds.push(fileForRetrieval.id);
    } catch (error) {
      console.error('UPLOAD: Error uploading file to OpenAI:', error);
      // Decide how to handle partial failures
      // Adding a log for partial failure scenario
      console.log(`UPLOAD: Partial Failure: Uploaded ${fileIds.length} of ${files.length} files`);
    }
  }

  // Log the final status of file upload
  console.log(`UPLOAD: File upload completed. Total files uploaded: ${fileIds.length}`);
  return NextResponse.json({ success: true, fileIds: fileIds });
}


