"use client";

import { useEffect } from "react";

export default function MediaViewPing({ mediaId }) {
  useEffect(() => {
    if (!mediaId) return;

    const url = `/api/public/media/${mediaId}/view`;
    try {
      if ("sendBeacon" in navigator) {
        // Send an empty body; the route only needs method & headers/IP
        const blob = new Blob([], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, { method: "POST", cache: "no-store", keepalive: true }).catch(
          () => {}
        );
      }
    } catch {
      // ignore
    }
  }, [mediaId]);

  return null;
}
