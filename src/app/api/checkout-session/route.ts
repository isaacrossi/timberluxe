import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.sold) {
      return NextResponse.json({ error: 'This physical piece is already acquired/sold' }, { status: 400 });
    }

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const secretKey = process.env.STRIPE_SECRET_KEY;

    // Detect if we are in simulation mode (no keys or placeholder keys)
    const isPlaceholder = !secretKey || !publishableKey || 
      secretKey.includes('placeholder') || publishableKey.includes('placeholder');

    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

    if (isPlaceholder) {
      console.warn("Stripe key is missing or configured with placeholders. Entering checkout simulation mode.");
      // Return a simulated URL path that client can redirect to
      const simulatedUrl = `${baseUrl}/purchase/success?simulated=true&productId=${product.id}`;
      return NextResponse.json({ url: simulatedUrl, simulated: true });
    }

    // Initialize real Stripe
    const stripe = new Stripe(secretKey);

    // Format main image URL for Stripe (must be absolute url)
    const absoluteImageUrl = product.image.startsWith('http') 
      ? product.image 
      : `${baseUrl}${product.image}`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud', // Australian Dollars default
            product_data: {
              name: product.name,
              description: product.description,
              images: [absoluteImageUrl],
            },
            unit_amount: Math.round(product.price), // stored in cents in database
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}&productId=${product.id}`,
      cancel_url: `${baseUrl}/product/${product.id}`,
      metadata: {
        productId: product.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error", error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
