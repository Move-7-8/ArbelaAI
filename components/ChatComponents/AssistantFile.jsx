"use client";

import { assistantAtom, assistantFileAtom, fileAtom } from "@/atom";
import { useAtom } from "jotai";
import React, { useRef, useState, useEffect } from "react";

const AssistantFile = ({ onFileChangeTrigger, fileChangeTrigger, onFileChangeComplete }) => {
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

  // Use useEffect to listen for changes to onFileChangeTrigger
  useEffect(() => {
    if (fileChangeTrigger) {
      handleFileChange();
    }
  }, [fileChangeTrigger]);
  
  const handleFileChange = async (event) => {
    console.log('handle file change triggered')
    const fileKey = 'DigitalX.pdf';

    const response = await fetch('/api/AI/assistantFile/S3', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: fileKey }),
    });
    const responseData = await response.blob();
    console.log('Response data:', responseData);

    const file = responseData
    // const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      handleUpload(file);
    } else {
      console.log("No file selected");
    }
  };

//   const handleUpload = async () => {
//     setUploading(true);
//     try {
//         // Call your backend API endpoint to trigger the S3 file retrieval
//         const response = await fetch("/api/file/upload", {
//             method: "GET", // or "POST" if appropriate
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const responseJSON = await response.json();
//         // Handle the response, e.g., updating state with the retrieved files
//         setMessage("Successfully fetched files from S3");
//         // Further processing...

//     } catch (error) {
//         console.error("Error fetching files from S3:", error);
//         setMessage("Error fetching files from S3");
//     } finally {
//         setUploading(false);
//     }
// };

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
      console.log('uploaded file', uploadedFile)
    
      
        if (uploadedFile && uploadedFile.id) {
          setFile(uploadedFile.id);
          localStorage.setItem("file", uploadedFile.id);
          setUploadedFileInfo(uploadedFile); // Update the state here
          setMessage("Successfully uploaded file");
          console.log('uploadedFile.id', uploadedFile.id)

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
  console.log('file', uploadedFile);
  console.log('file id', uploadedFile.id);
  console.log('assistant', assistant);
  console.log('HANDLE CREATE TRIGGERED');

    if (!file || !assistant) {
      throw new Error("No file or assistant");
    }

    setCreating(true);
    try {
      
      const response = await fetch(`/api/AI/assistantFile/create?assistantId=${assistant.id}&fileId=${uploadedFile.id}`);
      const fileData = await response.json();
      const assistantFile = fileData.assistantFile;
      const assistantFileId = fileData.assistantFile.id;
      console.log('======================================')
      console.log('RESPONSE RECEIVED', fileData)
      console.log('======================================')
      // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }
        
        // const assistantFile = response.data.assistantFile;

      console.log("assistantFileReceived", assistantFile);
      setAssistantFile(assistantFileId);
      localStorage.setItem("assistantFile", assistantFileId);
      onFileChangeComplete(); // Call the callback here
      console.log('======================================')
      console.log('C A L L  B A C K  T R I G G E R E D')
      console.log('======================================')

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
return null
//   return (
// <div className="flex flex-col mb-8">
//   <h1 className="text-4xl font-semibold mb-4">Assistant File</h1>
//   <div className="flex flex-row gap-x-4 w-full">
//     <button
//       // onClick={() => fileInputRef.current?.click()}
//       onClick={handleFileChange}
//       disabled={uploading}
//       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
//     >
//       {uploading ? "Uploading..." : "S3"}
//     </button>
//      <button
//       onClick={handleUpload}
//       // disabled={!assistant || !file}
//       className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
//       {uploading ? "Uploading..." : "Ipload"}
//       </button>
    

//     <button
//       onClick={handleCreate}
//       // disabled={!assistant || !file}
//       className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
//     >
//       {creating ? "Creating..." : "Create"}
//     </button>
//     <button
//       onClick={handleList}
//       className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
//     >
//       {listing ? "Listing..." : "List"}
//     </button>
//     <button
//       onClick={handleDelete}
//       // disabled={!assistant || !assistantFile}
//       className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
//     >
//       {deleting ? "Deleting..." : "Delete"}
//     </button>
//   </div>
//   {message && <div className="mt-4 text-center text-lg">{message}</div>}
//   <p className="font-semibold mb-4">File ID: {uploadedFileInfo?.id}</p>

// </div>
//   );
}

export default AssistantFile;
