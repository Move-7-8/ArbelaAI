import { messagesAtom, threadAtom } from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import botImage from '../../public/assets/images/user1.png';
import Image from 'next/image';



function ChatContainer({ onMessageSent, chatCondition }) {
  // Atom State
  const [thread] = useAtom(threadAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // Initial check
  const [messageFocused, setMessageFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


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
  const [isTyping, setIsTyping] = useState(false); // Temporarily set to true for testing

  useEffect(() => {
    setIsTyping(chatCondition);
  }, [chatCondition]);

  // useEffect(() => {
  //   // Logic to execute when chatCondition changes
  //   console.log("Chat condition changed:", chatCondition);
  //   // You can add any additional logic you need here
  //   // For example, if you need to hide typing indicators or something similar
  // }, [chatCondition]);

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

  // Generate a unique ID for the gradient to avoid conflicts
const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

///maintain height of chat content area to align with chat input area

  
return (
  
    
    <>
      <div className={`bg-gray-100 bg-opacity-50 m-4 rounded-lg flex flex-col chat-container ${isLargeScreen ? 'fixed bottom-20 w-full top-20 lg:max-w-[calc(25%-2.3rem)]' : ''}`} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        
        {/* Chat Header with SVG */}
       <div className="relative text-center shadow-lg rounded" style={{ paddingTop: 0, marginTop: 0, backgroundColor: 'rgba(79, 198, 235, 0.2'}}>

          <div className= {isLargeScreen ? "h-[10vw] rounded max-h-[90px]" : " rounded h-[15vw]"} style={{ width: '100%', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#5E5DF0', stopOpacity: 0.4 }} />
                  <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.5 }} />

                </linearGradient>
              </defs>
              <path d={isLargeScreen ? "M0,0 L700,0 L500 60 Q100,150 0,80 Z" : "M0,0 L500,0 L500 40 Q60,120 0,70 Z"} fill={`url(#${gradientId})`} />
            </svg>
          </div>
     <div className="absolute left-3 top-1/4 flex items-center">
      <div className="w-10 h-10 flex justify-center items-center relative"> {/* Adjusted size of the image container */}
        {/* Ensure the Image component is imported correctly for your setup */}
        <Image src={botImage} alt="PNG" layout="fill" objectFit="cover" />
      </div>

            <div className="ml-3 text-white flex flex-col justify-center">
              <div className="text-sm" style={{ alignSelf: 'flex-start' }}>Chat with</div>
              <div className="text-lg" style={{ alignSelf: 'flex-start' }}>Arbela bot</div>
            </div>
          </div>
        </div>
        
        {/* Chat Content Area */}
        <div className="flex-grow p-3 overflow-y-auto" ref={chatContentRef} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
          {messages.map((message, index) => (
            <p key={index} className="text-left text-sm my-2 p-2 rounded-md" style={message.role === 'user' ? { background: 'linear-gradient(to right, rgba(80, 120, 235, 0.5), rgba(79, 198, 235, 0.5))', color: 'white' } : { backgroundColor: 'rgba(200, 200, 200, 0.2)' }}>
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
        <div className="bg-gray-50 p-4 border-t border-gray-300 flex items-center" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '0 0 8px 8px' }}>
     <input
  type="text"
  placeholder="Type a message..."
  className="flex-grow p-2 border border-gray-300 rounded-l-md bg-white focus:outline-none focus:border-purple-500" // Adjusted for Tailwind
  style={{ borderColor: messageFocused ? '#6a0dad' : 'inherit' }} // Example using inline styles for custom focus color
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { sendMessage(); }}}
  onFocus={() => setMessageFocused(true)} // Handler to set state indicating focus
  onBlur={() => setMessageFocused(false)} // Handler to unset state indicating focus
/>

<button disabled={!message} className="icon-wrapper bg-black text-white rounded-r-md p-2 flex items-center relative" onClick={sendMessage}>
    {/* Use the FaPaperPlane icon and change its color on hover */}
    <FaPaperPlane size={26} className="icon text-white-500" />

</button>

        </div>
      </div>

      {/* Style tags inclusion for specific styling */}
      <style jsx>{`
 .icon:hover {
    transform: scale(1.1); /* Scale the icon to 110% of its original size on hover */
    transition: transform 0.2s; /* Smooth transition for the transform */
  }
    

      .icon-wrapper:hover {
        background: linear-gradient(135deg, #4FC6EB 0%, #6551BA 100%);
      }

      .icon {
        color: white; /* Initial icon color */
      }

      .icon-wrapper:hover .icon {
        color: transparent; /* Attempt to change icon color on hover - may not work as expected */
      }


      
        .chat-container {
          height: 60vh; /* Adjusted for full view height */
        }

        @media (min-width: 1024px) {
          .chat-container {
            height: 85vh; /* Ensured consistency across screen sizes */
          }
        }

        @keyframes blink {
          0%, 100% { opacity: .2; }
          50% { opacity: 1; }
        }
        .typing-indicator {
          display: inline-block;
          height: 8px;
          width: 8px;
          background-color: black;
          border-radius: 9999px;
          animation: blink 1.4s infinite ease-in-out;
        }
        .typing-indicator:nth-child(2) {
          animation-delay: .2s;
        }
        .typing-indicator:nth-child(3) {
          animation-delay: .4s;
        }
      `}</style>
    </>
  );
};


export default ChatContainer;