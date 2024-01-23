import { useEffect } from 'react';

const FileUpload = ({ triggerFunction, onFileUploadFunction }) => {
    useEffect(() => {
      if (triggerFunction) {
        console.log('File Upload Triggered');
        // Simulate file upload process here
        // Once upload is done:
        onFileUploadFunction(); // Call this when file upload is complete
      }
    }, [triggerFunction, onFileUploadFunction]);
  
    return (
        <div>
            <h1>File Upload</h1>
        </div>
    );
  };
  
export default FileUpload;
