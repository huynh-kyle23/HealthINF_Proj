import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {DotPattern} from "../components/magicui/dot-pattern";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Study Immerse",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>{/* You can include meta tags, links, etc. here */}</head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* Animated pattern as a background */}
        <div className="fixed inset-0 -z-10">

        </div>
        {/* Main content */}
        
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}