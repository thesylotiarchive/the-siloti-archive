"use client";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/context/AuthContext";

function DashboardGuard({ children }) {
  const { me, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white text-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
        <span className="text-xs text-slate-500 font-medium tracking-wide">Verifying authorization...</span>
      </div>
    );
  }

  if (!me || (me.role !== "ADMIN" && me.role !== "SUPERADMIN")) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950 flex flex-col items-center justify-center px-4 relative">
        <div className="relative z-10 text-center space-y-5 max-w-md bg-white border border-slate-200 rounded-[2rem] p-8 sm:p-10 shadow-xl">
          <h3 className="text-2xl font-semibold text-red-600 font-serif italic">Access Denied</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            You do not have administrative permissions required to access the Sylheti Archive admin panel.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-3 bg-black hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
          >
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  return children;
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <DashboardGuard>
        <div className="flex h-screen w-full overflow-hidden relative bg-slate-50 text-slate-950 selection:bg-slate-950 selection:text-white">
          {/* Sidebar */}
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* Main content */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
              sidebarOpen ? "md:ml-64" : ""
            }`}
          >
            {/* Fixed navbar */}
            <div className="flex-shrink-0 border-b border-slate-200/80">
              <Navbar />
            </div>

            {/* Scrollable content */}
            <main className="flex-1 overflow-auto p-6 md:p-10 w-full relative bg-[#fafafa]">
              {children}
            </main>
          </div>

          {/* Floating toggle button (mobile only) */}
          <Button
            variant="default"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden fixed bottom-6 right-6 z-50 rounded-full bg-black hover:bg-slate-900 text-white shadow-lg"
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Mobile overlay when sidebar open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </DashboardGuard>
    </AuthProvider>
  );
}
