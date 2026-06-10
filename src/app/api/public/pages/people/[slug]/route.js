import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedData } from "@/lib/cache";

export async function GET(req, { params }) {
  try {
    const { slug: id } = await params;

    const page = await getCachedData("page:people", async () => {
      return await prisma.page.findUnique({
        where: { slug: "people" },
      });
    }, 3600); // 1 hour TTL

    if (!page) {
      return NextResponse.json({ error: "People page not found" }, { status: 404 });
    }

    // Parse sections JSON
    const sections = page.sections;
    let foundPerson = null;

    // Loop through sections to find the person
    for (const section of sections.sections) {
      const person = section.people.find((p) => p.id === id);
      if (person) {
        foundPerson = { ...person, sectionTitle: section.title };
        break;
      }
    }

    if (!foundPerson) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    const telemetry = page?._cacheTelemetry;
    return NextResponse.json(foundPerson, {
      headers: {
        "x-cache-log": telemetry ? encodeURIComponent(telemetry) : ""
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch person" }, { status: 500 });
  }
}
