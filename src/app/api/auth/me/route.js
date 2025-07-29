import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const cookies = req.headers.get('cookie');
    if (!cookies) {
      return new Response(JSON.stringify({ error: 'No session found' }), { status: 401 });
    }

    const { token } = cookie.parse(cookies || '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        name: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error('Error verifying session:', err);
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
    });
  }
}


