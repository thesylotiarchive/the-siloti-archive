"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Signup failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="bg-card text-card-foreground border border-border p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-semibold">Sign Up</h1>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={form.username}
          required
          className="w-full p-2 border border-input rounded-md bg-background text-foreground"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
          className="w-full p-2 border border-input rounded-md bg-background text-foreground"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
          className="w-full p-2 border border-input rounded-md bg-background text-foreground"
        />
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90"
        >
          Create Account
        </button>
      </form>
    </main>
  );
}