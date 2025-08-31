// app/api/admin/users/me/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN" && user.role !== "CONTRIBUTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        name: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ me: dbUser });
  } catch (error) {
    console.error("GET /api/admin/users/me error:", error);
    return NextResponse.json({ error: "Failed to fetch current user" }, { status: 500 });
  }
}
