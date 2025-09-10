import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
      where: { slug },
    });

    // console.log("Fetched page:", page);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page, { status: 200 }); // ✅ ensures JSON
  } catch (error) {
    console.error("Page API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
