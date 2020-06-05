import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import './styles.css'

function Dropzone(props) {

    const {onFileUploaded} = props
    const [selectedFileUrl, setSelectedFileUrl] = useState('')


    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        const file = acceptedFiles[0]

        const fileUrl = URL.createObjectURL(file)

        setSelectedFileUrl(fileUrl)
        onFileUploaded(file)

    }, [onFileUploaded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
        <div className='dropzone' {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />
            {/* {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      } */}

            {
                selectedFileUrl
                    ? <img src={selectedFileUrl} alt="Point thumbnail" />
                    : (
                        <p>
                            <FiUpload />
                            Imagem do estabelecimento.
                        </p>
                    )
            }

        </div>
    )
}

export default Dropzone