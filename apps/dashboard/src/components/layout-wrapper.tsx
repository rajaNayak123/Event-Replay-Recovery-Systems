"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pages that should NOT have a sidebar
  const isAuthPage = pathname === "/login" || pathname === "/setup";

  if (isAuthPage) {
    return <main className="min-h-screen flex flex-col">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <span className="text-lg font-bold text-white tracking-tight">Event Replay</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 text-slate-300"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-64 min-h-screen flex flex-col bg-slate-950/20 backdrop-blur-3xl pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
