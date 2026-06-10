'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bell, X, Check, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/public/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  // Fetch count and notifications on mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch when dropdown is opened to guarantee fresh data
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/public/notifications', { method: 'PATCH' });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const res = await fetch(`/api/public/notifications/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent triggering item click
    try {
      const res = await fetch(`/api/public/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        // Recalculate unreadCount
        const deleted = notifications.find((n) => n.id === id);
        if (deleted && !deleted.read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
      }
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const handleNotificationClick = async (n) => {
    if (!n.read) {
      await handleMarkRead(n.id);
    }
    setIsOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer outline-none flex items-center justify-center"
        title="Notifications"
        type="button"
      >
        <Bell className="w-5 h-5 text-white/90 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3.5 w-80 bg-slate-950/95 border border-white/10 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-md z-[100] animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
            <span className="font-extrabold text-[15px] tracking-wide text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                type="button"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-white/40 text-xs font-light">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={clsx(
                    "group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-2.5 items-start",
                    n.read
                      ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"
                      : "bg-emerald-400/[0.02] border-emerald-400/20 hover:bg-emerald-400/[0.04] hover:border-emerald-400/30"
                  )}
                >
                  {/* Unread indicator */}
                  {!n.read && (
                    <span className="absolute top-3.5 left-2 w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                  )}

                  {/* Body */}
                  <div className={clsx("flex-1 space-y-1 pr-6", !n.read ? "pl-2" : "")}>
                    <h5 className="text-[13px] font-bold leading-snug text-white/90">
                      {n.title}
                    </h5>
                    <p className="text-[11px] font-light leading-relaxed text-white/60 group-hover:text-white/80 transition-colors">
                      {n.message}
                    </p>
                    <span className="block text-[9px] text-white/40 font-light">
                      {new Date(n.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleDelete(e, n.id)}
                      className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete notification"
                      type="button"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
