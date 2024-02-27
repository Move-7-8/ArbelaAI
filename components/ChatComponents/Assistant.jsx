import { useState, useEffect } from 'react';
import { assistantAtom, fileAtom, messagesAtom } from "@/atom";
import { useAtom } from "jotai";

const Assistant = ({ onFileChangeTrigger, triggerCreate, setTriggerCreate }) => {
    const [assistant, setAssistant] = useAtom(assistantAtom);
    const [, setMessages] = useAtom(messagesAtom);
    const [file] = useAtom(fileAtom);

    const [creating, setCreating] = useState(false);
    const [modifying, setModifying] = useState(false);
    const [listing, setListing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState(''); // Declare message state


    useEffect(() => {
      if (triggerCreate) {
        handleCreate();
        setTriggerCreate(false); // Reset the trigger
      }
    }, [triggerCreate, setTriggerCreate]);
  
    const handleCreate = async () => {
        setCreating(true);
        try {
          const response = await fetch("/api/AI/assistant/create");
          const data = await response.json();

          const newAssistant = data.assistant;
          // console.log("newAssistant", newAssistant);
          setAssistant(newAssistant);
          localStorage.setItem("assistant", JSON.stringify(newAssistant));
          setMessage("Successfully created assistant");
          onFileChangeTrigger();

        } catch (error) {
          // console.log("error", error);
          setMessage("Error creating assistant");
        } finally {
          setCreating(false);
        }
    };

    // const handleModify = async () => {
    //     setModifying(true);
    //     try {
    //       const response = await fetch(`/api/AI/assistant/modify?assistantId=${assistant?.id}&fileId=${file}`);
    //       const data = await response.json();

    //       const newAssistant = data.assistant;
    //       setAssistant(newAssistant);
    //       localStorage.setItem("assistant", JSON.stringify(newAssistant));
    //       setMessage("Successfully modified assistant");
    //     } catch (error) {
    //       console.log("error", error);
    //       setMessage("Error modifying assistant");
    //     } finally {
    //       setModifying(false);
    //     }
    // };

    const handleList = async () => {
        setListing(true);
        try {
          const response = await fetch(`/api/AI/assistant/list`);
          const data = await response.json();
    
          const assistants = data.assistants;
          // console.log("assistants", assistants);
    
          // Join the assistant names with a comma and a space
          const assistantIds = assistants.map(a => a.id).join(', ');

        //   const assistantNames = assistants.map(a => a.name).join(', ');
          setMessage(`Assistants: ${assistantIds}`);
        } catch (error) {
          console.log("error", error);
          setMessage("Error listing assistants");
        } finally {
          setListing(false);
        }
    };
    
    const handleDelete = async () => {
        setDeleting(true);
        try {
            // Extract assistant IDs from the message
            const assistantIds = message.replace('Assistants: ', '').split(', ');
    
            const response = await fetch(`/api/AI/assistant/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ assistantIds })
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
    // return (
    //   <div className="flex flex-col mb-8">

    //       <div className="flex flex-row gap-x-4 w-full">
    //           <button
    //           onClick={handleCreate}
    //           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    //           >
    //           {creating ? "Creating..." : "Create"}
    //           </button>
    //           {/* <button
    //           onClick={handleModify}
    //           disabled={!assistant || !file}
    //           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    //           >
    //           {modifying ? "Modifying..." : "Modify"}
    //           </button> */}
    //           {/* <button
    //           onClick={handleList}
    //           className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
    //           >
    //           {listing ? "Listing..." : "List"}
    //           </button> */}
    //           {/* <button
    //           onClick={handleDelete}
    //           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    //           >
    //           {deleting ? "Deleting..." : "Delete"}
    //           </button> */}
    //       </div>
    //       {/* {message && <div className="mt-4 text-center text-lg">{message}</div>}
    //       <p className="font-semibold mb-4">Assistant ID: {assistant?.id}</p> */}

    //   </div>
    // );
}

export default Assistant;
