import React, { useState } from 'react'
import axios from '../Api/axios'


const FileUpload = ({onUpload}) => {
    const [File,setFile]=useState(null)
    const handleUpload=async()=>{
        if(!File) return ;
         const formData=new FormData()
    formData.append("file",File)
    try {
        await axios.post("/upload",formData,{
            headers:{"Content-Type":"multipart/form-data"}
        })
        setFile(null)
        onUpload()
    } catch (error) {
        console.error("Upload Failed",error)
    }
    }
  return (
    <div className='bg-white shadow-md rounded-lg p-4 mb-6'>
        <h2 className='text-lg font-bold mb-2'>Upload file</h2>
        <input
         type='file'
         onChange={(e)=>setFile(e.target.files[0])}
         className='mb-2'
        />
        <button onClick={handleUpload}
        className='bg-blue-500 text-white px-4 py-2 rounded-lg'
        >Upload</button>
    </div>
  )
}

export default FileUpload
