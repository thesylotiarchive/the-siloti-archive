"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/admin/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const data = await res.json();
      setError(data.message || "Admin login failed");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="bg-card text-card-foreground border border-border p-6 rounded-xl w-[90%] max-w-md space-y-4 shadow-md"
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/logo.png" // put your logo in public/logo.png
            alt="Logo"
            className="w-12 h-12"
          />
          <h1 className="text-2xl font-bold">Sylheti Archive Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>

        {/* Error message */}
        {error && <p className="text-destructive text-sm">{error}</p>}

        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          onChange={handleChange}
          value={form.email}
          required
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
        />

        {/* Password input with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
            className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </main>
  );
}
