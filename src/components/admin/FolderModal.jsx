"use client";

import { useEffect, useState } from "react";
import ImageUploaderWithToggle from "../ImageUploaderWithToggle";
import { Switch } from "../ui/switch";

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
  }, [folder, parentId, isEdit, me?.role]);

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
      // include status — server will enforce contributor -> DRAFT
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Folder" : "Create New Folder"}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Folder Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-input rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-input rounded-md px-3 py-2 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Folder Thumbnail</label>
          <ImageUploaderWithToggle
            value={form.image}
            setIsUploading={setIsUploading}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>

        {!parentId && (
          <div>
            <label className="block text-sm font-medium mb-1">Parent Folder (optional)</label>
            <select
              name="parentId"
              value={form.parentId || ""}
              onChange={handleChange}
              className="w-full border border-input rounded-md px-3 py-2"
            >
              <option value="">— Root —</option>
              {flattenFolders(folders).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Contributor warning if editing a published folder */}
        {me?.role === "CONTRIBUTOR" && isEdit && folder?.status === "PUBLISHED" && (
          <div className="p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
            Warning: Saving will move this folder (and its contents) back to draft.
          </div>
        )}

        {/* Publish toggle ONLY visible to ADMIN / SUPERADMIN */}
        {me && (me.role === "ADMIN" || me.role === "SUPERADMIN") && (
          <div className="flex items-center gap-2">
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
                data-[state=checked]:bg-green-500 
                data-[state=unchecked]:bg-gray-400 
                border border-gray-300
              "
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publish
            </label>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            disabled={isUploading || loading}
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
  );
}
