"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, X } from "lucide-react"

export default function ConfirmDeleteDialog({ open, setOpen, target, onConfirm, loading }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/40 backdrop-blur-sm">
      <Card className="w-[90%] max-w-sm rounded-[2rem] border border-slate-200/60 bg-white/95 shadow-2xl backdrop-blur-md overflow-hidden">
        <CardContent className="p-6">
          {/* Header with Close button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif italic font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Delete Account
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-950 transition-all cursor-pointer"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">
            Are you sure you want to delete{" "}
            <strong className="text-slate-900 font-bold">"{target?.name || target?.username}"</strong>? This action will permanently remove their administrative credentials and cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
