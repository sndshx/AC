"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, MessageSquare, ShieldCheck, Activity, CheckCircle2, Clock, 
  ArrowUpRight, RefreshCw, ChevronRight, TrendingUp, Bot, CalendarDays, Settings
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart as RechartsPieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DailyActivityList } from "./daily-activity-list";

// ── Data ──────────────────────────────────────────────────────────────
const campaignActivityData = [
  { day: "Sat", messages: 850, replies: 215, opens: 680 },
  { day: "Sun", messages: 620, replies: 148, opens: 496 },
  { day: "Mon", messages: 1240, replies: 312, opens: 992 },
  { day: "Tue", messages: 1380, replies: 345, opens: 1104 },
  { day: "Wed", messages: 1520, replies: 380, opens: 1216 },
  { day: "Thu", messages: 1650, replies: 412, opens: 1320 },
  { day: "Fri", messages: 1420, replies: 355, opens: 1136 },
];

const hourlyActivityData = [
  { hour: "12am", activity: 12 },
  { hour: "3am", activity: 8 },
  { hour: "6am", activity: 25 },
  { hour: "9am", activity: 95 },
  { hour: "12pm", activity: 120 },
  { hour: "3pm", activity: 135 },
  { hour: "6pm", activity: 98 },
  { hour: "9pm", activity: 45 },
];

const teamRoleDistribution = [
  { name: "Marketers", value: 11, color: "#00C853" },
  { name: "Managers", value: 3, color: "#143D2C" },
  { name: "Admins", value: 2, color: "#3B82F6" },
];

const recentUsers = [
  { name: "Sarah Johnson", email: "sarah.j@company.com", role: "USER", status: "ACTIVE", lastActive: "2m ago" },
  { name: "Mike Chen", email: "mike.c@company.com", role: "USER", status: "ACTIVE", lastActive: "15m ago" },
  { name: "Emma Davis", email: "emma.d@company.com", role: "USER", status: "ACTIVE", lastActive: "1h ago" },
  { name: "Alex Kumar", email: "alex.k@company.com", role: "ADMIN", status: "ACTIVE", lastActive: "5m ago" },
  { name: "Lisa Wong", email: "lisa.w@company.com", role: "USER", status: "ACTIVE", lastActive: "30m ago" },
];

const whatsappHealthStats = [
  { user: "Sarah J.", status: "ACTIVE", health: 98, messages: 1250, replies: 312, rate: 24.9 },
  { user: "Mike C.", status: "ACTIVE", health: 95, messages: 1180, replies: 295, rate: 25.0 },
  { user: "Emma D.", status: "WARNING", health: 72, messages: 890, replies: 198, rate: 22.2 },
  { user: "Alex K.", status: "ACTIVE", health: 100, messages: 420, replies: 112, rate: 26.6 },
  { user: "Lisa W.", status: "ACTIVE", health: 88, messages: 1050, replies: 252, rate: 24.0 },
];

const taskStatuses = [
  { label: "Completed", count: 142, pct: 58, color: "#00C853" },
  { label: "In Progress", count: 68, pct: 28, color: "#3B82F6" },
  { label: "Todo", count: 34, pct: 14, color: "#94a3b8" },
];

const recentTasks = [
  { title: "Launch Summer Campaign", assignee: "Sarah J.", priority: "HIGH", status: "IN_PROGRESS", dueDate: "Today" },
  { title: "Follow-up with 50 leads", assignee: "Mike C.", priority: "URGENT", status: "IN_PROGRESS", dueDate: "Today" },
  { title: "Weekly Report Generation", assignee: "Emma D.", priority: "MEDIUM", status: "COMPLETED", dueDate: "Yesterday" },
  { title: "WhatsApp Template Review", assignee: "Lisa W.", priority: "HIGH", status: "TODO", dueDate: "Tomorrow" },
  { title: "Client Meeting Prep", assignee: "Alex K.", priority: "MEDIUM", status: "COMPLETED", dueDate: "2 days ago" },
];

// ── Helpers ───────────────────────────────────────────────────────────
const roleColor: Record<string, string> = {
  USER:  "bg-slate-100 text-slate-600",
  ADMIN: "bg-blue-50 text-blue-600",
};

const statusColor: Record<string, string> = {
  ACTIVE:   "bg-emerald-50 text-emerald-600",
  DISABLED: "bg-red-50 text-red-600",
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

// ── Top‑row stat cards ────────────────────────────────────────────────
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
}

function StatCard({ icon: Icon, iconBg, iconColor, badge, badgeColor = "text-[#00C853]", value, label, sub, trend }: StatCardProps) {
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
        {trend && <p className="text-[8px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">↗ {trend}</p>}
      </CardContent>
    </Card>
  );
}

// ── Compact secondary stat card ───────────────────────────────────────
interface SmallStatProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  subtitle?: string;
}

function SmallStat({ icon: Icon, iconBg, iconColor, value, label, subtitle }: SmallStatProps) {
  return (
    <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 group">
      <CardContent className="p-2.5 flex items-center gap-2">
        <div className={`h-7 w-7 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{value}</p>
          <p className="text-[9px] text-slate-600 dark:text-slate-300 mt-0.5 font-medium">{label}</p>
          {subtitle && <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
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
  const router = useRouter();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const now = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

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
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* == Row 1: 4 primary stat cards ======================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/users')}
        >
          <StatCard
            icon={Users}
            iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
            iconColor="text-blue-600"
            badge="6 new"
            value="16"
            label="Total Team Members"
            sub="Active marketing team across all departments"
            trend="+37% vs last month"
          />
        </div>
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/activity-logs')}
        >
          <StatCard
            icon={MessageSquare}
            iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100"
            iconColor="text-emerald-700"
            badge="↑18%"
            value="8,680"
            label="Messages Sent (7d)"
            sub="1,240 avg per day • 72% open rate"
            trend="+1,240 vs last week"
          />
        </div>
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/marketing')}
        >
          <StatCard
            icon={Activity}
            iconBg="bg-gradient-to-br from-green-50 to-green-100"
            iconColor="text-green-600"
            badge="95% avg"
            badgeColor="text-emerald-600"
            value="2,167"
            label="Campaign Replies"
            sub="25% conversion • 542 qualified leads"
            trend="+312 vs last week"
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
            badge="58% done"
            badgeColor="text-indigo-600"
            value="244"
            label="Marketing Tasks"
            sub="142 completed • 68 in progress • 34 pending"
            trend="+28 completed today"
          />
        </div>
      </div>

      {/* == Row 2: 4 secondary stat cards ====================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/reports')}
        >
          <SmallStat 
            icon={Bot} 
            iconBg="bg-gradient-to-br from-purple-50 to-purple-100" 
            iconColor="text-purple-600" 
            value="12" 
            label="AI Recommendations" 
            subtitle="3 new today"
          />
        </div>
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/reports')}
        >
          <SmallStat 
            icon={TrendingUp} 
            iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100" 
            iconColor="text-emerald-600" 
            value="88%" 
            label="Avg Success Rate" 
            subtitle="↑4% this week"
          />
        </div>
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/activity-logs')}
        >
          <SmallStat 
            icon={Clock} 
            iconBg="bg-gradient-to-br from-amber-50 to-amber-100" 
            iconColor="text-amber-600" 
            value="2.4h" 
            label="Avg Response Time" 
            subtitle="↓30min improvement"
          />
        </div>
        <div 
          className="cursor-pointer transform transition-all hover:scale-105"
          onClick={() => router.push('/admin/marketing')}
        >
          <SmallStat 
            icon={ShieldCheck} 
            iconBg="bg-gradient-to-br from-blue-50 to-blue-100" 
            iconColor="text-blue-600" 
            value="15/16" 
            label="Healthy WhatsApp" 
            subtitle="1 needs attention"
          />
        </div>
      </div>

      {/* == Row 3: Line chart + Donut chart ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Campaign Activity */}
        <Card className="lg:col-span-2 border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/reports')}>
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
                <LineChart data={campaignActivityData} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
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

        {/* Team Roles */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/users')}>
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white">Team Composition</CardTitle>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Member distribution by role type</p>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2">
            <div className="h-28 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={teamRoleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={50}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {teamRoleDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(v: any) => [`${v} members`]} 
                    contentStyle={{ fontSize: '10px', fontWeight: 600 }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {teamRoleDistribution.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full shadow-sm" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{p.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{p.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* == Row 4: Team by Role | Task Statuses | WhatsApp Health == */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* Users by Role */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Users className="h-3 w-3 text-[#00C853]" />
              Team by Role
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2.5 space-y-2.5">
            {teamRoleDistribution.map((p) => (
              <div key={p.name} className="space-y-1">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold uppercase tracking-wide" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{p.value} ({Math.round(p.value / 16 * 100)}%)</span>
                </div>
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.round(p.value / 16 * 100)}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Task Statuses */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-[#00C853]" />
              Task Statuses
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2.5 space-y-2">
            {taskStatuses.map((j) => (
              <div key={j.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: j.color }} />
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">{j.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{j.count}</span>
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded-full text-white" style={{ backgroundColor: j.color }}>
                    {j.pct}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* WhatsApp Health */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <MessageSquare className="h-3 w-3 text-[#00C853]" />
              WhatsApp Health
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2.5 space-y-1.5">
            {whatsappHealthStats.slice(0, 5).map((w, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">{w.user}</p>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500">{w.messages} messages</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{w.health}%</p>
                  <span className={`text-[8px] font-bold uppercase tracking-wide px-1 py-0.5 rounded ${healthColor[w.status]} text-white`}>{w.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* == Row 5: Daily Activity Updates ========================= */}
      <div className="grid grid-cols-1 gap-3">
        <DailyActivityList />
      </div>

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
            {recentUsers.map((u, i) => (
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
                  <span className={`text-[8px] font-normal uppercase px-1 py-0.5 rounded tracking-wide ${roleColor[u.role]}`}>
                    {u.role}
                  </span>
                  <span className="text-[7px] text-slate-400 dark:text-slate-500">{u.lastActive}</span>
                </div>
              </div>
            ))}
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
            {recentTasks.map((t, i) => (
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
                  <span className={`text-[8px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${priorityColor[t.priority]}`}>
                    {t.priority}
                  </span>
                  <span className={`text-[8px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${taskStatusColor[t.status]}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* == Row 7: Hourly Activity Pattern ========================= */}
      <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#00C853]" />
                Hourly Activity Pattern
              </CardTitle>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Team activity distribution across 24 hours</p>
            </div>
            <Badge className="bg-[#E8F7EE] text-[#143D2C] dark:bg-[#143D2C] dark:text-[#E8F7EE] text-[9px] font-semibold px-2 py-0.5">
              Peak: 3pm
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-3 pt-2">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyActivityData} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C853" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis 
                  dataKey="hour" 
                  fontSize={9} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "#64748b" }} 
                />
                <YAxis 
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
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#00C853" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: "#00C853", strokeWidth: 2, stroke: "#fff" }} 
                  activeDot={{ r: 5 }}
                  name="Activity"
                  fill="url(#activityGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* == Row 8: Performance Insights Grid ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* Top Performers */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/users')}>
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[#00C853]" />
              Top Performers
            </CardTitle>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Highest reply rates this week</p>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2 space-y-2">
            {whatsappHealthStats.sort((a, b) => b.rate - a.rate).slice(0, 3).map((w, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#00C853] text-white text-[9px] font-bold">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">{w.user}</p>
                    <p className="text-[8px] text-slate-500 dark:text-slate-400">{w.replies} replies</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#00C853]">{w.rate}%</p>
                  <p className="text-[7px] text-slate-400 dark:text-slate-500 uppercase">Rate</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Campaign Stats */}
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/marketing')}>
          <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Activity className="h-3 w-3 text-[#00C853]" />
              Campaign Statistics
            </CardTitle>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Overall campaign metrics</p>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-2 space-y-2.5">
            <div 
              className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() => router.push('/admin/marketing')}
            >
              <div>
                <p className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Active Campaigns</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-0.5">12</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div 
              className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              onClick={() => router.push('/admin/reports')}
            >
              <div>
                <p className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wide">Avg Open Rate</p>
                <p className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">72%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div 
              className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              onClick={() => router.push('/admin/reports')}
            >
              <div>
                <p className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">Conversion Rate</p>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-0.5">25%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

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