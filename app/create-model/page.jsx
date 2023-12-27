'use client'
import {useState} from 'react'
import FileUpload from "@components/Upload/FileUpload"
import FileList from '@components/Upload/FileList'


const CreateModel = () => {
  const [companyName, setCompanyName] = useState('');
  const [modelTitle, setModelTitle] = useState('Your Model'); 

  const [files, setFiles] = useState([
])

//Delete Upload 
const removeFile = (filename) => {
  setFiles(files.filter(file => file.name !== filename))
}
console.log(files)

//Handle the Form  
const handleCompanyNameChange = (e) => {
  setCompanyName(e.target.value);
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Company name submitted:', companyName);
  setModelTitle(companyName); 
  setCompanyName('');
};


  return (
    <div className="flex flex-col items-center w-full h-screen mt-14">
      <div className='mb-2 mt-12 text-center'>
        <h1 className='mb-4 text-7xl font-black text-black'>Upload Data</h1>
        <p className='text-lg text-black'>
          To create your own models 
        </p>
      </div>
      {/* <div className="w-full h-3/5 mt-5 flex flex-row justify-between p-4"> */}
      <div className="w-full h-3/5 mt-5 flex flex-row justify-between p-4 file-upload-flex-container">

        <div className='w-1/2 p-2 border border-black m-2'>
        <form onSubmit={handleSubmit} className="mb-8 file-upload-company-name-form">
      <input
        type="text"
        value={companyName}
        onChange={handleCompanyNameChange}
        className="file-upload-company-name-input"
        placeholder="Enter company/ model name"
      />
      <button type="submit" className="file-upload-submit-button">
        Submit
      </button>
    </form>
          <FileUpload files={files} setFiles={setFiles} removeFile={removeFile} />
        </div>

        <div className='w-1/2 p-2 border border-black m-2'>
        <h3 className='text-center font-bold'>{modelTitle}</h3> 

          <FileList files={files} removeFile={removeFile} />
        </div>
      </div>
    </div>
  );
};

export default CreateModel


    