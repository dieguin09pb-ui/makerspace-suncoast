import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ChatWidget } from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "Makerspace @ Suncoast",
  description:
    "STEM Club at Suncoast Community High School. Meetings Mondays after school, Workshop Wednesdays at lunch, and open build time every lunch in Room 3-126.",
  icons: {
    icon: "/images/makerspaceLogoSimplified.png",
    apple: "/images/makerspaceLogoSimplified.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        <ChatWidget />
      </body>
    </html>
  );
}
