import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/db';

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('timberluxe_admin_session');
  return session?.value === 'true';
}

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to get products", error);
    return NextResponse.json({ error: 'Failed to retrieve products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await request.json();
    if (!product.id || !product.name || !product.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert price to number if it is sent as string
    if (typeof product.price === 'string') {
      product.price = parseFloat(product.price.replace(/[^\d.]/g, '')) || 0;
    }

    await saveProduct(product);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Failed to save product", error);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}
