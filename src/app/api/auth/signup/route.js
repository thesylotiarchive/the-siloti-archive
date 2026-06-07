import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, username, email, password, avatarUrl } = body;

    if (!name || !username || !email || !password) {
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

    const defaultAvatars = [
      "avatar-b3pecmvkyo.svg",
      "avatar-gmpcrnhlbo (1).svg",
      "avatar-gmpcrnhlbo.svg",
      "avatar-ixjd8yjzux (1).svg",
      "avatar-ixjd8yjzux.svg",
      "avatar-naezrfctlz (1).svg",
      "avatar-naezrfctlz (2).svg",
      "avatar-naezrfctlz.svg",
      "avatar-nxdqw8tyon (1).svg",
      "avatar-nxdqw8tyon (2).svg",
      "avatar-nxdqw8tyon.svg",
      "avatar-ut5pkxey8b.svg",
      "avatar-x7kv7ded8n (1).svg",
      "avatar-x7kv7ded8n.svg",
      "avatar-znwxkkstkw.svg"
    ];
    
    const finalAvatarUrl = avatarUrl || `/svg_profiles/${defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]}`;

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        avatarUrl: finalAvatarUrl,
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
          avatarUrl: newUser.avatarUrl,
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
