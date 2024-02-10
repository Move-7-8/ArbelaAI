"use client";

import { useState, useEffect } from "react";

import Assistant from "./ChatComponents/Assistant";
import AssistantFile from "./ChatComponents/AssistantFile";
import Thread from "./ChatComponents/Thread";
import ChatContainer from "./ChatComponents/ChatContainer";
import Run from "./ChatComponents/Run";
import ChatLoad from "./ChatComponents/ChatLoad";
import FileUpload from '@components/ChatComponents/FileUpload';

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

export default function Home({data}) {
  // Atom State
  const [, setAssistant] = useAtom(assistantAtom);
  const [, setFile] = useAtom(fileAtom);
  const [, setAssistantFile] = useAtom(assistantFileAtom);
  const [, setThread] = useAtom(threadAtom);
  const [, setRun] = useAtom(runAtom);
  const [, setRunState] = useAtom(runStateAtom);
  
  // UseStates for the Callbacks to trigger functions across the child components
  const [fileChangeTrigger, setFileChangeTrigger] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState({ create: false, upload: false });
  const [fileChangeCompleted, setFileChangeCompleted] = useState(false);
  const [uploadCompleteTrigger, setUploadCompleteTrigger] = useState(false);
  const [condition1, setcondition1] = useState(false);
  const [condition2, setcondition2] = useState(false);
  const [Chatcondition, setChatcondition] = useState(false);

  const [messageSent, setMessageSent] = useState(false);
  const [triggerCreate, setTriggerCreate] = useState(false);
  const [isThreadCreated, setIsThreadCreated] = useState(false);
  const [fileUploadTrigger, setFileUploadTrigger] = useState(false);
  const [triggerFileUploadFunction, setTriggerFileUploadFunction] = useState(false);

  const chat_ticker = data?.price?.symbol;
  //Function to run the Assistant Create function on page load
  useEffect(() => {
    setTriggerCreate(true);
  }, []);

// Update the state when handleCreate completes
const afterAssistantCreate = () => {
  setTasksCompleted(prev => ({ ...prev, create: true }));
  checkAndHandleUpload();
  handleFileChangeTrigger(); // Verify if this is called
  console.log("condition1 is pre:", condition1);
  setcondition1(true);
  console.log("condition1 is post: ", condition1);
};

// const onFileChangeTrigger = () => {
//   console.log('=============================')
//   console.log("onFileChangeTrigger called");
//   console.log('=============================')

// }

//Trigger AssistantFile when both necessary conditions are met
const onFileUploadCompleted = () => {
  setTasksCompleted(prev => ({ ...prev, upload: true }));
  checkAndHandleUpload();
  setUploadCompleteTrigger(true); // Verify if this is called
  console.log("condition1 is pre:", condition1);
  setcondition2(true);
  console.log("condition2 is post: ", condition2);
};
  
//Track if the Run has loaded and trigger the ChatMessage to render
const handleRunCompletion = () => {
  setChatcondition(true);
};

const handleRunFinalization = () => {
  setChatcondition(false); // Set Chatcondition to false when run is completed
  'OLA PENDEJO, CHAT  CONDITION IS FALSE'
};

// Check if both tasks are completed
const checkAndHandleUpload = () => {
  if (tasksCompleted.create && tasksCompleted.upload) {
    handleFileUploadInAssistantFile(); // Function to trigger upload in AssistantFile
    setTasksCompleted({ create: false, upload: false }); // Reset after triggering
  }
};
    
  
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
        // setAssistant(JSON.parse(localAssistant));
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
      <div className="flex flex-row  mt-3 gap-x-10">
        <div className="flex flex-col w-full">
          {/* Assistant, FileUpload, AssistantFile, Thread are Service Components */}
          {/* They are triggered once on render of company page */}
          <Assistant onFileChangeTrigger={afterAssistantCreate} triggerCreate={triggerCreate} setTriggerCreate={setTriggerCreate} />
          <FileUpload data={data} onFileUploadCompleted={onFileUploadCompleted} />
          <AssistantFile 
            onFileChangeTrigger={handleFileChangeTrigger} 
            tasksCompleted={tasksCompleted}
            uploadCompleteTrigger={uploadCompleteTrigger}
            onFileChangeComplete={() => setFileChangeCompleted(true)}
            fileChangeTrigger={fileChangeTrigger}   
            condition1={condition1}
            condition2={condition2}
            // symbol={symbol}
          />
          <Thread fileChangeCompleted={fileChangeCompleted} onThreadCreated={handleThreadCreated}/>
          {/* Run is a Service Component, ChatContainer is not */}
          {/* Run is triggered on ChatContainer 'Send' button click */}
          {/* Conditional Rendering between load screen and chatbox*/}
          {isThreadCreated ? <ChatContainer onMessageSent={handleMessageSent} chatCondition={Chatcondition} chat_ticker={chat_ticker} /> : <ChatLoad />}
          <Run messageSent={messageSent} onRunComplete={handleRunCompletion} onRunFinal={handleRunFinalization} />
        </div>
        {/* Chat */}
        {/* <div className="w-full"> */}
        {/* </div> */}
      </div>
    </main>
  );
}
