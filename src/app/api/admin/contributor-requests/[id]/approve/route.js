import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-helpers";

export async function POST(req, { params }) {
  try {
    const actor = await getUserFromRequest(req);
    if (!actor || (actor.role !== "ADMIN" && actor.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const { feedback } = body;

    const request = await prisma.contributorRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.status !== "PENDING") {
      return NextResponse.json({ error: "Request has already been processed" }, { status: 400 });
    }

    // Run updates in a Prisma Transaction
    await prisma.$transaction([
      // 1. Update contributor request status
      prisma.contributorRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          feedback: feedback || "Your request has been approved by the administrators.",
        },
      }),
      // 2. Promote user role
      prisma.user.update({
        where: { id: request.userId },
        data: { role: "CONTRIBUTOR" },
      }),
      // 3. Create Notification for the user
      prisma.notification.create({
        data: {
          userId: request.userId,
          title: "Promoted to Contributor",
          message: "You're promoted as a CONTRIBUTOR and you can contribute now!.",
          link: "/submit",
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/admin/contributor-requests/[id]/approve error", err);
    return NextResponse.json({ error: "Failed to approve request" }, { status: 500 });
  }
}
