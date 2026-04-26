import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";
import "../styles/theme.css";

export const metadata: Metadata = {
  title: "Antigravity | Event Replay & Recovery",
  description: "Advanced distributed system recovery and event replay management"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen text-slate-50">
        <SessionProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 min-h-screen flex flex-col bg-slate-950/20 backdrop-blur-3xl">
              {children}
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

