import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import "../styles/theme.css";

export const metadata: Metadata = {
  title: "Event Replay Dashboard",
  description: "Failed event inspection, replay, and recovery"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body style={{ background: "#0b1220", minHeight: "100vh" }}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

