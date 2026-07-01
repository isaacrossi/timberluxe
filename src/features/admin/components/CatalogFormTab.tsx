"use client";

import Image from "next/image";
import { Product, ProductSpec, ProductMedia } from "@/lib/db";
import { EditingProduct } from "../hooks/useAdminDashboard";

interface CatalogFormTabProps {
  products: Product[];
  editingProduct: EditingProduct;
  setEditingProduct: React.Dispatch<React.SetStateAction<EditingProduct | null>>;
  formSpecs: ProductSpec[];
  formMedia: ProductMedia[];
  uploadingFile: string | null;
  savingProduct: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleNameChange: (name: string) => void;
  handleAddSpec: () => void;
  handleUpdateSpec: (idx: number, field: "label" | "value", val: string) => void;
  handleRemoveSpec: (idx: number) => void;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "main" | "gallery"
  ) => Promise<void>;
  handleRemoveMedia: (idx: number) => void;
  handleSaveProduct: (e: React.FormEvent) => Promise<void>;
}

export default function CatalogFormTab({
  products,
  editingProduct,
  setEditingProduct,
  formSpecs,
  formMedia,
  uploadingFile,
  savingProduct,
  setIsEditing,
  handleNameChange,
  handleAddSpec,
  handleUpdateSpec,
  handleRemoveSpec,
  handleFileUpload,
  handleRemoveMedia,
  handleSaveProduct,
}: CatalogFormTabProps) {
  const isExisting = products.some((p) => p.id === editingProduct.id);

  return (
    <form
      onSubmit={handleSaveProduct}
      className="max-w-4xl w-full flex flex-col gap-8 bg-[#161619] border border-stone-850 p-6 md:p-8"
    >
      <div className="flex items-center justify-between border-b border-stone-850 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl text-stone-100 font-light">
            {isExisting ? "Edit Physical Work" : "Create New Work"}
          </h2>
          <p className="text-stone-400 text-xs font-light">
            Specify details, specifications, images, and videos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setEditingProduct(null);
          }}
          className="text-[10px] uppercase tracking-[0.15em] text-stone-400 hover:text-stone-200 transition-colors font-bold cursor-pointer"
        >
          Back to Catalog
        </button>
      </div>

      {/* Grid of Core Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
            Product Name <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            value={editingProduct.name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Amber Burl Table"
            required
            className="w-full h-11 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm"
          />
        </div>

        {/* Slug / Unique ID */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold flex items-center gap-1.5">
            Slug / Unique ID <span className="text-amber-500">*</span>
            <span className="text-[9px] text-stone-500 capitalize font-normal">
              (Used in URL path)
            </span>
          </label>
          <input
            type="text"
            value={editingProduct.id || ""}
            onChange={(e) =>
              setEditingProduct((prev) => (prev ? { ...prev, id: e.target.value } : null))
            }
            placeholder="e.g. amber-burl-table"
            required
            disabled={isExisting} // Cannot change ID once created
            className="w-full h-11 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed font-mono"
          />
        </div>

        {/* Price ($ AUD) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
            Price ($ AUD) <span className="text-amber-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={editingProduct.price ?? ""}
            onChange={(e) =>
              setEditingProduct((prev) => (prev ? { ...prev, price: e.target.value } : null))
            }
            placeholder="e.g. 450"
            required
            className="w-full h-11 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm"
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
            Subtitle (Materials Tag)
          </label>
          <input
            type="text"
            value={editingProduct.subtitle || ""}
            onChange={(e) =>
              setEditingProduct((prev) => (prev ? { ...prev, subtitle: e.target.value } : null))
            }
            placeholder="e.g. 04 / English Oak & Amber Resin"
            className="w-full h-11 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm"
          />
        </div>

        {/* Sold Status */}
        <div className="flex flex-col justify-center pt-2 md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer select-none text-stone-300">
            <input
              type="checkbox"
              checked={editingProduct.sold || false}
              onChange={(e) =>
                setEditingProduct((prev) => (prev ? { ...prev, sold: e.target.checked } : null))
              }
              className="w-5 h-5 rounded border border-stone-800 bg-stone-900 checked:bg-amber-500 text-amber-500 focus:ring-0 outline-none accent-amber-500 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.1em] font-semibold">
                Mark Piece as Sold
              </span>
              <span className="text-[9px] text-stone-500">
                Hides the purchase button and displays &quot;Sold&quot; overlay.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5 border-t border-stone-850 pt-6">
        <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
          Description
        </label>
        <textarea
          value={editingProduct.description || ""}
          onChange={(e) =>
            setEditingProduct((prev) => (prev ? { ...prev, description: e.target.value } : null))
          }
          placeholder="Write a storytelling description for the collectors..."
          rows={4}
          className="w-full p-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm leading-relaxed"
        />
      </div>

      {/* Specifications */}
      <div className="flex flex-col gap-4 border-t border-stone-850 pt-6">
        <div className="flex justify-between items-center">
          <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
            Product Specifications
          </label>
          <button
            type="button"
            onClick={handleAddSpec}
            className="text-[10px] uppercase tracking-[0.15em] text-amber-500 hover:text-amber-400 font-semibold transition-colors cursor-pointer"
          >
            + Add Spec Row
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {formSpecs.map((spec, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => handleUpdateSpec(index, "label", e.target.value)}
                placeholder="Label (e.g. Timber)"
                className="flex-1 h-10 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/30 text-stone-200 outline-none text-xs uppercase tracking-wider font-semibold"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleUpdateSpec(index, "value", e.target.value)}
                placeholder="Value (e.g. English Burr Oak)"
                className="flex-2 h-10 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/30 text-stone-200 outline-none text-xs"
              />
              <button
                type="button"
                onClick={() => handleRemoveSpec(index)}
                className="text-stone-500 hover:text-red-500 transition-colors p-1 cursor-pointer"
                title="Remove specification"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                  <path
                    fillRule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3h11V2h-11v1z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Media Upload (Main Cover Image) */}
      <div className="flex flex-col gap-4 border-t border-stone-850 pt-6">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
            Main Cover Image
          </label>
          <p className="text-stone-500 text-[10px] leading-relaxed">
            The primary thumbnail displayed in the catalog grid and at the top of the product page.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative aspect-[4/3] w-48 bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center text-xs text-stone-600 uppercase tracking-widest shrink-0">
            {editingProduct.image ? (
              <Image
                src={editingProduct.image}
                alt={editingProduct.alt || ""}
                fill
                sizes="192px"
                className="object-cover"
              />
            ) : (
              "No Image"
            )}
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <label className="h-10 px-4 flex items-center justify-center rounded border border-stone-750 bg-stone-800 text-stone-200 text-xs font-semibold cursor-pointer hover:bg-stone-750 transition-colors uppercase tracking-widest disabled:opacity-50">
                {uploadingFile === "main" ? "Uploading..." : "Choose File"}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingFile !== null}
                  onChange={(e) => handleFileUpload(e, "main")}
                  className="hidden"
                />
              </label>
              {editingProduct.image && (
                <span className="text-[10px] font-mono text-stone-500 break-all select-all">
                  {editingProduct.image}
                </span>
              )}
            </div>
            <input
              type="text"
              value={editingProduct.alt || ""}
              onChange={(e) =>
                setEditingProduct((prev) => (prev ? { ...prev, alt: e.target.value } : null))
              }
              placeholder="Image alt description (for screen readers and SEO)"
              className="w-full h-10 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/30 text-stone-200 outline-none text-xs"
            />
          </div>
        </div>
      </div>

      {/* Media Gallery Section */}
      <div className="flex flex-col gap-4 border-t border-stone-850 pt-6">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
              Product Page Media Gallery (Images & Videos)
            </label>
            <label className="text-[10px] uppercase tracking-[0.15em] text-amber-500 hover:text-amber-400 font-semibold cursor-pointer transition-colors disabled:opacity-50">
              {uploadingFile === "gallery" ? "Uploading Media..." : "+ Add Media Assets"}
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                disabled={uploadingFile !== null}
                onChange={(e) => handleFileUpload(e, "gallery")}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-stone-500 text-[10px] leading-relaxed">
            Upload supplementary images or short showcase videos to be displayed in the dynamic media grid on the product&apos;s details page.
          </p>
        </div>

        {formMedia.length === 0 ? (
          <div className="w-full border border-dashed border-stone-800 p-8 text-center text-stone-600 text-xs uppercase tracking-widest">
            No additional media. Click &quot;+ Add Media Assets&quot; to upload images or videos.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formMedia.map((media, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] border border-stone-800 bg-stone-950 group overflow-hidden"
              >
                {media.type === "video" ? (
                  <video
                    src={media.url}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={media.url}
                    alt={media.alt || ""}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 200px"
                    className="object-cover"
                  />
                )}

                {/* Video indicator badge */}
                {media.type === "video" && (
                  <div className="absolute top-2 left-2 bg-stone-950/80 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider text-amber-500 font-bold border border-amber-500/20">
                    Video
                  </div>
                )}

                {/* Delete Overlay */}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(idx)}
                  className="absolute inset-0 bg-red-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 text-red-200 text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form actions */}
      <div className="flex gap-4 border-t border-stone-850 pt-6 mt-4">
        <button
          type="submit"
          disabled={savingProduct || uploadingFile !== null}
          className="h-11 px-8 rounded-full bg-stone-200 text-stone-950 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-white transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {savingProduct ? (
            <>
              <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              Saving Product...
            </>
          ) : (
            "Save Product"
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setEditingProduct(null);
          }}
          className="h-11 px-8 rounded-full border border-stone-850 text-stone-400 font-semibold text-xs uppercase tracking-[0.15em] hover:border-stone-700 hover:text-stone-300 transition-all duration-300 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
