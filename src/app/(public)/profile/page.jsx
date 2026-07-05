"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, Calendar, Camera, Save, ArrowLeft } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "react-hot-toast";

const SVG_PROFILES = [
  "/svg_profiles/avatar-b3pecmvkyo.svg",
  "/svg_profiles/avatar-gmpcrnhlbo (1).svg",
  "/svg_profiles/avatar-gmpcrnhlbo.svg",
  "/svg_profiles/avatar-ixjd8yjzux (1).svg",
  "/svg_profiles/avatar-ixjd8yjzux.svg",
  "/svg_profiles/avatar-naezrfctlz (1).svg",
  "/svg_profiles/avatar-naezrfctlz (2).svg",
  "/svg_profiles/avatar-naezrfctlz.svg",
  "/svg_profiles/avatar-nxdqw8tyon (1).svg",
  "/svg_profiles/avatar-nxdqw8tyon (2).svg",
  "/svg_profiles/avatar-nxdqw8tyon.svg",
  "/svg_profiles/avatar-ut5pkxey8b.svg",
  "/svg_profiles/avatar-x7kv7ded8n (1).svg",
  "/svg_profiles/avatar-x7kv7ded8n.svg",
  "/svg_profiles/avatar-znwxkkstkw.svg",
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updatingDetails, setUpdatingDetails] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarTab, setAvatarTab] = useState("svg"); // "svg" or "upload"

  const [user, setUser] = useState(null);
  const [detailsForm, setDetailsForm] = useState({ name: "", email: "", avatarUrl: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setDetailsForm({
          name: data.user.name || "",
          email: data.user.email || "",
          avatarUrl: data.user.avatarUrl || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Please sign in to view your profile");
        router.push("/login");
      });
  }, [router]);

  const handleDetailsChange = (e) => {
    setDetailsForm({ ...detailsForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (svgPath) => {
    setDetailsForm({ ...detailsForm, avatarUrl: svgPath });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setUpdatingDetails(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: detailsForm.name,
          email: detailsForm.email,
          avatarUrl: detailsForm.avatarUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile details updated successfully");
        setUser(data.user);
        // If email or details changed, reload the page or update session to sync header
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.error || "Failed to update profile details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating profile details");
    } finally {
      setUpdatingDetails(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setUpdatingPassword(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password changed successfully");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="relative z-10 w-full min-h-[calc(100vh-220px)] flex items-center justify-center py-12 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500 dark:text-white/50">Loading profile data...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-220px)] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-400 selection:text-slate-950">
      {/* Background glow effects */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-650 dark:text-emerald-300">My Account Settings</span>
          </div>
        </div>

        {/* Profile Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: User Profile Overview Card */}
          <div className="bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col items-center text-center space-y-6 h-fit transition-colors duration-300">
            
            {/* Display Big Avatar */}
            <div className="relative w-28 h-28 rounded-full border border-white/20 bg-slate-900/60 overflow-hidden flex items-center justify-center shadow-lg group">
              {detailsForm.avatarUrl ? (
                <img
                  src={detailsForm.avatarUrl}
                  alt={user?.name || user?.username}
                  className={`w-full h-full object-cover ${detailsForm.avatarUrl.startsWith("/svg_profiles/") ? "scale-[1.3]" : ""}`}
                />
              ) : (
                <span className="text-white/30 text-lg">Avatar</span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-light text-slate-805 dark:text-white leading-tight">
                {user?.name || <span className="italic text-slate-500 dark:text-white/30">No Name Set</span>}
              </h3>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-1 font-mono">@{user?.username}</p>
            </div>

            {/* Badges/Details */}
            <div className="w-full space-y-3 pt-4 border-t border-slate-200 dark:border-white/5">
              {/* Role Badge */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-white/40">Role</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest rounded-full text-[9px]">
                  {user?.role}
                </span>
              </div>

              {/* Joined Date */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-white/40 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-white/30" /> Joined
                </span>
                <span className="text-slate-700 dark:text-white/70 font-medium">
                  {formatDate(user?.createdAt)}
                </span>
              </div>

              {/* Email display */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-white/40 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-white/30" /> Email
                </span>
                <span className="text-slate-700 dark:text-white/70 font-medium truncate max-w-[150px]" title={user?.email}>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editing Sections */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Profile Update Details Card */}
            <div className="bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6 transition-colors duration-300">
              <h4 className="text-lg font-medium text-slate-805 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                Personal Information
              </h4>

              <form onSubmit={handleDetailsSubmit} className="space-y-5">
                
                {/* Name & Email inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={detailsForm.name}
                      onChange={handleDetailsChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={detailsForm.email}
                      onChange={handleDetailsChange}
                      required
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-805 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Username (Disabled) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/30 block font-semibold pl-1">
                    Username (Cannot be changed)
                  </label>
                  <input
                    type="text"
                    value={user?.username || ""}
                    disabled
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl py-3 px-4 text-sm text-slate-500 dark:text-white/40 cursor-not-allowed transition-colors duration-300"
                  />
                </div>

                {/* Avatar Selection Area */}
                <div className="space-y-3.5 border border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-white/[0.01] rounded-2xl p-4 transition-colors duration-300">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
                    Change Profile Picture
                  </label>

                  {/* Selector Options Tabs */}
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl transition-colors duration-300">
                    <button
                      type="button"
                      onClick={() => setAvatarTab("svg")}
                      className={`py-1.5 text-[11px] rounded-lg transition-all cursor-pointer ${
                        avatarTab === "svg"
                          ? "bg-white dark:bg-white/10 text-slate-805 dark:text-white font-semibold shadow-xs"
                          : "text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white/70"
                      }`}
                    >
                      Choose Avatar Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarTab("upload")}
                      className={`py-1.5 text-[11px] rounded-lg transition-all cursor-pointer ${
                        avatarTab === "upload"
                          ? "bg-white dark:bg-white/10 text-slate-805 dark:text-white font-semibold shadow-xs"
                          : "text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white/70"
                      }`}
                    >
                      Upload Custom Image
                    </button>
                  </div>

                  {/* Tab Contents */}
                  {avatarTab === "svg" ? (
                    <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {SVG_PROFILES.map((svg, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAvatarSelect(svg)}
                          className={`aspect-square rounded-lg p-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border transition-all overflow-hidden ${
                            detailsForm.avatarUrl === svg
                              ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/10 scale-95"
                              : "border-slate-200 dark:border-white/5"
                          }`}
                        >
                          <img src={svg} alt={`Avatar ${idx + 1}`} className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-250 dark:border-white/10 rounded-xl min-h-[80px] transition-colors duration-300">
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></div>
                          <span className="text-[10px] text-slate-500 dark:text-white/50">Uploading image...</span>
                        </div>
                      ) : (
                        <UploadButton
                          endpoint="folderImageUploader"
                          appearance={{
                            button: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold py-1.5 px-3.5 rounded-lg cursor-pointer shadow-md active:scale-95 transition-transform duration-200",
                            allowedContent: "hidden"
                          }}
                          onUploadBegin={() => setIsUploading(true)}
                          onClientUploadComplete={(res) => {
                            if (res && res.length > 0) {
                              setDetailsForm(f => ({ ...f, avatarUrl: res[0].url }));
                              toast.success("Custom image uploaded. Make sure to click save below.");
                            }
                            setIsUploading(false);
                          }}
                          onUploadError={(error) => {
                            console.error(error);
                            setIsUploading(false);
                            toast.error("Upload failed. Make sure size is under 3MB.");
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingDetails || isUploading}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {updatingDetails ? "Saving details..." : "Save Details"}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6 transition-colors duration-300">
              <h4 className="text-lg font-medium text-slate-805 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                Change Password
              </h4>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    {updatingPassword ? "Updating password..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
