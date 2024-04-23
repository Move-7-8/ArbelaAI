"use client";

import { assistantAtom, assistantFileAtom, fileAtom } from "@/atom";
import { useAtom } from "jotai";
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';

//Why are you hacking me? 

const AssistantFile = ({ condition1, condition2, symbol, fileChangeTrigger, onFileChangeComplete, uploadCompleteTrigger }) => {
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

  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker');

  // In AssistantFile.jsx
  useEffect(() => {
    if (condition1 && condition2) {
      handleFileChange();
    }
  }, [condition1, condition2]);
              
  const handleFileChange = async (event) => {


    const fileKey = `${ticker}_current_data.pdf`;
    const response = await fetch(`/api/AI/assistantFile/S3`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: fileKey }),
    });
    const responseData = await response.blob();

    const file = responseData
    if (file) {
      handleUpload(file);
    } else {
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

          handleCreate(uploadedFile); // Pass uploadedFile directly

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

const handleCreate = async (uploadedFile) => {

    if (!file || !assistant) {
      throw new Error("No file or assistant");
    }

    setCreating(true);
    try {
      
      const response = await fetch(`/api/AI/assistantFile/create?assistantId=${assistant.id}&fileId=${uploadedFile.id}`);
      const fileData = await response.json();
      const assistantFile = fileData.assistantFile;
      const assistantFileId = fileData.assistantFile.id;

      setAssistantFile(assistantFileId);
      localStorage.setItem("assistantFile", assistantFileId);
      onFileChangeComplete(); // Call the callback here
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
        setMessage(`Assistant Files: ${fileIds}`);
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
          cache: 'no-store',
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
      setMessage("Error deleting assistants");
  } finally {
      setDeleting(false);
  }
};

return null
}

export default AssistantFile;
