"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export function MediaViewModal({ isOpen, onClose, media, me, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");

  if (!isOpen || !media) return null;

  const handlePublish = async () => {
    if (!media?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media/${media.id}/publish`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to publish media");
      
      await Swal.fire({
        title: "Published!",
        text: "Media item has been successfully published.",
        icon: "success",
        confirmButtonColor: "#000000",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
      });

      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to publish media item.",
        icon: "error",
        confirmButtonColor: "#000000",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!media?.id) return;
    if (!reason.trim()) {
      Swal.fire({
        title: "Rejection Reason Required",
        text: "Please specify why this submission is being rejected.",
        icon: "warning",
        confirmButtonColor: "#000000",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media/${media.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to reject media");

      await Swal.fire({
        title: "Rejected",
        text: "Submission has been declined and feedback logged.",
        icon: "success",
        confirmButtonColor: "#000000",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
      });

      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to reject media item.",
        icon: "error",
        confirmButtonColor: "#000000",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!media?.id) return;
    
    const result = await Swal.fire({
      title: "Delete Submission?",
      text: "Provide a comment/reason for deleting this submission:",
      input: "text",
      inputPlaceholder: "Comment/reason...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "rgba(0,0,0,0.1)",
      confirmButtonText: "Yes, delete it",
      background: "#ffffff",
      color: "#000000",
      customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
    });

    if (!result.isConfirmed) return;
    const comment = result.value || "";

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media/${media.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      if (!res.ok) throw new Error("Failed to delete media");

      await Swal.fire({
        title: "Deleted",
        text: "Media submission has been soft-deleted/rejected.",
        icon: "success",
        confirmButtonColor: "#000000",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
      });

      onUpdate?.();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to delete media item.",
        icon: "error",
        confirmButtonColor: "#000000",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMediaContent = () => {
    switch (media.mediaType) {
      case "AUDIO":
        return <audio controls className="w-full"><source src={media.fileUrl || media.externalLink} /></audio>;
      case "VIDEO":
        return <video controls className="w-full max-h-[400px]"><source src={media.fileUrl || media.externalLink} /></video>;
      case "IMAGE":
        return <img src={media.image || media.fileUrl} alt={media.title} className="w-full object-contain rounded-md" />;
      case "PDF":
        return (
          <iframe
            src={media.fileUrl || media.externalLink}
            className="w-full h-[500px] border rounded-md"
          />
        );
      case "LINK":
        return (
          <a href={media.externalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Open Link
          </a>
        );
      default:
        return (
          <a href={media.fileUrl || media.externalLink} download className="text-blue-600 underline">
            Download File
          </a>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white/85 border border-slate-200/80 p-6 rounded-[2rem] shadow-xl w-full max-w-2xl space-y-5 backdrop-blur-lg">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic">
            {media.title}
          </h2>
          {/* Media type badge */}
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 uppercase tracking-wider">
            {media.mediaType}
          </span>
        </div>

        {media.description && (
          <p className="text-sm text-slate-500 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 shadow-inner">
            {media.description}
          </p>
        )}

        <div className="my-4 p-2 border border-slate-200/60 bg-white/40 rounded-2xl overflow-hidden shadow-sm">
          {renderMediaContent()}
        </div>

        {rejectMode && (
          <div className="space-y-2 border-t border-slate-200/60 pt-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Specify Rejection Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this submission is being rejected..."
              className="w-full px-3.5 py-2.5 bg-white/60 border border-slate-200 focus:border-red-400 focus:ring-1 focus:ring-red-400/50 rounded-xl text-slate-900 text-sm shadow-inner transition-all duration-200 min-h-[90px] outline-none"
              required
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          {rejectMode ? (
            <>
              <button
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-950 transition-colors font-semibold cursor-pointer"
                onClick={() => {
                  setRejectMode(false);
                  setReason("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                onClick={handleReject}
                className="px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
                variant="destructive"
                size="sm"
                disabled={loading}
              >
                {loading ? "Rejecting..." : "Confirm Reject"}
              </Button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-950 transition-colors font-semibold cursor-pointer mr-2"
                onClick={onClose}
                disabled={loading}
              >
                Close
              </button>

              {(me.role === "ADMIN" || me.role === "SUPERADMIN") && (
                <>
                  {media.status !== "PUBLISHED" && (
                    <Button
                      onClick={handlePublish}
                      className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
                      variant="default"
                      size="sm"
                      disabled={loading}
                    >
                      {loading ? "Publishing..." : "Publish"}
                    </Button>
                  )}

                  {media.status !== "PUBLISHED" && media.status !== "REJECTED" && (
                    <Button
                      onClick={() => setRejectMode(true)}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-semibold rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 transition-all duration-200 cursor-pointer"
                    >
                      Reject
                    </Button>
                  )}

                  <Button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50 cursor-pointer"
                    variant="destructive"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
