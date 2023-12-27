"use client";

import LinkBar from '@components/AssistantComponents/LinkBar';
import MessageList from '@components/AssistantComponents/MessageList';
import WelcomeForm from '@components/AssistantComponents/WelcomeForm';
import InputForm from '@components/AssistantComponents/InputForm';
import { useSession } from "next-auth/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState, useEffect } from "react";
import { useChat } from "ai/react";

import { VercelIcon, GithubIcon, LoadingCircle, SendIcon } from "@public/assets/icons/assistant/assistant";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";



// Chat component that manages the chat interface and interactions
export default function ThreadAssistant({ companyName, selectedDocuments, threadnumber }) {
    // Refs for form and input elements
  const formRef = useRef(null);
  const inputRef = useRef(null);

  // Custom hook to manage chat state and interactions
  const { messages, input, setInput, handleSubmit, isLoading} = useChat({
    // Error handling callback
    onError: (error) => {
      va.track("Chat errored", {
        input,
        error: error.message,
      });
    },
  });


  // Determine if the chat interface should be disabled
  const disabled = isLoading || input.length === 0;

  // State variables for managing various aspects of the chat assistant
  const [assistantName, setAssistantName] = useState('');
  const [assistantModel, setAssistantModel] = useState('gpt-3.5-turbo-1106');
  const [assistantDescription, setAssistantDescription] = useState('');
  const [inputmessage, setInputmessage] = useState('Introduce yourself');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [files, setFiles] = useState([]);
  const [assistantId, setAssistantId] = useState(null);
//   const [threadId, setThreadId] = useState(null);
  const [isStartLoading, setStartLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { data: session, status } = useSession();

  const threadId= threadnumber
  console.log('Thread Assistant threadID',threadId )
  // Handler for file input changes
  const handleFileChange = (selectedFiles) => {
    console.log('Handle File Change Triggered');
    setFiles([...files, ...selectedFiles]);
};

  // Handler for form submissions
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Handling form submission.');
    
    setIsSending(true);
    // Update chat messages with user input
    setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: input }]);
    setInput('');
    console.log('User message added to chat.');

    // Preparing data for API calls
    let formData = new FormData();
    if (threadId) {
      formData.append('threadId', threadId);
    }
    formData.append('input', input);

    // Call the addMessage API route
    console.log('Sending message to addMessage API endpoint.');
    const addMessageResponse = await fetch('/api/Assistant/addMessage', {
      method: 'POST',
      body: formData
    });
    const addMessageData = await addMessageResponse.json();
    console.log('Message sent to addMessage API endpoint.');

    // Call the runAssistant API route
    console.log('Invoking runAssistant API endpoint.');
    let formData_run = new FormData();
    if (assistantId) {
      formData_run.append('assistantId', assistantId);
    }
    // ... The rest of your code goes here
    if (threadId) {
    formData_run.append('threadId', threadId);
    }
    const runAssistantResponse = await fetch('/api/Assistant/runAssistant', {
    method: 'POST',
    body: formData_run
    });
    const runAssistantData = await runAssistantResponse.json();
    console.log('Received response from runAssistant API endpoint.');

    // Checking the status of the assistant's response
    let status = runAssistantData.status;
    let formData_checkStatus = new FormData();
    if (threadId) {
    formData_checkStatus.append('threadId', threadId);
    }
    if (runAssistantData.runId) {
    formData_checkStatus.append('runId', runAssistantData.runId);
    }

    while (status !== 'completed') {
    const statusResponse = await fetch('/api/Assistant/checkRunStatus', {
        method: 'POST',
        body: formData_checkStatus
    });
    const statusData = await statusResponse.json();
    status = statusData.status;

    console.log('Checking assistant response status:', status);
    await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('Assistant response processing completed.');

    // Retrieve messages from the assistant
    console.log('Fetching messages from listMessages API endpoint.');
    let formData_listMessage = new FormData();
    if (threadId) {
    formData_listMessage.append('threadId', threadId);
    }

    const listMessagesResponse = await fetch('/api/Assistant/listMessages', {
    method: 'POST',
    body: formData_listMessage
    });
    const listMessagesData = await listMessagesResponse.json();
    console.log('Messages retrieved from listMessages API endpoint.');
    setIsSending(false);

    // Add the assistant's response to the chat
    if (listMessagesResponse.ok) {
    if (listMessagesData.messages) {
        console.log('Adding assistant\'s message to the chat.');
        setChatMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: listMessagesData.messages }
        ]);
    } else {
        console.error('No messages received from the assistant.');
    }
    } else {
    console.error('Error retrieving messages:', listMessagesData.error);
    }
    }

    async function startAssistant() {
    console.log('startAssistant function called');
    console.log(`Assistant Name: ${assistantName} Assistant Model:${assistantModel} Assistant Description:${assistantDescription} Input Message:${inputmessage}`)
    if (!assistantName || !assistantModel || !assistantDescription || !inputmessage) {
        console.error('All fields must be filled');
        return;
    }
        console.log('Initializing chat assistant.');
        setStartLoading(true);
        setIsButtonDisabled(true);

    // Preparing file data for upload
    // Preparing file data for upload
    let fileIds = [];
    if (files.length > 0) {
        console.log('Uploading files:', files.map(f => f.name).join(', '));
        const fileData = new FormData();
        files.forEach(file => fileData.append('file', file));

        // Upload files in a single request
        const uploadResponse = await fetch('/api/Assistant/upload', {
            method: 'POST',
            body: fileData,
        });
        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
            console.error('File upload failed:', uploadData.message);
            return;
        }

        // Collect file IDs from the response
        fileIds = uploadData.fileIds;
        console.log(`Uploaded File IDs:`, fileIds);
    }

    // Create assistant
    console.log('Creating assistant.');
    console.log(`TWO: File IDs before creating assistant:`, fileIds);

    const assistantData = new FormData();
    assistantData.set('assistantName', assistantName);
    assistantData.set('assistantModel', assistantModel);
    assistantData.set('assistantDescription', assistantDescription);
    
    // Appending each file ID to the FormData
    for (let fileId of fileIds) {
        // formData_run.append('fileIds[]', fileId);
        assistantData.append('fileIds[]', fileId); // Append each fileId
    }
    
    const createAssistantResponse = await fetch('/api/Assistant/createAssistant', {
        method: 'POST',
        body: assistantData,
    });
    const createAssistantData = await createAssistantResponse.json();
    console.log(`#################################################################`)
    console.log(`THREE: Create Assistant Response:`, createAssistantData);
    console.log(`#################################################################`)

    if (!createAssistantResponse.ok) {
        console.error('Error creating assistant:', createAssistantData.error);
        return;
    }
    const assistantId = createAssistantData.assistantId;
    
    // Create thread
    // Pass Company, URL, Message
    // const userId = session.user.id
    // const currentPageUrl = window.location.href;
    // // console.log(`Assistant User ID${userId}`)
    // console.log(`Assistant Page URL${currentPageUrl}`)

    // console.log('Creating thread.');
    // const threadData = new FormData();
    // threadData.set('inputmessage', inputmessage);
    // threadData.set('userId', userId); // Add the user ID to the FormData
    // threadData.set('companyName', companyName); // Add the user ID to the FormData
    // threadData.set('currentPageUrl', currentPageUrl); // Add the current page URL to the FormData

    // companyName
    // const createThreadResponse = await fetch('/api/Assistant/createThread', {
    //     method: 'POST',
    //     body: threadData,
    // });
    // const createThreadData = await createThreadResponse.json();
    
    // if (!createThreadResponse.ok) {
    //     console.error('Error creating thread:', createThreadData.error);
    //     return;
    // }
    const threadId = threadnumber;
    
    // Run assistant
    console.log('Running assistant.');
    const runAssistantData = new FormData();
    runAssistantData.set('assistantId', assistantId);
    runAssistantData.set('threadId', threadId);
    
    const runAssistantResponse = await fetch('/api/Assistant/runAssistant', {
        method: 'POST',
        body: runAssistantData,
    });
    const runAssistantDataResponse = await runAssistantResponse.json();
    
    if (!runAssistantResponse.ok) {
        console.error('Error running assistant:', runAssistantDataResponse.error);
        return;
    }
    
    // Check run status
    let formData_checkRunStatus = new FormData();
    formData_checkRunStatus.append('threadId', threadId);
    formData_checkRunStatus.append('runId', runAssistantDataResponse.runId);
            
    // ... [previous code, possibly including the startAssistant function]

    // Code to check run status and fetch messages
    let checkRunStatusData;
    do {
    const checkRunStatusResponse = await fetch('/api/Assistant/checkRunStatus', {
        method: 'POST',
        body: formData_checkRunStatus,
    });
    checkRunStatusData = await checkRunStatusResponse.json();

    console.log('Run status:', checkRunStatusData.status);

    if (["cancelled", "cancelling", "failed", "expired"].includes(checkRunStatusData.status)) {
        console.error(`Run stopped due to status: ${checkRunStatusData.status}`);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    } while (checkRunStatusData.status !== 'completed');

    // Code after run completion
    console.log('Get Messages from listMessages.');
    const listMessagesResponse = await fetch('/api/Assistant/listMessages', {
    method: 'POST',
    body: formData_checkRunStatus,
    });
    const listMessagesData = await listMessagesResponse.json();
    ('**************************************************.');
    console.log('Messages retrieved from listMessages API endpoint.');
    console.log(listMessagesData);
    console.log('**************************************************.');

    if (listMessagesResponse.ok) {
    console.log('Message content:', listMessagesData.messages);
    setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: listMessagesData.messages }]);
    setIsButtonDisabled(false);
    } else {
    console.error('Error fetching messages');
    }

    setAssistantId(assistantId);
    // setThreadId(threadId);
    setChatStarted(true);
    // setIsButtonDisabled(false);
    console.log('Chat with assistant started successfully.');
    }
    // React component return statement
    return (
        <main className="h-full flex flex-col bg-space-grey-light  ">
        {chatMessages.length > 0 ? (
            <>
                <MessageList chatMessages={chatMessages} />
                <InputForm
                    input={input}
                    setInput={setInput}
                    handleFormSubmit={handleFormSubmit}
                    inputRef={inputRef}
                    formRef={formRef}
                    disabled={disabled}
                    chatStarted={chatStarted}
                    isSending={isSending}
                />
            </>
        ) : (
            <WelcomeForm
                assistantName={companyName}
                setAssistantName={setAssistantName}
                assistantDescription={assistantDescription}
                setAssistantDescription={setAssistantDescription}
                assistantModel={assistantModel}
                setAssistantModel={setAssistantModel}
                files={files}
                handleFileChange={handleFileChange}
                startAssistant={startAssistant}
                isButtonDisabled={isButtonDisabled}
                isStartLoading={isStartLoading}
                setFiles={setFiles}
            />
        )}
    </main>
);
}
