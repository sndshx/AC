"use client";

import { useState, useEffect } from "react";
import { DailyActivityForm } from "@/app/user/_components/dashboard/daily-activity-form";
import { Calendar, Loader2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActivityLog {
  id: string;
  messageCount: number;
  remarks: string | null;
  date: string;
  updatedAt: string;
}

interface UserHistory {
  activityHistory: ActivityLog[];
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

export default function UserActivityLogPage() {
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [userHistory, setUserHistory] = useState<UserHistory | null>(null);

  const fetchUserHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`/api/activity-log/history?days=all`);
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

  useEffect(() => {
    if (showHistory) {
      fetchUserHistory();
    }
  }, [showHistory]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
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
    <div className="w-full px-6 py-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Daily Activity Log
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your daily message counts and add notes about your activities
          </p>
        </div>

        <DailyActivityForm />

        {/* View History Button */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
          <CardContent className="p-4">
            <Button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full bg-gradient-to-r from-[#143D2C] to-[#00C853] hover:from-[#0f2d21] hover:to-[#00a845] text-white"
            >
              {showHistory ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Hide My Activity History
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  View My Activity History
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Simple Calendar-Style History */}
        {showHistory && (
          <>
            {historyLoading ? (
              <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
                <CardContent className="p-12 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#00C853] mx-auto mb-4" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Loading history...</p>
                  </div>
                </CardContent>
              </Card>
            ) : userHistory && userHistory.activityHistory.length > 0 ? (
              <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#00C853]" />
                    My Activity History ({userHistory.activityHistory.length} entries)
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Total Messages: {userHistory.statistics.totalMessages}
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {userHistory.activityHistory.map((log, index) => (
                      <div
                        key={log.id}
                        className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#00C853]/10 dark:bg-[#00C853]/20">
                                <Calendar className="h-5 w-5 text-[#00C853]" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {formatDate(log.date)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Updated: {formatTime(log.updatedAt)}
                                </p>
                              </div>
                            </div>
                            
                            {log.remarks && (
                              <div className="mt-3 ml-13 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-3 border-[#00C853]">
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {log.remarks}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-[#00C853] hover:bg-[#00a845] text-white text-base px-3 py-1">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {log.messageCount}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="outline" className="text-xs border-[#00C853] text-[#00C853]">
                                Latest
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No activity history found
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Start logging your daily activities to see your history here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
