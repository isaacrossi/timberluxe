"use client";

interface StudioInfoTabProps {
  aboutText: string;
  setAboutText: (text: string) => void;
  savingInfo: boolean;
  infoMessage: { text: string; type: string };
  handleSaveAbout: () => Promise<void>;
}

export default function StudioInfoTab({
  aboutText,
  setAboutText,
  savingInfo,
  infoMessage,
  handleSaveAbout,
}: StudioInfoTabProps) {
  return (
    <div className="max-w-3xl flex flex-col gap-6 bg-[#161619] border border-stone-850 p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl text-stone-100 font-light">
          Edit Studio Description
        </h2>
        <p className="text-stone-400 text-xs font-light leading-relaxed">
          This is the main block of text displayed in the
          &quot;About&quot; section on the homepage. Keep it
          storytelling-focused and atmospheric.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          placeholder="Write studio narrative..."
          rows={6}
          className="w-full p-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm leading-relaxed"
        />
        <div className="text-[10px] text-stone-500 self-end">
          {aboutText.length} characters
        </div>
      </div>

      {infoMessage.text && (
        <div
          className={`p-4 text-xs uppercase tracking-wider rounded border ${
            infoMessage.type === "success"
              ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
              : "bg-red-950/20 border-red-900/30 text-red-400"
          }`}
        >
          {infoMessage.text}
        </div>
      )}

      <button
        onClick={handleSaveAbout}
        disabled={savingInfo}
        className="h-11 px-8 rounded-full bg-stone-200 text-stone-950 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 self-start"
      >
        {savingInfo ? (
          <>
            <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          "Save Description"
        )}
      </button>
    </div>
  );
}
