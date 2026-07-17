"use client";

import { useState, useEffect } from "react";
import { Plus, Smartphone, Loader2, CheckCircle2, AlertTriangle, ShieldOff, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WhatsAppAccount {
  id: string;
  phoneNumber: string;
  label: string | null;
  status: string;
  healthScore: number;
  dailyMessages: number;
  monthlyMessages: number;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  ACTIVE:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  WARNING: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  LIMITED: "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
  BANNED:  "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "WARNING") return <AlertTriangle className="h-3 w-3" />;
  if (status === "LIMITED") return <ShieldOff className="h-3 w-3" />;
  if (status === "BANNED") return <Ban className="h-3 w-3" />;
  return <CheckCircle2 className="h-3 w-3" />;
};

export function WhatsAppAccountsManager() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp-accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const res = await fetch("/api/whatsapp-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim(), label: label.trim() || null })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add account");
      }

      setAccounts((prev) => [data.account, ...prev]);
      setPhoneNumber("");
      setLabel("");
      setShowForm(false);
      setSuccess("WhatsApp number added successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add account");
    } finally {
      setAdding(false);
    }
  };

  // Combined aggregated stats
  const totalDailyMessages = accounts.reduce((s, a) => s + a.dailyMessages, 0);
  const totalMonthlyMessages = accounts.reduce((s, a) => s + a.monthlyMessages, 0);
  const avgHealth = accounts.length > 0
    ? Math.round(accounts.reduce((s, a) => s + a.healthScore, 0) / accounts.length)
    : 0;
  const statusPriority = { BANNED: 4, LIMITED: 3, WARNING: 2, ACTIVE: 1 } as const;
  const worstStatus = accounts.length > 0
    ? accounts.reduce((worst, acc) => {
        const p = statusPriority[acc.status as keyof typeof statusPriority] ?? 0;
        return p > (statusPriority[worst as keyof typeof statusPriority] ?? 0) ? acc.status : worst;
      }, "ACTIVE")
    : "ACTIVE";

  return (
    <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
      <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-[#00C853]" />
              WhatsApp Numbers
            </CardTitle>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
              Manage all your tracked WhatsApp accounts
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => { setShowForm((v) => !v); setError(null); }}
            className="h-6 text-[10px] px-2 bg-[#00C853] hover:bg-[#00a845] text-white"
          >
            <Plus className="h-3 w-3 mr-0.5" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-3 space-y-3">

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleAdd} className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +447911123456"
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Label (Optional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Main Office, Support Line"
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent"
              />
            </div>
            {error && (
              <p className="text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">{error}</p>
            )}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={adding}
                className="flex-1 h-7 text-[10px] bg-[#00C853] hover:bg-[#00a845] text-white"
              >
                {adding ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                {adding ? "Adding..." : "Add Number"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setShowForm(false); setError(null); }}
                className="h-7 text-[10px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Success Banner */}
        {success && (
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1.5 rounded flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {success}
          </div>
        )}



        {/* Account List */}
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-4 text-slate-400 dark:text-slate-500">
            <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-[10px]">No WhatsApp numbers added yet.</p>
            <p className="text-[9px] mt-0.5">Click &ldquo;Add&rdquo; to track your first number.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[85px] overflow-y-auto pr-0.5 scrollbar-thin">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {acc.label || acc.phoneNumber}
                    </span>
                    {acc.status === "BANNED" && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        🚫 Banned
                      </span>
                    )}
                  </div>
                  {acc.label && <p className="text-[9px] text-slate-400 font-mono">{acc.phoneNumber}</p>}
                  <div className="flex gap-3 mt-1">
                    <span className="text-[9px] text-slate-500">Today: <span className="font-semibold text-slate-700 dark:text-slate-300">{acc.dailyMessages}</span></span>
                    <span className="text-[9px] text-slate-500">Monthly: <span className="font-semibold text-slate-700 dark:text-slate-300">{acc.monthlyMessages}</span></span>
                    <span className="text-[9px] text-slate-500">Health: <span className={`font-semibold ${acc.healthScore >= 80 ? "text-emerald-600" : acc.healthScore >= 60 ? "text-amber-600" : "text-red-600"}`}>{acc.healthScore}%</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overall Status Summary */}
        {accounts.length > 0 && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-500">{accounts.length} number{accounts.length !== 1 ? "s" : ""} tracked</span>
            <span className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${statusColor[worstStatus] ?? statusColor.ACTIVE}`}>
              <StatusIcon status={worstStatus} />
              Overall: {worstStatus}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
