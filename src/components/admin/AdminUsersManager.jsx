"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Plus, Shield } from "lucide-react";
import { AdminUserFormDialog } from "./AdminUserFormDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

function AvatarCircle({ text }) {
  const letter = (text || "?").trim()[0]?.toUpperCase() || "?";
  return (
    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
      {letter}
    </div>
  );
}

function RoleBadge({ role }) {
  const color =
    role === "SUPERADMIN" ? "bg-red-100 text-red-700" :
    role === "ADMIN" ? "bg-blue-100 text-blue-700" :
    role === "CONTRIBUTOR" ? "bg-amber-100 text-amber-700" :
    "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-1 rounded text-xs ${color}`}>{role}</span>;
}

export default function AdminUsersManager({ initialMe, initialAdmins, canManageSuperadmin }) {
  const [me, setMe] = useState(initialMe || { id: "", username: "", email: "", role: "ADMIN" });
  const [admins, setAdmins] = useState(initialAdmins || []);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    if (!admins) return [];
    const s = q.trim().toLowerCase();
    if (!s) return admins;
    return admins.filter(u =>
      [u.username, u.email, u.name].filter(Boolean).some(v => v.toLowerCase().includes(s))
    );
  }, [q, admins]);

  const [editing, setEditing] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  async function refreshList() {
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      setAdmins(Array.isArray(data?.admins) ? data.admins : []);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateOrUpdate(payload, id) {
    setLoading(true);
    try {
      const res = await fetch(id ? `/api/admin/users/${id}` : "/api/admin/users", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      await refreshList();
      setOpenForm(false);
      setEditing(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      await refreshList();
      setOpenDelete(false);
      setDeleting(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Admin Users</h1>
        <Button onClick={() => { setEditing(null); setOpenForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Admin
        </Button>
      </div>

      {/* Current Admin Card */}
      {me && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
            <AvatarCircle text={me?.name || me?.username} />
            <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
              <div className="flex flex-col">
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  {me?.name || me?.username}
                  <RoleBadge role={me?.role} />
                </CardTitle>
                <div className="text-sm text-muted-foreground truncate">
                  {me?.email} • {me?.username}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-2 sm:mt-0">
                <Shield className="h-5 w-5 opacity-70" />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => { setEditing(me); setOpenForm(true); }}
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Search */}
      <Input
        placeholder="Search admin by name, username, or email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-md"
      />

      {/* Admins list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered
          .filter(u => u?.id && u.id !== me?.id)
          .map((u) => (
            <Card key={u.id} className="shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                <AvatarCircle text={u.name || u.username} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{u.name || u.username}</span>
                    <RoleBadge role={u.role} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {u.email} • {u.username}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setEditing(u); setOpenForm(true); }}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => { setDeleting(u); setOpenDelete(true); }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardContent>
            </Card>
        ))}
      </div>

      {/* Dialogs */}
      <AdminUserFormDialog
        open={openForm}
        setOpen={setOpenForm}
        initial={editing || {}}
        loading={loading}
        canManageSuperadmin={canManageSuperadmin}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmDeleteDialog
        open={openDelete}
        setOpen={setOpenDelete}
        target={deleting || {}}
        loading={loading}
        onConfirm={() => deleting && handleDelete(deleting.id)}
      />
    </div>
  );
}
