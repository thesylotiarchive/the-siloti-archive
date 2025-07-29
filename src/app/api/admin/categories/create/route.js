import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

async function verifyAdmin(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload?.role === "ADMIN" ? payload : null;
  } catch {
    return null;
  }
}

export async function POST(req) {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, image } = body;

  if (!name) {
    return NextResponse.json({ message: "Category name is required" }, { status: 400 });
  }

  try {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ message: "Category already exists" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name, description, image },
    });

    return NextResponse.json(newCategory);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error creating category" }, { status: 500 });
  }
}
