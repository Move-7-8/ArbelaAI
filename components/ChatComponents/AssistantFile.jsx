"use client";

import { assistantAtom, assistantFileAtom, fileAtom } from "@/atom";
import { useAtom } from "jotai";
import React, { useRef, useState } from "react";

function AssistantFile() {
  // State
  const [assistant] = useAtom(assistantAtom);
  const [file, setFile] = useAtom(fileAtom);
  const [assistantFile, setAssistantFile] = useAtom(assistantFileAtom);
  
  const [message, setMessage] = useState('');
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);

  // Refs
  const fileInputRef = useRef(null);

  // CRUD States
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [listing, setListing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      handleUpload(file);
    } else {
      console.log("No file selected");
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/file/upload", {
          method: "POST",
          body: formData,
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJSON = await response.json();
      const uploadedFile = responseJSON.file;
      
        if (uploadedFile && uploadedFile.id) {
          setFile(uploadedFile.id);
          localStorage.setItem("file", uploadedFile.id);
          setUploadedFileInfo(uploadedFile); // Update the state here
          setMessage("Successfully uploaded file");
      } else {
          console.error("Invalid response structure:", responseJSON);
          setMessage("Error processing uploaded file");
      }
          } catch (error) {
        console.error("Error uploading file:", error);
        setMessage("Error uploading file");
    } finally {
        setUploading(false);
    }
};

  const handleCreate = async () => {
    console.log('file', file)
    console.log('assistant', assistant)
    if (!file || !assistant) {
      throw new Error("No file or assistant");
    }

    setCreating(true);
    try {
      const response = await fetch(`/api/AI/assistantFile/create?assistantId=${assistant.id}&fileId=${file}`);

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const assistantFile = response.data.assistantFile;

      console.log("assistantFile", assistantFile);
      setAssistantFile(assistantFile.id);
      localStorage.setItem("assistantFile", assistantFile.id);
    } catch (error) {
      console.error("Error creating assistant file:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleList = async () => {
    setListing(true);
    try {
        const response = await fetch(`/api/AI/assistantFile/list`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const assistantFiles = data.Files.data; // Assuming the response has a 'files' array
        
        // Join the file IDs with a comma and a space
        const fileIds = assistantFiles.map(file => file.id).join(', ');
        console.log("Assistant Files", fileIds);
        setMessage(`Assistant Files: ${fileIds}`);
        console.log('MESSAGE: ', message)
    } catch (error) {
        console.error("Error listing assistant files:", error);
        setMessage("Error listing assistant files");
    } finally {
        setListing(false);
    }
};

const handleDelete = async () => {
  setDeleting(true);
  try {
      // Extract assistant IDs from the message
      const fileIds = message.replace('Assistant Files: ', '').split(', ');

      const response = await fetch(`/api/AI/assistantFile/delete`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fileIds })
      });
      const data = await response.json();

      if (data.error) {
          setMessage(`Error deleting assistants: ${data.error}`);
      } else {
          setMessage(data.message);
      }
  } catch (error) {
      console.log("error", error);
      setMessage("Error deleting assistants");
  } finally {
      setDeleting(false);
  }
};

  return (
<div className="flex flex-col mb-8">
  <h1 className="text-4xl font-semibold mb-4">Assistant File</h1>
  <div className="flex flex-row gap-x-4 w-full">
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
    />
    <button
      onClick={() => fileInputRef.current?.click()}
      disabled={uploading}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {uploading ? "Uploading..." : "Upload"}
    </button>
    <button
      onClick={handleCreate}
      // disabled={!assistant || !file}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {creating ? "Creating..." : "Create"}
    </button>
    <button
      onClick={handleList}
      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
    >
      {listing ? "Listing..." : "List"}
    </button>
    <button
      onClick={handleDelete}
      // disabled={!assistant || !assistantFile}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  </div>
  {message && <div className="mt-4 text-center text-lg">{message}</div>}
  <p className="font-semibold mb-4">File ID: {uploadedFileInfo?.id}</p>

</div>
  );
}

export default AssistantFile;
