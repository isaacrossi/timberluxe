import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { deleteProduct } from '@/lib/db';

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('timberluxe_admin_session');
  return session?.value === 'true';
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteProduct(id);

    if (deleted) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  } catch (error) {
    console.error("Failed to delete product", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
