"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, X } from "lucide-react"

export default function ConfirmDeleteDialog({ open, setOpen, target, onConfirm, loading }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <Card className="w-[90%] max-w-sm rounded-2xl shadow-lg">
        <CardContent className="p-6">
          {/* Header with Close button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Delete Admin</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-muted"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to delete{" "}
            <strong>{target?.name || target?.username}</strong>? This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
