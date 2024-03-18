import React, { useEffect, useState } from "react";
import {
  assistantAtom,
  messagesAtom,
  runAtom,
  runStateAtom,
  threadAtom,
} from "@/atom";
import { useAtom } from "jotai";

function Run({ messageSent, onRunComplete, onRunFinal }) {

  // Atom State
  const [thread] = useAtom(threadAtom);
  const [run, setRun] = useAtom(runAtom);
  const [, setMessages] = useAtom(messagesAtom);
  const [assistant] = useAtom(assistantAtom);
  const [runState, setRunState] = useAtom(runStateAtom);

  // State
  const [creating, setCreating] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [pollingIntervalId, setPollingIntervalId] = useState(null);
  const [message, setMessage] = useState('');


  
  //Listen for when the send function in ChatComponent.jsx is complete
  useEffect(() => {
    if (messageSent) {
      handleCreate(); 
    }
  }, [messageSent]);

  useEffect(() => {
    // Clean up polling on unmount
    return () => {
      if (pollingIntervalId) clearInterval(pollingIntervalId);
    };
  }, [pollingIntervalId]);

  const startPolling = (runId) => {
    if (!thread) return;
    const intervalId = setInterval(async () => {
        try {
            const url = `/api/AI/run/retrieve?threadId=${thread}&runId=${runId}`;
            const response = await fetch(url, {
              cache: 'no-store',
            });
          
            if (!response.ok) {
              throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }
          
            const data = await response.json();
            const updatedRun = data.run;
          
        setRun(updatedRun);
        setRunState(updatedRun.status);

        // Check if run status is 'in_progress' and call the callback
        if (updatedRun.status === 'in_progress') {
          onRunComplete(); // Call the callback function
        }
        
        // console.log('/////////////////////////////')
        // console.log('RUN STATUS',updatedRun.status )
        // console.log('/////////////////////////////')
      

        if (["cancelled", "failed", "completed", "expired"].includes(updatedRun.status)) {
          clearInterval(intervalId);
          setPollingIntervalId(null);
          fetchMessages();
          // onRunFinal();
        // Check if run status is 'in_progress' and call the callback

          if (updatedRun.status === 'completed') {
            onRunFinal(); // Call the callback for run finalization
        }

        }

      } catch (error) {
        console.error("Error polling run status:", error);
        clearInterval(intervalId);
        setPollingIntervalId(null);
      }
    }, 500);

    setPollingIntervalId(intervalId);
  };

  const handleCreate = async () => {
    if (!assistant || !thread) return;

    setCreating(true);
    try {
        const response = await fetch(`/api/AI/run/create?threadId=${thread}&assistantId=${assistant.id}`, {
          cache: 'no-store',

        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const newRun = data.run;
              setRunState(newRun.status);
      setRun(newRun);
      setMessage("Successfully created run");
      localStorage.setItem("run", JSON.stringify(newRun));

      // Start polling after creation
      startPolling(newRun.id);
    } catch (error) {
      setMessage("Error creating run");
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = async () => {
    if (!run || !thread) return;

    setCanceling(true);
    try {
      const response = await axios.get(`/api/AI/run/cancel?runId=${run.id}&threadId=${thread}`);

      const newRun = response.data.run;
      setRunState(newRun.status);
      setRun(newRun);
      setMessage("Canceled run");

      localStorage.setItem("run", JSON.stringify(newRun));
    } catch (error) {
      setMessage("Error cancelling run");
      console.error(error);
    } finally {
      setCanceling(false);
    }
  };

  const fetchMessages = async () => {
    if (!thread) return;

    try {
        fetch(`/api/AI/message/list?threadId=${thread}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
      .then((response) => {
        // console.log('RUN response', response.messages)
        let newMessages = response.messages;

        // Sort messages in descending order by createdAt
        newMessages = newMessages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        setMessages(newMessages);
      });
    } catch (error) {
      // console.log("error", error);
      setMessage("Error fetching messages");
    }
  };

  return null
  // return (
  //   <div className="flex flex-col mb-8">
  //     <h1 className="text-4xl font-semibold mb-4">Run</h1>
  //     <div className="flex flex-row gap-x-4 w-full">
  //       <button
  //         onClick={handleCreate}
  //         disabled={creating || !assistant || !thread}
  //         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
  //       >
  //         {creating ? "Creating..." : "Create"}
  //       </button>
  //       <button
  //         onClick={handleCancel}
  //         disabled={["N/A"].includes(runState) || !run}
  //         className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
  //       >
  //         {canceling ? "Canceling..." : "Cancel"}
  //       </button>
  //     </div>
  //     {message && <div className="mt-4 text-center text-lg">{message}</div>}
  //     <p className="font-semibold mb-4">Run: {run?.id}</p>
  //     <p className="font-semibold mb-4">RunState: {runState}</p>
  //   </div>
  // );
}

export default Run;
