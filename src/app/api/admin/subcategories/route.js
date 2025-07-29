import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET() {
    try {
      const subcategories = await prisma.subCategory.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(subcategories);
    } catch (error) {
      console.error("GET /subcategories error:", error); // 🔍 Debug log
      return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
    }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, image, categoryId } = await req.json();

    const subcategory = await prisma.subCategory.create({
      data: { name, description, image, categoryId },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}
