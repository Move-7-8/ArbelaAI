// 'use client'

// import clsx from "clsx";
// import { Bot, User } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { useState, useEffect, useRef } from 'react';

// const Message = ({ messages }) => {

//   let messagelist = messages.content;
//   // let messagelist = messages;

//   if (typeof messagelist === 'string') {
//     messagelist = [{ role: 'user', content: messagelist }];
//   }
  
// let reversedMessageList = [...messagelist].reverse();


// return (
//   <div>
//     {reversedMessageList.map((message, index) => (
//       <div
//         key={index}
//         className={clsx(
//           "flex w-full border-b border-gray-200 py-8 ;",
//           message.role === "user" ? "bg-white" : "bg-gray-100"
//         )}
//       >
//         <div className="flex items-start space-x-4 px-5 w-full">
//           <div
//             className={clsx(
//               "p-1.5 text-white",
//               message.role === "assistant" ? "bg-green-500" : "bg-black"
//             )}
//           >
//             {message.role === "user" ? <User width={20} /> : <Bot width={20} />}
//           </div>
//           <ReactMarkdown
//             className="prose mt-1 w-full break-words prose-p:leading-relaxed"
//             remarkPlugins={[remarkGfm]}
//             components={{
//               a: (props) => (
//                 <a {...props} target="_blank" rel="noopener noreferrer" />
//               ),
//             }}
//           >
//             {message.content}
//           </ReactMarkdown>
//         </div>
//       </div>
//     ))}
//   </div>
// )
// };


// const MessageList = ({ chatMessages }) => {
//   const messagesEndRef = useRef(null);
//   const [displayedMessages, setDisplayedMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showLottie, setShowLottie] = useState(false);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (chatMessages.length > 0) {
//       const lastMessage = chatMessages[chatMessages.length - 1];
//       const secondLastMessage = chatMessages.length > 1 ? chatMessages[chatMessages.length - 2] : null;
//       const lastObject = lastMessage.content[0];
//       const secondlastObject = lastMessage.content[1];
//       const thirdlastObject = lastMessage.content[2];

//       // If the last message is from the user, start loading
//       if (lastMessage.role === 'user') {
//         setIsLoading(true);
//       }

//       console.log('***********************')
//       console.log('last message:' , lastObject)
//       console.log('second last message:' , secondlastObject)
      
//       console.log('***********************')
//       let updatedLastMessage = { ...lastMessage };

//       if (lastObject.role === 'assistant' && secondlastObject && secondlastObject.role === 'assistant') {
//         if (thirdlastObject && thirdlastObject.role === 'assistant') {
//           // If the last three messages are from the assistant, remove the last two
//           console.log('removing last two');
//           const newContent = lastMessage.content.slice(2);
//           updatedLastMessage = { ...lastMessage, content: newContent };
//         } else {
//           // If only the last two messages are from the assistant, remove the last one
//           console.log('removing last');
//           const newContent = lastMessage.content.slice(1);
//           updatedLastMessage = { ...lastMessage, content: newContent };
//         }
//       } else {
//         // Check for any two consecutive assistant messages in the list
//         let newContent = [...updatedLastMessage.content];
//         for (let i = 0; i < newContent.length - 1; i++) {
//           if (newContent[i].role === 'assistant' && newContent[i + 1].role === 'assistant') {
//             // Remove one of the consecutive assistant messages
//             newContent.splice(i + 1, 1);
//             break; // Remove this line if you want to check for more than one pair of consecutive messages
//           }
//         }
//         updatedLastMessage = { ...updatedLastMessage, content: newContent };
//       }
//             console.log('last message:' , lastMessage)
//       console.log('updated last message:' , updatedLastMessage.content)
//       const latestTwo = updatedLastMessage.content.slice(0, 2)
//       const reversedLatestTwo = [...latestTwo].reverse();

//       console.log('latest Two:' , latestTwo)

//       // last_two_messages = updatedLastMessage.content.slice(0, 2);
//       // console.log('updated last message last 2:' , last_two_messages)

      
//       // If the last message is from the assistant and the second last message is not from the assistant
//       if (lastMessage.role === 'assistant' && (!secondLastMessage || secondLastMessage.role !== 'assistant')) {
//         setDisplayedMessages([updatedLastMessage]);
//         // setDisplayedMessages(prevMessages => [...prevMessages, ...reversedLatestTwo]);
//         setIsLoading(false);
//       }
//     }
//   }, [chatMessages]);

//   useEffect(() => {
//     let timeoutId;

//     if (isLoading) {
//         // Set a timeout to show the Lottie player after 0.2 seconds
//         timeoutId = setTimeout(() => {
//             setShowLottie(true);
//             console.log("Lottie player is now displayed");
//         }, 200); // 200 milliseconds = 0.2 seconds
//     } else {
//         // Immediately hide the Lottie player when not loading
//         setShowLottie(false);
//     }

//     // Clear the timeout when the component is unmounted or isLoading changes
//     return () => clearTimeout(timeoutId);
// }, [isLoading]);
  
//   useEffect(() => {
//     // Scroll to bottom when a new message is displayed
//     scrollToBottom();
//   }, [displayedMessages]);
  
//   console.log('displayedMessages:', displayedMessages)
//   return (
//     <div className="message-list-container" style={{ maxHeight: '650px', overflowY: 'auto' }}>
//       {displayedMessages.map((message, i) => (
//         <Message key={i} messages={message} />
//       ))}
//       {showLottie && (
//           <div style={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: '70px',
//               width: '100%',
//               marginTop: '20px'
//           }}>
//               <dotlottie-player 
//                   src="https://lottie.host/bad49e7f-525c-4d0b-a52f-f1f1ffaafddc/2BVvBT7fQ3.json" 
//                   background="transparent" 
//                   speed="1" 
//                   style={{ width: '180px', height: '180px' }}
//                   loop 
//                   autoplay>
//               </dotlottie-player>
//           </div>
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
//       }  
// export default MessageList; 

