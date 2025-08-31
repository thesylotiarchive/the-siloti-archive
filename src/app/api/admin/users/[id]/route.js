// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function PATCH(req, { params }) {
  const actor = await getUserFromRequest(req);

  if (!actor || (actor.role !== "ADMIN" && actor.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();

  try {
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // If password is being updated, hash it
    let updateData = { ...body };
    if (body.password) {
      if (String(body.password).length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    // Role changes: enforce SUPERADMIN restriction
    if (body.role) {
      const requested = String(body.role).toUpperCase();
      if (requested === "SUPERADMIN" && actor.role !== "SUPERADMIN") {
        return NextResponse.json({ error: "Only SUPERADMIN can promote to SUPERADMIN" }, { status: 403 });
      }

      // Prevent demoting the last SUPERADMIN
      if (target.role === "SUPERADMIN" && requested !== "SUPERADMIN") {
        const superadmins = await prisma.user.count({ where: { role: "SUPERADMIN" } });
        if (superadmins <= 1) {
          return NextResponse.json({ error: "Cannot demote the last SUPERADMIN" }, { status: 403 });
        }
      }

      // validate
      const allowedRoles = ["SUPERADMIN", "ADMIN", "CONTRIBUTOR", "VIEWER"];
      if (!allowedRoles.includes(requested)) {
        delete updateData.role;
      } else {
        updateData.role = requested;
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ user: updated });
  } catch (e) {
    console.error("PATCH /api/admin/users/[id] error:", e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const actor = await getUserFromRequest(req);

  if (!actor || (actor.role !== "ADMIN" && actor.role !== "SUPERADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting last SUPERADMIN
    if (target.role === "SUPERADMIN") {
      const superadmins = await prisma.user.count({ where: { role: "SUPERADMIN" } });
      if (superadmins <= 1) {
        return NextResponse.json({ error: "Cannot delete the last SUPERADMIN" }, { status: 403 });
      }
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/admin/users/[id] error:", e);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
