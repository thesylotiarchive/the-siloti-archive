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
    <header className="w-full border-b px-4 md:px-8 py-3 bg-background flex items-center justify-between">
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
          <span className="text-sm font-semibold">The Siloti Archive</span>
        </div>
        <h1 className="hidden md:block text-lg font-semibold">Dashboard</h1>
      </div>

      {/* User Info with Dropdown */}
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-2 focus:outline-none">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={user?.username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground sm:block">
            {user?.username || "Loading..."}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg focus:outline-none z-50">
          {/* <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => router.push("/admin/dashboard/admins")}
                className={`w-full text-left px-4 py-2 text-sm ${
                  active ? "bg-muted" : ""
                }`}
              >
                Admins
              </button>
            )}
          </Menu.Item> */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 text-sm text-destructive ${
                  active ? "bg-muted" : ""
                }`}
              >
                Logout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </header>
  );
}
