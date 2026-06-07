"use client";

import { useEffect, useState } from "react";
import ImageUploaderWithToggle from "../ImageUploaderWithToggle";
import { Switch } from "../ui/switch";
import { X } from "lucide-react";

/**
 * Props:
 * - isOpen, onClose, onSuccess, folders = [], folder = null, parentId = null
 * - me: { id, username, role, ... }  <-- pass this from CollectionManagerClient
 */
export function FolderModal({
  isOpen,
  onClose,
  onSuccess,
  folders = [],
  folder = null,
  parentId = null,
  me = null,
}) {
  const isEdit = !!folder;
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // form.status will be "PUBLISHED" | "DRAFT"
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    parentId: parentId || null,
    status: "DRAFT",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: folder.name || "",
        description: folder.description || "",
        image: folder.image || "",
        parentId: folder.parentId || parentId || null,
        status: folder.status || "DRAFT",
      });
    } else {
      // default: Admins/Superadmins default to PUBLISHED on create; contributors default to DRAFT
      setForm({
        name: "",
        description: "",
        image: "",
        parentId: parentId || null,
        status: me && (me.role === "ADMIN" || me.role === "SUPERADMIN") ? "PUBLISHED" : "DRAFT",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, parentId, isEdit, me?.role, isOpen]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      // published toggle -> map to status
      setForm((prev) => ({
        ...prev,
        status: checked ? "PUBLISHED" : "DRAFT",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prevent submit while uploading images or already submitting
    if (isUploading || loading) return;

    setLoading(true);

    // Prepare body
    const body = {
      name: form.name,
      description: form.description,
      image: form.image,
      parentId: form.parentId || null,
      status: form.status,
    };

    // Contributors must always create/edit as DRAFT (server will also enforce, but we set it client-side too)
    if (me?.role === "CONTRIBUTOR") {
      body.status = "DRAFT";
    }

    const endpoint = isEdit ? `/api/admin/folders/${folder.id}` : `/api/admin/folders`;
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Folder save failed:", res.status, errText);
        alert("Failed to save folder.");
        setLoading(false);
        return;
      }

      // Success: call onSuccess to refresh parent UI
      onSuccess && onSuccess();

      // Close modal
      onClose && onClose();

      // Reset
      setForm({
        name: "",
        description: "",
        image: "",
        parentId: parentId || null,
        status: me && (me.role === "ADMIN" || me.role === "SUPERADMIN") ? "PUBLISHED" : "DRAFT",
      });
    } catch (err) {
      console.error("Save folder error:", err);
      alert("Failed to save folder.");
    } finally {
      setLoading(false);
    }
  };

  const flattenFolders = (foldersList, prefix = "") =>
    foldersList.flatMap((f) => [
      { id: f.id, name: prefix + f.name },
      ...flattenFolders(f.children || [], prefix + "— "),
    ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div className="bg-white/95 border border-slate-200/80 rounded-[2.5rem] backdrop-blur-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] transition-all transform duration-300 scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 shrink-0">
          <h2 className="text-2xl">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              {isEdit ? "Edit Folder" : "Create Folder"}
            </span>
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 select-none custom-scrollbar">
          
          {/* Folder Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Folder Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Give your folder a clear name..."
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Description (Optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a brief overview of this folder..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm outline-none resize-none"
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Folder Cover / Image</label>
            <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-[1.5rem] hover:bg-slate-50/80 transition-all">
              <ImageUploaderWithToggle
                value={form.image}
                setIsUploading={setIsUploading}
                onChange={(url) => setForm({ ...form, image: url })}
                endpoint="folderImageUploader"
              />
            </div>
          </div>

          {/* Parent Selection */}
          {!parentId && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Parent Folder (Optional)</label>
              <div className="relative">
                <select
                  name="parentId"
                  value={form.parentId || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 text-sm outline-none cursor-pointer appearance-none"
                >
                  <option value="">— Root Level —</option>
                  {flattenFolders(folders).map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45"></div>
              </div>
            </div>
          )}

          {/* Contributor warning if editing a published folder */}
          {me?.role === "CONTRIBUTOR" && isEdit && folder?.status === "PUBLISHED" && (
            <div className="p-4 text-xs font-medium bg-amber-50 border border-amber-200/80 text-amber-800 rounded-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
              Warning: Editing this published folder will send it and its contents back to pending review.
            </div>
          )}

          {/* Publish Toggle (Only for Admins/Superadmins) */}
          {me && (me.role === "ADMIN" || me.role === "SUPERADMIN") && (
            <div className="flex items-center justify-between p-4 border border-emerald-100 bg-emerald-50/20 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-slate-800">Publish Immediately?</p>
                <p className="text-xs text-slate-400 mt-0.5">Toggle off to save as a Draft folder instead.</p>
              </div>
              <Switch
                id="published"
                checked={form.status === "PUBLISHED"}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    status: checked ? "PUBLISHED" : "DRAFT",
                  }))
                }
                className="
                  data-[state=checked]:bg-emerald-500 
                  data-[state=unchecked]:bg-slate-200 
                  border border-transparent
                "
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading || loading}
              className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm hover:shadow transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : me?.role === "CONTRIBUTOR"
                ? "Save as Draft"
                : isEdit
                ? form.status === "PUBLISHED"
                  ? "Save & Publish"
                  : "Save as Draft"
                : form.status === "PUBLISHED"
                ? "Create & Publish"
                : "Create as Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
