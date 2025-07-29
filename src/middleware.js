import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/', '/login', '/api/auth/', '/api/auth/login', '/api/auth/signup'];

const authRequiredPaths = [
  '/submit',
  '/dashboard',
];

const adminOnlyPaths = [
  '/admin',
  '/api/admin',
];

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
  const token = req.cookies.get('token')?.value;

  const user = token ? await verifyJWT(token) : null;

  // Redirect unauthenticated users from protected pages
  if (authRequiredPaths.some((path) => pathname.startsWith(path))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Restrict admin-only paths
  if (
    adminOnlyPaths.some((path) => pathname.startsWith(path)) &&
    pathname !== '/admin/login'
  ) {
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/submit', '/dashboard', '/admin/:path*', '/api/admin/:path*'],
};
