import { useState } from 'react';

const AssistantTest = () => {
    const [assistant, setAssistant] = useState(null);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const [creating, setCreating] = useState(false);
    const [modifying, setModifying] = useState(false);
    const [listing, setListing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleCreate = async () => {
        setCreating(true);
        try {
          const response = await fetch("/api/AI/assistant/create");
          const data = await response.json();

          const newAssistant = data.assistant;
          console.log("newAssistant", newAssistant);
          setAssistant(newAssistant);
          localStorage.setItem("assistant", JSON.stringify(newAssistant));
          setMessage("Successfully created assistant");
        } catch (error) {
          console.log("error", error);
          setMessage("Error creating assistant");
        } finally {
          setCreating(false);
        }
    };

    const handleModify = async () => {
        setModifying(true);
        try {
          const response = await fetch(`/api/assistant/modify?assistantId=${assistant?.id}&fileId=${file}`);
          const data = await response.json();

          const newAssistant = data.assistant;
          setAssistant(newAssistant);
          localStorage.setItem("assistant", JSON.stringify(newAssistant));
          setMessage("Successfully modified assistant");
        } catch (error) {
          console.log("error", error);
          setMessage("Error modifying assistant");
        } finally {
          setModifying(false);
        }
    };

    const handleList = async () => {
        setListing(true);
        try {
          const response = await fetch(`/api/assistant/list`);
          const data = await response.json();

          const assistants = data.assistants;
          console.log("assistants", assistants);
          setMessage(`Assistants:\n${assistants.map(a => `${a.name}\n`).join('')}`);
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
          await fetch(`/api/assistant/delete?assistantId=${assistant?.id}`);

          setAssistant(null);
          localStorage.removeItem("assistant");
          setMessage("Successfully deleted assistant");
          // setMessages([]); // Uncomment if setMessages is defined
        } catch (error) {
          console.log("error", error);
          setMessage("Error deleting assistant");
        } finally {
          setDeleting(false);
        }
    };

    return (
      <div className="flex flex-col mb-8">
          <h1 className="text-4xl font-semibold mb-4">Assistant</h1>
          <div className="flex flex-row gap-x-4 w-full">
              <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
              {creating ? "Creating..." : "Create"}
              </button>
              <button
              onClick={handleModify}
              disabled={!assistant || !file}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
              {modifying ? "Modifying..." : "Modify"}
              </button>
              <button
              onClick={handleList}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
              {listing ? "Listing..." : "List"}
              </button>
              <button
              onClick={handleDelete}
              disabled={!assistant}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
              {deleting ? "Deleting..." : "Delete"}
              </button>
          </div>
          {message && <div className="mt-4 text-center text-lg">{message}</div>}
      </div>
    );
}

export default AssistantTest;
