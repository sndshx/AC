"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Loader2, 
  RefreshCw, 
  MessageSquare,
  TrendingUp,
  Download,
  Filter,
  Users,
  FileText,
  BarChart3,
  Clock,
  Award
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ActivityLog {
  id: string;
  messageCount: number;
  remarks: string | null;
  date: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
  };
}

interface Summary {
  totalMessages: number;
  uniqueUsers: number;
  totalEntries: number;
  averagePerEntry: number;
  startDate: string;
  endDate: string;
  dateRange: number;
}

interface TimelineEntry {
  date: string;
  entries: number;
  totalMessages: number;
  activeUsers: number;
}

interface UserRanking {
  userId: string;
  userName: string;
  userEmail: string;
  totalMessages: number;
  totalEntries: number;
  averageMessages: number;
  dates: string[];
}

export default function AllDatesActivityLogsPage() {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [userRankings, setUserRankings] = useState<UserRanking[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllActivityLogs();
  }, [startDate, endDate, selectedUser]);

  const fetchAllActivityLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/admin/activity-logs/all?startDate=${startDate}&endDate=${endDate}`;
      if (selectedUser) {
        url += `&userId=${selectedUser}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch activity logs");
      }
      const data = await response.json();
      setActivityLogs(data.activityLogs || []);
      setSummary(data.summary);
      setTimeline(data.timeline || []);
      setUserRankings(data.userRankings || []);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      setError("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
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

  const exportToCSV = () => {
    const headers = ["Date", "User", "Email", "Messages", "Remarks", "Updated At"];
    const rows = activityLogs.map(log => [
      formatDate(log.date),
      log.user.fullName,
      log.user.email,
      log.messageCount,
      log.remarks || "",
      formatTime(log.updatedAt)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  const quickDateRanges = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
    { label: "This Year", days: 365 }
  ];

  const setQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  return (
    <div className="w-full px-6 py-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header with Filters */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Calendar className="h-7 w-7 text-[#00C853]" />
                    All Dates Activity Logs - Complete History
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Comprehensive view of team activity across all dates with analytics and exports
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    disabled={loading || activityLogs.length === 0}
                    className="h-9"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={fetchAllActivityLogs}
                    disabled={loading}
                    className="h-9"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Quick Date Range Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-2">
                  Quick Ranges:
                </span>
                {quickDateRanges.map((range) => (
                  <Button
                    key={range.days}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(range.days)}
                    className="h-8 text-xs"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>

              {/* Date Range Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start Date
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate}
                      className="text-sm flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    End Date
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      max={new Date().toISOString().split("T")[0]}
                      className="text-sm flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Filter by User
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                      value={selectedUser || ""}
                      onChange={(e) => setSelectedUser(e.target.value || null)}
                      className="text-sm flex-1 bg-transparent border-none text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="">All Users</option>
                      {userRankings.map((user) => (
                        <option key={user.userId} value={user.userId}>
                          {user.userName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-12 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#00C853] mx-auto mb-4" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Loading comprehensive data...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border border-red-200/60 dark:border-red-700 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Statistics */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                          {summary.totalMessages.toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-500 font-medium">
                          Total Messages
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                          {summary.uniqueUsers}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">
                          Active Users
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                          {summary.totalEntries}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-500 font-medium">
                          Total Entries
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-amber-500 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                          {summary.averagePerEntry}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-500 font-medium">
                          Avg per Entry
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/20 dark:to-slate-700/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-slate-500 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {summary.dateRange}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Days Range
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Timeline Chart */}
            <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#00C853]" />
                  Activity Timeline - Messages Over Time
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline.slice().reverse()}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={11}
                        tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px"
                        }}
                        labelFormatter={(value) => formatDate(value)}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="totalMessages"
                        stroke="#00C853"
                        strokeWidth={2}
                        fill="url(#colorTotal)"
                        name="Total Messages"
                      />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#143D2C"
                        strokeWidth={2}
                        name="Active Users"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Rankings */}
            <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#FFD700]" />
                  User Performance Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {userRankings.map((user, index) => (
                    <div
                      key={user.userId}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl font-bold w-12 text-center ${
                          index === 0 ? "text-[#FFD700]" :
                          index === 1 ? "text-[#C0C0C0]" :
                          index === 2 ? "text-[#CD7F32]" :
                          "text-slate-400 dark:text-slate-600"
                        }`}>
                          #{index + 1}
                        </div>

                        <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-700">
                          <AvatarFallback className="bg-gradient-to-br from-[#143D2C] to-[#00C853] text-white font-bold">
                            {user.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {user.userName}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user.userEmail}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                              {user.totalMessages.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Messages
                            </p>
                          </div>
                          <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                              {user.averageMessages}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Average
                            </p>
                          </div>
                          <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                              {user.totalEntries}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* All Activity Logs Table */}
            <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    Complete Activity Log ({activityLogs.length} entries)
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 mt-1">
                            <AvatarFallback className="bg-gradient-to-br from-[#143D2C] to-[#00C853] text-white text-xs font-bold">
                              {log.user.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {log.user.fullName}
                              </h4>
                              <Badge className="text-xs">
                                {log.user.role}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                              {log.user.email}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(log.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(log.updatedAt)}
                              </span>
                            </div>
                            {log.remarks && (
                              <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded text-xs text-slate-600 dark:text-slate-400 border-l-2 border-[#00C853]">
                                {log.remarks}
                              </div>
                            )}
                          </div>
                        </div>

                        <Badge className="bg-[#00C853] hover:bg-[#00a845] text-white text-sm px-3 py-1 whitespace-nowrap">
                          {log.messageCount} messages
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
