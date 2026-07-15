"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2, RefreshCw, User, MessageSquare, TrendingUp, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getActivityLevel = (count: number): { label: string; color: string; bgColor: string } => {
    if (count >= 150) return { label: "Excellent", color: "text-emerald-700 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-900/20" };
    if (count >= 100) return { label: "Good", color: "text-blue-700 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/20" };
    if (count >= 50) return { label: "Average", color: "text-amber-700 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-900/20" };
    return { label: "Low", color: "text-slate-700 dark:text-slate-400", bgColor: "bg-slate-50 dark:bg-slate-800/50" };
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
      <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center">
                <MessageSquare className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              Team Daily Activity Updates
            </CardTitle>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />
              Detailed activity logs for {formatDate(selectedDate)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[9px] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-[#00C853]"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Date Picker with enhanced styling */}
        <div className="flex items-center gap-2 mt-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="h-5 w-5 rounded bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Calendar className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="flex-1 text-[10px] px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent font-medium"
          />
          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
            {activityLogs.length} {activityLogs.length === 1 ? 'update' : 'updates'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Loading activity data...</p>
          </div>
        ) : error ? (
          <div className="text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-3 rounded-lg border border-red-200 dark:border-red-900/30 text-center font-medium">
            {error}
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">No activity updates for this date</p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500">Try selecting a different date</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            {activityLogs.map((log, index) => {
              const activityLevel = getActivityLevel(log.messageCount);
              return (
                <div
                  key={log.id}
                  className="group p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-800/50 dark:to-slate-800/30 hover:from-emerald-50/30 hover:to-emerald-50/10 dark:hover:from-emerald-900/10 dark:hover:to-emerald-900/5 transition-all duration-200 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-700 shadow-sm group-hover:border-emerald-200 dark:group-hover:border-emerald-800 transition-colors">
                        <AvatarFallback className="bg-gradient-to-br from-[#E8F7EE] to-[#00C853]/20 dark:from-[#143D2C] dark:to-[#00C853]/20 text-[#143D2C] dark:text-[#E8F7EE] text-[10px] font-bold">
                          {log.user.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                            {log.user.fullName}
                          </p>
                          <Badge className={`text-[8px] px-1.5 py-0 font-semibold ${activityLevel.bgColor} ${activityLevel.color} border-0`}>
                            {activityLevel.label}
                          </Badge>
                        </div>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {log.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                        <MessageSquare className="h-2.5 w-2.5" />
                        <span className="text-[10px] font-bold">{log.messageCount}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[8px] text-slate-400 dark:text-slate-500">
                        <Clock className="h-2.5 w-2.5" />
                        {getTimeAgo(log.updatedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Remarks Section */}
                  {log.remarks && (
                    <div className="mt-2 p-2 bg-white dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 transition-colors">
                      <div className="flex items-start gap-1.5">
                        <FileText className="h-3 w-3 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[9px] text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                          {log.remarks}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[8px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                        Logged
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatTime(log.updatedAt)}
                      </span>
                    </div>
                    <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500">
                      #{activityLogs.length - index}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Summary Section */}
        {!loading && !error && activityLogs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30 text-center">
                <div className="flex items-center justify-center mb-1">
                  <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                  {activityLogs.length}
                </p>
                <p className="text-[8px] text-blue-600 dark:text-blue-500 font-semibold uppercase tracking-wide">
                  Members
                </p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-900/30 text-center">
                <div className="flex items-center justify-center mb-1">
                  <MessageSquare className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {activityLogs.reduce((sum, log) => sum + log.messageCount, 0)}
                </p>
                <p className="text-[8px] text-emerald-600 dark:text-emerald-500 font-semibold uppercase tracking-wide">
                  Messages
                </p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-900/30 text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-bold text-purple-700 dark:text-purple-400">
                  {Math.round(activityLogs.reduce((sum, log) => sum + log.messageCount, 0) / activityLogs.length)}
                </p>
                <p className="text-[8px] text-purple-600 dark:text-purple-500 font-semibold uppercase tracking-wide">
                  Average
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
