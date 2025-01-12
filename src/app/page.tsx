'use client';
import "./globals.css";
import FileUpload from "@/components/FileUpload";
import Forms from "@/components/Forms";
import NavBar from "@/components/NavBar";
import SignUp from "@/components/SignUp";
import Image from "next/image";
import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import Calendar from "@/components/Calendar";
import FetchPhotosButton from "@/components/FetchPhotosButton";
import Dashboard from "@/components/Dashboard";


export default function Home() {
return (
  <div className="flex justify-center max-h-screen bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 font-[family-name:var(--font-geist-sans)]">
    {/* <NavBar/> */}
    {/* <SignUp/> */}
    {/* <Forms/> */}
    <FileUpload/>
    <FetchPhotosButton/>
    {/* <Calendar/> */}
    {/* <Dashboard/> */}
  </div>
);
}
