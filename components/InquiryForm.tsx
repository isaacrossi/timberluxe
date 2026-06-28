"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function InquiryForm() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill message if product query parameter is provided
  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam) {
      const productNames: { [key: string]: string } = {
        "burl-plum-board": "Burl & Plum Board",
        "charcoal-serving-board": "Charcoal Serving Board",
        "teal-river-plank": "Teal River Plank",
      };
      const name = productNames[productParam];
      if (name) {
        setMessage(`I would like to inquire about acquiring the ${name}. `);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Simulate form submission
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 md:p-8 border border-stone-900/10 bg-stone-900/[0.02] animate-airy-fade-in">
        <span className="text-stone-900 text-3xl font-serif mb-4">✓</span>
        <h3 className="font-serif font-light text-2xl text-stone-900 tracking-wide">
          Inquiry Received
        </h3>
        <p className="text-stone-600 text-xs md:text-sm font-light leading-relaxed mt-3 max-w-sm">
          Thank you for your interest in Timberluxe. Our atelier team will review your inquiry and connect with you within 24 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
          className="mt-6 text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold hover:text-stone-900 transition-colors underline cursor-pointer"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md mx-auto">
      {/* Name Input */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold mb-1 block">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Julian Croft"
          className="w-full bg-stone-900/5 border border-stone-900/10 focus:border-stone-900/40 focus:outline-none p-3 text-xs md:text-sm font-light text-stone-900 transition-colors"
        />
      </div>

      {/* Email Input */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold mb-1 block">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E.g., julian@example.com"
          className="w-full bg-stone-900/5 border border-stone-900/10 focus:border-stone-900/40 focus:outline-none p-3 text-xs md:text-sm font-light text-stone-900 transition-colors"
        />
      </div>

      {/* Message Textarea */}
      <div className="flex flex-col">
        <label htmlFor="message" className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold mb-1 block">
          Message / Commission Brief
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Detail your request, sizing preferences, or design ideas..."
          className="w-full bg-stone-900/5 border border-stone-900/10 focus:border-stone-900/40 focus:outline-none p-3 text-xs md:text-sm font-light text-stone-900 transition-colors resize-y min-h-[80px]"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="h-12 w-full mt-2 flex items-center justify-center bg-stone-900 text-stone-100 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-stone-800 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:scale-[1.01] cursor-pointer rounded-full"
      >
        Submit Inquiry
      </button>
    </form>
  );
}
