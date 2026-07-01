import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getAboutText, saveAboutText } from '@/lib/db';

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('timberluxe_admin_session');
  return session?.value === 'true';
}

export async function GET() {
  try {
    const text = await getAboutText();
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Failed to get about text", error);
    return NextResponse.json({ error: 'Failed to retrieve about text' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await request.json();
    if (typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await saveAboutText(text);
    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("Failed to save about text", error);
    return NextResponse.json({ error: 'Failed to save about text' }, { status: 500 });
  }
}
