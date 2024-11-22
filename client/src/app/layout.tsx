"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import Loader from "../app/components/Loader/Loader";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-Poppins",
  weight: ["400", "500", "600", "700"],
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-Josefin",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <SessionProvider>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </SessionProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
  
}

const Custom:React.FC<{children:React.ReactNode}>=({children})=>{
 const {isLoading}=useLoadUserQuery({});
  return(
    <>
    {
      isLoading?<Loader/>:<>{children}</>
    }
    </>
  )
}
