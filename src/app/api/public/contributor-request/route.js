import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const request = await prisma.contributorRequest.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ request });
  } catch (err) {
    console.error("GET /api/public/contributor-request error", err);
    return NextResponse.json({ error: "Failed to fetch request status" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "VIEWER") {
      return NextResponse.json({ error: "You are already a contributor or administrator" }, { status: 400 });
    }

    // Check for existing pending request
    const pendingRequest = await prisma.contributorRequest.findFirst({
      where: {
        userId: user.id,
        status: "PENDING",
      },
    });

    if (pendingRequest) {
      return NextResponse.json({ error: "You already have a pending contributor request" }, { status: 400 });
    }

    const body = await req.json();
    const { message } = body;

    const created = await prisma.contributorRequest.create({
      data: {
        userId: user.id,
        message: message || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, request: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/public/contributor-request error", err);
    return NextResponse.json({ error: "Failed to submit contributor request" }, { status: 500 });
  }
}
