// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/lib/auth-helpers";

const SELECT_FIELDS = {
  id: true,
  username: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET(req) {
  const actor = await getUserFromRequest(req);
  if (!actor || (actor.role !== "ADMIN" && actor.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const roleParam = url.searchParams.get("role");

  try {
    // Legacy: no role param -> return admins (old behaviour)
    if (!roleParam) {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        orderBy: { createdAt: "desc" },
        select: SELECT_FIELDS,
      });
      return NextResponse.json({ admins, users: admins });
    }

    const key = String(roleParam).toLowerCase();
    let users;

    if (key === "admins" || key === "admin") {
      // "admins" tab returns both ADMIN and SUPERADMIN
      users = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
        orderBy: { createdAt: "desc" },
        select: SELECT_FIELDS,
      });
    } else if (key === "contributors" || key === "contributor") {
      users = await prisma.user.findMany({
        where: { role: "CONTRIBUTOR" },
        orderBy: { createdAt: "desc" },
        select: SELECT_FIELDS,
      });
    } else if (key === "viewers" || key === "viewer") {
      users = await prisma.user.findMany({
        where: { role: "VIEWER" },
        orderBy: { createdAt: "desc" },
        select: SELECT_FIELDS,
      });
    } else if (key === "all") {
      users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: SELECT_FIELDS,
      });
    } else {
      // fallback: treat roleParam as exact role name (uppercase)
      const roleUpper = String(roleParam).toUpperCase();
      users = await prisma.user.findMany({
        where: { role: roleUpper },
        orderBy: { createdAt: "desc" },
        select: SELECT_FIELDS,
      });
    }

    return NextResponse.json({ users });
  } catch (e) {
    console.error("GET /api/admin/users error:", e);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req) {
  const actor = await getUserFromRequest(req);

  if (!actor || (actor.role !== "ADMIN" && actor.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { username, email, name, password } = body;
  let { role } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: "username, email, and password are required" }, { status: 400 });
  }

  if (String(password).length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  // Normalize role
  role = role ? String(role).toUpperCase() : "ADMIN";
  const allowedRoles = ["SUPERADMIN", "ADMIN", "CONTRIBUTOR", "VIEWER"];

  if (!allowedRoles.includes(role)) {
    role = "ADMIN";
  }

  // Only SUPERADMIN can create SUPERADMIN
  if (role === "SUPERADMIN" && actor.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Only SUPERADMIN can create SUPERADMIN" }, { status: 403 });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: {
        username,
        email,
        name: name || null,
        password: hash,
        role,
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
      return NextResponse.json({ error: "Username or email already in use" }, { status: 409 });
    }
    console.error("POST /api/admin/users error:", e);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
