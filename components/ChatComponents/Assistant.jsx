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
      try {
        const response = await fetch("/api/AI/assistant/create", { method: 'POST' });
        const data = await response.json();

          const newAssistant = data.assistant;
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

    const handleList = async () => {
        setListing(true);
        try {
          const response = await fetch(`/api/AI/assistant/list`);
          const data = await response.json();
    
          const assistants = data.assistants;
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
}

export default Assistant;
