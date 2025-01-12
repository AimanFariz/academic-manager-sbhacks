'use client'
import Link from 'next/link';
import DemoApp from "@/components/Calendar";
import CalendarComponent from "@/components/EventCalendar";
import FetchPhotosButton from "@/components/FetchPhotosButton";
import FileUpload from "@/components/FileUpload";
import FetchCalendarButton from "@/components/FetchCalendarButton";
import Image from "next/image";
import PhotoAnalysis from '@/components/PhotoAnalysis';
import {useRouter} from 'next/navigation';
import Calendar from '@/components/Calendar';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-4 gap-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 items-center w-full">
        <Image
          className="mb-4"
          src="/logo-transparent-png-removebg-preview.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <Dashboard/>
        <div className="flex justify-center w-full">
          <FetchCalendarButton/>
        </div>
      </main>
    </div>
  );
}
