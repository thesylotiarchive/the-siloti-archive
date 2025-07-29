"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [user, setUser] = useState(null);

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

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="w-full border-b px-4 md:px-8 py-3 bg-background flex items-center justify-between">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user?.avatarUrl} alt={user?.username} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">
          {user?.username || "Loading..."}
        </span>
      </div>
    </header>
  );
}
