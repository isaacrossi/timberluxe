import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (password === correctPassword) {
      const cookieStore = await cookies();
      cookieStore.set('timberluxe_admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
  } catch (error) {
    console.error("Admin verification error", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
