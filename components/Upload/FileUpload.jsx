import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const FileUpload = ({ files, setFiles, removeFile }) => {
  const uploadHandler = async (event) => {
    const file = event.target.files[0];
    file.isUploading = true;
    setFiles([...files, file]);

    // Create FormData and append file
    const formData = new FormData();
    formData.append(
        file.name, 
        file, 
        file.name
    );

    axios.post('api/upload', formData)
        .then((res) => {
          file.isUploading = false;
          setFiles(files.map(f => (f.name === file.name ? file : f)));
        })
        .catch((err) => {
          // console.log(err);
          removeFile(file.name);
        });
  };

  return (
    <div className="FileUpload-file-card flex flex-col items-center">
        <div className="FileUpload-file-inputs w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto">
            <input className='FileUpload-file w-full' type="file" onChange={uploadHandler} />
            <button className='FileUpload-button mt-2'>
                <FontAwesomeIcon icon={faPlus} className='FileUpload-button-icon'/>
                Upload
            </button>
        </div>

        <p className='FileUpload-main mt-2'>Support Files</p>
        <p className='FileUpload-info'>PDF, EXCEL</p>
    </div>
  );
};

export default FileUpload;
