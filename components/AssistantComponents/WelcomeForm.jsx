// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
// import { LoadingCircle } from '@public/assets/icons/assistant/assistant';
// import {useState, useEffect} from 'react'
// import Skeleton from '@mui/material/Skeleton';

// const WelcomeForm = ({
//   assistantName,
//   setAssistantName,
//   assistantDescription,
//   setAssistantDescription,
//   assistantModel,
//   setAssistantModel,
//   files,
//   handleFileChange,
//   startAssistant,
//   isButtonDisabled,
//   isStartLoading,
//   setFiles
// }) => {

//   const [s3Files, setS3Files] = useState([]); // Array to store multiple files
//   useEffect(() => {
//     if (s3Files.length > 0 && !isStartLoading && !isButtonDisabled) {
//       startAssistant();
//     }
//   }, [s3Files, isStartLoading, isButtonDisabled]); // Depend on s3Files and other relevant states

//   setAssistantName('HAL')
//   setAssistantDescription(`
//   You are a finance expert. Your goal is to provide answers about the company ${assistantName}.
//   `)
//   // You are a finance expert. Your goal is to provide answers about the company ${assistantName}.  You must use the provided Tavily search API function to find relevant online information. You should never use your own knowledge to answer questions. Please include relevant url sources in the end of your answers if they are from Taverly. 
//   // If asked about the DigitalX P/B ratio, it is 1.37. If asked who the DigitalX CEO is, it is Lisa Wade, it is not leigh travers. You must give a summary of ${assistantName} when asked. You must use the provided Tavily search API function to find relevant online information. 
//   // You are a finance expert. Your goal is to provide answers about the company ${assistantName}. you must answer by retrieving files and finding answers within them.

//   const handleFetchS3File = async () => {
//     try {
//       const response = await fetch('/api/S3');
//       const data = await response.json();
//       console.log("Response from /api/S3:", data);
  
//       const fetchedFiles = await Promise.all(data.map(async (fileData) => {
//         const fileResponse = await fetch(fileData.url);
//         const blob = await fileResponse.blob();
//         return new File([blob], fileData.key, { type: blob.type });
//       }));
  
//       console.log("New files created:", fetchedFiles);
//       setS3Files(fetchedFiles); // Updates the local state for displaying files
//       setFiles(fetchedFiles); // Updates the state in the parent component
//       } catch (error) {
//       console.error('Error fetching files from S3:', error);
//     }
//   };
          
//       useEffect(() => {
//         handleFetchS3File();
//       }, []); 

//       return (
//         <div className="h-full w-full border-gray-500 bg-gray-200 sm:mx-0   rounded-md border-2">
//           <div className="flex flex-col h-full p-7 sm:p-10 w-full">
//             <div className="w-full">
//               <div className="flex items-center space-x-4 mb-4 w-full">
//                 <Skeleton variant="circular" width={40} height={40} />
//                 <Skeleton variant="text" width="100%" height={80} />
//               </div>
//               <Skeleton variant="rectangular" width="100%" height={80} className="mb-4" />
//               <Skeleton variant="rectangular" width="100%" height={80} className="mb-4" />
//               <Skeleton variant="rectangular" width="100%" height={80} className="mb-4" />
//             </div>
    
//             <div className="mt-auto w-full">
//               <Skeleton variant="rounded" width="100%" height={60} />
//             </div>
//           </div>
//         </div>
//       );
//                 };
    
//     export default WelcomeForm;
    


