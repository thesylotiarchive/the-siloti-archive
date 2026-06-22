"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

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

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "", avatarUrl: "" });
  const [avatarTab, setAvatarTab] = useState("svg"); // "svg" or "upload"
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        avatarUrl: form.avatarUrl || undefined,
      }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || data.message || "Signup failed");
    }
  };

  return (
    <section className="relative z-10 w-full min-h-[calc(100vh-220px)] flex items-center justify-center py-12 px-4 selection:bg-emerald-400 selection:text-slate-950">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md shadow-2xl transition-colors duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200/50 dark:bg-white/5 border border-slate-350 dark:border-white/10 rounded-full mb-4 transition-colors duration-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-505 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">Contributor Portal</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-center text-slate-800 dark:text-white mb-2 leading-tight">
            Create <span className="font-serif italic font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">Account</span>
          </h2>
          <p className="text-slate-500 dark:text-white/50 text-xs sm:text-sm font-light text-center">Join the archive community and submit field documentations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-xs font-semibold font-sans">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                value={form.name}
                required
                autoComplete="off"
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-805 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors duration-300"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                onChange={handleChange}
                value={form.username}
                required
                autoComplete="off"
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-805 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors duration-300"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                onChange={handleChange}
                value={form.email}
                required
                autoComplete="off"
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-805 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors duration-300"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                value={form.password}
                required
                autoComplete="new-password"
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-sm text-slate-805 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors duration-300"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-900 hover:dark:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                onChange={handleChange}
                value={form.confirmPassword}
                required
                autoComplete="new-password"
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-sm text-slate-805 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors duration-300"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Profile Picture (Optional) */}
          <div className="space-y-3.5 border border-slate-250 dark:border-white/10 bg-slate-200/20 dark:bg-white/[0.01] rounded-2xl p-4 transition-colors duration-300">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
                Profile Picture (Optional)
              </label>
              {form.avatarUrl && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, avatarUrl: "" })}
                  className="text-[10px] text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 hover:dark:text-emerald-300 transition-colors uppercase font-bold cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-slate-900/60 overflow-hidden flex items-center justify-center shrink-0 transition-colors duration-300">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="Profile Preview"
                    className={`w-full h-full object-cover ${form.avatarUrl.startsWith("/svg_profiles/") ? "scale-[1.3]" : ""}`}
                  />
                ) : (
                  <div className="text-slate-400 dark:text-white/35 text-[9px] font-medium text-center leading-normal">
                    Random<br />Default
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-700 dark:text-white/70 font-semibold truncate">
                  {form.avatarUrl ? "Selected avatar ready" : "No avatar chosen"}
                </p>
                <p className="text-[10px] text-slate-550 dark:text-white/40 font-light mt-0.5 leading-snug">
                  {form.avatarUrl ? "You can change your avatar choice below." : "A random default SVG avatar will be assigned automatically."}
                </p>
              </div>
            </div>

            {/* Selector Options Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-slate-200/50 dark:bg-white/5 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAvatarTab("svg")}
                className={`py-1.5 text-[11px] rounded-lg transition-all cursor-pointer ${
                  avatarTab === "svg"
                    ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white font-semibold shadow-sm"
                    : "text-slate-500 dark:text-white/40 hover:text-slate-800 hover:dark:text-white/70"
                }`}
              >
                Choose Avatar
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab("upload")}
                className={`py-1.5 text-[11px] rounded-lg transition-all cursor-pointer ${
                  avatarTab === "upload"
                    ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white font-semibold shadow-sm"
                    : "text-slate-500 dark:text-white/40 hover:text-slate-800 hover:dark:text-white/70"
                }`}
              >
                Upload Image
              </button>
            </div>

            {/* Tab Contents */}
            {avatarTab === "svg" ? (
              <div className="grid grid-cols-5 gap-1.5 max-h-28 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                {SVG_PROFILES.map((svg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setForm({ ...form, avatarUrl: svg })}
                    className={`aspect-square rounded-lg p-1 bg-slate-200/30 dark:bg-white/5 hover:bg-slate-200/60 hover:dark:bg-white/10 border transition-all overflow-hidden cursor-pointer ${
                      form.avatarUrl === svg
                        ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/10 scale-95"
                        : "border-slate-200 dark:border-white/5"
                    }`}
                  >
                    <img src={svg} alt={`Avatar ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 bg-slate-200/30 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-xl min-h-[70px]">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                    <span className="text-[9px] text-slate-400 dark:text-white/50">Uploading image...</span>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="folderImageUploader"
                    appearance={{
                      button: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold py-1.5 px-3 rounded-lg cursor-pointer shadow-md active:scale-95 transition-transform duration-200",
                      allowedContent: "hidden"
                    }}
                    onUploadBegin={() => setIsUploading(true)}
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        setForm(f => ({ ...f, avatarUrl: res[0].url }));
                      }
                      setIsUploading(false);
                    }}
                    onUploadError={(error) => {
                      console.error(error);
                      setIsUploading(false);
                      alert("Upload failed. Make sure the image size is under 3MB.");
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading Profile Image..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-slate-500 dark:text-white/40 text-xs mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}