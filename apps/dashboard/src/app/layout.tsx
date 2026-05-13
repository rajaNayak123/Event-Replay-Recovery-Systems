import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { LayoutWrapper } from "@/components/layout-wrapper";
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}


