import { messagesAtom, threadAtom } from "@/atom";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import botImage from '../../public/assets/images/user1.png';
import Image from 'next/image';
import { MdOutlineSend } from 'react-icons/md';
import { FaChalkboardTeacher, FaUsers, FaChartLine, FaLeaf, FaUserFriends , FaCheckCircle, FaThumbsUp, FaExclamationTriangle, FaHeartbeat, FaPaperPlane, FaAngleDoubleUp, FaAngleDoubleDown, FaAngleDoubleLeft, FaGripLinesVertical, FaUser } from 'react-icons/fa';
import Spinner from './Spinner'; // Assume you have a Spinner component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// Utility function to convert rem to pixels, moved outside to prevent re-definitions
function convertRemToPixels(rem) {    
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// Similarly, these calculations can be moved outside if they don't depend on props
// But if they do, consider using useEffect or useCallback hooks inside the component
const calculateMinWidth = () => {
  const viewportWidth = window.innerWidth;
  const minWidth = viewportWidth * 0.25 - convertRemToPixels(2); // Example adjustment
  return minWidth;
};

const calculateMaxWidth = () => {
  return calculateMinWidth() * 1.15;
};


function ChatContainer({ onMessageSent, chatCondition, chat_ticker, onWidthChange }) {

  // Atom State
  const [thread] = useAtom(threadAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // Initial check
  const [messageFocused, setMessageFocused] = useState(false);
  const [isHoveredChalkboard, setIsHoveredChalkboard] = useState(false);
  const [isHoveredThumbsUp, setIsHoveredThumbsUp] = useState(false);
  const [isHoveredExclamation, setIsHoveredExclamation] = useState(false);
  const [isHoveredHeartbeat, setIsHoveredHeartbeat] = useState(false);
  const [isHoveredTeam, setIsHoveredTeam] = useState(false);
  const [isHoveredAnalyst, setIsHoveredAnalyst] = useState(false);
  const [isHoveredCompetitor, setIsHoveredCompetitor] = useState(false);
  const [isHoveredESG, setIsHoveredESG] = useState(false);
  const [isHoveredPortfolio, setIsHoveredPortfolio] = useState(false);
  const [isHoveredRating, setIsHoveredRating] = useState(false);
  const [isHoveredSend, setIsHoveredSend] = useState(false);
  const [showExtraIcons, setShowExtraIcons] = useState(false);
  const [widthDiff, setWidthDiff] = useState(0);

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

  useEffect(() => {
    // Reset messages when the chat_ticker changes, indicating a change in company page
    setMessages([]);
  }, [chat_ticker]); // Dependency array includes chat_ticker to trigger effect on change
  

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
        const response = await fetch(`/api/AI/message/list?threadId=${thread}`, {
          cache: 'no-store',
        });
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


const containerRef = useRef(null);

// Adjust the calculateMinWidth function to not enforce the 300px minimum on small screens
const calculateMinWidth = () => {
  // You can adjust this logic based on your specific needs
  if (window.innerWidth >= 1024) {
    return Math.max(window.innerWidth * 0.25 - convertRemToPixels(2.3), 250);
  } else {
    // For smaller screens, consider a lower min width or allow it to be more flexible
    return window.innerWidth * 0.4; // Example adjustment, adapt as needed
  }
};

  const calculateMaxWidth = () => {
    return calculateMinWidth() * 2.0;
  };

  // Responsive width state
  const [width, setWidth] = useState(calculateMinWidth());

  useEffect(() => {
    // Function to adjust chat container width responsively
    const handleResize = () => {
      // Update width only if the window is larger than 'lg' breakpoint to prevent override by fixed width on smaller screens
      if (window.innerWidth >= 1024) {
        setWidth(calculateMinWidth());
      } else {
        // Allow full width on smaller screens
        setWidth('60%');
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent default action
    const startX = e.clientX;
    const startWidth = width !== '100%' ? width : containerRef.current.offsetWidth;

  const handleMouseMove = (e) => {
    if (window.innerWidth >= 1024) {
      const deltaX = startX - e.clientX;
      let newWidth = startWidth + deltaX;

      newWidth = Math.max(calculateMinWidth(), Math.min(newWidth, calculateMaxWidth()));
      setWidth(newWidth);
        const minWidth = calculateMinWidth();
        const additionalWidth = newWidth - minWidth;
            // Now use `onWidthChange` directly since it's destructured from props
        onWidthChange(additionalWidth);

     

      // Log the width difference to the console
      console.log(`Width Difference: ${additionalWidth}px`);
    }
  };


    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

return (
  <>
    <div 
      ref={containerRef} 
      className={`bg-gray-100 bg-opacity-50 m-4 rounded-lg flex flex-col gradient1 chat-container ${isLargeScreen ? 'fixed bottom-20 top-16 right-0' : ''}`} 
      style={{ 
        width: `${width}px`, 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'fixed', // Keep it fixed to the viewport
      }}
    > 
    <div  
      className="absolute left-0 top-0 bottom-0 cursor-ew-resize z-10" 
      onMouseDown={handleMouseDown} 
      style={{ width: '20px', left: '-20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Adjust as necessary
    >
    <FaGripLinesVertical size={85} style={{ color: 'lightgrey' }} />
    </div>
    <div className="relative text-center shadow-lg rounded" style={{ paddingTop: 0, marginTop: 0, backgroundColor: 'rgba(255, 102, 101, 0.2)'}}>
      <div className= {isLargeScreen ? "h-[10vw] rounded max-h-[88px]" : " rounded h-[15vw]"} style={{ width: '100%', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'rgba(255, 102, 101, 0.9)' }} />
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
    <div className="flex-grow p-3 overflow-y-auto" ref={chatContentRef} style={{  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
      {fetching ? (
        <Spinner /> // Show spinner while fetching
      ) : (
        messages.map((message, index) => (
        <div key={index} className="text-left text-sm my-2 p-2 rounded-md" 
          style={message.role === 'user' ? 
            { background: 'linear-gradient(to right, rgba(255, 102, 101, 0.6), rgba(255, 102, 101, 0.6))', color: 'white' } : 
            { backgroundColor: 'rgba(255, 255, 255)', color: 'black' }}
          >
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
      <div className="p-2">
        <div className={`flex items-center rounded-full bg-white p-1 overflow-hidden ${messageFocused ? 'ring-2 ring-[#E0D08B]' : ''}`}>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow p-2 bg-white focus:outline-none rounded-l-full flex-1 min-w-0"
            style={{ fontSize: '14px' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { sendMessage(); }}}
            onFocus={() => setMessageFocused(true)}
            onBlur={() => setMessageFocused(false)}
          />
          <button
            disabled={!message}
            className="absolute right-4 flex items-center justify-center bg-white border-none rounded-full"
            onClick={sendMessage}
            onMouseEnter={() => setIsHoveredSend(true)}
            onMouseLeave={() => setIsHoveredSend(false)}
          >
            <span className="transition-transform duration-200 ease-in-out hover:scale-110 mr-4">
              <FaPaperPlane size={20} className="send-icon text-gray-800" />
            </span>
          </button>
        </div>
        {/* Adjusted "See More" Toggle Button for closer proximity */}
        <div className="flex justify-center mt-2"> {/* Ensure there's no margin-top */}
          <button
            className="px-1 py-0 focus:outline-none transition duration-150 ease-in-out" /* Minimized padding */
            onClick={() => setShowExtraIcons(!showExtraIcons)}
          >
            {showExtraIcons ? (
              <FaAngleDoubleDown className="text-[#3A3C3E] text-xl" />
            ) : (
              <FaAngleDoubleUp className="text-[#3A3C3E] text-xl" />
            )}
          </button>
      </div>
      {/* Conditionally render extra icons */}
      {showExtraIcons && (
      <>
        {/* Section Container with Flex */}
        <div className="flex mb-4 mt-4">
          {/* Portfolio Integration Button */}
          <div className="w-1/2 flex justify-center items-center pr-2">
            <button
              // onClick={() => handleIconClick('Portfolio Integration')}
              className="w-full py-2 px-4 rounded-lg shadow hover:shadow-xl transition-transform duration-300 hover:scale-105 text-xs"
              style={{ height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
            >
              Portfolio Integration
            </button>
            {isHoveredPortfolio && (
              <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
                Coming Soon
              </span>
            )}
          </div>
          {/* Rating Section with Button and Slider */}
          <div className="w-1/2 pl-2 flex justify-center items-center">
            <div className="w-full h-full flex flex-col justify-between py-2 px-4 border rounded-lg shadow hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}>
              <button
                onClick={() => handleIconClick('Rating')}
                className="mb-2 text-xs"
              >
                User Rating
              </button>
              {isHoveredRating && (
                  <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
                    Coming Soon
                  </span>
              )}
              <input type="range" className="w-full slider-thumb" min="0" max="5" step="1"
                style={{
                  accentColor: '#6A849D'
                }}
              />
              {/* Number Display Underneath Slider */}
              <div className="w-full flex justify-between text-xxs text-gray-500 mt-1">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center transition-opacity duration-300 opacity-100 mb-4">
          <div 
            // onClick={() => handleIconClick('What are the positive aspects of this company that enhance its investment appeal')}
            onMouseEnter={() => setIsHoveredCompetitor(true)}
            onMouseLeave={() => setIsHoveredCompetitor(false)}
            className="flex flex-col items-center cursor-pointer relative py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
            disabled={true} 
            style={{ width: '4.5rem', height: '3.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
          >
            <FaUsers
              size={17} 
              className="text-[#3A3C3E]  mb-2" // Adjusted to use className for consistency
            />
            <span className="text-xs text-center truncate w-full ">Competing</span>
            {isHoveredCompetitor && (
              <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
                Coming Soon
              </span>
            )}
          </div>
          <div 
            // onClick={() => handleIconClick('What are the positive aspects of this company that enhance its investment appeal')}
            onMouseEnter={() => setIsHoveredAnalyst(true)}
            onMouseLeave={() => setIsHoveredAnalyst(false)}
            className="flex flex-col items-center cursor-pointer relative py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
            style={{ width: '4.5rem', height: '3.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
            disabled={true} 
          >
            <FaChartLine
              size={17} 
              className="text-[#3A3C3E]   mb-2" // Adjusted to use className for consistency
            />
            <span className="text-xs">Analyst</span>
            {isHoveredAnalyst && (
              <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
                Coming Soon
              </span>
            )}
          </div>
          <div 
            // onClick={() => handleIconClick('What are the positive aspects of this company that enhance its investment appeal')}
            onMouseEnter={() => setIsHoveredTeam(true)}
            onMouseLeave={() => setIsHoveredTeam(false)}
            className="flex flex-col items-center cursor-pointer relative py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
            style={{ width: '4.5rem', height: '3.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
            disabled={true} 
          >
            <FaUserFriends
              size={17} 
              className="text-[#3A3C3E]   mb-2" // Adjusted to use className for consistency
            />
            <span className="text-xs">Team</span>
            {isHoveredTeam && (
              <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
                Coming Soon
              </span>
            )}
          </div>
          <div 
            // onClick={() => handleIconClick('What are the positive aspects of this company that enhance its investment appeal')}
            onMouseEnter={() => setIsHoveredESG(true)}
            onMouseLeave={() => setIsHoveredESG(false)}
            className="flex flex-col items-center cursor-pointer relative py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
            style={{ width: '4.5rem', height: '3.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
            disabled={true} 
         >
            <FaLeaf
              size={17} 
              className="text-[#3A3C3E]   mb-2" // Adjusted to use className for consistency
            />
            <span className="text-xs">ESG</span>
            {isHoveredESG && (
              <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </>
    )}
      <div className="flex justify-between items-center mt-2"> {/* Adjusted for even spacing among icons */}
        {/* Icons for predefined messages */}
      <div 
    onClick={() => handleIconClick('Simply explain what this company does and what their business model is.')}
    onMouseEnter={() => setIsHoveredChalkboard(true)}
    onMouseLeave={() => setIsHoveredChalkboard(false)}
    className="flex flex-col items-center cursor-pointer relative py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
    style={{ width: '4.5rem', height: '3.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
  >
    <FaChalkboardTeacher size={17} className="text-[#3A3C3E] mb-2 " />
    <span className="text-xs">Overview</span>
    {isHoveredChalkboard && (
      <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 border bg-white border-3A3C3E text-black text-xs rounded-md">
        Company Overview
      </span>
    )}
  </div>

<div 
  onClick={() => handleIconClick('What are the positive aspects of this company that enhance its investment appeal')}
  onMouseEnter={() => setIsHoveredThumbsUp(true)}
  onMouseLeave={() => setIsHoveredThumbsUp(false)}
  className="flex flex-col items-center cursor-pointer relative py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
  style={{ width: '4.5rem', height: '3.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
>
  <FaCheckCircle
    size={17} 
    className="text-[#3A3C3E] mb-2 " // Adjusted to use className for consistency
  />
  <span className="text-xs">Positive</span>
  {isHoveredThumbsUp && (
    <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
      Positive Aspects
    </span>
  )}
</div>

<div 
  onClick={() => handleIconClick('Make an argument for the financial risks that pertain to the operations of this company and its investment prospects')}
  onMouseEnter={() => setIsHoveredExclamation(true)}
  onMouseLeave={() => setIsHoveredExclamation(false)}
  className="flex flex-col items-center cursor-pointer relative py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
  style={{ width: '4.5rem', height: '3.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
>
  <FaExclamationTriangle
    size={17}
    className="text-[#3A3C3E] mb-2"
  />
  <span className="text-xs">Risks</span>
  {isHoveredExclamation && (
    <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
      Investment Risks
    </span>
  )}
</div>

<div 
  onClick={() => handleIconClick('What is the health of this company')} 
  onMouseEnter={() => setIsHoveredHeartbeat(true)}
  onMouseLeave={() => setIsHoveredHeartbeat(false)}
  className="flex flex-col items-center cursor-pointer relative py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
  style={{ width: '4.5rem', height: '3.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
>
  <FaHeartbeat
    size={17}
    className="text-[#3A3C3E] mb-2"
  />
  <span className="text-xs">Health</span>
  {isHoveredHeartbeat && (
    <span className="absolute whitespace-nowrap bottom-0 mb-14 px-2 py-1 bg-white border-3A3C3E text-black text-xs rounded-md">
      Company Health
    </span>
  )}
</div>


        </div>
      </div>

      </div>

      {/* Style tags for specific styling */}
      <style jsx>{`

    .text-xxs {
      font-size: 0.45rem; /* Example size, adjust as needed */
    }

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
          height:88.5vh;
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

