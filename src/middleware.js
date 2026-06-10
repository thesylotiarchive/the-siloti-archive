import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/api/auth/",
  "/api/auth/login",
  "/api/auth/signup",
];

const authRequiredPaths = ["/submit", "/dashboard"];

const adminPagePaths = ["/admin"];
const adminApiPaths = ["/api/admin"];

async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const user = token ? await verifyJWT(token) : null;

  // 🔹 Protect regular user-only pages
  if (authRequiredPaths.some((path) => pathname.startsWith(path))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🔹 Protect ADMIN PAGES (/admin/*)
  if (adminPagePaths.some((path) => pathname.startsWith(path))) {
    if (pathname !== "/admin/login") {
      if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
  }

  // 🔹 Protect ADMIN API routes (/api/admin/*) → return JSON instead of redirect
  if (adminApiPaths.some((path) => pathname.startsWith(path))) {
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/submit",
    "/dashboard",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
