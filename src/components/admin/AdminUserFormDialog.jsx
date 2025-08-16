"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminUserFormDialog({ open, setOpen, initial, onSubmit, loading, canManageSuperadmin }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    username: initial?.username || "",
    email: initial?.email || "",
    name: initial?.name || "",
    password: "",
    role: initial?.role || "ADMIN",
  });

  useEffect(() => {
    if (initial) {
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

  function set(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Modal content */}
      <div className="relative z-50 w-[90%] max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <h2 className="mb-4 text-lg font-semibold">
          {isEdit ? "Edit Admin" : "Create Admin"}
        </h2>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={e => set("username", e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={e => set("email", e.target.value)}
            />
          </div>

          <div>
            <Label>Name (optional)</Label>
            <Input
              value={form.name}
              onChange={e => set("name", e.target.value)}
            />
          </div>

          <div>
            <Label>
              {isEdit ? "New Password (leave empty to keep current)" : "Password"}
            </Label>
            <Input
              type="password"
              value={form.password}
              onChange={e => set("password", e.target.value)}
            />
            {!isEdit && (
              <p className="mt-1 text-xs text-muted-foreground">
                Minimum 8 characters
              </p>
            )}
          </div>

          <div>
            <Label>Role</Label>
            <select
              className="w-full rounded-md border bg-background px-3 py-2"
              value={form.role}
              onChange={e => set("role", e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              {canManageSuperadmin && <option value="SUPERADMIN">SUPERADMIN</option>}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
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
          >
            {isEdit ? "Save Changes" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
