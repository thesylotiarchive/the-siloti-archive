"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LayoutDashboard,
  Folder,
  Layers,
  FolderTree,
  ImageIcon,
  LogOut,
  // Layers,
  Newspaper,
} from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/collection-manager", label: "Collection Manager", icon: FolderTree },
  { href: "/admin/dashboard/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/dashboard/media", label: "Media Items", icon: ImageIcon },
  // { href: "/admin/dashboard/media", label: "Media Items", icon: ImageIcon },
];

export function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
    //   console.log("User data: ", data.user);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setUser(null);
      });
  }, []);
  

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4 space-y-4">
      <h2 className="text-lg font-semibold">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
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
    <>
      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden p-4 border-b flex justify-between items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="text-sm text-muted-foreground">Admin Panel</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:border-r md:bg-muted">
        <SidebarContent />
      </aside>
    </>
  );
}
