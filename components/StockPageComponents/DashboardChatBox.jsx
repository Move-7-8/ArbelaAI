import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';




const Chatbox = () => {
    const iconSize = 24; // Adjust as needed
    // Dummy messages for testing the scrollbar
    const messages = [
        { sender: 'chatbot', text: 'Hello, how can I help you today?' },
        { sender: 'user', text: 'I need assistance with my account.' },
        { sender: 'chatbot', text: 'Sure, I can help with that. What seems to be the issue?' },
        // ...add more dummy messages here...
    ];


    return (
     <div className="bg-gray-100 bg-opacity-50 m-4 rounded-lg flex flex-col flex-grow justify-between" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            {/* Chat header */}
            <div className="p-3 border-b border-gray-300 text-center">
                <div className="font-bold text-lg">ChatBot</div>
                <div className="mt-1 inline-flex items-center justify-center bg-gray-200 rounded-full px-2 py-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xxs text-gray-600" style={{ fontSize: '9px' }}>Online</span> {/* Custom smaller font size */}
                </div>
            </div>

           {/* Chat content area with scrollbar */}
            <div className="chat-content-area p-3 overflow-y-auto" style={{ minHeight: '470px' }}>
                {/* Display chat messages */}
                    {messages.map((msg, index) => (
                        <p key={index} className="text-left text-xs my-2 p-2 rounded-md" 
                        style={{ backgroundColor: msg.sender === 'chatbot' ? 'rgba(200, 200, 200, 0.2)' : 'rgba(80, 120, 235, 0.2)' }}>
                            {msg.text}
                        </p>
                    ))}

            </div>

            {/* Chat input area */}
            <div className=" flex  p-3 border-t border-gray-300 flex items-center mt-4">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="w-full p-2 border border-black rounded-l-md bg-white" 
                />
                <button className="bg-black text-white rounded-r-md p-2 flex items-center hover:bg-white hover:text-black border border-black">
                    <FaPaperPlane size={iconSize} className="text-current" />
                </button>
            </div>


            {/* Custom scrollbar styles */}
            <style jsx>{`
                .chat-content-area::-webkit-scrollbar {
                    width: 8px;
                    border-radius: 4px;
                }

                .chat-content-area::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #ED83FF 10%, #FEF0C2); /* More yellow (#FEF0C2) */
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default Chatbox;