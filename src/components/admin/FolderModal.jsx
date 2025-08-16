"use client";

import { useEffect, useState } from "react";
import ImageUploaderWithToggle from "../ImageUploaderWithToggle";

export function FolderModal({ isOpen, onClose, onSuccess, folders = [], folder = null, parentId = null }) {
  const isEdit = !!folder;
  const [form, setForm] = useState({ name: "", description: "", image: "", parentId: "" });

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: folder.name || "",
        description: folder.description || "",
        image: folder.image || "",
        parentId: folder.parentId || "",
      });
    } else {
      setForm({
        name: "",
        description: "",
        image: "",
        parentId: parentId || "",
      });
    }
  }, [folder, parentId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEdit
      ? `/api/admin/folders/${folder.id}`
      : `/api/admin/folders`;

    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSuccess();
      onClose?.();          
      setForm({             
        name: "",
        description: "",
        image: "",
        parentId: "",
      });
    } else {
      alert("Failed to save folder.");
    }
  };

  const flattenFolders = (folders, prefix = "") =>
    folders.flatMap((f) => [
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

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
