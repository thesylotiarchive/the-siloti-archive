import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'syloti_super_secret';

export async function PUT(req) {
  try {
    const cookies = req.headers.get('cookie');
    if (!cookies) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const { token } = cookie.parse(cookies || '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const body = await req.json();
    const { name, email, avatarUrl, currentPassword, newPassword } = body;

    // Build update object
    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return new Response(JSON.stringify({ error: 'Name cannot be empty' }), { status: 400 });
      }
      updateData.name = name;
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    let emailChanged = false;
    if (email && email !== user.email) {
      if (!email.trim()) {
        return new Response(JSON.stringify({ error: 'Email cannot be empty' }), { status: 400 });
      }
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return new Response(JSON.stringify({ error: 'Email is already in use by another account' }), { status: 400 });
      }
      updateData.email = email;
      emailChanged = true;
    }

    if (newPassword) {
      if (!currentPassword) {
        return new Response(JSON.stringify({ error: 'Current password is required to set a new password' }), { status: 400 });
      }
      const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatch) {
        return new Response(JSON.stringify({ error: 'Incorrect current password' }), { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Perform database update
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const headers = new Headers();
    if (emailChanged) {
      // Generate fresh JWT token
      const newToken = jwt.sign(
        {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set cookie
      headers.append(
        'Set-Cookie',
        cookie.serialize('token', newToken, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          avatarUrl: updatedUser.avatarUrl,
        },
      }),
      {
        status: 200,
        headers,
      }
    );

  } catch (err) {
    console.error('❌ Profile update error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
