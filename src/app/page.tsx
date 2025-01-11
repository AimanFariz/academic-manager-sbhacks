import FileUpload from "@/components/FileUpload";
import SignUp from "@/components/SignUp";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center max-h-screen py-10 gap-48 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Image
          className="dark:invert"
          src="/logo-png.webp"
          alt="Next.js logo"
          width={250}
          height={50}
          priority
        />
      <SignUp/>
    </div>
  );
}
