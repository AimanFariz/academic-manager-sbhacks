'use client'
import React from 'react'
// import Link from 'next/link'
import FileUpload from './FileUpload'
import Calendar from 'react-calendar'
// import './globals.css'
import { Circle } from 'rc-progress';
import FetchPhotosButton from './FetchPhotosButton';

function Dashboard() {
let percent = 100;
  return (
    <div className='flex flex-row p-5 gap-10'>
        <div className='flex flex-col border border-gray-600 rounded-md w-auto p-5 gap-10'>
            <p className='text-3xl'>Dashboard</p>
            <FileUpload/>
            <FetchPhotosButton/>
            <div>
                <p className='text-3xl'>Upcoming Deadlines</p>
            </div>
        </div>
        <div className='flex flex-col gap-5 p-5 border border-gray-600 rounded-md w-auto '>
            {/* Top */}
            <div className='flex flex-row gap-5'>
                <div className='flex flex-col gap-5 items-center'>
                <p>Daily Progress</p>
                <div style={{ position: 'relative', width: 150, height: 150 }}>
                {/* Circle Progress */}
                <Circle percent={percent} strokeWidth={4} strokeColor="#13E857" style={{ width: '100%', height: '100%' }} />
                {/* Centered Text */}
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
                {/* Priority Tasks */}
                <div className='p-5'>
                    <p>Priority Tasks</p>
                </div>
            </div>

            {/* Bottom */}
            <div>
                <p>Daily Planner - [Day] of the week</p>
            </div>
            {/* <Link href="/Calendar" >
                <a>Go to About Page</a>
                Go to About Page
            </Link> */}
        </div>
    </div>
  )
}

export default Dashboard