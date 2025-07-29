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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Folder Explorer</h1>
        <button
            onClick={() => {
            setSelectedFolder(null);
            setModalOpen(true);
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
            Add Folder
        </button>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-4 bg-muted rounded w-[60%] ml-[1.5rem]"
              style={{ marginLeft: `${idx * 1.5}rem` }}
            />
          ))}
        </div>
      ) : folders.length === 0 ? (
        <p className="text-muted-foreground">No folders found.</p>
      ) : (
        <div className="space-y-2">
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
    <div style={{ marginLeft: `${level * 1.5}rem` }}>
      <div className="flex items-center justify-between group">
        <div
          className="flex items-center gap-2 cursor-pointer hover:underline"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="font-medium">
            {expanded ? "📂" : "📁"} {folder.name}
          </span>
        </div>

        <div className="relative">
          <button
            className="opacity-0 group-hover:opacity-100 transition text-muted-foreground"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-50">
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(folder);
                }}
              >
                Edit
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(folder);
                }}
              >
                Delete
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
