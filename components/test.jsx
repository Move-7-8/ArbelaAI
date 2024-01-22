"use client";

import { useState, useEffect } from "react";

import Assistant from "./ChatComponents/Assistant";
import AssistantFile from "./ChatComponents/AssistantFile";
import Thread from "./ChatComponents/Thread";
import ChatContainer from "./ChatComponents/ChatContainer";
import Run from "./ChatComponents/Run";
import ChatLoad from "./ChatComponents/ChatLoad";

// import Header from "./components/Header";
import { useAtom } from "jotai";
import {
  assistantAtom,
  fileAtom,
  runStateAtom,
  threadAtom,
  isValidRunState,
  assistantFileAtom,
  runAtom,
} from "@/atom";

export default function Home() {
  // Atom State
  const [, setAssistant] = useAtom(assistantAtom);
  const [, setFile] = useAtom(fileAtom);
  const [, setAssistantFile] = useAtom(assistantFileAtom);
  const [, setThread] = useAtom(threadAtom);
  const [, setRun] = useAtom(runAtom);
  const [, setRunState] = useAtom(runStateAtom);
  
  // UseStates for the Callbacks to trigger functions across the child components
  const [fileChangeTrigger, setFileChangeTrigger] = useState(false);
  const [fileChangeCompleted, setFileChangeCompleted] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [triggerCreate, setTriggerCreate] = useState(false);
  const [isThreadCreated, setIsThreadCreated] = useState(false);

  //Function to run the Assistant Create function on page load
  useEffect(() => {
    setTriggerCreate(true);
  }, []);

  // Function aa Callback to trigger the AssistantFile component to re-render 
  const handleFileChangeTrigger = () => {
    setFileChangeTrigger(true);
  };

  useEffect(() => {
    if (fileChangeTrigger) {
      setFileChangeTrigger(false);
    }
  }, [fileChangeTrigger]);

  // Function and UseEffect to trigger the Run from the Chat component 
  const handleMessageSent = () => {
    setMessageSent(true);
  };

  useEffect(() => {
    if (messageSent) {
      setMessageSent(false); // Reset the state for future message sends
    }
  }, [messageSent]);

    // Callback function to be called from Thread.jsx after final function is complete
    const handleThreadCreated = () => {
      setIsThreadCreated(true);
    };
  

  // Load default data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localAssistant = localStorage.getItem("assistant");
      if (localAssistant) {
        setAssistant(JSON.parse(localAssistant));
      }
      const localFile = localStorage.getItem("file");
      if (localFile) {
        setFile(localFile);
      }
      const localAssistantFile = localStorage.getItem("assistantFile");
      if (localAssistantFile) {
        setAssistantFile(localAssistantFile);
      }
      const localThread = localStorage.getItem("thread");
      if (localThread) {
        setThread(JSON.parse(localThread));
      }
      const localRun = localStorage.getItem("run");
      if (localRun) {
        setRun(JSON.parse(localRun));
      }
      const localRunState = localStorage.getItem("runState");
      if (localRunState && isValidRunState(localRunState)) {
        setRunState(localRunState);
      }
    }
  }, []);

  return (
    <main className="flex flex-col">
      <div className="flex flex-row mt-20 gap-x-10">
        <div className="flex flex-col w-full">
          {/* Assistant, AssistantFile, Thread are Service Components */}
          {/* They are triggered once on render of company page */}
          <Assistant onFileChangeTrigger={handleFileChangeTrigger} triggerCreate={triggerCreate} setTriggerCreate={setTriggerCreate} />
          <AssistantFile 
            onFileChangeTrigger={handleFileChangeTrigger} 
            fileChangeTrigger={fileChangeTrigger} 
            onFileChangeComplete={() => setFileChangeCompleted(true)} 
          />
          <Thread fileChangeCompleted={fileChangeCompleted} onThreadCreated={handleThreadCreated}/>

          {/* Run is a Service Component, ChatContainer is not */}
          {/* Run is triggered on ChatContainer 'Send' button click */}
          {/* Conditional Rendering between load screen and chatbox*/}
          {isThreadCreated ? <ChatContainer onMessageSent={handleMessageSent} /> : <ChatLoad />}
          <Run messageSent={messageSent} />
        </div>
        {/* Chat */}
        {/* <div className="w-full"> */}
        {/* </div> */}
      </div>
    </main>
  );
}
