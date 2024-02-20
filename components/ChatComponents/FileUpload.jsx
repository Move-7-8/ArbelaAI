
import { useEffect, useState } from 'react';

const FileUpload = ({ data, data2, onFileUploadCompleted }) => {
    const [uploadInitiated, setUploadInitiated] = useState(false);

    // console.log('file upload component is rendered');
    // console.log('*********************************')
    // console.log('Received data in FileUpload DATA:', data);
    // console.log('*********************************')

    const handleUpload = async () => {
        const bodyData = JSON.stringify({ data, data2 });
        console.log('*********************************')
        console.log('Received data in FileUpload BODY:', bodyData.data2);
        console.log('*********************************')

            try {
            
            const response = await fetch("/api/AI/fileUpload", {
                method: 'POST', // Specify the method
                headers: {
                    'Content-Type': 'application/json'
                },
                body: bodyData // Convert your data to JSON and send in the request body
            });
            const responseData = await response.json();
            console.log("Data Uploaded:", responseData);
            onFileUploadCompleted(); // Call this after successful upload

        } catch (error) {
            console.error("Error in file upload:", error);
        }
    };

    // useEffect(() => {
    //     // Check if both data and data2 are not null/undefined and upload has not been initiated
    //     if (data) {
    //         handleUpload();
    //     }
    // }, [data]); // This still depends on data and data2 but ensures single execution

    useEffect(() => {
        // Check if both data and data2 are not null/undefined and upload has not been initiated
        if (data && data2 && !uploadInitiated) {
            handleUpload();
            setUploadInitiated(true); // Prevent further uploads
        }
    }, [data, data2]); // This still depends on data and data2 but ensures single execution
    
    return null
    // return (
    //     <div>
    //         <h1>File Upload</h1>
    //     </div>
    // );
};
  
export default FileUpload;

// import { useEffect, useState } from 'react';

// const FileUpload = ({ data, data2, onFileUploadCompleted }) => {

//     const handleUpload = async () => {
        // const bodyData = JSON.stringify({ data, data2 });
//         // console.log('*********************************')
//         // console.log('Received data in FileUpload BODY:', bodyData);
//         // console.log('*********************************')

//             try {
            
//             const response = await fetch("/api/AI/fileUpload", {
//                 method: 'POST', // Specify the method
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: bodyData // Convert your data to JSON and send in the request body
//             });
//             const responseData = await response.json();
//             // console.log("Data received:", responseData);
//             onFileUploadCompleted(); // Call this after successful upload

//         } catch (error) {
//             console.error("Error in file upload:", error);
//         }
//     };

//     useEffect(() => {
//         // Optionally check for both `data` and `data2` before proceeding
//         if (data && data2) {
//             console.log('Initiating file upload with data and data2');
//             handleUpload();
//         }
//     }, [data, data2]); // Run effect when either `data` or `data2` changes
    
//     return null
// };
  
// export default FileUpload;