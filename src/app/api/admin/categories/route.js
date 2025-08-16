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

    const role = payload?.role;
    return role === "ADMIN" || role === "SUPERADMIN" ? payload : null;
  } catch (err) {
    return null;
  }
}

export async function GET(req) {
  const user = await verifyAdmin(req);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching categories" }, { status: 500 });
  }
}
