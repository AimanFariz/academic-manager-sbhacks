// landingpage/page.tsx
'use client'
import React from 'react';
import {useRouter} from 'next/navigation';
import Calendar from '@/components/Calendar'
import {Circle} from 'rc-progress'
// import { render } from 'react-dom'
import '@/app/globals.css'
import FileUpload from '@/components/FileUpload';

export default function LandingPage() {
    let percent = 100;
    let count = 0;
    return (
        <div className='flex flex-col'>
            <Calendar/>
            <div className='flex justify-center'>
                <div className='flex flex-col gap-5 p-5 border text-center border-gray-600 rounded-md '>
                    {/* Top */}
                    <div>
                        <p>Deadlines</p>
                    </div>
                    {/* Bottom */}
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
                    </div>
                </div>
                <div className='flex flex-col gap-5 p-5 border border-gray-600 rounded-md '>
                    <FileUpload/>
                </div>
            </div>
        </div>

    );
  }