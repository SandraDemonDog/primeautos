import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export const POST = async () => {
  const expiredCookie = serialize('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: -1, 
  });

  return NextResponse.json(
    { success: true, message: 'Sesión cerrada exitosamente.' },
    { status: 200, headers: { 'Set-Cookie': expiredCookie } }
  );
};
