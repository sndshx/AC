"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, MessageSquare, Activity, CheckCircle2, Clock, 
  ArrowUpRight, RefreshCw, ChevronRight, TrendingUp, Bot, CalendarDays, Settings,
  Loader2
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ── Types ─────────────────────────────────────────────────────────────
interface DashboardStats {
  totalTeamMembers: number;
  totalTeamMembersTrend: string;
  whatsappMessagesMonthly: number;
  whatsappMessagesDaily: number;
  whatsappTopContributor: { name: string; phone: string; count: number } | null;
  campaignReplies: number;
  campaignRepliesTrend: string;
  campaignRepliesSub: string;
  marketingTasks: number;
  marketingTasksSub: string;
  marketingTasksTrend: string;
  weeklyCampaignPerformance: Array<{ day: string; messages: number; replies: number }>;
  teamRoleDistribution: Array<{ name: string; value: number; color: string }>;
  taskStatuses: Array<{ label: string; count: number; pct: number; color: string }>;
  whatsappHealthStats: Array<{ user: string; status: string; health: number; messages: number; replies: number; rate: number }>;
  recentActiveUsers: Array<{ name: string; email: string; role: string; status: string; lastActive: string }>;
  recentTasks: Array<{ title: string; assignee: string; priority: string; status: string; dueDate: string }>;
  hourlyActivityData: Array<{ hour: string; activity: number }>;
  topPerformers: Array<{ user: string; replies: number; rate: number }>;
  campaignStats: { activeCampaigns: number; avgOpenRate: number; conversionRate: number };
}

// ── Helpers ───────────────────────────────────────────────────────────
const roleColor: Record<string, string> = {
  USER:  "bg-slate-100 text-slate-600",
  ADMIN: "bg-blue-50 text-blue-600",
};

const healthColor: Record<string, string> = {
  ACTIVE:  "bg-emerald-500",
  WARNING: "bg-amber-500",
  LIMITED: "bg-orange-500",
  BANNED:  "bg-red-500",
};

const priorityColor: Record<string, string> = {
  LOW:    "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-600",
  HIGH:   "bg-orange-50 text-orange-600",
  URGENT: "bg-red-50 text-red-600",
};

const taskStatusColor: Record<string, string> = {
  TODO:        "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-50 text-blue-600",
  COMPLETED:   "bg-emerald-50 text-emerald-600",
  BLOCKED:     "bg-red-50 text-red-600",
};

// ── Top-row stat cards ────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
  value: string;
  label: string;
  sub: string;
  trend?: string;
  topLine?: string;
}

function StatCard({ icon: Icon, iconBg, iconColor, badge, badgeColor = "text-[#00C853]", value, label, sub, trend, topLine }: StatCardProps) {
  return (
    <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 dark:from-slate-800 to-transparent rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform duration-500" />
      <CardContent className="p-3 relative">
        <div className="flex items-start justify-between mb-2">
          <div className={`h-7 w-7 rounded-lg ${iconBg} flex items-center justify-center shadow-sm`}>
            <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
          </div>
          {badge && (
            <span className={`text-[9px] font-semibold ${badgeColor} flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30`}>
              <ArrowUpRight className="h-2 w-2" />{badge}
            </span>
          )}
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-0.5">{value}</p>
        <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">{label}</p>
        <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-snug">{sub}</p>
        {topLine && <p className="text-[9px] text-[#00C853] dark:text-emerald-400 font-semibold mt-1 truncate">{topLine}</p>}
        {trend && <p className="text-[8px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">↗ {trend}</p>}
      </CardContent>
    </Card>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2.5 text-xs">
      <p className="text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.stroke }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    setRefreshing(false);
  };

  const now = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#00C853] animate-spin" />
          <p className="text-sm text-slate-500 font-semibold">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const totalMembers = stats?.totalTeamMembers ?? 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-blue-50/30 px-3 py-3 space-y-3">

      {/* == Header ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Real-time marketing analytics & team performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] uppercase font-normal tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Last Updated</p>
            <p className="text-[9px] font-normal text-slate-700 dark:text-slate-300">{now}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="h-7 text-[10px] px-2 gap-1 font-normal shadow-sm hover:shadow transition-all"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* == Row 1: Primary stat cards ======================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/users')}
        >
          <StatCard
            icon={Users}
            iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
            iconColor="text-blue-600"
            badge={stats ? stats.totalTeamMembersTrend : "—"}
            value={stats ? stats.totalTeamMembers.toString() : "—"}
            label="Total Team Members"
            sub="Active marketing team across all departments"
            trend={stats ? stats.totalTeamMembersTrend : "—"}
          />
        </div>
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/tasks')}
        >
          <StatCard
            icon={CheckCircle2}
            iconBg="bg-gradient-to-br from-indigo-50 to-indigo-100"
            iconColor="text-indigo-600"
            badge={stats ? stats.marketingTasksTrend : "—"}
            badgeColor="text-indigo-600"
            value={stats ? stats.marketingTasks.toString() : "—"}
            label="Marketing Tasks"
            sub={stats ? stats.marketingTasksSub : "—"}
            trend={stats ? stats.marketingTasksTrend : "—"}
          />
        </div>
      </div>

      {/* == Row 3: Campaign Activity Chart ==================== */}
      <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/reports')}>
        <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-white">Weekly Campaign Performance</CardTitle>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Messages sent & replies received across last 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-normal text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C853] shadow-sm" />
                Messages
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#143D2C] shadow-sm" />
                Replies
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-3 pt-2">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats ? stats.weeklyCampaignPerformance : []} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis 
                  dataKey="day" 
                  fontSize={9} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "#64748b" }} 
                />
                <YAxis 
                  yAxisId="left" 
                  fontSize={9} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "#64748b" }} 
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  fontSize={9}
                  fontWeight={600} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "#64748b" }} 
                />
                <Tooltip 
                  content={<ChartTooltip />} 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#00C853" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: "#00C853", strokeWidth: 2, stroke: "#fff" }} 
                  activeDot={{ r: 4 }}
                  name="Messages" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="replies" 
                  stroke="#143D2C" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: "#143D2C", strokeWidth: 2, stroke: "#fff" }} 
                  activeDot={{ r: 4 }}
                  name="Replies" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>



      {/* == Row 6: Recent Team Members | Recent Tasks ============== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* Recently Active Team Members */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Users className="h-3 w-3 text-[#00C853]" />
                Active Team Members
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#143D2C] dark:text-[#00C853] text-[9px] h-6 px-1.5 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20" onClick={() => router.push('/admin/users')}>
                View All <ChevronRight className="h-2.5 w-2.5 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2 space-y-1.5">
            {(stats ? stats.recentActiveUsers : []).map((u, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/users`)}
              >
                <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-700">
                  <AvatarFallback className="bg-[#E8F7EE] dark:bg-[#143D2C] text-[#143D2C] dark:text-[#E8F7EE] text-[8px] font-normal">
                    {u.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className={`text-[8px] font-normal uppercase px-1 py-0.5 rounded tracking-wide ${roleColor[u.role] || "bg-slate-100"}`}>
                    {u.role}
                  </span>
                  <span className="text-[7px] text-slate-400 dark:text-slate-500">{u.lastActive}</span>
                </div>
              </div>
            ))}
            {(stats ? stats.recentActiveUsers : []).length === 0 && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center py-4">No team members</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-[#00C853]" />
                Recent Tasks
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#143D2C] dark:text-[#00C853] text-[9px] h-6 px-1.5 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20" onClick={() => router.push('/admin/tasks')}>
                View All <ChevronRight className="h-2.5 w-2.5 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2 space-y-1.5">
            {(stats ? stats.recentTasks : []).map((t, i) => (
              <div 
                key={i} 
                className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => router.push('/admin/tasks')}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 truncate">{t.title}</p>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {t.assignee} • {t.dueDate}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
                  <span className={`text-[8px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${priorityColor[t.priority] || "bg-slate-100"}`}>
                    {t.priority}
                  </span>
                  <span className={`text-[8px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${taskStatusColor[t.status] || "bg-slate-100"}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
            {(stats ? stats.recentTasks : []).length === 0 && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center py-4">No tasks found</p>
            )}
          </CardContent>
        </Card>
      </div>



      {/* == Row 8: Performance Insights Grid ======================= */}
      <div className="grid grid-cols-1 gap-3">

        {/* Quick Actions */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Bot className="h-3 w-3 text-[#00C853]" />
              Quick Actions
            </CardTitle>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Manage your workspace</p>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2 space-y-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-[10px] h-8 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-[#143D2C] dark:hover:text-[#00C853] hover:border-[#00C853]"
              onClick={() => router.push('/admin/users')}
            >
              <Users className="h-3.5 w-3.5 mr-2" />
              Manage Team Members
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-[10px] h-8 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-[#143D2C] dark:hover:text-[#00C853] hover:border-[#00C853]"
              onClick={() => router.push('/admin/tasks')}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
              Create New Task
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-[10px] h-8 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-[#143D2C] dark:hover:text-[#00C853] hover:border-[#00C853]"
              onClick={() => router.push('/admin/calendar')}
            >
              <CalendarDays className="h-3.5 w-3.5 mr-2" />
              Schedule Campaign
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-[10px] h-8 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-[#143D2C] dark:hover:text-[#00C853] hover:border-[#00C853]"
              onClick={() => router.push('/admin/reports')}
            >
              <Activity className="h-3.5 w-3.5 mr-2" />
              Generate Report
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-[10px] h-8 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-[#143D2C] dark:hover:text-[#00C853] hover:border-[#00C853]"
              onClick={() => router.push('/admin/settings')}
            >
              <Settings className="h-3.5 w-3.5 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}