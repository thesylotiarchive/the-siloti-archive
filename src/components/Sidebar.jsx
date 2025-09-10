// components/Sidebar.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderTree,
  LogOut,
  Newspaper,
  ShieldCheck,
  FileText,
  FileEdit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/collection-manager", label: "Collection Manager", icon: FolderTree },
  { href: "/admin/dashboard/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/dashboard/drafts", label: "Drafts", icon: FileText },
  { href: "/admin/dashboard/pages", label: "Edit Pages", icon: FileEdit },
  { href: "/admin/dashboard/admins", label: "Account Manager", icon: ShieldCheck },
];

export function Sidebar({ open, setOpen }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const pathname = usePathname();

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


      {/* Role */}
      {!user ? (
        // Skeleton Loader for Role
        <div className="flex justify-center mt-3 items-center animate-pulse">
          <div className="h-4 w-10 bg-gray-300 rounded mr-2"></div>
          <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
        </div>
      ) : (
        <div className="flex justify-center mt-3 items-center">
          <span className="text-xs font-medium text-muted-foreground mr-1">Role:</span>
          <span
            className={`px-2 py-0.5 text-[11px] font-semibold rounded-full uppercase
              ${user.role === "SUPERADMIN" ? "bg-red-100 text-red-700" :
                user.role === "ADMIN" ? "bg-blue-100 text-blue-700" :
                user.role === "CONTRIBUTOR" ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-700"}`}
          >
            {user.role}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-col gap-2 mt-3">
        {navLinks.map(({ href, label, icon: Icon }) => {
          if (href === "/admin/dashboard/admins" && user?.role === "CONTRIBUTOR") return null;
          if (href === "/admin/dashboard/drafts" && !["ADMIN", "SUPERADMIN"].includes(user?.role)) return null;
          if (href === "/admin/dashboard/pages" && !["ADMIN", "SUPERADMIN"].includes(user?.role)) return null;

          // Check if current route matches or is a nested route
          const isDashboard = href === "/admin/dashboard";

          const isActive = isDashboard
              ? pathname === href // only exact match for dashboard
              : pathname === href || pathname?.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition
                ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={() => setOpen(false)}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : ""}`} />
              {label}
            </Link>
          );
        })}
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
