"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "@headlessui/react"; // Headless UI Menu
import { ChevronDown } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header className="w-full border-b border-slate-200/50 px-6 md:px-10 py-3.5 bg-white/60 backdrop-blur-md flex items-center justify-between shadow-sm relative z-40">
      {/* Title or Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 md:hidden">
          <Image
            src="/logo.png"
            alt="The Siloti Archive Logo"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="text-sm font-bold text-slate-800">The Siloti Archive</span>
        </div>
        <h1 className="hidden md:block text-lg font-serif italic font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
      </div>

      {/* User Info with Dropdown */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-2 focus:outline-none hover:opacity-85 transition-opacity cursor-pointer">
          <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
            <AvatarImage src={user?.avatarUrl} alt={user?.username} />
            <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-slate-700 hidden sm:block">
            {user?.name || user?.username || "Loading..."}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2.5 w-48 bg-white/95 border border-slate-200/60 rounded-xl shadow-xl backdrop-blur-md focus:outline-none z-50 p-1 divide-y divide-slate-100">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push("/admin/dashboard/admins")}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    active ? "bg-slate-100 text-slate-900" : "text-slate-600"
                  }`}
                >
                  Manage Admins
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    active ? "bg-red-50 text-red-600" : "text-red-500"
                  }`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </header>
  );
}
