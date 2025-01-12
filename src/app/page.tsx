'use client';
import FetchPhotosButton from "@/components/FetchPhotosButton";
import FileUpload from "@/components/FileUpload";
import FetchCalendarButton from "@/components/FetchCalendarButton";
import Image from "next/image";
import { useRouter } from 'next/navigation'

import React, {useEffect} from "react";
import "./globals.css";
import Link from 'next/link';



export default function Home() {
  return (    
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <FileUpload/>
        <FetchPhotosButton/>
        <FetchCalendarButton/>
        {/* <Link href="/landingpage">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4">
            Go to Landing Page
          </button>
        </Link> */}
      </main>
    </div>
  ); 
    
}