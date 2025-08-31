"use client";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AuthProvider } from "@/lib/context/AuthContext";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex h-screen w-full overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? "md:ml-64" : ""
          }`}
        >
          {/* Fixed navbar */}
          <div className="flex-shrink-0">
            <Navbar />
          </div>

          {/* Scrollable content */}
          <main className="flex-1 overflow-auto p-4 md:p-8 w-full">
            {children}
          </main>
        </div>

        {/* Floating toggle button (mobile only) */}
        <Button
          variant="default"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Mobile overlay when sidebar open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthProvider>
  );
}
