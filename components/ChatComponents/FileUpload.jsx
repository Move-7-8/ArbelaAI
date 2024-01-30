import { useEffect } from 'react';

const FileUpload = ({ data, onFileUploadCompleted }) => {
    console.log('file upload component is rendered');
    console.log('*********************************')
    console.log('Received data in FileUpload DATA:', data);
    console.log('*********************************')

    const handleUpload = async () => {
        const bodyData = JSON.stringify(data)
        console.log('*********************************')
        console.log('Received data in FileUpload BODY:', bodyData);
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
            console.log("Data received:", responseData);
            onFileUploadCompleted(); // Call this after successful upload

        } catch (error) {
            console.error("Error in file upload:", error);
        }
    };
    useEffect(() => {
        if (data) {
            handleUpload();
        }
    }, [data]); // Run effect when `data` changes
    
    return null
    // return (
    //     <div>
    //         <h1>File Upload</h1>
    //     </div>
    // );
};
  
export default FileUpload;
