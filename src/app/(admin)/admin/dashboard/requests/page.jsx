"use client";

import { useEffect, useState } from "react";
import { 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Loader2, 
  ArrowLeft,
  Search,
  Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tabs and Search filters
  const [activeTab, setActiveTab] = useState("PENDING"); // "PENDING" | "APPROVED" | "REJECTED" | "ALL"
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contributor-requests", { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized access. Admin privileges required.");
        }
        throw new Error("Failed to load requests");
      }
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleActionSwal = async (req, type) => {
    if (type === "approve") {
      const result = await Swal.fire({
        title: "Approve Request?",
        text: `Promote user @${req.user?.username} to CONTRIBUTOR?`,
        input: "textarea",
        inputValue: "Your request has been approved. Welcome to our contributor community!",
        inputPlaceholder: "Add optional approval feedback...",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "rgba(0,0,0,0.1)",
        confirmButtonText: "Approve",
        cancelButtonText: "Cancel",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
      });

      if (!result.isConfirmed) return;
      const feedback = result.value || "";

      try {
        const res = await fetch(`/api/admin/contributor-requests/${req.id}/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedback }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to approve request");

        await Swal.fire({
          title: "Approved!",
          text: "User has been promoted to CONTRIBUTOR.",
          icon: "success",
          confirmButtonColor: "#000000",
          background: "#ffffff",
          color: "#000000",
          customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
        });
        fetchRequests();
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.message || "Failed to approve request",
          icon: "error",
          confirmButtonColor: "#000000",
          background: "#ffffff",
          color: "#000000",
          customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
        });
      }
    } else if (type === "reject") {
      const result = await Swal.fire({
        title: "Decline Request?",
        text: `Decline promotion request for @${req.user?.username}?`,
        input: "textarea",
        inputPlaceholder: "Specify rejection reason (required)...",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "rgba(0,0,0,0.1)",
        confirmButtonText: "Decline",
        cancelButtonText: "Cancel",
        background: "#ffffff",
        color: "#000000",
        customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" },
        inputValidator: (value) => {
          if (!value?.trim()) {
            return "Rejection feedback is required!";
          }
        }
      });

      if (!result.isConfirmed) return;
      const feedback = result.value;

      try {
        const res = await fetch(`/api/admin/contributor-requests/${req.id}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedback }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to reject request");

        await Swal.fire({
          title: "Declined",
          text: "Request declined and feedback logged.",
          icon: "success",
          confirmButtonColor: "#000000",
          background: "#ffffff",
          color: "#000000",
          customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
        });
        fetchRequests();
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.message || "Failed to decline request",
          icon: "error",
          confirmButtonColor: "#000000",
          background: "#ffffff",
          color: "#000000",
          customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
        });
      }
    }
  };

  // Filter requests based on tab and search query
  const filteredRequests = requests.filter((req) => {
    const matchesTab = activeTab === "ALL" || req.status === activeTab;
    const matchesSearch = 
      req.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading && requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
        <span className="text-xs text-slate-400 font-medium tracking-wide">Loading requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto bg-white border border-slate-200 rounded-2xl">
        <p className="text-red-500 font-medium text-sm">{error}</p>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif italic font-bold text-slate-950 tracking-tight">
            Contributor Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Review promotion applications from viewers seeking contributor permissions.
          </p>
        </div>
        
        {/* Quick Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-black transition-colors shadow-xs"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto no-scrollbar">
        {[
          { key: "PENDING", label: "Pending Curation", icon: Clock },
          { key: "APPROVED", label: "Approved Contributors", icon: CheckCircle2 },
          { key: "REJECTED", label: "Declined Applications", icon: XCircle },
          { key: "ALL", label: "All Archives", icon: Filter },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = requests.filter(r => tab.key === "ALL" || r.status === tab.key).length;
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-xs font-semibold tracking-wide border-b-2 flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                isActive 
                  ? "border-black text-slate-950 font-bold" 
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 text-[9px] rounded-md font-bold transition-colors ${
                isActive ? "bg-black text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
          <div className="p-3.5 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
            <UserCheck className="w-6 h-6 text-slate-650" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No requests found</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            There are no requests matching the current filter status or query term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map((req) => {
            const dateStr = new Date(req.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });
            
            return (
              <div 
                key={req.id}
                className="bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 rounded-[1.5rem] p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                {/* Left side: user & message details */}
                <div className="space-y-4 flex-1">
                  {/* User Profile info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden font-bold text-slate-700 text-xs">
                      {req.user?.avatarUrl ? (
                        <img src={req.user.avatarUrl} alt={req.user.name || req.user.username} className="w-full h-full object-cover" />
                      ) : (
                        (req.user?.name || req.user?.username || "U")[0].toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{req.user?.name || req.user?.username}</span>
                        <span className="text-xs text-slate-400 font-normal">(@{req.user?.username})</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">{req.user?.email}</p>
                    </div>
                  </div>

                  {/* Submission message */}
                  <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>Application Statement</span>
                      <span>•</span>
                      <span>{dateStr}</span>
                    </div>
                    <p className="text-xs text-slate-650 leading-relaxed italic">
                      "{req.message || "No statement provided."}"
                    </p>
                  </div>

                  {/* Feedback text if already curated */}
                  {req.status !== "PENDING" && (
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                      req.status === "APPROVED" 
                        ? "bg-slate-50 border-slate-200 text-slate-800" 
                        : "bg-red-50/50 border-red-100 text-red-800"
                    }`}>
                      <span className="font-extrabold uppercase tracking-widest text-[9px] block text-slate-400">
                        Curator Feedback
                      </span>
                      <p className="italic font-medium">
                        "{req.feedback || "No feedback logged."}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Right side: status / curation actions */}
                <div className="flex flex-row md:flex-col md:items-end justify-between md:justify-start gap-4 self-center md:self-start shrink-0">
                  {/* Status Badge */}
                  <div>
                    {req.status === "PENDING" && (
                      <span className="px-3 py-1 bg-amber-55/10 border border-amber-200 text-amber-700 text-[9px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3 h-3 animate-pulse" />
                        <span>Pending</span>
                      </span>
                    )}
                    {req.status === "APPROVED" && (
                      <span className="px-3 py-1 bg-black text-white text-[9px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approved</span>
                      </span>
                    )}
                    {req.status === "REJECTED" && (
                      <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-[9px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-3 h-3" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>

                  {/* Active curation buttons */}
                  {req.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleActionSwal(req, "reject")}
                        className="px-3.5 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleActionSwal(req, "approve")}
                        className="px-3.5 py-2 border border-black bg-black hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-xs"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
