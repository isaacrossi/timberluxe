"use client";

import { Product } from "@/lib/db";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import DashboardHeader from "./DashboardHeader";
import StudioInfoTab from "./StudioInfoTab";
import CatalogListTab from "./CatalogListTab";
import CatalogFormTab from "./CatalogFormTab";

interface AdminDashboardProps {
  initialProducts: Product[];
  initialAboutText: string;
}

export default function AdminDashboard({
  initialProducts,
  initialAboutText,
}: AdminDashboardProps) {
  const {
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
    formMedia,
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
  } = useAdminDashboard(initialProducts, initialAboutText);

  return (
    <div className="min-h-screen w-full bg-[#121214] text-stone-200 font-sans flex flex-col">
      {/* CMS Header */}
      <DashboardHeader handleLogout={handleLogout} />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Navigation Tabs */}
        {!isEditing && (
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
        )}

        {/* TAB: STUDIO INFO */}
        {activeTab === "info" && !isEditing && (
          <StudioInfoTab
            aboutText={aboutText}
            setAboutText={setAboutText}
            savingInfo={savingInfo}
            infoMessage={infoMessage}
            handleSaveAbout={handleSaveAbout}
          />
        )}

        {/* TAB: CATALOG LIST */}
        {activeTab === "catalog" && !isEditing && (
          <CatalogListTab
            products={products}
            handleCreateProduct={handleCreateProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        )}

        {/* TAB: CATALOG ADD / EDIT FORM */}
        {isEditing && editingProduct && (
          <CatalogFormTab
            products={products}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            formSpecs={formSpecs}
            formMedia={formMedia}
            uploadingFile={uploadingFile}
            savingProduct={savingProduct}
            setIsEditing={setIsEditing}
            handleNameChange={handleNameChange}
            handleAddSpec={handleAddSpec}
            handleUpdateSpec={handleUpdateSpec}
            handleRemoveSpec={handleRemoveSpec}
            handleFileUpload={handleFileUpload}
            handleRemoveMedia={handleRemoveMedia}
            handleSaveProduct={handleSaveProduct}
          />
        )}
      </main>
    </div>
  );
}
