import { messagesAtom, threadAtom } from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

function ChatContainer({ onMessageSent }) {
  // Atom State
  const [thread] = useAtom(threadAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isTyping, setIsTyping] = useState(false); // Temporarily set to true for testing



  // State
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      setFetching(true);
      if (!thread) return;
  
      try {
        const response = await fetch(`/api/AI/message/list?threadId=${thread}`);
        console.log('response status: ', response.status)
        if (!response.ok) {
          if (response.status === 404) {
            
            // Handle the case where no messages are found
            console.log('No messages found for this thread.');
            setMessages([]); // Set messages to an empty array or handle as needed
            return;
          }
          
          // throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('data', data)
        let newMessages = data.messages;

        // Sort messages in descending order by createdAt
        newMessages = newMessages.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setMessages(newMessages);
      } catch (error) {
        console.log("error", error);
      } finally {
        setFetching(false);
      }
    };
  
    fetchMessages();
  }, [thread]);
  
  const sendMessage = async () => {
    if (!thread) return;
    setSending(true);
  
    try {
      const response = await axios.post(`/api/AI/message/create?threadId=${thread}&message=${message}`, 
        { message: message, threadId: thread }
      );
  
      const newMessage = response.data.message;
      console.log("newMessage", newMessage);
      setMessages([...messages, newMessage]);
      setMessage("");
      onMessageSent(); // Invoke the callback after successful send

    } catch (error) {
      console.log("error", error);
    } finally {
      setSending(false);
    }
  };
  
return (
  
  <div className="bg-gray-100 bg-opacity-50 m-4 rounded-lg flex flex-col" style={{ height: '100vh', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
    {/* Chat Header */}
    <div className="p-3 border-b border-gray-300 text-center">
      <div className="font-bold text-lg">ChatBot</div>
      <div className="mt-1 inline-flex items-center justify-center bg-gray-200 rounded-full px-2 py-1">
        <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        <span className="text-xxs text-gray-600" style={{ fontSize: '9px' }}>Online</span>
      </div>
    </div>

 {/* Chat Content Area */}
    <div className="flex-grow flex flex-col p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
      {messages.map((message, index) => (
        <p key={index} className="text-left text-xs my-2 p-2 rounded-md" 
           style={{ backgroundColor: message.role === 'user' ? 'rgba(80, 120, 235, 0.2)' : 'rgba(200, 200, 200, 0.2)' }}>
          {message.content[0].type === "text" ? message.content[0].text.value : null}
        </p>
      ))}
          {isTyping && (
    <div className="flex space-x-1">
      <span className="typing-indicator"></span>
      <span className="typing-indicator"></span>
      <span className="typing-indicator"></span>
    </div>
  )}
    </div>
    <style>
      {`
        @keyframes blink {
          0%, 100% { opacity: .2; }
          50% { opacity: 1; }
        }
        .typing-indicator {
          display: inline-block;
          height: 8px;
          width: 8px;
          background-color: black;
          border-radius: 9999px; /* Full round */
          animation: blink 1.4s infinite;
        }
        .typing-indicator:nth-child(2) {
          animation-delay: .2s;
        }
        .typing-indicator:nth-child(3) {
          animation-delay: .4s;
        }
      `}
    </style>

 {/* Chat Input Area */}
    <div className="flex p-3 border-t border-gray-300 items-center mt-auto">
      <input 
        type="text" 
        placeholder="Type a message..." 
        className="w-full p-2 border border-black rounded-l-md bg-white"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
          }
        }}
      />
      <button 
        disabled={!thread || sending || message === ""}
        className="bg-black text-white rounded-r-md p-2 flex items-center hover:bg-white hover:text-black border border-black"
        onClick={sendMessage}
      >
        <FaPaperPlane size={24} className="text-current" />
      </button>
    </div>

    {/* Custom Scrollbar Styles */}
    <style jsx>{`
      .chat-content-area::-webkit-scrollbar {
        width: 8px;
        border-radius: 4px;
      }

      .chat-content-area::-webkit-scrollbar-thumb {
        background: lightgrey;
        border-radius: 4px;
      }
    `}</style>
  </div>
);
}

export default ChatContainer;