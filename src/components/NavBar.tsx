import React from 'react'
import Image from 'next/image'

export default function NavBar() {
  return (
    <div className='fixed justify-around flex w-full bg-gray-800 text-white p-2 text-center items-center'>
        <div className='flex items-center'>
        <Image
          // logo-transparent-png-removebg-preview.png
          src="/logo-transparent-png-removebg-preview.png"
          alt="Next.js logo"
          width={50}
          height={20}
          priority
        />
        <p>LockedIn.tech</p>
        </div>
        <a target='__blank' href='https://drive.google.com/drive/folders/1HA9w4OwQvbPb_-RgcfNRwp0WbpzbSah0?usp=drive_link' className='border border-slate-400 p-3 bg-slate-500 rounded-md text-white font-medium hover:bg-cyan-400'>GitHub</a>
    </div>
  )
}