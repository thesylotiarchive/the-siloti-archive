import * as cookie from 'cookie';

export async function POST() {
  const headers = new Headers();

  headers.append(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0), // Expire immediately
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  );

  return new Response(
    JSON.stringify({ message: 'Logged out successfully' }),
    { status: 200, headers }
  );
}


