import React, { useState } from 'react'
import { FaFileWord } from "react-icons/fa";
import axios from 'axios'
function Home() {
  const [selectedFile,setselectedFile]=useState(null);
  const [convert,setconvert]=useState("");
  const [DownloadError,setDownloadError]=useState("")
  const handleFileChange=(e)=>{
    setselectedFile(e.target.files[0])
  };
  const handleSubmit=async (event)=>{
    event.preventDefault();
    if(!selectedFile){
      setconvert("Please Select a File");
      return;
    }
    const formData=new FormData();
    formData.append("file",selectedFile);
    try {
      const response = await axios.post("http://localhost:3000/convertFile",formData,{
        responseType:"blob",
      });
      const url=window.URL.createObjectURL(new Blob([response.data]))
      const link=document.createElement("a")
      link.href=url
      link.setAttribute("download",selectedFile.name.replace(/\.[^/.]+$/,"")+".pdf")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      setselectedFile(null)
      setDownloadError("")
      setconvert("File Converted Successfully")
    } catch (error) {
      if(error.response && error.response.status==400)setDownloadError("Error occuring");
      else setconvert("");
    }
  }
  return (
    <>
    <div className='max-w-screen-2xl mx-auto container px-6 py-3 md:px-40'>
        <div className='flex h-screen items-center justify-center'>
            <div className='border-2 border-dashed px-4 py-2 md:py-6 border-red-400 rounded-lg shadow-2xl'>
                <h1 className='text-3xl font-bold text-center mb-4'>Convert Word to PDF Online</h1>
                <p className='text-sm text-center mb-5'>Easily convert Word Document to PDF format online, without having to install any software</p>
            
            <div className='flex flex-col items-center space-y-4'>
                <input type="file" accept='.doc,.docx' className='hidden' id="FileInput"
                onChange={handleFileChange}
                />
                <label htmlFor="FileInput" 
                className='w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer  border-blue-300 hover:bg-blue-600 duration-300  hover:text-white'>
                <FaFileWord className='text-2xl mr-3'/>
                <span className='text-2xl mr-2'>{selectedFile?selectedFile.name:"Choose File"}</span>
                </label>
                <button onClick={handleSubmit} disabled={!selectedFile} className='text-white bg-blue-500 hover:bg-blue-800 font-bold px-4 py-2 rounded-xl disabled:bg-gray-400 disabled:pointer-events-none'>Convert File</button>
                {convert && (<div className='text-green-500 text-center'>{convert}</div>)}
                {DownloadError && (<div className='text-red-500 text-center'>{DownloadError}</div>)}
            </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Home
