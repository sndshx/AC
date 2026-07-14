"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2, RefreshCw, User, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActivityLogWithUser {
  id: string;
  messageCount: number;
  remarks: string | null;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export function DailyActivityList() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLogWithUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivityLogs();
  }, [selectedDate]);

  const fetchActivityLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/activity-logs?date=${selectedDate}`);
      if (!response.ok) {
        throw new Error("Failed to fetch activity logs");
      }
      const data = await response.json();
      setActivityLogs(data.activityLogs || []);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      setError("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActivityLogs();
    setRefreshing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
      <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <MessageSquare className="h-3 w-3 text-[#00C853]" />
              Daily Activity Updates
            </CardTitle>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Team message counts and remarks for {formatDate(selectedDate)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-1.5 text-[9px]"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="h-3 w-3 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="text-[10px] px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C853]"
          />
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-2 rounded text-center">
            {error}
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center py-8">
            No activity updates for this date
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <div className="h-6 w-6 rounded-full bg-[#E8F7EE] dark:bg-[#143D2C] flex items-center justify-center flex-shrink-0">
                      <User className="h-3 w-3 text-[#143D2C] dark:text-[#E8F7EE]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {log.user.fullName}
                      </p>
                      <p className="text-[8px] text-slate-500 dark:text-slate-400 truncate">
                        {log.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <Badge className="bg-[#00C853] hover:bg-[#00a845] text-white text-[9px] px-1.5 py-0.5">
                      {log.messageCount} msgs
                    </Badge>
                  </div>
                </div>

                {log.remarks && (
                  <div className="mt-1.5 p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-[9px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {log.remarks}
                    </p>
                  </div>
                )}

                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-[8px] text-slate-400 dark:text-slate-500">
                    Updated: {formatTime(log.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && !error && activityLogs.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {activityLogs.length}
                </p>
                <p className="text-[8px] text-slate-500 dark:text-slate-400 font-medium">
                  Team Members
                </p>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {activityLogs.reduce((sum, log) => sum + log.messageCount, 0)}
                </p>
                <p className="text-[8px] text-emerald-600 dark:text-emerald-500 font-medium">
                  Total Messages
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
