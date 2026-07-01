import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('timberluxe_admin_session');
  return session?.value === 'true';
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file data to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename and make it unique
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${Date.now()}-${cleanFileName}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Save file
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

