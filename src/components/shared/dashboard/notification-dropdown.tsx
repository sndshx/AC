"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Brain,
  User,
  Clock,
  X,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { usePathname } from "next/navigation";
import Link from "next/link";

type DbNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

function getIcon(type: string) {
  switch (type) {
    case "TASK_ASSIGNED":
    case "TASK_COMPLETED":
      return CheckCircle2;
    case "AI_RECOMMENDATION":
      return Brain;
    case "ADMIN_REMARK":
      return User;
    case "CALENDAR_REMINDER":
      return Calendar;
    case "WHATSAPP_WARNING":
    case "WHATSAPP_BAN":
      return AlertCircle;
    default:
      return Bell;
  }
}

function getColor(type: string) {
  switch (type) {
    case "TASK_ASSIGNED":
    case "TASK_COMPLETED":
      return "bg-blue-500";
    case "AI_RECOMMENDATION":
      return "bg-[#00C853]";
    case "ADMIN_REMARK":
      return "bg-purple-500";
    case "CALENDAR_REMINDER":
      return "bg-orange-500";
    case "WHATSAPP_WARNING":
      return "bg-yellow-500";
    case "WHATSAPP_BAN":
      return "bg-red-500";
    default:
      return "bg-slate-500";
  }
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const basePath = pathname.startsWith("/admin") ? "/admin" : "/user";

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount so the red dot reflects real unread count immediately
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Re-fetch (and reset expanded) whenever dropdown is opened
  useEffect(() => {
    if (open) {
      fetchNotifications();
      setExpandedId(null);
    }
  }, [open, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function markAsRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  }

  async function markAllAsRead() {
    setMarkingAll(true);
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    const now = new Date().toISOString();
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
    setMarkingAll(false);
  }

  function handleItemClick(n: DbNotification) {
    // Toggle expand
    setExpandedId((prev) => (prev === n.id ? null : n.id));
    // Auto mark as read when opening
    if (!n.readAt && expandedId !== n.id) {
      markAsRead(n.id);
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        title="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
        )}
      </Button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-[26rem] z-50 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#00C853]" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-4">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllAsRead}
                disabled={markingAll || unreadCount === 0}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold border border-[#00C853] text-[#00C853] hover:bg-[#00C853] hover:text-white active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Check className="h-3 w-3" />
                {markingAll ? "Marking…" : "Mark all read"}
              </button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="h-7 w-7"
                aria-label="Close notifications"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[440px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                <Bell className="h-8 w-8 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = getIcon(n.type);
                const color = getColor(n.type);
                const isUnread = !n.readAt;
                const isExpanded = expandedId === n.id;

                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 cursor-pointer transition-colors select-none ${
                      isUnread
                        ? "bg-[#E8F7EE]/30 dark:bg-[#143D2C]/10 hover:bg-[#E8F7EE]/50 dark:hover:bg-[#143D2C]/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                    onClick={() => handleItemClick(n)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-full ${color} flex items-center justify-center mt-0.5`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                            {n.title}
                            {isUnread && (
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00C853] flex-shrink-0" />
                            )}
                          </p>
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5 whitespace-nowrap">
                              tap to expand
                            </span>
                          )}
                        </div>

                        {/* Message — truncated when collapsed, full when expanded */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                          {isExpanded
                            ? n.message
                            : n.message.length > 70
                            ? n.message.slice(0, 70) + "…"
                            : n.message}
                        </p>

                        {/* Expanded detail block */}
                        {isExpanded && (
                          <div
                            className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(n.createdAt), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                              {n.readAt ? (
                                <span className="flex items-center gap-1 text-[#00C853]">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Read
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(n.id);
                                  }}
                                  className="flex items-center gap-1 text-[#00C853] hover:underline"
                                >
                                  <Check className="h-3 w-3" />
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Timestamp (collapsed view) */}
                        {!isExpanded && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                            <Clock className="h-2.5 w-2.5" />
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {!loading && notifications.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 text-center">
              <Link
                href={`${basePath}/notifications`}
                className="text-xs text-[#00C853] hover:underline font-medium"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
