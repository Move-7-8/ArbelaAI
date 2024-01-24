import { useEffect } from 'react';

const FileUpload = () => {
    console.log('file upload component is rendered');

    const handleUpload = async () => {
        try {
            const response = await fetch("/api/AI/fileUpload");
            const data = await response.json();
            console.log("Data received:", data);
        } catch (error) {
            console.error("Error in file upload:", error);
        }
    };

    useEffect(() => {
        handleUpload();
    }, []); // Empty array makes this effect run only once on component mount

    return (
        <div>
            <h1>File Upload</h1>
        </div>
    );
};
  
export default FileUpload;
