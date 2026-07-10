"use client";

import {
  Activity,
  AlertTriangle,
  Bot,
  CalendarDays,
  CheckCircle2,
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
import { StatCard } from "@/components/shared/dashboard/stat-card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

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

const userStatConfig = [
  { key: "todayTarget", label: "Today's Target", icon: Target, tone: "success" as const },
  { key: "todayMessages", label: "Today's Messages", icon: MessageSquareText, tone: "success" as const },
  { key: "monthlyMessages", label: "Monthly Messages", icon: Activity, tone: "info" as const },
  { key: "assignedTasks", label: "Assigned Tasks", icon: CheckCircle2, tone: "info" as const },
  { key: "completedTasks", label: "Completed Tasks", icon: CheckCircle2, tone: "success" as const },
  { key: "aiScore", label: "AI Score", icon: Bot, tone: "info" as const },
  { key: "whatsAppStatus", label: "WhatsApp Status", icon: ShieldCheck, tone: "success" as const },
  { key: "calendarEvents", label: "Calendar Events", icon: CalendarDays, tone: "info" as const },
  { key: "performance", label: "Performance", icon: Zap, tone: "success" as const },
  { key: "conversionRate", label: "Conversion Rate", icon: TrendingUp, tone: "success" as const }
];

export function EnhancedDashboard({ role }: EnhancedDashboardProps) {
  const { data, loading, error, refetch } = useDashboardData(role);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Loading Header */}
          <Card className="p-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </Card>

          {/* Loading Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
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

  const statConfig = role === "ADMIN" ? adminStatConfig : userStatConfig;
  const stats = statConfig.map(config => ({
    ...config,
    ...data.stats[config.key]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {role === "ADMIN" ? "Admin Control Center" : "🎯 My Performance Dashboard"}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {role === "ADMIN" 
                  ? "Monitor team performance, track activities, and manage your marketing operations with advanced insights." 
                  : "🚀 Your personal command center to track progress, optimize performance, and achieve your marketing goals with AI assistance."}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={refetch}>
                <RefreshCw className="mr-2 h-5 w-5" />
                Refresh Data
              </Button>
              <Button variant="secondary" size="lg">
                <Eye className="mr-2 h-5 w-5" />
                {role === "ADMIN" ? "View Reports" : "View Goals"}
              </Button>
              <Button size="lg" className="shadow-lg">
                <Activity className="mr-2 h-5 w-5" />
                {role === "ADMIN" ? "Generate Report" : "Start Activity"}
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
                {role === "USER" && (
                  <div className="absolute top-2 right-2">
                    {stat.key === 'todayTarget' && <Target className="h-4 w-4 text-green-500" />}
                    {stat.key === 'todayMessages' && <MessageSquareText className="h-4 w-4 text-blue-500" />}
                    {stat.key === 'performance' && <Zap className="h-4 w-4 text-yellow-500" />}
                    {stat.key === 'aiScore' && <Bot className="h-4 w-4 text-purple-500" />}
                  </div>
                )}
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
                    {role === "ADMIN" ? "Marketing Performance Analytics" : "Personal Performance Overview"}
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
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="repliesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
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
                          stroke="#14b8a6" 
                          fill="url(#messagesGradient)" 
                          strokeWidth={3}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="replies" 
                          stroke="#0ea5e9" 
                          fill="url(#repliesGradient)" 
                          strokeWidth={3}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#f59e0b" 
                          strokeWidth={3} 
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
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
                        <Bar dataKey="messages" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="replies" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
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
                        <Line type="monotone" dataKey="tasks" stroke="#14b8a6" strokeWidth={4} />
                        <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={4} />
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
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                        style={{ backgroundColor: item.color }}
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
                {role === "ADMIN" ? "Team Performance Dashboard" : "Monthly Progress Tracker"}
              </CardTitle>
              <CardDescription>
                {role === "ADMIN" ? "Real-time team metrics and performance indicators" : "Track your monthly achievements and goals"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {role === "ADMIN" && data.teamPerformance ? (
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
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{team.score}%</p>
                          <p className="text-xs text-slate-500">Performance</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score</span>
                            <span>{team.score}%</span>
                          </div>
                          <Progress value={team.score} className="h-3" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Efficiency</span>
                            <span>{team.efficiency}%</span>
                          </div>
                          <Progress value={team.efficiency} className="h-3" />
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
                      <Bar dataKey="productivity" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="growth" fill="#f59e0b" radius={[8, 8, 0, 0]} />
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
                {data.activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage src={`/avatars/${activity.user.toLowerCase().replace(' ', '-')}.png`} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{activity.user}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{activity.action}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        tone={activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'info'}
                        className="text-xs font-medium"
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

        {/* Enhanced Performance Summary */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Overall Performance Summary
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {role === "ADMIN" 
                    ? "Your team is performing exceptionally well across all metrics. System health is optimal."
                    : "You're exceeding expectations! Your productivity and AI score are both trending upward."}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">94%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Performance</div>
                </div>
                <div className="w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 94 }, { value: 6 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={45}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}