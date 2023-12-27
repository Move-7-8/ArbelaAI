import React, { useState, useEffect } from 'react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from "@chatscope/chat-ui-kit-react";
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const frostedGlassStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0)', // Semi-transparent white
  backdropFilter: 'blur(10px)', // Applying blur
  border: '1px solid rgba(255, 255, 255, 0)', // Optional: Adding a border for better visibility
};

const ChatBox = ({ company, quarter }) => {
  const [inputValue, setInputValue] = useState(""); // New state for holding input value
  const [messages, setMessages] = useState([
    {
      message: `Your model is now trained. I recommend the following lines of enquiry:`,
      sentTime: "15 mins ago",
      direction: "incoming",
      position: "single",
      hasButton: false,
    },
    {
      message: `How have DigitalX performed since their annual report?`,
      sentTime: "10 mins ago",
      direction: "incoming",
      position: "single",
      hasButton: true,
    },
    {
      message: `What is DigitalX's current strategy?`,
      sentTime: "10 mins ago",
      direction: "incoming",
      position: "single",
      hasButton: true,
    },
    {
      message: `What can be expected over the next 12 months?`,
      sentTime: "10 mins ago",
      direction: "incoming",
      position: "single",
      hasButton: true,
    }
  ]);

  const { data: session} = useSession();

  const fetchResponse = async (messageContent) => {
    try {
      console.log('triggered in fetch', { messageContent: messageContent, userId: session?.user.id, company: company })
      const result = await axios.post('/api/AIAssistant', { messageContent: messageContent, userId: session?.user.id, company: company });
      setMessages(prevMessages => [...prevMessages, {
        message: result.data.message,
        sentTime: "just now",
        direction: "incoming",
        position: "single"
      }]);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setMessages(prevMessages => [...prevMessages, {
        message: 'Error fetching data',
        sentTime: "just now",
        direction: "incoming",
        position: "single"
      }]);
    }
  };

  
  const MessageButton = ({ messageContent }) => (
    <div
      onClick={() => setInputValue(messageContent)}
      style={{ cursor: 'pointer', color: 'black' }}
    >
      <ContentCopyOutlinedIcon />
    </div>
  );

  const handleSendMessage = (messageContent) => {
    // Add the outgoing message to the messages state
    setMessages(prevMessages => [...prevMessages, {
      message: messageContent,
      sentTime: "just now", // You might want to create a function to generate the actual time
      direction: "outgoing", // Outgoing message
      position: "single", // You can define the position based on the context
      hasButton: false, // Assuming outgoing messages don't have buttons, adjust if needed
    }])};



  return (
    <MainContainer style={{ ...frostedGlassStyle, height: '100%', width: '100%' }}>
      <ChatContainer style={{ ...frostedGlassStyle, height: '100%' }}>
        <MessageList style={frostedGlassStyle}>
          {messages.map((msg, index) => (
            <Message
              model={{
                message: msg.message,
                sentTime: msg.sentTime,
                direction: msg.direction,
                position: msg.position,
                type: "custom"
              }}
              key={index}
              className={msg.hasButton ? "message-with-button" : ""}
            >
              <Message.CustomContent>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                  <p style={{ marginRight: '8px' }}>{msg.message}</p>
                  {msg.hasButton && <MessageButton messageContent={msg.message} />}
                </div>
              </Message.CustomContent>
            </Message>
          ))}
        </MessageList>
        <MessageInput 
          value={inputValue}
          onChange={setInputValue}
          placeholder="Type a message..."
          onSend={() => {
            // handleSendMessage(inputValue);
            fetchResponse(inputValue)
            handleSendMessage(inputValue)
            setInputValue("");
          }}
          style={{ ...frostedGlassStyle, width: '100%' }} 
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default ChatBox;

