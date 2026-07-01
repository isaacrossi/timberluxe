"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, ProductSpec, ProductMedia } from "@/lib/products";
import { toCurrencyFromCent, toCent, fromCent } from "@/lib/currency";

interface AdminDashboardClientProps {
  initialProducts: Product[];
  initialAboutText: string;
}

export default function AdminDashboardClient({
  initialProducts,
  initialAboutText,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"info" | "catalog">("catalog");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [aboutText, setAboutText] = useState<string>(initialAboutText);

  // Info Save State
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ text: "", type: "success" });

  // Catalog Form / Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null,
  );
  const [formSpecs, setFormSpecs] = useState<ProductSpec[]>([]);
  const [formMedia, setFormMedia] = useState<ProductMedia[]>([]);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null); // 'main' | 'gallery' | null
  const [savingProduct, setSavingProduct] = useState(false);

  // LOGOUT
  const handleLogout = async () => {
    // Clear cookie by requesting verification with empty details, or just expire cookie client-side
    document.cookie =
      "timberluxe_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  // ABOUT SAVE
  const handleSaveAbout = async () => {
    setSavingInfo(true);
    setInfoMessage({ text: "", type: "success" });
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aboutText }),
      });
      if (res.ok) {
        setInfoMessage({
          text: "Studio description saved successfully.",
          type: "success",
        });
      } else {
        const d = await res.json();
        setInfoMessage({
          text: d.error || "Failed to save description.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setInfoMessage({ text: "Connection error.", type: "error" });
    } finally {
      setSavingInfo(false);
    }
  };

  // PRODUCT EDIT TRIGGER
  const handleEditProduct = (product: Product) => {
    setEditingProduct({
      ...product,
      price: fromCent(Number(product.price)),
    });
    setFormSpecs([...product.specs]);
    setFormMedia([...(product.media || [])]);
    setIsEditing(true);
  };

  // PRODUCT CREATE TRIGGER
  const handleCreateProduct = () => {
    setEditingProduct({
      id: "",
      name: "",
      price: "",
      subtitle: "",
      description: "",
      image: "",
      alt: "",
      specs: [
        { label: "Timber", value: "" },
        { label: "Resin", value: "" },
        { label: "Dimensions", value: "" },
        { label: "Finish", value: "" },
      ],
      media: [],
      sold: false,
    });
    setFormSpecs([
      { label: "Timber", value: "" },
      { label: "Resin", value: "" },
      { label: "Dimensions", value: "" },
      { label: "Finish", value: "" },
    ]);
    setFormMedia([]);
    setIsEditing(true);
  };

  // AUTO SLUGGIFY ID
  const handleNameChange = (name: string) => {
    if (!editingProduct) return;
    const updates: Partial<Product> = { name };
    // Only auto-generate ID if we are creating a new product
    const isNew = products.findIndex((p) => p.id === editingProduct.id) === -1;
    if (isNew) {
      updates.id = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    setEditingProduct((prev) => ({ ...prev, ...updates }));
  };

  // SPEC HANDLERS
  const handleAddSpec = () => {
    setFormSpecs([...formSpecs, { label: "", value: "" }]);
  };

  const handleUpdateSpec = (
    idx: number,
    field: "label" | "value",
    val: string,
  ) => {
    const updated = [...formSpecs];
    updated[idx][field] = val;
    setFormSpecs(updated);
  };

  const handleRemoveSpec = (idx: number) => {
    const updated = [...formSpecs];
    updated.splice(idx, 1);
    setFormSpecs(updated);
  };

  // FILE UPLOAD HANDLING
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "main" | "gallery",
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(target);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (target === "main") {
            setEditingProduct((prev) => ({
              ...prev,
              image: data.url,
              alt: prev?.alt || prev?.name || "Product Image",
            }));
            // Break loop since main image only allows one file
            break;
          } else {
            const isVideo = file.type.startsWith("video/");
            const newMediaItem: ProductMedia = {
              type: isVideo ? "video" : "image",
              url: data.url,
              alt: file.name,
            };
            setFormMedia((prev) => [...prev, newMediaItem]);
          }
        } else {
          alert(`Failed to upload file ${file.name}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploadingFile(null);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveMedia = (idx: number) => {
    const updated = [...formMedia];
    updated.splice(idx, 1);
    setFormMedia(updated);
  };

  // PRODUCT SAVE
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingProduct ||
      !editingProduct.id ||
      !editingProduct.name ||
      !editingProduct.price
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    setSavingProduct(true);
    const cleanedProduct: Product = {
      id: editingProduct.id,
      name: editingProduct.name,
      price: toCent(Number(editingProduct.price)),
      subtitle: editingProduct.subtitle || "",
      description: editingProduct.description || "",
      image: editingProduct.image || "",
      alt: editingProduct.alt || "",
      specs: formSpecs.filter((s) => s.label.trim() !== ""),
      media: formMedia,
      sold: !!editingProduct.sold,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedProduct),
      });

      if (res.ok) {
        // Update local state
        const index = products.findIndex((p) => p.id === cleanedProduct.id);
        if (index >= 0) {
          const updated = [...products];
          updated[index] = cleanedProduct;
          setProducts(updated);
        } else {
          setProducts([...products, cleanedProduct]);
        }
        setIsEditing(false);
        setEditingProduct(null);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error saving product.");
    } finally {
      setSavingProduct(false);
    }
  };

  // PRODUCT DELETE
  const handleDeleteProduct = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this piece? This action is permanent.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121214] text-stone-200 font-sans flex flex-col">
      {/* CMS Header */}
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
            className="text-[10px] uppercase tracking-[0.15em] text-stone-400 hover:text-stone-100 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-850 gap-8">
          <button
            onClick={() => {
              setActiveTab("catalog");
              setIsEditing(false);
            }}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 relative ${
              activeTab === "catalog"
                ? "text-amber-500"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Works Catalog ({products.length})
            {activeTab === "catalog" && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("info");
              setIsEditing(false);
            }}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 relative ${
              activeTab === "info"
                ? "text-amber-500"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Studio Info
            {activeTab === "info" && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-500" />
            )}
          </button>
        </div>

        {/* TAB: STUDIO INFO */}
        {activeTab === "info" && (
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

            <div className="flex flex-col gap-2 mt-2">
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={6}
                className="w-full p-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 font-serif font-light text-base md:text-lg tracking-wide leading-relaxed outline-none transition-colors"
              />
              <div className="flex justify-between items-center text-[10px] text-stone-500 uppercase tracking-widest mt-1">
                <span>Character Count: {aboutText.length}</span>
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
              className="h-11 px-6 w-fit rounded-full bg-stone-200 text-stone-950 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingInfo ? (
                <>
                  <span className="w-4.5 h-4.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}

        {/* TAB: CATALOG LIST */}
        {activeTab === "catalog" && !isEditing && (
          <div className="flex flex-col gap-6">
            <div className="w-full flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-2xl text-stone-100 font-light">
                  Product Catalog
                </h2>
                <p className="text-stone-400 text-xs font-light">
                  Manage the physical works available for sale or display.
                </p>
              </div>
              <button
                onClick={handleCreateProduct}
                className="h-11 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>+ Create New Work</span>
              </button>
            </div>

            {products.length === 0 ? (
              <div className="w-full border border-stone-850 p-12 text-center text-stone-500 text-sm font-light">
                No items in catalog. Click &quot;+ Create New Work&quot; to add
                your first piece.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    className="border border-stone-850 bg-[#161619] flex flex-col justify-between overflow-hidden group hover:border-stone-800 transition-colors"
                  >
                    <div className="relative aspect-[4/3] w-full bg-stone-900 overflow-hidden border-b border-stone-850">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={idx < 2}
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-stone-600 uppercase tracking-widest bg-stone-950">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col gap-4 flex-1 justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-sans font-light text-stone-100 text-base tracking-wide">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-amber-500 text-sm font-semibold">
                              {toCurrencyFromCent(Number(product.price))}
                            </span>
                            {product.sold && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded border border-red-500/30 bg-red-950/20 text-red-400 font-bold uppercase tracking-wider font-mono">
                                Sold
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold">
                          {product.subtitle}
                        </span>
                        <p className="text-stone-400 text-xs font-light leading-relaxed mt-2 line-clamp-2 italic">
                          &quot;{product.description}&quot;
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-stone-850/50 mt-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 h-9 rounded-md bg-stone-800 hover:bg-stone-750 text-stone-200 text-[10px] uppercase tracking-[0.15em] font-semibold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 h-9 rounded-md border border-red-950 text-red-500 hover:bg-red-950/20 text-[10px] uppercase tracking-[0.15em] font-semibold transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: CATALOG ADD / EDIT FORM */}
        {activeTab === "catalog" && isEditing && editingProduct && (
          <form
            onSubmit={handleSaveProduct}
            className="max-w-4xl w-full flex flex-col gap-8 bg-[#161619] border border-stone-850 p-6 md:p-8"
          >
            <div className="flex items-center justify-between border-b border-stone-850 pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-2xl text-stone-100 font-light">
                  {products.some((p) => p.id === editingProduct.id)
                    ? "Edit Physical Work"
                    : "Create New Work"}
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
                className="text-[10px] uppercase tracking-[0.15em] text-stone-400 hover:text-stone-200 transition-colors font-bold"
              >
                Back to Catalog
              </button>
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
                  Name <span className="text-amber-500">*</span>
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

              {/* Product ID (Slug) */}
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
                    setEditingProduct((prev) => ({
                      ...prev,
                      id: e.target.value,
                    }))
                  }
                  placeholder="e.g. amber-burl-table"
                  required
                  disabled={products.some((p) => p.id === editingProduct.id)} // Cannot change ID once created
                  className="w-full h-11 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                />
              </div>

              {/* Price ($) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
                  Price ($ AUD) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProduct.price ?? ""}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="e.g. 450"
                  required
                  className="w-full h-11 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm"
                />
              </div>

              {/* Subtitle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
                  Subtitle / Edition
                </label>
                <input
                  type="text"
                  value={editingProduct.subtitle || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="e.g. 04 / English Oak & Amber Resin"
                  className="w-full h-11 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm"
                />
              </div>

              {/* Sold Status Checkbox */}
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-3 cursor-pointer text-stone-400 hover:text-stone-200 select-none">
                  <input
                    type="checkbox"
                    checked={editingProduct.sold || false}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        sold: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded border border-stone-800 bg-stone-900 checked:bg-amber-500 text-amber-500 focus:ring-0 outline-none accent-amber-500 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-[0.1em] font-semibold">
                      Mark Piece as Sold
                    </span>
                    <span className="text-[9px] text-stone-500">
                      Hides the purchase button and displays &quot;Sold&quot;
                      overlay.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
                Description
              </label>
              <textarea
                value={editingProduct.description || ""}
                onChange={(e) =>
                  setEditingProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Write a storytelling description for the collectors..."
                rows={4}
                className="w-full p-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/40 text-stone-200 outline-none text-sm leading-relaxed"
              />
            </div>

            {/* Specifications Section */}
            <div className="flex flex-col gap-4 border-t border-stone-850 pt-6">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-semibold">
                  Specifications
                </label>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-[10px] uppercase tracking-[0.15em] text-amber-500 hover:text-amber-400 font-semibold transition-colors"
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
                      onChange={(e) =>
                        handleUpdateSpec(index, "label", e.target.value)
                      }
                      placeholder="Label (e.g. Timber)"
                      className="flex-1 h-10 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/30 text-stone-200 outline-none text-xs uppercase tracking-wider font-semibold"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        handleUpdateSpec(index, "value", e.target.value)
                      }
                      placeholder="Value (e.g. English Burr Oak)"
                      className="flex-2 h-10 px-4 bg-stone-900 border border-stone-800 rounded-md focus:border-amber-500/30 text-stone-200 outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="text-stone-500 hover:text-red-500 transition-colors p-1"
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
                  The primary thumbnail displayed in the catalog grid and at the
                  top of the product page.
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
                      {uploadingFile === "main"
                        ? "Uploading..."
                        : "Choose File"}
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
                      setEditingProduct((prev) => ({
                        ...prev,
                        alt: e.target.value,
                      }))
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
                    {uploadingFile === "gallery"
                      ? "Uploading Media..."
                      : "+ Add Media Assets"}
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
                  Upload supplementary images or short showcase videos to be
                  displayed in the dynamic media grid on the product&apos;s
                  details page.
                </p>
              </div>

              {formMedia.length === 0 ? (
                <div className="w-full border border-dashed border-stone-800 p-8 text-center text-stone-600 text-xs uppercase tracking-widest">
                  No additional media. Click &quot;+ Add Media Assets&quot; to
                  upload images or videos.
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
        )}
      </main>
    </div>
  );
}
