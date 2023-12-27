import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faFileAlt, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'

const FileItem = ({file, deleteFile}) => {
  return (
    <li 
    className='file-item-list-item'
    key={file.name}
    >
    <FontAwesomeIcon 
    icon={faFileAlt}
    className='faFileAlt' // Ensure this matches the class in your CSS
    />
            <p className='file-item-file-name'>{file.name}</p>
            <div className='file-items-actions'>
                {file.isUploading &&
                    <FontAwesomeIcon
                    icon={faSpinner}
                    className='fa-spin'
                    />
                }

                {!file.isUploading &&
                    <FontAwesomeIcon
                    icon={faTrash}
                    onClick={()=> deleteFile(file.name)}
                    className='fa-trash'

                    />
                }



        </div>
    </li>
  )
}

export default FileItem