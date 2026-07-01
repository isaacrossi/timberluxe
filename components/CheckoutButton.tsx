"use client";

import { useState } from 'react';

interface CheckoutButtonProps {
  productId: string;
}

export default function CheckoutButton({ productId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to initiate purchase');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred during checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="h-12 px-8 flex items-center justify-center rounded-full bg-stone-900 text-stone-100 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-stone-800 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 cursor-pointer"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-stone-100 border-t-transparent rounded-full animate-spin" />
          Acquiring...
        </>
      ) : (
        "Purchase Work"
      )}
    </button>
  );
}
