"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.reload();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-semibold">
          Enter Admin Passcode
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
          className="w-full h-12 px-4 bg-stone-900 border border-stone-800 text-stone-100 rounded-md focus:border-amber-500/50 outline-none transition-all duration-300 font-mono text-center text-lg tracking-[0.2em]"
        />
      </div>

      {error && (
        <span className="text-[10px] text-red-400 text-center tracking-wider uppercase font-semibold">
          {error}
        </span>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full mt-2 rounded-full bg-stone-200 text-stone-950 font-semibold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 hover:scale-[1.01] flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Access Dashboard"
        )}
      </button>
    </form>
  );
}
