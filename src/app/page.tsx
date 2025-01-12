'use client';

import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import Calendar from "../components/Calendar";
import "./globals.css";


export default function Home() {
  useEffect(() => {
    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <Calendar />
      </React.StrictMode>
    );
  }, []);
}
