import { messagesAtom, threadAtom } from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import botImage from '../../public/assets/images/bot.png';
import Image from 'next/image';



function ChatContainer({ onMessageSent, chatCondition }) {
  // Atom State
  const [thread] = useAtom(threadAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isTyping, setIsTyping] = useState(false); // Temporarily set to true for testing
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // Initial check

  //Chatbox scrolls down to new message

  const chatContentRef = useRef(null);

    // Function to update `isLargeScreen` based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // 'lg' breakpoint for Tailwind CSS
    };

    // Set up event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]); 

  // State
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    // Logic to execute when chatCondition changes
    console.log("Chat condition changed:", chatCondition);
    // You can add any additional logic you need here
    // For example, if you need to hide typing indicators or something similar
  }, [chatCondition]);

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
  
    <div className="bg-gray-100 bg-opacity-50 m-4 rounded-lg flex flex-col chat-container" style={{  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', }}>
    {/* Chat Header */}
    {/* Chat Header with SVG */}
    <div className="relative text-center rounded-lg overflow-hidden shadow-lg" style={{ paddingTop: 0, marginTop: 0 }}>
          <div className={isLargeScreen ? "h-[10vw] max-h-[90px]" : "h-[15vw]"} style={{ width: '100%', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#5E5DF0', stopOpacity: 0.5 }} />
                        <stop offset="100%" style={{ stopColor: '#4FC6EB', stopOpacity: 0.5 }} /> 
                    </linearGradient>
                </defs>
                 <path d={isLargeScreen ? "M0,0 L700,0 L500 60 Q100,150 0,80 Z" : "M0,0 L500,0 L500 40 Q60,120 0,70 Z"} fill="url(#gradient)" />
            </svg>
        </div>
    {/* Container for image and text */}
    <div className="absolute left-3 top-1/4 mt-4 transform -translate-y-1/2 flex items-center">
        {/* Circle for PNG with image */}
        <div className="rounded-full w-12 h-12 flex justify-center items-center" style={{ backgroundColor: 'rgba(79, 198, 235, 0.3)' }}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src={botImage} alt="PNG" layout="fill" objectFit="cover" />
            </div>
        </div>

{/* Adjusted text alignment */}
        <div className="ml-3 text-white flex flex-col justify-center">
            <div className="text-sm" style={{ alignSelf: 'flex-start' }}>Chat with</div>
            <div className="text-lg" style={{ alignSelf: 'flex-start' }}>Arbela bot</div>
        </div>
    </div>
</div>


    <style>
        {`
          .chat-container {
            height: 60vh; /* Default height for small screens */
          }

          @media (min-width: 1024px) { /* Tailwind's 'lg' breakpoint */
            .chat-container {
              height: 92vh; /* Height for large screens and above */
            }
          }
        `}
  
      </style>
 {/* Chat Content Area */}
      <div className="flex-grow flex flex-col p-3 overflow-y-auto" ref={chatContentRef} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
  
      backdropFilter: 'blur(10px)', /* Blur effect */
      WebkitBackdropFilter: 'blur(10px)', /* For Safari */
     }}>
        {messages.map((message, index) => (
   <p key={index} 
     className="text-left text-sm my-2 p-2 rounded-md" 
     style={message.role === 'user' ? 
            { background: 'linear-gradient(to right, rgba(80, 120, 235, 0.5), rgba(79, 198, 235, 0.5))', color: 'white' } : 
            { backgroundColor: 'rgba(200, 200, 200, 0.2)' }}>
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

      {/* Chat Input Area */}
      <div  className="fixed bg-gray-50 bottom-0  mr-6 p-4 pr-8 border-t border-gray-300 w-full lg:max-w-[calc(25%-2.3rem)] flex items-center"
  style={{
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0 0 8px 8px',

  }}>
        <input 
          type="text" 
          placeholder="Type a message..." 
            className="chat-input flex-grow p-2 border border-black rounded-l-md bg-white"
  style={{ minWidth: '50px', maxWidth: 'calc(100% - 20px)' }} // Adjust 60px based on the button and padding
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

      <style jsx>{`
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
      `}</style>
    </div>
  );
}


export default ChatContainer;