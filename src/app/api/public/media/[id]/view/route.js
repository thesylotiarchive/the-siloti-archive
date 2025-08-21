import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs"; // needed for crypto in Node runtime

function getClientIp(req) {
  // Try common proxy headers first (Vercel/Cloudflare/etc.)
  const h = req.headers;
  const cf = h.get("cf-connecting-ip");
  const xff = h.get("x-forwarded-for");
  const fly = h.get("fly-client-ip");
  const xr  = h.get("x-real-ip");

  // x-forwarded-for can be a list: client, proxy1, proxy2
  if (xff) return xff.split(",")[0].trim();
  return cf || fly || xr || "";
}

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || ""; // add a random string in env
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}

function todayKeyUTC() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export async function POST(req, { params }) {
  try {
    const mediaId = params.id;
    if (!mediaId) {
      return NextResponse.json({ error: "Missing media id" }, { status: 400 });
    }

    const ip = getClientIp(req);
    if (!ip) {
      // If we truly can’t get an IP, just don’t count (avoid inflating from server IP)
      return NextResponse.json({ counted: false, reason: "no_ip" }, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const ipHash = hashIp(ip);
    const dateDay = todayKeyUTC();

    // Try to create a unique ledger row: if it already exists, we won't increment.
    try {
      await prisma.mediaView.create({
        data: { mediaId, ipHash, dateDay },
      });

      await prisma.mediaItem.update({
        where: { id: mediaId },
        data: { views: { increment: 1 } },
      });

      return NextResponse.json(
        { counted: true },
        { headers: { "Cache-Control": "no-store" } }
      );
    } catch (e) {
      // P2002 = unique constraint violation => already counted today
      if (e?.code === "P2002") {
        return NextResponse.json(
          { counted: false, reason: "already_counted" },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
      throw e;
    }
  } catch (err) {
    console.error("View count error:", err);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
