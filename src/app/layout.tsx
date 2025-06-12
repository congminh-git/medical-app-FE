import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import { ChatProvider } from "@/context/chatContext";
import AllChatContactWrapper from "@/components/allChatContactWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConnectCare",
  description: "Cong Minh - Vinh Tien",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ChatProvider>
            {children}
            <AllChatContactWrapper />
          </ChatProvider>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
