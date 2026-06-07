import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invalidateCache } from "@/lib/cache";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    return NextResponse.json(page, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { slug } = await params;
    const body = await req.json(); // expected { title, sections }

    const updatedPage = await prisma.page.update({
      where: { slug },
      data: {
        title: body.title,
        sections: body.sections,
      },
    });

    // Invalidate the cache for this page
    await invalidateCache(`page:${slug}`);

    return NextResponse.json(updatedPage, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
