import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "people" },
    });

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

    return NextResponse.json(foundPerson);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch person" }, { status: 500 });
  }
}
