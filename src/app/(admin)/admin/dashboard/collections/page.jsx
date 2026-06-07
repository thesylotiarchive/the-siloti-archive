"use client";

import { useEffect, useState } from "react";
import { FolderModal } from "@/components/admin/FolderModal";
import { MoreHorizontal } from "lucide-react";

export default function FolderExplorerPage() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", image: "", parentId: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFolder(null);
  };
  
  const fetchTree = async () => {
    try {
      const res = await fetch("/api/admin/folders/tree");
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      console.error("Failed to fetch folder tree", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (folder) => {
    setSelectedFolder(folder);
    setModalOpen(true);
  };

  const handleDelete = async (folder) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${folder.name}" and all its contents?`
    );

    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/folders/${folder.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchTree();
    } else {
      alert("Failed to delete folder");
    }
  };

  

  useEffect(() => {

    fetchTree();
  }, []);

  const handleAddFolder = () => {
    setModalOpen(true);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Folder Explorer
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Browse, view and modify hierarchical directory structures.</p>
        </div>
        <button
            onClick={() => {
            setSelectedFolder(null);
            setModalOpen(true);
            }}
            className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
            Add Folder
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="h-10 bg-white/40 border border-slate-200/30 rounded-xl animate-pulse w-full max-w-xl"
              style={{ marginLeft: `${idx * 1.2}rem` }}
            />
          ))}
        </div>
      ) : folders.length === 0 ? (
        <div className="text-center py-16 bg-white/50 border border-slate-200/40 rounded-[2rem] shadow-sm max-w-xl">
          <p className="text-slate-400 font-medium">No folders found.</p>
        </div>
      ) : (
        <div className="space-y-3 p-6 bg-white/70 border border-slate-200/60 rounded-[2rem] shadow-sm backdrop-blur-md max-w-2xl">
          {folders.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              level={0}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <FolderModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
            fetchTree(); // refetch updated list
        }}
        folders={folders}
        folder={selectedFolder}
      />
    </div>
  );
}

function FolderNode({ folder, level, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{ marginLeft: `${level * 1.5}rem` }} className="space-y-1">
      <div className="flex items-center justify-between group p-2 hover:bg-slate-50/80 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-100">
        <div
          className="flex items-center gap-2.5 cursor-pointer text-slate-800 hover:text-emerald-700 transition-colors"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="text-base transition-transform duration-200 group-hover:scale-110">
            {expanded ? "📂" : "📁"}
          </span>
          <span className="font-semibold text-sm">
            {folder.name}
          </span>
        </div>

        <div className="relative">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200/60 bg-white opacity-0 group-hover:opacity-100 transition-all text-slate-500 hover:text-slate-900 shadow-sm cursor-pointer"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MoreHorizontal size={14} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200/80 rounded-xl shadow-lg p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800">
              <button
                className="w-full px-3 py-2 text-left text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(folder);
                }}
              >
                ✏️ Edit
              </button>
              <button
                className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(folder);
                }}
              >
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded && folder.children?.length > 0 && (
        <div className="mt-1 space-y-1">
          {folder.children.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
