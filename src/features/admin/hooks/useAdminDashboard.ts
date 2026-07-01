"use client";

import { useState } from "react";
import { Product, ProductSpec, ProductMedia } from "@/lib/db";
import { toCent, fromCent } from "@/lib/currency";

export interface EditingProduct extends Omit<Partial<Product>, "price"> {
  price?: string;
}

export function useAdminDashboard(initialProducts: Product[], initialAboutText: string) {
  const [activeTab, setActiveTab] = useState<"info" | "catalog">("catalog");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [aboutText, setAboutText] = useState<string>(initialAboutText);

  // Info Save State
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ text: "", type: "success" });

  // Catalog Form / Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [formSpecs, setFormSpecs] = useState<ProductSpec[]>([]);
  const [formMedia, setFormMedia] = useState<ProductMedia[]>([]);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null); // 'main' | 'gallery' | null
  const [savingProduct, setSavingProduct] = useState(false);

  // LOGOUT
  const handleLogout = async () => {
    document.cookie = "timberluxe_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
      price: fromCent(Number(product.price)).toString(), // Stringify for form inputs
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

  // NAME AND ID AUTO-GENERATOR
  const handleNameChange = (name: string) => {
    if (!editingProduct) return;
    const updates: EditingProduct = { name };
    const isNew = products.findIndex((p) => p.id === editingProduct.id) === -1;
    if (isNew) {
      updates.id = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    setEditingProduct((prev) => (prev ? { ...prev, ...updates } : null));
  };

  // SPEC HANDLERS
  const handleAddSpec = () => {
    setFormSpecs([...formSpecs, { label: "", value: "" }]);
  };

  const handleUpdateSpec = (idx: number, field: "label" | "value", val: string) => {
    const updated = [...formSpecs];
    updated[idx][field] = val;
    setFormSpecs(updated);
  };

  const handleRemoveSpec = (idx: number) => {
    setFormSpecs(formSpecs.filter((_, i) => i !== idx));
  };

  // FILE UPLOAD HANDLING
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "main" | "gallery"
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
            setEditingProduct((prev) => (prev ? {
              ...prev,
              image: data.url,
              alt: prev?.alt || prev?.name || "Product Image",
            } : null));
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
    setFormMedia(formMedia.filter((_, i) => i !== idx));
  };

  // PRODUCT SAVE
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingProduct ||
      !editingProduct.id ||
      !editingProduct.name ||
      editingProduct.price === undefined ||
      editingProduct.price === ""
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
        "Are you sure you want to delete this piece? This action is permanent."
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

  return {
    activeTab,
    setActiveTab,
    products,
    aboutText,
    setAboutText,
    savingInfo,
    infoMessage,
    isEditing,
    setIsEditing,
    editingProduct,
    setEditingProduct,
    formSpecs,
    setFormSpecs,
    formMedia,
    setFormMedia,
    uploadingFile,
    savingProduct,
    handleLogout,
    handleSaveAbout,
    handleEditProduct,
    handleCreateProduct,
    handleNameChange,
    handleAddSpec,
    handleUpdateSpec,
    handleRemoveSpec,
    handleFileUpload,
    handleRemoveMedia,
    handleSaveProduct,
    handleDeleteProduct,
  };
}
