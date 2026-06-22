"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">Secure Access</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-center text-slate-800 dark:text-white mb-2 leading-tight">
            Welcome <span className="font-serif italic font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">Back</span>
          </h2>
          <p className="text-slate-500 dark:text-white/55 text-xs sm:text-sm font-light text-center">Sign in to manage your collections and archive contributions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Email or Username Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold pl-1">
              Email or Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="email"
                placeholder="name@example.com or username"
                onChange={handleChange}
                value={form.email}
                required
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-805 dark:text-white placeholder-slate-400 dark:placeholder-white/35 focus:outline-none focus:border-emerald-500 focus:dark:border-emerald-400 transition-colors duration-300"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40 block font-semibold">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                value={form.password}
                required
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95 text-sm"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-slate-500 dark:text-white/40 text-xs mt-8">
          Don't have an account?{" "}
          <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}