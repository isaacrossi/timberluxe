"use client";

interface DashboardHeaderProps {
  handleLogout: () => Promise<void>;
}

export default function DashboardHeader({ handleLogout }: DashboardHeaderProps) {
  return (
    <header className="w-full border-b border-stone-800 bg-[#161619]/90 backdrop-blur-md px-6 md:px-8 py-5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <span className="font-serif tracking-[0.2em] text-sm md:text-base font-bold text-stone-100">
          TIMBERLUXE ADMIN
        </span>
        <span className="text-[9px] px-2 py-0.5 rounded border border-amber-500/30 text-amber-500 uppercase tracking-widest font-semibold font-mono">
          CMS Panel
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-[10px] uppercase tracking-[0.15em] text-stone-400 hover:text-stone-100 transition-colors font-semibold cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
