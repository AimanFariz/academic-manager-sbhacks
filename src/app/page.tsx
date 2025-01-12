'use client'
import Link from 'next/link'; // Import Link from next/link
import DemoApp from "@/components/Calendar";
import CalendarComponent from "@/components/EventCalendar";
import FetchPhotosButton from "@/components/FetchPhotosButton";
import FileUpload from "@/components/FileUpload";
import FetchCalendarButton from "@/components/FetchCalendarButton";
import Image from "next/image";
import PhotoAnalysis from '@/components/PhotoAnalysis';
import {useRouter} from 'next/navigation';
import Calendar from '@/components/Calendar'
import Dashboard from '@/components/Dashboard';
import SignUp from '@/components/SignUp';
import LightDarkModeToggle from '@/components/DarkMode';

export default function Home() {
  return (
    <div className="justify-items-center sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 gap-5 justify-start items-start sm:items-start">
        <Image
          className="m-auto"
          src="/logo-transparent-png-removebg-preview.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        {/* <Dashboard/> */}
        {/* <LightDarkModeToggle/> */}
        <SignUp/>
        {/* <FileUpload/>
        <PhotoAnalysis />
        <FetchCalendarButton/> */}
        
      </main>
    </div>
  );

}
