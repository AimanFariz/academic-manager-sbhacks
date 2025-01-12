'use client'
import React, { useState } from 'react'
import FileUpload from './FileUpload'
import { Circle } from 'rc-progress';
import FetchPhotosButton from './FetchPhotosButton';

function Dashboard() {
  let percent = 100;
  const [files, setFiles] = useState<any[]>([]);

  const handleFilesUploaded = (uploadedFiles: any[]) => {
    setFiles(uploadedFiles);
  };

  return (
    <div className='flex flex-col gap-4 w-full max-w-[1400px] mx-1'>
      <div className='flex flex-row p-2 gap-4 w-full'>
        {/* Left container - 60% width */}
        <div className='flex flex-col border border-gray-600 rounded-md w-3/5 p-6 gap-6'>
          <p className='text-3xl'>Dashboard</p>
          <FileUpload onFilesUploaded={handleFilesUploaded}/>
        </div>

        {/* Right container - 40% width */}
        <div className='flex flex-col gap-6 p-6 border border-gray-600 rounded-md w-2/5'>
          <div className='flex flex-row justify-between items-start'>
            {/* Daily Progress */}
            <div className='flex flex-col gap-4 items-center'>
              <p>Daily Progress</p>
              <div style={{ position: 'relative', width: 150, height: 150 }}>
                <Circle percent={percent} strokeWidth={4} strokeColor="#13E857" style={{ width: '100%', height: '100%' }} />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {percent}%
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className='flex flex-col gap-4 items-center'>
              <p>Upcoming Deadlines</p>
              {/* Add your deadlines content here */}
            </div>
          </div>
        </div>
      </div>

      {/* Files container */}
      {files.length > 0 && (
        <div className='border border-gray-600 rounded-md p-6 w-full'>
          <h3 className='text-xl mb-4'>Uploaded Files</h3>
          <div className='flex flex-row gap-4 flex-wrap'>
            {files.map((file, index) => (
              <div key={index} className='border border-gray-300 rounded p-3 flex flex-col items-center'>
                <p className='text-sm'>{file.name}</p>
                {file.url && (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="w-24 h-24 object-cover mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
