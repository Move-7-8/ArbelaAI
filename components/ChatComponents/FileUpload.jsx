
import { useEffect, useState } from 'react';

const FileUpload = ({ data, data2, ticker, onFileUploadCompleted }) => {
    const [uploadInitiated, setUploadInitiated] = useState(false);

    const handleUpload = async () => {
        console.log('File Upload triggered');
        const bodyData = JSON.stringify({ ticker });

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


    useEffect(() => {
        // Check if both data and data2 are not null/undefined and upload has not been initiated
        if (data && data2 && !uploadInitiated) {
            handleUpload();
            setUploadInitiated(true); // Prevent further uploads
        }
    }, [data, data2]); // This still depends on data and data2 but ensures single execution
    
    return null
};
  
export default FileUpload;
