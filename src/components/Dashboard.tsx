'use client'
import React from 'react'
// import Link from 'next/link'
import FileUpload from './FileUpload'
import Calendar from 'react-calendar'
// import './globals.css'
import { Circle } from 'rc-progress';
import FetchPhotosButton from './FetchPhotosButton';
import FetchCalendarButton from './FetchCalendarButton';

function Dashboard() {

  return (
    <div className='flex flex-row p-5 gap-10'>
        <div className='flex flex-col border border-gray-600 rounded-md w-auto p-5 gap-10'>
            <p className='text-3xl'>Dashboard</p>
            <FileUpload/>
            <FetchCalendarButton/>
            <div>
                <p className='text-3xl'>Upcoming Deadlines</p>
            </div>
        </div>
        
    </div>
  )
}

export default Dashboard