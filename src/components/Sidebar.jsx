// components/Sidebar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderTree,
  LogOut,
  Newspaper,
  ShieldCheck,
} from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/collection-manager", label: "Collection Manager", icon: FolderTree },
  { href: "/admin/dashboard/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/dashboard/admins", label: "Admins", icon: ShieldCheck },
];

export function Sidebar({ open, setOpen }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="The Siloti Archive Logo"
          width={36}
          height={36}
          className="rounded"
        />
        <span className="font-bold text-base">The Siloti Archive</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 mt-6">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition"
            onClick={() => setOpen(false)} // close on mobile click
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="mt-auto">
        <p className="text-sm text-muted-foreground mb-2">
          Logged in as: {user?.username || "Loading..."}
        </p>
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 text-destructive justify-start cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-muted border-r transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex md:flex-col`}
    >
      <SidebarContent />
    </aside>
  );
}
