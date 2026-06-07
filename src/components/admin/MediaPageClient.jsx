"use client";

import { useEffect, useState } from "react";
import MediaItemModal from "@/components/admin/MediaItemModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/AuthContext";
import { 
  FileText, 
  Search, 
  Filter, 
  Music, 
  Video as VideoIcon, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles 
} from "lucide-react";

export default function MediaPageClient() {
  const { me, authLoading } = useAuth();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setMediaItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  // Get matching icon for media type
  const getMediaIcon = (type) => {
    switch (type) {
      case "AUDIO":
        return <Music className="w-8 h-8 text-indigo-500" />;
      case "VIDEO":
        return <VideoIcon className="w-8 h-8 text-rose-500" />;
      case "IMAGE":
        return <ImageIcon className="w-8 h-8 text-sky-500" />;
      case "PDF":
        return <FileText className="w-8 h-8 text-emerald-500" />;
      default:
        return <LinkIcon className="w-8 h-8 text-amber-500" />;
    }
  };

  // Filtering Logic
  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "ALL" || item.mediaType === selectedType;
    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 border-b border-slate-200/50 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Media Library
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your archives. Review, upload, and update files and external resources.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}
          className="self-start md:self-auto px-6 py-3 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          Add Media
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white/60 border border-slate-200/50 backdrop-blur-md p-4 rounded-[2rem] shadow-sm">
        
        {/* Search Input */}
        <div className="lg:col-span-2 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm outline-none"
          />
        </div>

        {/* Media Type Filter */}
        <div className="relative flex items-center">
          <Filter className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 text-sm outline-none cursor-pointer appearance-none"
          >
            <option value="ALL">All Types</option>
            <option value="AUDIO">Audio</option>
            <option value="VIDEO">Video</option>
            <option value="IMAGE">Image</option>
            <option value="PDF">PDF Document</option>
            <option value="LINK">External Link</option>
          </select>
          <div className="absolute right-4 pointer-events-none w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45"></div>
        </div>

        {/* Status Filter */}
        <div className="relative flex items-center">
          <Sparkles className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 text-slate-800 text-sm outline-none cursor-pointer appearance-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div className="absolute right-4 pointer-events-none w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45"></div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center border border-slate-200/60 rounded-[2.5rem] p-6 animate-pulse bg-white/40 shadow-sm"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-3xl mb-4" />
              <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white/50 border border-slate-200/40 rounded-[2.5rem] shadow-sm max-w-xl mx-auto px-6">
          <p className="text-slate-400 font-medium text-lg">No media items match your search filters.</p>
          <p className="text-slate-300 text-sm mt-1">Try tweaking the text query or dropdown selections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col items-center border border-slate-200/60 rounded-[2.5rem] p-6 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-lg hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Status Badge */}
              <div
                className={`absolute top-4 left-4 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border ${
                  item.status === "PUBLISHED"
                    ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
                    : item.status === "REJECTED"
                    ? "bg-red-50 border-red-200/80 text-red-700"
                    : "bg-yellow-50 border-yellow-200/80 text-yellow-700"
                }`}
              >
                {item.status || "DRAFT"}
              </div>

              {/* Media Thumbnail */}
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl mb-4 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-inner">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getMediaIcon(item.mediaType)
                )}
              </div>

              {/* Title and details */}
              <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 text-center transition-colors duration-300 line-clamp-1 w-full px-1 mb-1">
                {item.title}
              </span>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4">
                {item.mediaType}
              </span>

              {/* Edit button */}
              <div className="mt-auto pt-3 border-t border-slate-100/80 flex justify-center w-full">
                <Button
                  onClick={() => handleEdit(item)}
                  className="w-full text-xs font-semibold px-2 py-2 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 bg-white"
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {!authLoading && (
        <MediaItemModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          mediaItem={selectedItem}
          onSuccess={fetchData}
          me={me}
        />
      )}
    </div>
  );
}
