"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2, Smartphone, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivityLog {
  id: string;
  messageCount: number;
  remarks: string | null;
  updatedAt: string;
}

interface WhatsAppAccount {
  id: string;
  phoneNumber: string;
  label: string | null;
  status: string;
  healthScore: number;
}

/** Maps any DB status to the simplified "Active" | "Banned" control value */
function toSimpleStatus(dbStatus: string): "ACTIVE" | "BANNED" {
  return dbStatus === "BANNED" ? "BANNED" : "ACTIVE";
}

export function DailyActivityForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [messageCount, setMessageCount] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [existingEntry, setExistingEntry] = useState<ActivityLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  // The simplified status shown in the Status dropdown
  const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "BANNED">("ACTIVE");

  // Fetch accounts and today's entry on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Re-fetch today's entry when account selection changes; also sync status dropdown
  useEffect(() => {
    fetchTodayEntry(selectedAccountId || null);
    if (selectedAccountId) {
      const acc = accounts.find((a) => a.id === selectedAccountId);
      if (acc) setSelectedStatus(toSimpleStatus(acc.status));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/whatsapp-accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch {
      // ignore
    }
  };

  const fetchTodayEntry = async (accountId: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const url = accountId
        ? `/api/activity-log?whatsAppAccountId=${accountId}`
        : "/api/activity-log";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch activity log");
      const data = await response.json();

      if (data.activityLog) {
        setExistingEntry(data.activityLog);
        setMessageCount(data.activityLog.messageCount);
        setRemarks(data.activityLog.remarks || "");
      } else {
        setExistingEntry(null);
        setMessageCount(0);
        setRemarks("");
      }
    } catch (err) {
      console.error("Error fetching activity log:", err);
      setError("Failed to load today's activity");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (messageCount < 0) {
      setError("Message count cannot be negative");
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const body: Record<string, unknown> = {
        messageCount,
        remarks: remarks.trim() || null,
        whatsAppAccountId: selectedAccountId || null
      };

      // Only send status update when a specific account is selected
      if (selectedAccountId) {
        body.whatsAppAccountStatus = selectedStatus;
      }

      const response = await fetch("/api/activity-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save activity log");
      }

      const data = await response.json();
      setExistingEntry(data.activityLog);
      setSaved(true);

      // Refresh accounts so status badge stays in sync
      await fetchAccounts();

      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      console.error("Error saving activity log:", err);
      setError(err instanceof Error ? err.message : "Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xs font-bold text-slate-900 dark:text-white">
            Daily Activity Update
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-4 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) ?? null;

  return (
    <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
      <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-xs font-bold text-slate-900 dark:text-white">
          Daily Activity Update
        </CardTitle>
        <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
          Log your daily message count and notes
        </p>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-3">
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* WhatsApp Account Selector */}
          {accounts.length > 0 && (
            <div className="space-y-2">
              {/* Number dropdown */}
              <div>
                <label
                  htmlFor="whatsAppAccount"
                  className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"
                >
                  <Smartphone className="h-3 w-3 text-[#00C853]" />
                  Tag to WhatsApp Number (Optional)
                </label>
                <select
                  id="whatsAppAccount"
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent"
                >
                  <option value="">General (all accounts)</option>
                  {accounts.map((acc) => {
                    const isBanned = acc.status === "BANNED";
                    const displayName = acc.label
                      ? `${acc.label} (${acc.phoneNumber})`
                      : acc.phoneNumber;
                    return (
                      <option key={acc.id} value={acc.id}>
                        {displayName}{isBanned ? " (Banned)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Status dropdown — only visible when a specific account is selected */}
              {selectedAccount && (
                <div>
                  <label
                    htmlFor="accountStatus"
                    className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"
                  >
                    <Shield className="h-3 w-3 text-slate-400" />
                    Status
                  </label>
                  <select
                    id="accountStatus"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as "ACTIVE" | "BANNED")}
                    className={`w-full px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent transition-colors ${selectedStatus === "BANNED"
                        ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        : "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      }`}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="BANNED">Banned</option>
                  </select>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {selectedStatus === "BANNED"
                      ? "Marked as banned — will be saved on Submit."
                      : "Account is active — status saved on Submit."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Message Count */}
          <div>
            <label
              htmlFor="messageCount"
              className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Messages Sent Today <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="messageCount"
              min="0"
              required
              value={messageCount}
              onChange={(e) => setMessageCount(parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Remarks */}
          <div>
            <label
              htmlFor="remarks"
              className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent resize-none"
              placeholder="Any notes about today's activity..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1.5 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {saved && (
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1.5 rounded flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Activity saved successfully!
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full h-8 text-[10px] font-semibold bg-[#00C853] hover:bg-[#00a845] text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-1" />
                {existingEntry ? "Update" : "Save"}
              </>
            )}
          </Button>

          {/* Last Updated */}
          {existingEntry && (
            <p className="text-[8px] text-slate-400 dark:text-slate-500 text-center">
              Last updated: {new Date(existingEntry.updatedAt).toLocaleString()}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
