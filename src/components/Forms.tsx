import React,{useEffect, useState} from 'react'
import Image from 'next/image'

function Forms() {
    const [playerList, setPlayerList] = useState([])
    useEffect(()=>{
      let array = localStorage.getItem("playerList")
    
      if(array){
        setPlayerList(JSON.parse(array))
      }
    },[])
  
    return (
    <div className='flex py-10 items-center justify-center h-screen'>
        <div className='flex flex-col flex-grow bg-green-800 px-10 py-10'>
            <div className='flex items-center text-white bg-black'>
                <Image
                src="/logo-transparent-png-removebg-preview.png"
                alt="Next.js logo"
                width={50}
                height={20}
                />
                <p>LockedIn.tech</p>
            </div>
            <div>
                <h1>Hi</h1>
            </div>
        </div>
        <div className='flex flex-col flex-grow-[3] bg-red-500 px-10 py-10'>
            <p className=''>Enter your classes</p>
            <div className="flex flex-row items-center">
            </div>
        </div>
    </div>
  )
}

export default Forms