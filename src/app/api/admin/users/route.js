// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req) {
  const user = await getUserFromRequest(req);

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ admins });
}

export async function POST(req) {
  const actor = await getUserFromRequest(req);

  if (!actor || (actor.role !== "ADMIN" && actor.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, email, name, password, role } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "username, email, and password are required" },
      { status: 400 }
    );
  }

  if (String(password).length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Only SUPERADMIN can create another SUPERADMIN
  const desiredRole =
    role === "SUPERADMIN" && actor.role === "SUPERADMIN"
      ? "SUPERADMIN"
      : "ADMIN";

  try {
    const hash = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: {
        username,
        email,
        name: name || null,
        password: hash,
        role: desiredRole,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: created.id,
          username: created.username,
          email: created.email,
          name: created.name,
          role: created.role,
          createdAt: created.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (e) {
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already in use" },
        { status: 409 }
      );
    }

    console.error("POST /api/admin/users error:", e);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
