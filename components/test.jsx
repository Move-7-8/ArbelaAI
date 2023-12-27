'use client';

import { useState, useEffect, useRef } from 'react';
// Import the necessary classes from LangChain
import { OpenAIAssistantRunnable } from "langchain/experimental/openai_assistant";

export default function Test() {
  // ... [other state and variables]

  // Create the assistant
  useEffect(() => {
    const initAssistant = async () => {
      const assistant = await OpenAIAssistantRunnable.createAssistant({
        model: "gpt-4-1106-preview",
        // ...[other options if needed]
      });
      // Store the assistant in state or a ref
      setAssistant(assistant);
    };
    initAssistant();
  }, []);

  // Function to handle submitting messages
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    // ...[your existing logic]
    // Invoke the assistant
    if (assistant) {
      const assistantResponse = await assistant.invoke({
        content: input
      });
      // Process the response and update state as needed
    }
  };
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error != null && (
        <div className="relative bg-red-500 text-white px-6 py-4 rounded-md">
          <span className="block sm:inline">Error: {error.toString()}</span>
        </div>
      )}
  
      {messages.map((m) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap"
          style={{ color: roleToColorMap[m.role] }}
        >
          <strong>{`${m.role}: `}</strong>
          {m.content}
          <br />
          <br />
        </div>
      ))}
  
      {status === 'in_progress' && (
        <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
      )}
  
    {/* Conditional Rendering */}
    {isFormReady && (
      <>
      <form onSubmit={handleSubmitMessage}>
        <input
          ref={inputRef}
          disabled={status !== 'awaiting_message'}
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="What is the temperature in the living room?"
          onChange={handleInputChange}
          />
        <button type="submit" disabled={status !== 'awaiting_message'} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </>
    )}

    {/* NEW BACKEND TEST PT.2 */}
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* ... [Rest of your JSX] */}
      {/* Add a button to trigger the ping function */}
      <button onClick={pingBackend} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
        Ping Backend
      </button>
      {/* ... [Rest of your JSX] */}
    </div>

    </div>
  );
  }






















  // const fetchDocumentAsBlob = async () => {
  //   try {
  //     const response = await fetch('/api/S3');
  //     if (!response.ok) {
  //       throw new Error(`Error fetching S3 URLs: ${response.statusText}`);
  //     }
  //     const filesWithPresignedUrls = await response.json();

  //     // Assuming you want the first file, you can adjust as needed
  //     const fileData = filesWithPresignedUrls[0];
  //     const fileResponse = await fetch(fileData.url);
  //     if (!fileResponse.ok) {
  //       throw new Error(`Error fetching file from S3: ${fileResponse.statusText}`);
  //     }
  //     const blob = await fileResponse.blob();
  //     console.log('Document fetched as blob:', blob);
    
  //     // Create a FormData object and append the blob
  //     const formData = new FormData();
  //     formData.append('file', blob, fileData.key); // Assuming fileData.key is the filename
  //     console.log('Form data:');
      
    //   // Send FormData to your backend
    //   const backendResponse = await fetch('/api/Assistant/upload', {
    //     method: 'POST',
    //     body: formData
    //   });

    //   // Handle response from your backend
    //   const uploadData = await backendResponse.json();
    //   setOpenAIFileId(uploadData.fileIds);
    //   console.log('OpenAI File IDs:', uploadData.fileIds);

    //   console.log('OpenAI File IDs:', openAIFileId);

    // } catch (error) {
    //   console.error('Error:', error);
    // }
  // };

  // // Fetch the document when the component mounts or as per your logic
  // useEffect(() => {
  //   fetchDocumentAsBlob();
  // }, []);











