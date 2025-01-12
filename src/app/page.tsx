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
        <PhotoAnalysis />
        <FetchCalendarButton/>
        
      </main>
    </div>
  );

}
