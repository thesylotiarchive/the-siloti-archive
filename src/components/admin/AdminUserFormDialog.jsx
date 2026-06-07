"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminUserFormDialog({ open, setOpen, initial = {}, onSubmit, loading, canManageSuperadmin }) {
  const isEdit = Boolean(initial?.id); // more reliable
  const [form, setForm] = useState({
    username: initial?.username || "",
    email: initial?.email || "",
    name: initial?.name || "",
    password: "",
    role: initial?.role || "ADMIN",
  });

  useEffect(() => {
    if (initial && initial?.id) {
      setForm({
        username: initial.username || "",
        email: initial.email || "",
        name: initial.name || "",
        password: "",
        role: initial.role || "ADMIN",
      });
    } else {
      setForm({ username: "", email: "", name: "", password: "", role: "ADMIN" });
    }
  }, [initial, open]);

  function setField(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal content */}
      <div className="relative z-50 w-[90%] max-w-lg rounded-[2rem] border border-slate-200/60 bg-white/95 p-8 shadow-2xl backdrop-blur-md">
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-950 hover:bg-slate-100 p-1.5 rounded-xl transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <h2 className="mb-6 text-xl font-serif italic font-bold bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent">
          {isEdit ? "Edit Account Details" : "Create New Admin Account"}
        </h2>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 pl-1 uppercase tracking-wider">Username</Label>
            <Input
              value={form.username}
              onChange={e => setField("username", e.target.value)}
              className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 py-5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 pl-1 uppercase tracking-wider">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={e => setField("email", e.target.value)}
              className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 py-5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 pl-1 uppercase tracking-wider">Name (optional)</Label>
            <Input
              value={form.name}
              onChange={e => setField("name", e.target.value)}
              className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 py-5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 pl-1 uppercase tracking-wider">
              {isEdit ? "New Password (leave empty to keep current)" : "Password"}
            </Label>
            <Input
              type="password"
              value={form.password}
              onChange={e => setField("password", e.target.value)}
              className="rounded-xl border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 py-5 text-sm"
            />
            {!isEdit && (
              <p className="mt-1 text-[10px] font-medium text-slate-400 pl-1">
                Minimum 8 characters required
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 pl-1 uppercase tracking-wider">Role Scope</Label>
            <select
              className="w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none"
              value={form.role}
              onChange={e => setField("role", e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="CONTRIBUTOR">CONTRIBUTOR</option>
              <option value="VIEWER">VIEWER</option>
              {canManageSuperadmin && <option value="SUPERADMIN">SUPERADMIN</option>}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer font-semibold px-5"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const payload = {
                username: form.username.trim(),
                email: form.email.trim(),
                name: form.name.trim() || null,
                role: form.role,
              };
              if (!isEdit || form.password) payload.password = form.password;
              onSubmit(payload, isEdit ? initial.id : null);
            }}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold shadow-md transition-all duration-300 cursor-pointer px-5"
          >
            {isEdit ? "Save Changes" : "Create Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
