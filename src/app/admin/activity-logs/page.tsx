"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Loader2, 
  RefreshCw, 
  User, 
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  FileText,
  BarChart3,
  Target,
  Zap,
  Clock,
  Award,
  Activity
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
  Area,
  AreaChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface ActivityLogWithUser {
  id: string;
  messageCount: number;
  remarks: string | null;
  updatedAt: string;
  date: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface UserActivitySummary {
  userId: string;
  userName: string;
  userEmail: string;
  logs: ActivityLogWithUser[];
  totalMessages: number;
  averageMessages: number;
  trend: "up" | "down" | "neutral";
  trendPercentage: number;
}

interface UserHistory {
  activityHistory: ActivityLogWithUser[];
  statistics: {
    totalMessages: number;
    averageMessages: number;
    maxMessages: number;
    minMessages: number;
    consistency: number;
    trendPercentage: number;
    totalDays: number;
    activeDays: number;
  };
}

interface ChartDataPoint {
  date: string;
  messages: number;
  label: string;
}

export default function AdminActivityLogsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLogWithUser[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [selectedUserHistory, setSelectedUserHistory] = useState<string | null>(null);
  const [userHistory, setUserHistory] = useState<UserHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyDays, setHistoryDays] = useState(7);
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

  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
      // Clear history if this user was selected
      if (selectedUserHistory === userId) {
        setSelectedUserHistory(null);
        setUserHistory(null);
      }
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const fetchUserHistory = async (userId: string) => {
    setHistoryLoading(true);
    setSelectedUserHistory(userId);
    try {
      // Fetch with "all" to get complete history
      const response = await fetch(`/api/admin/activity-logs/history?userId=${userId}&days=${historyDays === 999 ? 'all' : historyDays}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user history");
      }
      const data = await response.json();
      setUserHistory(data);
    } catch (err) {
      console.error("Error fetching user history:", err);
      setUserHistory(null);
    } finally {
      setHistoryLoading(false);
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

  // Group logs by user and calculate statistics
  const userSummaries: UserActivitySummary[] = activityLogs.reduce((acc, log) => {
    const existing = acc.find(u => u.userId === log.user.id);
    
    if (existing) {
      existing.logs.push(log);
      existing.totalMessages += log.messageCount;
    } else {
      acc.push({
        userId: log.user.id,
        userName: log.user.fullName,
        userEmail: log.user.email,
        logs: [log],
        totalMessages: log.messageCount,
        averageMessages: 0,
        trend: "neutral",
        trendPercentage: 0
      });
    }
    
    return acc;
  }, [] as UserActivitySummary[]);

  // Calculate averages and trends
  userSummaries.forEach(summary => {
    summary.averageMessages = summary.totalMessages / summary.logs.length;
    
    // Simple trend calculation (comparing to average)
    const avgForComparison = 100; // baseline comparison
    const diff = summary.averageMessages - avgForComparison;
    const percentage = Math.abs((diff / avgForComparison) * 100);
    
    if (percentage < 5) {
      summary.trend = "neutral";
    } else if (diff > 0) {
      summary.trend = "up";
    } else {
      summary.trend = "down";
    }
    summary.trendPercentage = Math.round(percentage);
  });

  // Sort by total messages
  userSummaries.sort((a, b) => b.totalMessages - a.totalMessages);

  const totalTeamMessages = userSummaries.reduce((sum, u) => sum + u.totalMessages, 0);
  const averageTeamMessages = userSummaries.length > 0 
    ? Math.round(totalTeamMessages / userSummaries.length) 
    : 0;

  return (
    <div className="w-full px-6 py-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Team Activity Logs - User Based View
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Detailed breakdown of daily activity updates by team member
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="text-sm font-medium bg-transparent border-none text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={fetchActivityLogs}
                  disabled={loading}
                  className="h-9"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {userSummaries.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Active Members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {totalTeamMessages}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Total Messages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {averageTeamMessages}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Average per User
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {activityLogs.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Total Entries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User-Based Activity List */}
        {loading ? (
          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
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
        ) : userSummaries.length === 0 ? (
          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-8">
              <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
                No activity updates found for {formatDate(selectedDate)}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {userSummaries.map((summary) => {
              const isExpanded = expandedUsers.has(summary.userId);
              
              return (
                <Card 
                  key={summary.userId}
                  className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
                >
                  {/* User Summary Header */}
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleUserExpansion(summary.userId)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-700">
                          <AvatarFallback className="bg-gradient-to-br from-[#143D2C] to-[#00C853] text-white font-bold">
                            {summary.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                              {summary.userName}
                            </h3>
                            {summary.trend === "up" && (
                              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs px-2 py-0.5 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                +{summary.trendPercentage}%
                              </Badge>
                            )}
                            {summary.trend === "down" && (
                              <Badge className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-xs px-2 py-0.5 flex items-center gap-1">
                                <TrendingDown className="h-3 w-3" />
                                -{summary.trendPercentage}%
                              </Badge>
                            )}
                            {summary.trend === "neutral" && (
                              <Badge className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400 text-xs px-2 py-0.5 flex items-center gap-1">
                                <Minus className="h-3 w-3" />
                                Stable
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {summary.userEmail}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {summary.totalMessages}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            messages today
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                        {summary.logs.map((log) => (
                          <div
                            key={log.id}
                            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-[#00C853] hover:bg-[#00a845] text-white text-xs px-2 py-1">
                                  {log.messageCount} messages
                                </Badge>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  logged on {formatDate(log.date)}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {formatTime(log.updatedAt)}
                              </span>
                            </div>
                            
                            {log.remarks && (
                              <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                  Remarks:
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {log.remarks}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* User Statistics */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                              {summary.logs.length}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-500 font-medium">
                              Total Entries
                            </p>
                          </div>
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                              {Math.round(summary.averageMessages)}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">
                              Avg Messages
                            </p>
                          </div>
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                            <p className="text-lg font-bold text-purple-700 dark:text-purple-400">
                              {Math.max(...summary.logs.map(l => l.messageCount))}
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-500 font-medium">
                              Peak Messages
                            </p>
                          </div>
                        </div>

                        {/* View Detailed History Button */}
                        <div className="mt-4">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchUserHistory(summary.userId);
                            }}
                            className="w-full bg-gradient-to-r from-[#143D2C] to-[#00C853] hover:from-[#0f2d21] hover:to-[#00a845] text-white"
                            disabled={historyLoading && selectedUserHistory === summary.userId}
                          >
                            {historyLoading && selectedUserHistory === summary.userId ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading History...
                              </>
                            ) : (
                              <>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Complete Activity History
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detailed User History Modal/Section */}
        {selectedUserHistory && userHistory && (
          <Card className="border-2 border-[#00C853] shadow-2xl bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-[#E8F7EE] to-white dark:from-[#143D2C]/20 dark:to-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#143D2C] to-[#00C853] flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                      {historyDays === 999 ? 'Complete Activity History' : `${historyDays}-Day Performance Analysis`}
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {userSummaries.find(u => u.userId === selectedUserHistory)?.userName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={historyDays}
                    onChange={(e) => {
                      setHistoryDays(parseInt(e.target.value));
                      fetchUserHistory(selectedUserHistory);
                    }}
                    className="text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={7}>Last 7 Days</option>
                    <option value={14}>Last 14 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 90 Days</option>
                    <option value={999}>All Time History</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedUserHistory(null);
                      setUserHistory(null);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {userHistory.statistics.totalMessages}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-500 font-medium mt-1">
                      Total Messages
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                      {userHistory.statistics.averageMessages}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium mt-1">
                      Daily Average
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {userHistory.statistics.maxMessages}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-500 font-medium mt-1">
                      Peak Day
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                      {userHistory.statistics.consistency}%
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 font-medium mt-1">
                      Consistency
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Activity Rate
                        </span>
                      </div>
                      <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {userHistory.statistics.activeDays} / {userHistory.statistics.totalDays} days
                      </Badge>
                    </div>
                    <Progress 
                      value={userHistory.statistics.consistency} 
                      className="h-3"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      User logged activity on {userHistory.statistics.activeDays} out of {userHistory.statistics.totalDays} days
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {userHistory.statistics.trendPercentage > 0 ? (
                          <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : userHistory.statistics.trendPercentage < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                        ) : (
                          <Minus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        )}
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Performance Trend
                        </span>
                      </div>
                      <Badge className={
                        userHistory.statistics.trendPercentage > 0 
                          ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                          : userHistory.statistics.trendPercentage < 0
                          ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }>
                        {userHistory.statistics.trendPercentage > 0 ? "+" : ""}
                        {userHistory.statistics.trendPercentage}%
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {userHistory.statistics.trendPercentage > 10 && (
                        <p>📈 Strong upward trend - Excellent performance improvement!</p>
                      )}
                      {userHistory.statistics.trendPercentage > 0 && userHistory.statistics.trendPercentage <= 10 && (
                        <p>📊 Slight upward trend - Steady improvement</p>
                      )}
                      {userHistory.statistics.trendPercentage === 0 && (
                        <p>➡️ Stable performance - Consistent activity</p>
                      )}
                      {userHistory.statistics.trendPercentage < 0 && userHistory.statistics.trendPercentage >= -10 && (
                        <p>📉 Slight downward trend - Monitor for next period</p>
                      )}
                      {userHistory.statistics.trendPercentage < -10 && (
                        <p>⚠️ Declining trend - May need attention</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline Chart */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#00C853]" />
                    Daily Message Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={userHistory.activityHistory.slice().reverse().map(log => ({
                          date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                          messages: log.messageCount,
                          fullDate: log.date
                        }))}
                      >
                        <defs>
                          <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b" 
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={11}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="messages"
                          stroke="#00C853"
                          strokeWidth={2}
                          fill="url(#colorMessages)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-[#00C853]"></div>
                      <span>Messages Sent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-0.5 w-8 bg-slate-300"></div>
                      <span>Average: {userHistory.statistics.averageMessages}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution Chart */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#143D2C]" />
                    Message Volume Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={userHistory.activityHistory.slice().reverse().map(log => ({
                          date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                          messages: log.messageCount
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b" 
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={11}
                          tickLine={false}
                        />
                        <Tooltip />
                        <Bar 
                          dataKey="messages" 
                          fill="#143D2C" 
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Logs */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    {historyDays === 999 ? 'All Activity Entries' : 'Recent Activity Entries'} ({userHistory.activityHistory.length} total)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {userHistory.activityHistory.map((log, index) => (
                      <div
                        key={log.id}
                        className={`p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          index === 0 ? "bg-[#E8F7EE]/30 dark:bg-[#143D2C]/10" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {formatDate(log.date)}
                            </span>
                            {index === 0 && (
                              <Badge className="bg-[#00C853] text-white text-xs">Latest</Badge>
                            )}
                          </div>
                          <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {log.messageCount} messages
                          </Badge>
                        </div>
                        {log.remarks && (
                          <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded text-sm text-slate-600 dark:text-slate-400 border-l-2 border-[#00C853]">
                            "{log.remarks}"
                          </div>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                          Updated: {formatTime(log.updatedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
