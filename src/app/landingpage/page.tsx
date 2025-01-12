// landingpage/page.tsx
'use client'
import React from 'react';
import {useRouter} from 'next/navigation';
import Calendar from '@/components/Calendar'
// import { render } from 'react-dom'
import '@/app/globals.css'

export default function LandingPage() {
    return (
        <Calendar/>
    );
  }

  