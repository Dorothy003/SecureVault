import React, { useEffect, useState } from 'react'
import axios from "../Api/axios.js"
import FileUpload from './FileUpload.jsx'
const Dashboard = () => {
  const [files,setFiles]=useState([])
  const fetchFiles=async()=>{
    try{
      const res=await axios.get("/files")
      setFiles(res.data)    
    } catch(err){
      console.log("Error fetching files")
    }
  }
  useEffect(()=>{
    fetchFiles();
  },[])
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-5xl mx-auto p-6'>
         <FileUpload onUpload={fetchFiles}/>
      </div>
      
    </div>
  )
}

export default Dashboard
