import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  const { id } = params;
  const { name, description, image } = await req.json();

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name, description, image },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ message: "Failed to update category" }, { status: 500 });
  }
}
