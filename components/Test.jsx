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

export default function Home({data, data2}) {
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

  const [showChatContainer, setShowChatContainer] = useState(false);
  
  // State to load in of chat
  const [timer, setTimer] = useState(false);
  const [chatTickerDefined, setChatTickerDefined] = useState(false);

  const chat_ticker = data?.price?.symbol;
  console.log('Test Triggered')

  useEffect(() => {
    setTriggerCreate(true);
  }, []);

// Update the state when handleCreate completes
const afterAssistantCreate = () => {
  setTasksCompleted(prev => ({ ...prev, create: true }));
  checkAndHandleUpload();
  handleFileChangeTrigger(); // Verify if this is called

  setcondition1(true);

};

//Trigger AssistantFile when both necessary conditions are met
const onFileUploadCompleted = () => {
  console.log('1. onFileUploadCompleted called')
  setTasksCompleted(prev => ({ ...prev, upload: true }));
  checkAndHandleUpload();
  setUploadCompleteTrigger(true); // Verify if this is called
  setcondition2(true);
};
  
const handleRunCompletion = () => {
  setChatcondition(true);
};

const handleRunFinalization = () => {
  setChatcondition(false); // Set Chatcondition to false when run is completed

};

// Check if both tasks are completed
const checkAndHandleUpload = () => {
  console.log('2. checkAndHandleUpload called')

  if (tasksCompleted.create && tasksCompleted.upload) {
    console.log('3. Both tasks completed')

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
    console.log('setting thread created', isThreadCreated) // Logs the current state before the update
    setIsThreadCreated(true); // Schedules the state to be updated
    console.log('setting thread created2', isThreadCreated) // Still logs the current state, update not yet applied
  };

  const newThreadFunctionCaller = () => {
    if (!showChatContainer) {
      setShowChatContainer(true)
    }
    console.log('new thread function caller has turned on showChat', showChatContainer)
  }
  
  useEffect(() => {
    console.log('After setting thread created:', isThreadCreated);
    // Any code here will execute after `isThreadCreated` has been updated.
  }, [isThreadCreated]);
    
  useEffect(() => {
    console.log('showChatContainer updated to:', showChatContainer);
  }, [showChatContainer]);
  
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

    // Timer state setup to switch to true after 10 seconds
    useEffect(() => {
      if (chat_ticker) {
        // Once chat_ticker is defined, wait for 5 seconds to update chatTickerDefined
        const timer = setTimeout(() => {
          setChatTickerDefined(true);
        }, 7000); // Wait for 5 seconds
        console.log('Chat Ticker cleared')
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timer);
      }
    }, [chat_ticker]); // Depend on chat_ticker

  return (
    <main className="flex flex-col">
      <div className="flex flex-row  mt-3 gap-x-10">
        <div className="flex flex-col w-full">
          <Assistant onFileChangeTrigger={afterAssistantCreate} triggerCreate={triggerCreate} setTriggerCreate={setTriggerCreate} />
          <FileUpload data={data} data2={data2} onFileUploadCompleted={onFileUploadCompleted} />
          <AssistantFile 
            onFileChangeTrigger={handleFileChangeTrigger} 
            tasksCompleted={tasksCompleted}
            uploadCompleteTrigger={uploadCompleteTrigger}
            onFileChangeComplete={() => setFileChangeCompleted(true)}
            fileChangeTrigger={fileChangeTrigger}   
            condition1={condition1}
            condition2={condition2}
          />
          <Thread fileChangeCompleted={fileChangeCompleted} onThreadCreated={handleThreadCreated} newThreadFunctionCaller={newThreadFunctionCaller}/>

          {
          !chatTickerDefined ?
            <ChatLoad  />  :
              <ChatContainer  onMessageSent={handleMessageSent} chatCondition={Chatcondition} chat_ticker={chat_ticker} />  
          }

          <Run messageSent={messageSent} onRunComplete={handleRunCompletion} onRunFinal={handleRunFinalization}  />
        </div>
      </div>
    </main>
  );
}
