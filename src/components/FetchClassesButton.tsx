'use client'
import React from 'react';
import Link from 'next/link';

export default function FetchClassesButton() {
    return (
        <Link href="/classes">
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300">
                Fetch Classes
            </button>
        </Link>
    );
}