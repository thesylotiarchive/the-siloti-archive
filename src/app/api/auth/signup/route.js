import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
        
        return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
        return new Response(JSON.stringify({ error: 'Username already taken' }), { status: 400 });
    }


    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'VIEWER',
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Signup successful',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}
