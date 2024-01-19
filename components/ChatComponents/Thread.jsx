"use client";

import { messagesAtom, threadAtom } from "@/atom";
import { useAtom } from "jotai";
import React, { useState, useEffect} from "react";

function Thread({ fileChangeCompleted }) {
  // Atom State
  const [thread, setThread] = useAtom(threadAtom);
  const [, setMessages] = useAtom(messagesAtom);

  // State
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(""); // Added message state

  // Trigger handleCreate when fileChangeCompleted updates to true
// In Thread.jsx
useEffect(() => {
  if (fileChangeCompleted) {
    console.log("Triggering handleCreate in Thread.jsx");
    handleCreate();
  }
}, [fileChangeCompleted]);
  

  const handleCreate = async () => {
    setCreating(true);
    try {
        const response = await fetch("/api/AI/thread/create");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();

        const newThread = responseData.thread.id;
        console.log("response", newThread);
        setThread(newThread);
        localStorage.setItem("thread", JSON.stringify(newThread));
        setMessage("Successfully created thread"); // Update message
        console.log("Successfully created thread")
    } catch (error) {
        console.error(error);
        setMessage("Failed to create thread"); // Update message
    } finally {
        setCreating(false);
    }
  };

//   const handleDelete = async () => {
//     if (!thread) throw new Error("No thread to delete");

//     setDeleting(true);
//     try {
//         const response = await fetch(`/api/AI/thread/delete?threadId=${thread.id}`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
      
//       const deletedThread = response.data.thread;
//       console.log("response", deletedThread);
//       setThread(null);
//       localStorage.removeItem("thread");
//       setMessages([]);
//       setMessage("Successfully deleted thread"); // Update message
//     } catch (error) {
//       console.error(error);
//       setMessage("Failed to delete thread"); // Update message
//     } finally {
//       setDeleting(false);
//     }
//   };

  return (
    <div className="flex flex-col mb-8">
      <h1 className="text-4xl font-semibold mb-4">Thread</h1>
      <div className="flex flex-row gap-x-4 w-full">
      <button
        onClick={handleCreate}
        disabled={creating}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
        {creating ? "Creating..." : "Create"}
        </button>
        {/* <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
        {deleting ? "Deleting..." : "Delete"}
        </button> */}
      </div>
      {message && <div className="mt-4 text-center text-lg">{message}</div>} {/* Display message */}
    </div>
  );
}

export default Thread;