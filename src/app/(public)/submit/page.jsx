"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Link as LinkIcon, 
  File, 
  HelpCircle,
  Upload,
  Globe,
  Plus,
  Trash2,
  Lock,
  Folder,
  BookOpen,
  Loader2,
  Clock,
  ShieldAlert
} from "lucide-react";
import { toast } from "react-hot-toast";

const MEDIA_TYPES = [
  { value: "IMAGE", label: "Image / Photograph", icon: ImageIcon, color: "text-purple-400 bg-purple-950/40 border-purple-500/20" },
  { value: "AUDIO", label: "Audio / Recording", icon: Music, color: "text-green-400 bg-green-950/40 border-green-500/20" },
  { value: "VIDEO", label: "Video Clip", icon: Video, color: "text-red-400 bg-red-950/40 border-red-500/20" },
  { value: "PDF", label: "PDF / Manuscript", icon: FileText, color: "text-blue-400 bg-blue-950/40 border-blue-500/20" },
  { value: "DOC", label: "Document / Text", icon: File, color: "text-yellow-400 bg-yellow-950/40 border-yellow-500/20" },
  { value: "LINK", label: "External Link", icon: LinkIcon, color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20" },
  { value: "FOLDER", label: "Collection Folder", icon: Folder, color: "text-blue-400 bg-blue-950/40 border-blue-500/20" },
  { value: "BLOG", label: "Blog Article", icon: BookOpen, color: "text-amber-400 bg-amber-950/40 border-amber-500/20" },
  { value: "OTHER", label: "Other Artifact", icon: HelpCircle, color: "text-slate-400 bg-slate-950/40 border-slate-500/20" },
];

export default function SubmitPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    mediaType: "IMAGE",
    language: "Siloti / Sylheti",
    mediaUrl: "",
    image: "",
    author: "",
  });

  const [uploadSource, setUploadSource] = useState("file"); // "file" or "link"
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitMode, setSubmitMode] = useState("media"); // "media" | "folder" | "blog"
  const [folderForm, setFolderForm] = useState({ name: "", description: "", image: "" });
  const [blogForm, setBlogForm] = useState({ title: "", author: "", bannerUrl: "", content: "" });
  const [isScraping, setIsScraping] = useState(false);

  const [activeTab, setActiveTab] = useState("submit"); // "submit" or "history"
  const [submissions, setSubmissions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [contributorRequest, setContributorRequest] = useState(null);
  const [fetchingRequest, setFetchingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const fetchRequestStatus = async () => {
    setFetchingRequest(true);
    try {
      const res = await fetch("/api/public/contributor-request");
      if (res.ok) {
        const data = await res.json();
        setContributorRequest(data.request);
      }
    } catch (err) {
      console.error("Failed to fetch request status", err);
    } finally {
      setFetchingRequest(false);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          if (data.user.role === "VIEWER") {
            fetch("/api/public/contributor-request")
              .then((res) => {
                if (res.ok) return res.json();
                return null;
              })
              .then((reqData) => {
                if (reqData) {
                  setContributorRequest(reqData.request);
                }
              })
              .catch((err) => console.error("Failed to fetch request status on mount", err));
          }
        }
      })
      .catch((err) => console.error("Auth check error:", err))
      .finally(() => setCheckingAuth(false));
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/public/media/my-submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Failed to load submissions history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history" && user) {
      fetchHistory();
    }
  }, [activeTab, user]);

  const handleDeleteSubmission = async (id, submissionType) => {
    Swal.fire({
      title: "Delete Submission?",
      text: "Are you sure you want to delete this pending submission? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "rgba(255, 255, 255, 0.1)",
      confirmButtonText: "Yes, delete it",
      background: "#0f172a",
      color: "#fff",
      customClass: {
        popup: "rounded-3xl border border-white/10 shadow-2xl",
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let url = `/api/public/media/${id}`;
          if (submissionType === "FOLDER") {
            url = `/api/public/folders/${id}`;
          } else if (submissionType === "BLOG") {
            url = `/api/public/blogs/${id}`;
          }

          const res = await fetch(url, {
            method: "DELETE",
          });
          const data = await res.json();
          if (res.ok) {
            Swal.fire({
              title: "Deleted!",
              text: "Your submission has been deleted.",
              icon: "success",
              confirmButtonColor: "#10b981",
              background: "#0f172a",
              color: "#fff",
              customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
            });
            fetchHistory(); // refresh history
          } else {
            throw new Error(data.error || "Failed to delete submission");
          }
        } catch (err) {
          Swal.fire({
            title: "Delete Failed",
            text: err.message || "An error occurred while deleting. Please try again.",
            icon: "error",
            confirmButtonColor: "#ef4444",
            background: "#0f172a",
            color: "#fff",
            customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
          });
        }
      }
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFolderChange = (e) => {
    setFolderForm({ ...folderForm, [e.target.name]: e.target.value });
  };

  const handleBlogChange = (e) => {
    setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
  };

  const handleMediaTypeChange = (type) => {
    if (type === "FOLDER") {
      setSubmitMode("folder");
      toast.success("Switched to Folder Submission mode");
    } else if (type === "BLOG") {
      setSubmitMode("blog");
      toast.success("Switched to Blog Submission mode");
    } else {
      setForm({ ...form, mediaType: type });
    }
  };

  const fetchLinkMetadata = async (url) => {
    if (!url || !url.trim() || !url.startsWith("http")) return;
    setIsScraping(true);
    try {
      const res = await fetch(`/api/public/metadata?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        setForm(f => ({
          ...f,
          title: data.title || f.title,
          description: data.description || f.description,
          image: data.image || f.image,
          mediaType: data.mediaType || f.mediaType,
        }));
        toast.success("Details fetched automatically!");
      }
    } catch (err) {
      console.error("Failed to fetch link metadata", err);
    } finally {
      setIsScraping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitMode === "media") {
      if (!form.title.trim() || !form.description.trim()) {
        Swal.fire({
          title: "Validation Error",
          text: "Please enter both a title and description for your contribution.",
          icon: "warning",
          confirmButtonColor: "#10b981",
          background: "#0f172a",
          color: "#fff",
          customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
        });
        return;
      }

      if (uploadSource === "file" && !form.mediaUrl) {
        Swal.fire({
          title: "File Missing",
          text: "Please upload a media file or switch to 'Provide Link'.",
          icon: "warning",
          confirmButtonColor: "#10b981",
          background: "#0f172a",
          color: "#fff",
          customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch("/api/public/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            title: "Submission Received!",
            text: "Thank you for contributing! Your media item has been submitted for curation.",
            icon: "success",
            confirmButtonColor: "#10b981",
            background: "#0f172a",
            color: "#fff",
            customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
          }).then(() => {
            setForm({
              title: "",
              description: "",
              mediaType: "IMAGE",
              language: "Siloti / Sylheti",
              mediaUrl: "",
              image: "",
              author: "",
            });
            fetchHistory();
            setActiveTab("history");
          });
        } else {
          throw new Error(data.error || "Failed to submit item");
        }
      } catch (err) {
        Swal.fire({
          title: "Submission Failed",
          text: err.message || "An error occurred. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
          background: "#0f172a",
          color: "#fff",
          customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (submitMode === "folder") {
      if (!folderForm.name.trim()) {
        toast.error("Folder name is required");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch("/api/public/folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(folderForm),
        });

        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            title: "Folder Submitted!",
            text: "Your collection folder has been submitted for curator review.",
            icon: "success",
            confirmButtonColor: "#10b981",
            background: "#0f172a",
            color: "#fff",
            customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
          }).then(() => {
            setFolderForm({ name: "", description: "", image: "" });
            fetchHistory();
            setActiveTab("history");
          });
        } else {
          throw new Error(data.error || "Failed to submit folder");
        }
      } catch (err) {
        toast.error(err.message || "Failed to submit folder");
      } finally {
        setIsSubmitting(false);
      }
    } else if (submitMode === "blog") {
      if (!blogForm.title.trim() || !blogForm.content.trim()) {
        toast.error("Blog title and content are required");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch("/api/public/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogForm),
        });

        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            title: "Blog Submitted!",
            text: "Your blog post draft has been submitted for curator review.",
            icon: "success",
            confirmButtonColor: "#10b981",
            background: "#0f172a",
            color: "#fff",
            customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
          }).then(() => {
            setBlogForm({ title: "", author: "", bannerUrl: "", content: "" });
            fetchHistory();
            setActiveTab("history");
          });
        } else {
          throw new Error(data.error || "Failed to submit blog post");
        }
      } catch (err) {
        toast.error(err.message || "Failed to submit blog post");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingRequest(true);
    try {
      const res = await fetch("/api/public/contributor-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: requestMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          title: "Request Submitted!",
          text: "Your request to become a Contributor has been sent to the administrators.",
          icon: "success",
          confirmButtonColor: "#10b981",
          background: "#0f172a",
          color: "#fff",
          customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
        });
        setContributorRequest(data.request);
        setRequestMessage("");
      } else {
        throw new Error(data.error || "Failed to submit request");
      }
    } catch (err) {
      Swal.fire({
        title: "Submission Failed",
        text: err.message || "An error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#0f172a",
        color: "#fff",
        customClass: { popup: "rounded-3xl border border-white/10 shadow-2xl" }
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-220px)] flex flex-col items-center pt-28 pb-20 px-6 selection:bg-emerald-400 selection:text-slate-950">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="mb-5 flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
              Community Contributions
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-none mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl font-serif italic font-bold">
              Submit to the Archive
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-white/50 font-light max-w-xl leading-relaxed">
            Contribute manuscripts, field audio/video recordings, and books to preserve Siloti cultural heritage. All contributions are curated before going public.
          </p>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl backdrop-blur-md gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("submit")}
              className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "submit"
                  ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-650 hover:text-slate-900 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              Submit New Item
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "history"
                  ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-650 hover:text-slate-900 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              My Submissions
            </button>
          </div>
        </div>

        {activeTab === "submit" ? (
          !user ? (
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md shadow-2xl min-h-[300px]">
              <div className="text-center py-12 flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-400 dark:text-white/40">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Archive Submission Lock</h3>
                <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm leading-relaxed">
                  Please log in to submit items to the archive and track their curation process.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  Sign In Now
                </button>
              </div>
            </div>
          ) : user.role === "VIEWER" ? (
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md shadow-2xl min-h-[300px]">
              {fetchingRequest ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  <span className="text-xs text-slate-500 dark:text-white/50">Checking contributor request status...</span>
                </div>
              ) : contributorRequest && contributorRequest.status === "PENDING" ? (
                <div className="text-center py-12 flex flex-col items-center space-y-6">
                  <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 rounded-2xl flex items-center justify-center animate-pulse">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Curation Access Request Pending</h3>
                    <p className="text-xs text-slate-500 dark:text-white/50 max-w-md mx-auto leading-relaxed">
                      Thank you! Your request to become a Contributor is currently being reviewed by our administrators. You will receive an in-app notification once a decision has been made.
                    </p>
                  </div>
                  {contributorRequest.message && (
                    <div className="max-w-md w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-left">
                      <span className="text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-wider block mb-1">Your Request Message:</span>
                      <p className="text-xs text-slate-700 dark:text-white/70 italic">"{contributorRequest.message}"</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={fetchRequestStatus}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Refresh Status
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-rose-950 dark:text-white">Contributor Role Required</h4>
                      <p className="text-xs text-rose-900/80 dark:text-white/60 leading-relaxed">
                        To maintain the integrity and curation standards of the Sylheti Archive, direct contributions are restricted to verified contributors. Submit a request to the archive curators to promote your account.
                      </p>
                    </div>
                  </div>

                  {contributorRequest && contributorRequest.status === "REJECTED" && (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold uppercase tracking-wide text-[10px]">
                        <span>Previous Request Rejected</span>
                        <span>•</span>
                        <span>{new Date(contributorRequest.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-800 dark:text-white/80 font-light leading-relaxed">
                        Feedback: <span className="italic font-normal">"{contributorRequest.feedback || "No feedback comments specified."}"</span>
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleRequestSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                        Why would you like to contribute?
                      </label>
                      <textarea
                        placeholder="Briefly describe what materials you plan to contribute (e.g. books, recordings, photographs) and your research or connection to the Sylheti community..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={4}
                        required
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingRequest || !requestMessage.trim()}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    >
                      {isSubmittingRequest ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <span>Submit Contributor Request</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
              {isScraping && (
              <div className="absolute inset-0 bg-slate-100/90 dark:bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400 animate-spin" />
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Fetching details... please wait...</h3>
                  <p className="text-[11px] text-slate-500 dark:text-white/40 mt-1">Extracting page titles, cover thumbnails, and summaries</p>
                </div>
              </div>
            )}

            {/* Submit Mode Switcher */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setSubmitMode("media")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  submitMode === "media"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-lg"
                    : "text-slate-650 hover:text-slate-900 hover:bg-slate-150 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Media Item</span>
              </button>
              <button
                type="button"
                onClick={() => setSubmitMode("folder")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  submitMode === "folder"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-slate-650 hover:text-slate-900 hover:bg-slate-150 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Folder</span>
              </button>
              <button
                type="button"
                onClick={() => setSubmitMode("blog")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  submitMode === "blog"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg"
                    : "text-slate-650 hover:text-slate-900 hover:bg-slate-150 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Blog Article</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {submitMode === "media" && (
                <>
                  {/* Media Upload / Source Section FIRST */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                        Media Source
                      </label>
                      <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUploadSource("file");
                            setForm(f => ({ ...f, mediaUrl: "" }));
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            uploadSource === "file"
                              ? "bg-emerald-400 text-slate-950 font-bold"
                              : "text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadSource("link");
                            setForm(f => ({ ...f, mediaUrl: "" }));
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            uploadSource === "link"
                              ? "bg-emerald-400 text-slate-950 font-bold"
                              : "text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
                          }`}
                        >
                          Provide Link
                        </button>
                      </div>
                    </div>

                    {/* Upload Input / Zone */}
                    {uploadSource === "link" ? (
                      <div className="relative flex gap-2">
                        <input
                          type="text"
                          name="mediaUrl"
                          placeholder="Enter external URL (e.g. YouTube, SoundCloud, or external article)"
                          value={form.mediaUrl}
                          onChange={handleChange}
                          onBlur={() => fetchLinkMetadata(form.mediaUrl)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => fetchLinkMetadata(form.mediaUrl)}
                          disabled={isScraping || !form.mediaUrl.trim()}
                          className="px-4 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isScraping ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Fetch"
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed border-slate-350 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/[0.01] flex flex-col items-center justify-center text-center min-h-[140px] relative">
                        {form.mediaUrl ? (
                          <div className="space-y-3 w-full">
                            <div className="inline-flex items-center gap-2 p-3 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-xl text-xs font-semibold max-w-full">
                              <FileText className="w-4 h-4 shrink-0" />
                              <span className="truncate max-w-[250px]">{form.mediaUrl.split("/").pop()}</span>
                            </div>
                            <div className="flex justify-center gap-4">
                              <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, mediaUrl: "" }))}
                                className="text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
                              >
                                Remove file
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-3">
                            {isUploadingFile ? (
                              <>
                                <Loader2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 animate-spin" />
                                <span className="text-xs text-slate-500 dark:text-white/50">Uploading media files...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-slate-400 dark:text-white/30" />
                                <div className="text-xs text-slate-500 dark:text-white/50 text-center px-4">
                                  Upload PDF, Image, Audio (Max 5MB) or Video (Max 10MB)
                                </div>
                                <UploadButton
                                  endpoint="mediaFileUploader"
                                  appearance={{
                                    button: "bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-lg shadow-emerald-400/10 active:scale-95 transition-transform duration-200",
                                    allowedContent: "hidden"
                                  }}
                                  onUploadBegin={() => setIsUploadingFile(true)}
                                  onClientUploadComplete={(res) => {
                                    if (res && res.length > 0) {
                                      const file = res[0];
                                      const fileName = file.name || "";
                                      const dotIndex = fileName.lastIndexOf(".");
                                      const titleWithoutExt = dotIndex !== -1 ? fileName.substring(0, dotIndex) : fileName;
                                      const ext = dotIndex !== -1 ? fileName.substring(dotIndex).toLowerCase() : "";

                                      let mediaType = "OTHER";
                                      if ([".mp3", ".wav", ".ogg", ".m4a"].includes(ext)) {
                                        mediaType = "AUDIO";
                                      } else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
                                        mediaType = "VIDEO";
                                      } else if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) {
                                        mediaType = "IMAGE";
                                      } else if (ext === ".pdf") {
                                        mediaType = "PDF";
                                      } else if ([".doc", ".docx", ".odt"].includes(ext)) {
                                        mediaType = "DOC";
                                      } else if ([".epub", ".mobi"].includes(ext)) {
                                        mediaType = "BOOK";
                                      } else if ([".txt", ".rtf"].includes(ext)) {
                                        mediaType = "DOCUMENT";
                                      }

                                      setForm(f => ({
                                        ...f,
                                        mediaUrl: file.url,
                                        title: f.title || titleWithoutExt,
                                        mediaType: mediaType,
                                      }));
                                      toast.success(`Auto-detected: ${mediaType} - ${titleWithoutExt}`);
                                    }
                                    setIsUploadingFile(false);
                                  }}
                                  onUploadError={(error) => {
                                    console.error(error);
                                    setIsUploadingFile(false);
                                    toast.error("File upload failed. Please try again.");
                                  }}
                                />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Media Type Selector BELOW the upload/link input block */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Select Media Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {MEDIA_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = form.mediaType === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleMediaTypeChange(type.value)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? "border-emerald-400 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400 scale-[1.02]"
                                : "border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
                            }`}
                          >
                            <Icon className="w-5 h-5 mb-2" />
                            <span className="text-[11px] font-semibold">{type.label.split(" / ")[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Item Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Traditional Sylheti Dhamail Song Recording"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  {/* Author / Creator field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Author / Creator Name (optional)
                    </label>
                    <input
                      type="text"
                      name="author"
                      placeholder="e.g. Radharaman Dutta, Hason Raja (if known)"
                      value={form.author}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  {/* Description field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Description / Context
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe the item, its origins, regional significance, or background..."
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Language Field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Language (if applicable)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="language"
                        placeholder="e.g. Siloti / Sylheti, Nagri, English"
                        value={form.language}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none">
                        <Globe className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Optional Cover Image / Thumbnail */}
                  {form.mediaType !== "IMAGE" && (
                    <div className="space-y-3 border-t border-slate-200 dark:border-white/5 pt-5">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                        Optional Cover Image / Thumbnail
                      </label>
                      
                      <div className="p-4 border border-dashed border-slate-350 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/[0.01] flex flex-col items-center justify-center text-center min-h-[110px] relative">
                        {form.image ? (
                          <div className="flex items-center justify-between gap-4 w-full">
                            <div className="flex items-center gap-3">
                              <img src={form.image} alt="Thumbnail Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-250 dark:border-white/10" />
                              <span className="text-xs text-slate-650 dark:text-white/60 truncate max-w-[200px]">{form.image.split("/").pop()}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setForm(f => ({ ...f, image: "" }))}
                              className="text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
                            >
                              Remove image
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            {isUploadingThumb ? (
                              <>
                                <Loader2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 animate-spin" />
                                <span className="text-xs text-slate-500 dark:text-white/50">Uploading cover image...</span>
                              </>
                            ) : (
                              <>
                                <div className="text-xs text-slate-400 dark:text-white/40 mb-1">Upload a JPG/PNG thumbnail to preview the item</div>
                                <UploadButton
                                  endpoint="folderImageUploader"
                                  appearance={{
                                    button: "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-colors duration-200",
                                    allowedContent: "hidden"
                                  }}
                                  onUploadBegin={() => setIsUploadingThumb(true)}
                                  onClientUploadComplete={(res) => {
                                    if (res && res.length > 0) {
                                      setForm(f => ({ ...f, image: res[0].url }));
                                    }
                                    setIsUploadingThumb(false);
                                  }}
                                  onUploadError={(error) => {
                                    console.error(error);
                                    setIsUploadingThumb(false);
                                    toast.error("Image upload failed. Please try again.");
                                  }}
                                />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {submitMode === "folder" && (
                <>
                  {/* Folder Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Folder Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Sylheti Nagri Manuscripts Collection"
                      value={folderForm.name}
                      onChange={handleFolderChange}
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  {/* Folder Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Description / Context
                    </label>
                    <textarea
                      name="description"
                      placeholder="Explain what this folder will hold and the cultural relevance of this collection..."
                      value={folderForm.description}
                      onChange={handleFolderChange}
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Folder Cover Image Upload */}
                  <div className="space-y-3 border-t border-slate-200 dark:border-white/5 pt-5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Folder Cover Image
                    </label>
                    
                    <div className="p-4 border border-dashed border-slate-350 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/[0.01] flex flex-col items-center justify-center text-center min-h-[110px] relative">
                      {folderForm.image ? (
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div className="flex items-center gap-3">
                            <img src={folderForm.image} alt="Folder Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-250 dark:border-white/10" />
                            <span className="text-xs text-slate-650 dark:text-white/60 truncate max-w-[200px]">{folderForm.image.split("/").pop()}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFolderForm(f => ({ ...f, image: "" }))}
                            className="text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
                          >
                            Remove image
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          {isUploadingThumb ? (
                            <>
                              <Loader2 className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-spin" />
                              <span className="text-xs text-slate-500 dark:text-white/50">Uploading cover image...</span>
                            </>
                          ) : (
                            <>
                              <div className="text-xs text-slate-450 dark:text-white/40 mb-1">Upload a cover banner for this folder</div>
                              <UploadButton
                                endpoint="folderImageUploader"
                                appearance={{
                                  button: "bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-colors duration-200",
                                  allowedContent: "hidden"
                                }}
                                onUploadBegin={() => setIsUploadingThumb(true)}
                                onClientUploadComplete={(res) => {
                                  if (res && res.length > 0) {
                                    setFolderForm(f => ({ ...f, image: res[0].url }));
                                  }
                                  setIsUploadingThumb(false);
                                }}
                                onUploadError={(error) => {
                                  console.error(error);
                                  setIsUploadingThumb(false);
                                  toast.error("Image upload failed. Please try again.");
                                }}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {submitMode === "blog" && (
                <>
                  {/* Blog Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Blog Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Uncovering the History of Nagri Script"
                      value={blogForm.title}
                      onChange={handleBlogChange}
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  {/* Blog Author */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      name="author"
                      placeholder="e.g. Dr. J. Ali (leave blank to use your name)"
                      value={blogForm.author}
                      onChange={handleBlogChange}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  {/* Blog Banner Image Upload */}
                  <div className="space-y-3 border-t border-slate-200 dark:border-white/5 pt-5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Blog Banner Image
                    </label>
                    
                    <div className="p-4 border border-dashed border-slate-350 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/[0.01] flex flex-col items-center justify-center text-center min-h-[110px] relative">
                      {blogForm.bannerUrl ? (
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div className="flex items-center gap-3">
                            <img src={blogForm.bannerUrl} alt="Blog Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-250 dark:border-white/10" />
                            <span className="text-xs text-slate-650 dark:text-white/60 truncate max-w-[200px]">{blogForm.bannerUrl.split("/").pop()}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setBlogForm(f => ({ ...f, bannerUrl: "" }))}
                            className="text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
                          >
                            Remove image
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          {isUploadingThumb ? (
                            <>
                              <Loader2 className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-spin" />
                              <span className="text-xs text-slate-500 dark:text-white/50">Uploading banner image...</span>
                            </>
                          ) : (
                            <>
                              <div className="text-xs text-slate-455 dark:text-white/40 mb-1">Upload a header image for your blog post</div>
                              <UploadButton
                                endpoint="folderImageUploader"
                                appearance={{
                                  button: "bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-colors duration-200",
                                  allowedContent: "hidden"
                                }}
                                onUploadBegin={() => setIsUploadingThumb(true)}
                                onClientUploadComplete={(res) => {
                                  if (res && res.length > 0) {
                                    setBlogForm(f => ({ ...f, bannerUrl: res[0].url }));
                                  }
                                  setIsUploadingThumb(false);
                                }}
                                onUploadError={(error) => {
                                  console.error(error);
                                  setIsUploadingThumb(false);
                                  toast.error("Image upload failed. Please try again.");
                                }}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="space-y-1.5 border-t border-slate-200 dark:border-white/5 pt-5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/55 block font-bold pl-1">
                      Blog Article Content (Markdown supported)
                    </label>
                    <textarea
                      name="content"
                      placeholder="Write your article here. Supports markdown syntax..."
                      value={blogForm.content}
                      onChange={handleBlogChange}
                      rows={12}
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-250 dark:border-white/10 rounded-xl py-3.5 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:border-amber-400 font-mono transition-colors resize-y"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isUploadingFile || isUploadingThumb}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-8 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Submitting to Curator..."
                    : submitMode === "media"
                    ? "Submit Media to Curator Review"
                    : submitMode === "folder"
                    ? "Submit Folder to Curator Review"
                    : "Submit Blog Article Draft"}
                </span>
              </button>
            </form>
          </div>
          )
        ) : (
          /* History Container */
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md shadow-2xl min-h-[300px]">
            {!user ? (
              <div className="text-center py-12 flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-400 dark:text-white/40">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Track Your Submissions</h3>
                <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm leading-relaxed">
                  Please log in to see all your previous contributions, track review statuses, and read curator feedback comments.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  Sign In Now
                </button>
              </div>
            ) : loadingHistory ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-10 h-10 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
                <span className="text-xs text-slate-500 dark:text-white/50">Fetching your submissions...</span>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center space-y-3">
                <h3 className="text-lg font-light text-slate-900 dark:text-white">No Submissions Found</h3>
                <p className="text-xs text-slate-400 dark:text-white/40 max-w-sm">
                  You haven't submitted any items yet. Contribute artifacts to get started!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("submit")}
                  className="text-xs text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-bold underline transition-colors"
                >
                  Submit your first item
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Submission History</h3>
                  <span className="text-[10px] text-slate-450 dark:text-white/40 font-mono">{submissions.length} Total items</span>
                </div>
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {submissions.map((item) => {
                    let typeConfig = MEDIA_TYPES.find(t => t.value === item.mediaType);
                    if (item.submissionType === "FOLDER") {
                      typeConfig = MEDIA_TYPES.find(t => t.value === "FOLDER");
                    } else if (item.submissionType === "BLOG") {
                      typeConfig = MEDIA_TYPES.find(t => t.value === "BLOG");
                    }
                    if (!typeConfig) {
                      typeConfig = MEDIA_TYPES.find(t => t.value === "OTHER");
                    }
                    const Icon = typeConfig.icon;
                    
                    // Status badge styling
                    let statusLabel = "Pending";
                    let statusStyle = "bg-yellow-500/10 border-yellow-500/25 text-yellow-600 dark:text-yellow-400";
                    if (item.status === "PUBLISHED") {
                      statusLabel = "Approved";
                      statusStyle = "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400";
                    } else if (item.status === "REJECTED") {
                      statusLabel = "Rejected";
                      statusStyle = "bg-red-500/10 border-red-500/25 text-red-600 dark:text-red-400";
                    }

                    return (
                      <div 
                        key={item.id}
                        className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] rounded-2xl p-4 sm:p-5 space-y-3 transition-colors hover:border-slate-300 dark:hover:border-white/10"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`p-2.5 rounded-xl border shrink-0 ${typeConfig.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate pr-2" title={item.title}>
                                {item.title}
                              </h4>
                              <div className="flex flex-wrap gap-2 items-center mt-1">
                                <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                                  {item.submissionType === "MEDIA" ? `Media (${typeConfig.label.split(" / ")[0]})` : item.submissionType}
                                </span>
                                <span className="text-[10px] text-slate-300 dark:text-white/20">•</span>
                                <span className="text-[10px] text-slate-500 dark:text-white/40 font-light">
                                  Submitted on {new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 w-fit ${statusStyle}`}>
                              {statusLabel}
                            </span>
                            {item.status !== "PUBLISHED" && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSubmission(item.id, item.submissionType)}
                                className="p-1.5 text-slate-400 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all cursor-pointer"
                                title="Delete Submission"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-650 dark:text-white/60 font-light line-clamp-2 pl-0 sm:pl-12">
                          {item.submissionType === "BLOG"
                            ? (item.content ? (item.content.length > 150 ? item.content.substring(0, 150) + "..." : item.content) : "No content provided.")
                            : (item.description || "No description provided.")}
                        </p>

                        {/* Display Curator Rejection Feedback */}
                        {item.status === "REJECTED" && (
                          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-3 text-[11px] sm:pl-12 pl-3 space-y-1 mt-2">
                            <span className="font-bold text-red-500 dark:text-red-400 uppercase tracking-wide text-[9px]">Feedback from Curator:</span>
                            <p className="text-slate-800 dark:text-white/80 font-light leading-relaxed">
                              {item.rejectionReason || "No feedback comments specified by reviewer."}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

