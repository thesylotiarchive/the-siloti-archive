"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Plus, Shield } from "lucide-react";
import { AdminUserFormDialog } from "./AdminUserFormDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

function AvatarCircle({ text }) {
  const letter = (text || "?").trim()[0]?.toUpperCase() || "?";
  return (
    <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 shadow-inner">
      {letter}
    </div>
  );
}

function RoleBadge({ role }) {
  const color =
    role === "SUPERADMIN" ? "bg-red-50 border-red-200 text-red-700" :
    role === "ADMIN" ? "bg-blue-50 border-blue-200 text-blue-700" :
    role === "CONTRIBUTOR" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
    "bg-slate-50 border-slate-200 text-slate-700";
  return <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${color}`}>{role}</span>;
}

export default function AdminUsersManager({ initialMe = {}, canManageSuperadmin = false }) {
  const [me, setMe] = useState(initialMe || { id: "", username: "", email: "", role: "ADMIN" });
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  // Tabs: admins (includes SUPERADMIN + ADMIN), contributors, viewers
  const tabs = [
    { key: "admins", label: "Admins" },
    { key: "contributors", label: "Contributors" },
    { key: "viewers", label: "Viewers" },
  ];
  const [activeTab, setActiveTab] = useState("admins");

  // editing / dialogs
  const [editing, setEditing] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const filtered = useMemo(() => {
    if (!Array.isArray(users)) return [];
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter(u =>
      u && [u.username, u.email, u.name].filter(Boolean).some(v => v.toLowerCase().includes(s))
    );
  }, [q, users]);

  useEffect(() => {
    // load users for the active tab on mount and when tab changes
    refreshList(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function refreshList(tabKey) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?role=${encodeURIComponent(tabKey)}`, { cache: "no-store" });
      const data = await res.json();
      const list = Array.isArray(data?.users) ? data.users : Array.isArray(data?.admins) ? data.admins : [];
      setUsers(list);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
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
      await refreshList(activeTab);
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
      await refreshList(activeTab);
      setOpenDelete(false);
      setDeleting(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/50 pb-5">
        <div>
          <h2 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Account Management
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">Manage administrative credentials, user statuses, and permission scopes.</p>
        </div>
        <Button 
          onClick={() => { setEditing(null); setOpenForm(true); }}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition-all duration-300 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" /> New Account
        </Button>
      </div>

      {/* Current Admin Card */}
      {me && (
        <Card className="bg-white/70 border-slate-200/60 shadow-sm backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <AvatarCircle text={me?.name || me?.username} />
            <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
              <div className="flex flex-col">
                <CardTitle className="flex items-center gap-2 flex-wrap text-lg font-bold text-slate-800">
                  {me?.name || me?.username}
                  <RoleBadge role={me?.role} />
                </CardTitle>
                <div className="text-xs text-slate-400 font-medium">
                  {me?.email || ""} • {me?.username || ""}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-2 sm:mt-0">
                <Shield className="h-4 w-4 text-emerald-600 opacity-80" />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-slate-700 border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                  onClick={() => { setEditing(me); setOpenForm(true); }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Profile
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Controls Bar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Tabs Segment Switcher */}
        <div className="flex p-1 bg-slate-100/80 border border-slate-200/40 rounded-xl w-fit gap-1 backdrop-blur-md">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === t.key
                  ? "bg-white text-slate-950 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <Input
          placeholder="Search by name, username, or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md bg-white border-slate-200/80 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 py-5 text-sm"
        />
      </div>

      {/* Users list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(u => (
          <Card key={u.id} className="bg-white/70 border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col justify-between group">
            <CardHeader className="flex flex-row items-center gap-4 p-5 pb-3">
              <AvatarCircle text={u?.name || u?.username || ""} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900 truncate max-w-[120px]">{u?.name || u?.username || ""}</span>
                  <RoleBadge role={u?.role || ""} />
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5" title={u?.email}>
                  {u?.email || ""} • {u?.username || ""}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-end gap-2 p-5 pt-0 border-t border-slate-100/50 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                onClick={() => { setEditing(u); setOpenForm(true); }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 font-semibold cursor-pointer"
                onClick={() => { setDeleting(u); setOpenDelete(true); }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
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
        onSubmit={(payload, id) => handleCreateOrUpdate(payload, id)}
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
