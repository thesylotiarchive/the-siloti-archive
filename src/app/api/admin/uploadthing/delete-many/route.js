import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { getUserFromRequest } from "@/lib/auth-helpers";

const utapi = new UTApi();

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { urls } = await req.json();
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "No urls provided" }, { status: 400 });
    }

    const keys = urls
      .filter(Boolean)
      .map((u) => {
        try {
          // utfs.io/f/<key> or uploadthing blob urls
          const parts = u.split("/");
          return parts.pop();
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (!keys.length) {
      return NextResponse.json({ error: "No valid keys" }, { status: 400 });
    }

    await utapi.deleteFiles(keys);
    return NextResponse.json({ success: true, deleted: keys.length });
  } catch (err) {
    console.error("delete-many error", err);
    return NextResponse.json({ error: "Failed to delete files" }, { status: 500 });
  }
}
