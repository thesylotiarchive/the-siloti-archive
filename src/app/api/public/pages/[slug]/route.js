import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedData } from "@/lib/cache";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    const page = await getCachedData(`page:${slug}`, async () => {
      return await prisma.page.findUnique({
        where: { slug },
      });
    }, 3600); // 1 hour TTL

    // console.log("Fetched page:", page);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const telemetry = page?._cacheTelemetry;
    return NextResponse.json(page, {
      status: 200,
      headers: {
        "x-cache-log": telemetry ? encodeURIComponent(telemetry) : ""
      }
    });
  } catch (error) {
    console.error("Page API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
