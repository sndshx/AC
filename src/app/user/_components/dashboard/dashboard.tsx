"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CalendarDays,
  CheckCircle2,
  Circle,
  Check,
  DollarSign,
  Eye,
  MessageSquareText,
  MoreHorizontal,
  RefreshCw,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "./stat-card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/shared/utils";
import { DailyActivityForm } from "./daily-activity-form";

type EnhancedDashboardProps = {
  role: "ADMIN" | "USER";
};

// Define stat configurations with icons
const adminStatConfig = [
  { key: "totalUsers", label: "Total Users", icon: Users, tone: "success" as const },
  { key: "activeUsers", label: "Active Users", icon: ShieldCheck, tone: "success" as const },
  { key: "todayMessages", label: "Today's Messages", icon: MessageSquareText, tone: "info" as const },
  { key: "monthlyRevenue", label: "Monthly Revenue", icon: DollarSign, tone: "success" as const },
  { key: "completedTasks", label: "Completed Tasks", icon: CheckCircle2, tone: "success" as const },
  { key: "aiPerformance", label: "AI Performance", icon: Bot, tone: "info" as const },
  { key: "whatsAppActive", label: "WhatsApp Active", icon: MessageSquareText, tone: "success" as const },
  { key: "warningAccounts", label: "Warning Accounts", icon: AlertTriangle, tone: "warning" as const },
  { key: "growthRate", label: "Growth Rate", icon: TrendingUp, tone: "success" as const },
  { key: "systemHealth", label: "System Health", icon: Zap, tone: "success" as const }
];

export function EnhancedDashboard({ role }: EnhancedDashboardProps) {
  const { data, loading, error, refetch } = useDashboardData(role);

  if (loading) {
    return (
      <div className="w-full px-6 py-6 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
        <div className="w-full space-y-8">
          {/* Loading Header */}
          <Card className="p-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </Card>

          {/* Loading Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>

          {/* Loading Charts */}
          <div className="grid gap-8 xl:grid-cols-3">
            <Skeleton className="xl:col-span-2 h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-6 py-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
        <div className="w-full space-y-8">
          <Card className="p-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Failed to load dashboard data
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
              <Button onClick={refetch}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (role === "USER") {
    return <UserDashboardView data={data} refetch={refetch} />;
  }

  const stats = adminStatConfig.map(config => ({
    ...config,
    ...data.stats[config.key]
  }));

  return (
    <div className="w-full px-6 py-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="w-full space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Admin Control Center
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Monitor team performance, track activities, and manage your marketing operations with advanced insights.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={refetch}>
                <RefreshCw className="mr-2 h-5 w-5" />
                Refresh Data
              </Button>
              <Button variant="secondary" size="lg">
                <Eye className="mr-2 h-5 w-5" />
                View Reports
              </Button>
              <Button size="lg" className="shadow-lg bg-[#00C853] hover:bg-[#00B81D] text-white">
                <Activity className="mr-2 h-5 w-5" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="transform transition-all hover:scale-105">
              <div className="relative">
                <StatCard {...stat} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Dashboard */}
        <div className="grid gap-8 xl:grid-cols-3">
          {/* Primary Analytics Chart */}
          <Card className="xl:col-span-2 shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                    Marketing Performance Analytics
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600 dark:text-slate-400 mt-2">
                    Comprehensive view of messages, replies, tasks, and AI performance metrics
                  </CardDescription>
                </div>
                <Button variant="secondary" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                    Performance
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.chartData}>
                        <defs>
                          <linearGradient id="messagesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#143D2C" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#143D2C" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="repliesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C853" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#00C853" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="currentColor" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="currentColor" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="messages" 
                          stroke="#143D2C" 
                          fill="url(#messagesGradient)" 
                          strokeWidth={3}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="replies" 
                          stroke="#00C853" 
                          fill="url(#repliesGradient)" 
                          strokeWidth={3}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#eab308" 
                          strokeWidth={3} 
                          dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
                        <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                        <YAxis stroke="currentColor" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="messages" fill="#143D2C" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="replies" fill="#00C853" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
                        <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                        <YAxis stroke="currentColor" fontSize={12} />
                        <Tooltip />
                        <Line type="monotone" dataKey="tasks" stroke="#143D2C" strokeWidth={4} />
                        <Line type="monotone" dataKey="score" stroke="#eab308" strokeWidth={4} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Performance Breakdown */}
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <CardTitle className="text-xl font-bold">Performance Breakdown</CardTitle>
              <CardDescription>Today's activity distribution</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.performanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#143D2C" : index === 1 ? "#00C853" : "#10b981"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {data.performanceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: index === 0 ? "#143D2C" : index === 1 ? "#00C853" : "#10b981" }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance & Activity Feed */}
        <div className="grid gap-8 xl:grid-cols-2">
          {/* Team Performance */}
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <CardTitle className="text-xl font-bold">
                Team Performance Dashboard
              </CardTitle>
              <CardDescription>
                Real-time team metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {data.teamPerformance ? (
                <div className="space-y-4">
                  {data.teamPerformance.map((team, index) => (
                    <div key={index} className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{team.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {team.members} members • {team.tasks} active tasks
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#143D2C] dark:text-[#00C853]">{team.score}%</p>
                          <p className="text-xs text-slate-500">Performance</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score</span>
                            <span>{team.score}%</span>
                          </div>
                          <Progress value={team.score} className="h-3 bg-[#E8F7EE]" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Efficiency</span>
                            <span>{team.efficiency}%</span>
                          </div>
                          <Progress value={team.efficiency} className="h-3 bg-[#E8F7EE]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
                      <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="productivity" fill="#143D2C" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="growth" fill="#00C853" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl font-bold">Live Activity Feed</CardTitle>
                <CardDescription>Real-time updates and system events</CardDescription>
              </div>
              <Button variant="secondary" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {data.activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-[#143D2C] to-[#00C853] text-white font-bold">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{activity.user}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{activity.action}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        className="text-xs font-medium bg-[#E8F7EE] text-[#143D2C] dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

type UserDashboardViewProps = {
  data: any;
  refetch: () => void;
};

function UserDashboardView({ data, refetch }: UserDashboardViewProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ACTIVE");
  const [taskSearch, setTaskSearch] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const d = await res.json();
        setTasks(d.tasks || []);
      }
    } catch (e) {
      console.error("Failed to fetch tasks on user dashboard", e);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (!res.ok) throw new Error();
      refetch(); // update metrics
    } catch (e) {
      // Revert on error
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: currentStatus } : t));
    }
  };

  // Process Stats
  const targetVal = parseInt(data.stats.todayTarget?.value || "160");
  const messagesVal = parseInt(data.stats.todayMessages?.value || "0");
  const dailyProgress = Math.min((messagesVal / targetVal) * 100, 100);

  const completedCount = tasks.filter(t => t.status === "COMPLETED").length;
  const totalTasksCount = tasks.length;
  const taskProgress = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  // Custom User Stat configuration mapping
  const userStats = [
    {
      label: "My Tasks",
      value: `${completedCount} / ${totalTasksCount}`,
      trend: `${totalTasksCount - completedCount} active tasks remaining`,
      progress: taskProgress,
      icon: CheckCircle2,
      tone: "info" as const
    },
    {
      label: "Today's Activities",
      value: `${messagesVal} / ${targetVal}`,
      trend: data.stats.todayMessages?.trend || "+12%",
      progress: dailyProgress,
      icon: Activity,
      tone: "success" as const
    },
    {
      label: "Campaign Progress",
      value: "82.4%",
      trend: "6 active campaigns running",
      progress: 82.4,
      icon: Target,
      tone: "success" as const
    },
    {
      label: "AI Suggestions",
      value: "3 New",
      trend: "High confidence suggestions",
      progress: 95,
      icon: Bot,
      tone: "info" as const
    }
  ];

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(taskSearch.toLowerCase()));
    
    if (taskFilter === "ACTIVE") {
      return matchesSearch && task.status !== "COMPLETED";
    }
    if (taskFilter === "COMPLETED") {
      return matchesSearch && task.status === "COMPLETED";
    }
    return matchesSearch;
  });

  return (
    <div className="w-full px-4 py-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen overflow-y-auto">
      <div className="w-full space-y-4">
        
        {/* Simplified Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 px-5 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>🚀 My Workspace Dashboard</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track outreach targets, connections, and campaign tasks aligned with the ArticleCraft system.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button variant="secondary" size="sm" onClick={() => { refetch(); fetchTasks(); }} className="hover:text-[#143D2C] h-8 text-xs px-2.5">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="secondary" size="sm" className="hover:text-[#143D2C] h-8 text-xs px-2.5">
              <Target className="mr-1.5 h-3.5 w-3.5 text-[#00C853]" />
              My Goals
            </Button>
            <Button size="sm" className="bg-[#143D2C] hover:bg-[#143D2C]/90 text-white shadow h-8 text-xs px-2.5">
              <Zap className="mr-1.5 h-3.5 w-3.5 text-[#00C853]" />
              Start Outreach
            </Button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {userStats.map((stat, i) => (
            <div key={i} className="transform transition-all hover:scale-[1.02] hover:shadow-xl">
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Content Section (2-Column Split: Left 2/3, Right 1/3) */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Workspace Activities (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Chart Area */}
            <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                      Campaign Activity Trends
                    </CardTitle>
                    <CardDescription className="text-[10px] text-slate-400">
                      Daily tracking of outbound messages and replies
                    </CardDescription>
                  </div>
                  <Badge tone="default" className="text-[10px] border-[#E8F7EE] bg-[#E8F7EE] text-[#143D2C] dark:bg-emerald-950/20 dark:text-emerald-400 px-1.5 py-0.5">
                    Live Updates
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-1 px-4 pb-3">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData}>
                      <defs>
                        <linearGradient id="userMessagesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#143D2C" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#143D2C" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="userRepliesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C853" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#00C853" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#143D2C" 
                        fill="url(#userMessagesGradient)" 
                        strokeWidth={2.5}
                        name="Outbound"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="replies" 
                        stroke="#00C853" 
                        fill="url(#userRepliesGradient)" 
                        strokeWidth={2.5}
                        name="Replies"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Checklist */}
            <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                      Outreach Tasks Checklist
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Mark tasks as completed directly on this board to record daily progress
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
                    <button
                      onClick={() => setTaskFilter("ACTIVE")}
                      className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                        taskFilter === "ACTIVE" 
                          ? "bg-white dark:bg-slate-700 text-[#143D2C] dark:text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setTaskFilter("COMPLETED")}
                      className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                        taskFilter === "COMPLETED" 
                          ? "bg-white dark:bg-slate-700 text-[#143D2C] dark:text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => setTaskFilter("ALL")}
                      className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                        taskFilter === "ALL" 
                          ? "bg-white dark:bg-slate-700 text-[#143D2C] dark:text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      All
                    </button>
                  </div>
                </div>
                <div className="mt-3 relative w-full">
                  <Input
                    placeholder="Quick search checklist..."
                    value={taskSearch}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskSearch(e.target.value)}
                    className="h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]/25"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-4 px-0 pb-0">
                {tasksLoading ? (
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center p-8 text-slate-400 dark:text-slate-600 text-sm">
                    No matching tasks found. Get started by creating a new outreach activity.
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto pr-1">
                    {filteredTasks.map((task) => {
                      const isDone = task.status === "COMPLETED";
                      return (
                        <div 
                          key={task.id}
                          className={cn(
                            "flex items-start gap-3 px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors",
                            isDone && "bg-slate-50/30 dark:bg-slate-900/10"
                          )}
                        >
                          <button
                            onClick={() => toggleTask(task.id, task.status)}
                            className="mt-0.5 text-slate-400 hover:text-[#00C853] transition-colors"
                            aria-label={isDone ? "Mark Incomplete" : "Mark Complete"}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-5 w-5 text-[#00C853]" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={cn(
                              "text-sm font-semibold text-slate-800 dark:text-slate-200 truncate",
                              isDone && "line-through text-slate-400 dark:text-slate-600 font-medium"
                            )}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className={cn(
                                "text-xs text-slate-500 truncate mt-0.5",
                                isDone && "text-slate-400 dark:text-slate-600"
                              )}>
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                              {task.dueDate && (
                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  Due {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                              {task.priority && (
                                <Badge 
                                  tone="default" 
                                  className={cn(
                                    "text-[9px] px-1.5 py-0.5 uppercase tracking-wide font-bold",
                                    task.priority === "URGENT" && "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50",
                                    task.priority === "HIGH" && "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
                                    task.priority === "MEDIUM" && "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
                                    task.priority === "LOW" && "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                                  )}
                                >
                                  {task.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Diagnostics & Feeds Column */}
          <div className="space-y-6">
            
            {/* Daily Activity Update Form */}
            <DailyActivityForm />
            
            {/* Upcoming Meetings & AI Suggestions */}
            <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#00C853]" />
                  Upcoming Meetings
                </CardTitle>
                <CardDescription className="text-xs">
                  Schedule campaign meetings and reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                
                {/* Meetings List */}
                <div className="space-y-3">
                  {[
                    { title: "Weekly AI Performance Review", time: "Today, 10:00 AM", type: "Urgent" },
                    { title: "Outbound Content Planning", time: "Tomorrow, 2:00 PM", type: "Regular" },
                    { title: "Client Feedback Standup", time: "Jul 15, 11:30 AM", type: "Follow-up" }
                  ].map((meeting, index) => (
                    <div key={index} className="flex justify-between items-start p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{meeting.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{meeting.time}</p>
                      </div>
                      <Badge className="text-[9px] px-1.5 py-0.5" tone={meeting.type === "Urgent" ? "warning" : "info"}>
                        {meeting.type}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* AI Suggestions Box */}
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Bot className="h-4 w-4 text-[#143D2C] dark:text-[#00C853]" />
                    <span className="text-xs font-bold text-[#143D2C] dark:text-emerald-400">AI Suggestions</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-4 font-medium">
                    <li>Optimal sending window is <strong className="text-slate-800 dark:text-slate-200">10:00 - 11:30 AM</strong>.</li>
                    <li>Shorter CTA templates yield <strong className="text-slate-800 dark:text-slate-200">12% higher reply rate</strong>.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recent Notifications Feed */}
            <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Recent Notifications
                </CardTitle>
                <CardDescription className="text-xs">
                  Recent notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 px-3">
                <div className="h-64 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                  {data.activities.map((activity: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <Avatar className="h-7 w-7 border shadow-sm flex-shrink-0">
                        <AvatarFallback className="bg-slate-200 text-slate-700 font-bold text-[10px]">
                          {activity.user.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {activity.user}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate mt-0.5">
                          {activity.action}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}