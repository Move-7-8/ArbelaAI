import { messagesAtom, threadAtom } from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import botImage from '../../public/assets/images/user1.png';
import Image from 'next/image';
import { MdOutlineSend } from 'react-icons/md';
import { FaChalkboardTeacher, FaCheckCircle, FaThumbsUp, FaExclamationTriangle, FaHeartbeat } from 'react-icons/fa';
import Spinner from './Spinner'; // Assume you have a Spinner component




function ChatContainer({ onMessageSent, chatCondition, chat_ticker }) {
  // Atom State
  const [thread] = useAtom(threadAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // Initial check
  const [messageFocused, setMessageFocused] = useState(false);
  const [isHoveredChalkboard, setIsHoveredChalkboard] = useState(false);
  const [isHoveredThumbsUp, setIsHoveredThumbsUp] = useState(false);
  const [isHoveredExclamation, setIsHoveredExclamation] = useState(false);
  const [isHoveredHeartbeat, setIsHoveredHeartbeat] = useState(false);
  const [isHoveredSend, setIsHoveredSend] = useState(false);

  //console.log(' chatComponent chat_ticker:', chat_ticker);
  //Chatbox scrolls down to new message

  console.log('thread', thread)
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

  useEffect(() => {
    const fetchMessages = async () => {
      setFetching(true);
      if (!thread) return;
  
      try {
        const response = await fetch(`/api/AI/message/list?threadId=${thread}`);
        // console.log('response status: ', response.status)
        if (!response.ok) {
          if (response.status === 404) {
            
            // Handle the case where no messages are found
            // console.log('No messages found for this thread.');
            setMessages([]); // Set messages to an empty array or handle as needed
            return;
          }
          
          // throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log('data', data)
        let newMessages = data.messages;

        // Sort messages in descending order by createdAt
        newMessages = newMessages.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setMessages(newMessages);
      } catch (error) {
        // console.log("error", error);
      } finally {
        setFetching(false);
      }
    };
  
    fetchMessages();
  }, [thread]);
  
  //Function to send a message in normal circumstances
  const sendMessage = async () => {
    if (!thread) return;
    setSending(true);
  
    try {
      const response = await axios.post(`/api/AI/message/create?threadId=${thread}&message=${message}`, 
        { message: message, threadId: thread }
      );
  
      const newMessage = response.data.message;
      // console.log("newMessage", newMessage);
      setMessages([...messages, newMessage]);
      setMessage("");
      onMessageSent(); // Invoke the callback after successful send

    } catch (error) {
      // console.log("error", error);
    } finally {
      setSending(false);
    }
  };

    //Function to send a message automatically when an icon is clicked 
//Function to send a message automatically when an icon is clicked
const sendMessageAutomatically = async (messageText) => {
  if (!thread) return;
  setSending(true);

  try {
    const response = await axios.post(`/api/AI/message/create?threadId=${thread}&message=${messageText}`, {
      message: messageText, threadId: thread
    });

    const newMessage = response.data.message;
    setMessages(prevMessages => [...prevMessages, newMessage]);
    // Removed setMessage(""); as it's not needed
    onMessageSent(); // Optionally, if you have actions to perform after sending
  } catch (error) {
    console.error("error", error);
  } finally {
    setSending(false);
  }
};
    

  // Generate a unique ID for the gradient to avoid conflicts
const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

///Formatting the bold and paragraphs of the message content
function formatMessage(message) {

  // First, remove annotations like &#8203;``【oaicite:1】``&#8203;and &#8203;``【oaicite:0】``&#8203;
  const messageWithoutAnnotations = message.replace(/\【\d+†source】/g, '');

  // Normalize line breaks: Replace single newlines with double newlines for spacing
  const normalizedMessage = messageWithoutAnnotations.replace(/(?<!\n)\n(?!\n)/g, '\n\n');
  
  // Further process the message for bold text, ensuring it's preceded by a newline for spacing
  const processedMessage = normalizedMessage.replace(/\*\*(.*?)\*\*/g, '<br><br><strong>$1</strong>');
  
  // Split the processed message into sections based on double newlines for paragraphs
  const sections = processedMessage.split(/\n\n+/);


  return sections.map((section, index) => {
    // Check for numbered lists
    if (/^\d+\./m.test(section) || /^\-\s/m.test(section)) {
      const listItems = section.split(/\n/).map((item, itemIndex) => {
        // Process list item content for bold text
        const listItemContent = item.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <li key={itemIndex} dangerouslySetInnerHTML={{ __html: listItemContent }}></li>;
      });
      return <ol key={index}>{listItems}</ol>;
    }
    // Check for bullet points using dash (-)
    else if (/^\-\s/m.test(section)) {
      const listItems = section.split(/\n/).map((item, itemIndex) => {
        // Process list item content for bold text
        const listItemContent = item.replace(/^\-\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <li key={itemIndex} dangerouslySetInnerHTML={{ __html: listItemContent }}></li>;
      });
      return <ul key={index}>{listItems}</ul>;
    }
    else {
      // For regular paragraphs and other text
      // Use `dangerouslySetInnerHTML` to render the HTML content
      return <div key={index} dangerouslySetInnerHTML={{ __html: section }} />;
    }
  });
}

//Function to click an icon and send a message
const handleIconClick = (messageText) => {
  // Directly send the message without updating the input field
  sendMessageAutomatically(messageText);
};

return (
  <>
    <div className={`bg-gray-100 bg-opacity-50 m-4 rounded-lg flex flex-col chat-container ${isLargeScreen ? 'fixed bottom-20 w-full top-16 lg:max-w-[calc(25%-2.3rem)]' : ''}`} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div className="relative text-center shadow-lg rounded" style={{ paddingTop: 0, marginTop: 0, backgroundColor: 'rgba(255, 102, 101,0.2)'}}>
        <div className= {isLargeScreen ? "h-[10vw] rounded max-h-[90px]" : " rounded h-[15vw]"} style={{ width: '100%', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#FF6665', stopOpacity: 0.4 }} />
                <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.5 }} />
              </linearGradient>
            </defs>
            <path d={isLargeScreen ? "M0,0 L700,0 L500 60 Q100,150 0,80 Z" : "M0,0 L500,0 L500 40 Q60,120 0,70 Z"} fill={`url(#${gradientId})`} />
          </svg>
        </div>
        <div className="absolute left-3 top-1/4 flex items-center">
          <div className="w-10 h-10 flex justify-center items-center relative">
            <Image src={botImage} alt="PNG" layout="fill" objectFit="cover" />
          </div>
          <div className="ml-3 text-white flex flex-col justify-center">
            <div className="text-sm" style={{ alignSelf: 'flex-start' }}>Analyse</div>
            <div className="text-lg" style={{ alignSelf: 'flex-start' }}>{chat_ticker}</div>
          </div>
        </div>
      </div>
      <div className="flex-grow p-3 overflow-y-auto" ref={chatContentRef} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
        {fetching ? (
            <Spinner /> // Show spinner while fetching
          ) : (
            messages.map((message, index) => (
          <div key={index} className="text-left text-sm my-2 p-2 rounded-md" 
              style={message.role === 'user' ? 
                      { background: 'linear-gradient(to right, rgba(255, 102, 101, 0.5), rgba(224, 208, 139, 0.5))', color: 'white' } : 
                      { backgroundColor: 'rgba(200, 200, 200, 0.2)' }}>
            {formatMessage(message.content[0].type === "text" ? message.content[0].text.value : '')}
          </div>
            ))
        )}
        {isTyping && (
          <div className="flex space-x-1">
            <span className="typing-indicator"></span>
            <span className="typing-indicator"></span>
            <span className="typing-indicator"></span>
          </div>
        )}
      </div>

   <div className="bg-gray-50 p-4" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '0 0 8px 8px' }}>
<div className="w-full flex">
  <input
    type="text"
    placeholder="Type a message..."
    className="message-input flex-grow p-2 bg-white focus:outline-none"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { sendMessage(); }}}
    onFocus={() => setMessageFocused(true)}
    onBlur={() => setMessageFocused(false)}
    style={{ flex: 1, minWidth: '60%', marginRight: '4px' }} // Adjusted style
  />
  <button
    disabled={!message}
    className="p-2 flex items-center justify-center"
    style={{ flexShrink: 0, minWidth: '40px', background: 'none', border: 'none' }} // Adjusted style
    onClick={sendMessage}
    onMouseEnter={() => setIsHoveredSend(true)}
    onMouseLeave={() => setIsHoveredSend(false)}
  >
    <MdOutlineSend
      size={26}
      className="send-icon"
      style={{
        color: '#3A3C3E',
        transition: 'color 0.2s ease-in-out, transform 0.2s ease-in-out', // Ensure transition is applied for both properties
          color: isHoveredSend ? '#6A849D' : '#3A3C3E',
      }}
    />


  </button>
</div>

  <div className="flex justify-between items-center mt-4"> {/* Adjusted for even spacing among icons */}
    {/* Icons for predefined messages */}
<div 
  onClick={() => handleIconClick('Simply explain what this company does and what their business model is.')}
  onMouseEnter={() => setIsHoveredChalkboard(true)}
  onMouseLeave={() => setIsHoveredChalkboard(false)}
  className="cursor-pointer relative"
>
  <FaChalkboardTeacher 
    size={24} 
    style={{ color: isHoveredChalkboard ? '#6A849D' : '#3A3C3E' }}
  />
  {isHoveredChalkboard && (
    <span className="absolute whitespace-nowrap bottom-full mb-2 px-2 py-1 border bg-white border border-3A3C3E text-black text-xs rounded-md">
      Company Overview
    </span>
  )}
</div>

<div 
  onClick={() => handleIconClick('What are the positive aspects of this company that enhance its investment appeal')}
  onMouseEnter={() => setIsHoveredThumbsUp(true)}
  onMouseLeave={() => setIsHoveredThumbsUp(false)}
  className="cursor-pointer relative"
>
  <FaCheckCircle
    size={24} 
    style={{ color: isHoveredThumbsUp ? '#6A849D' : '#3A3C3E' }} // Consider renaming this state to match the new icon
  />
  {isHoveredThumbsUp && ( // Consider renaming this state to match the new icon
    <span className="absolute whitespace-nowrap bottom-full mb-2 px-2 py-1 bg-white border border-3A3C3E text-black text-xs rounded-md">
      Positive Aspects
    </span>
  )}
</div>

<div 
  onClick={() => handleIconClick('Make an argument for the  financial risks that pertain to the operations of this company and its investment prospects')}
  onMouseEnter={() => setIsHoveredExclamation(true)}
  onMouseLeave={() => setIsHoveredExclamation(false)}
  className="cursor-pointer relative"
>
  <FaExclamationTriangle 
    size={24} 
    style={{ color: isHoveredExclamation ? '#6A849D' : '#3A3C3E' }}
  />
  {isHoveredExclamation && (
    <span className="absolute whitespace-nowrap bottom-full mb-2 px-2 py-1 bg-white border border-3A3C3E text-black text-xs rounded-md">
      Investment Risks
    </span>
  )}
</div>

<div 
  onClick={() => handleIconClick('What is the health of this company')} 
  onMouseEnter={() => setIsHoveredHeartbeat(true)}
  onMouseLeave={() => setIsHoveredHeartbeat(false)}
  className="cursor-pointer relative"
>
  <FaHeartbeat 
    size={24} 
    style={{ color: isHoveredHeartbeat ? '#6A849D' : '#3A3C3E' }}
  />
  {isHoveredHeartbeat && (
  <span className="absolute right-0 translate-x-[-2%] whitespace-nowrap bottom-full mb-2 px-2 py-1 bg-white border border-3A3C3E text-black text-xs rounded-md">
  Company Health
</span>

  )}
</div>

  </div>
</div>

    </div>

    {/* Style tags for specific styling */}
    <style jsx>{`

    .message-input {
      border: none;
      border-bottom: 2px solid #ccc; /* Default gray border */
      border-radius: 0;
    }
    .message-input:focus {
      border-bottom: 2px solid #6A849D; /* Change to desired color on focus */
    }
     
  
      .chat-container {
        height: 60vh;
      }
      @media (min-width: 1024px) {
        .chat-container {
          height: 87vh;
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