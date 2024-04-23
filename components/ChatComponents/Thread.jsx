"use client";

import { messagesAtom, threadAtom } from "@/atom";
import { useAtom } from "jotai";
import React, { useState, useEffect} from "react";

function Thread({ fileChangeCompleted, onThreadCreated, newThreadFunctionCaller }) {
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
    handleCreate();
  }
}, [fileChangeCompleted]);

const handleCreate = async () => {
  setCreating(true);
  try {
    // Add method: 'POST' in the fetch options
    const response = await fetch("/api/AI/thread/create", {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    const newThread = responseData.thread.id;
    setThread(newThread);
    localStorage.setItem("thread", JSON.stringify(newThread));
    onThreadCreated(); // Call the callback once the thread is created
    newThreadFunctionCaller()

  } catch (error) {
    console.error(error);
    setMessage("Failed to create thread"); // Update message
  } finally {
    setCreating(false);
  }
};


return null
}

export default Thread;