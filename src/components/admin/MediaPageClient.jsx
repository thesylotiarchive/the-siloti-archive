"use client";

import { useEffect, useState } from "react";
import MediaItemModal from "@/components/admin/MediaItemModal";

export default function MediaPageClient() {
  const [mediaItems, setMediaItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setMediaItems(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Items</h1>
        <button
          onClick={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Add Media
        </button>
      </div>

      <ul className="space-y-4">
        {mediaItems.map((item) => (
          <li
            key={item.id}
            className="p-4 border rounded-md bg-card text-card-foreground"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground italic">
                  {item.type} | SubCategory: {item.subcategory?.name}
                </p>
                <button
                  onClick={() => handleEdit(item)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-12 w-12 rounded-md object-cover"
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      <MediaItemModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        mediaItem={selectedItem}
        onSuccess={fetchData}
      />
    </div>
  );
}
