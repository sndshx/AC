"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUp,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Eye,
  FileBarChart,
  MessageSquareText,
  MoreHorizontal,
  Settings,
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
  Cell,
  Line,
  LineChart,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
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
import { chartData, monthlyData, demoUsers } from "@/lib/shared/demo-data";

type DashboardHomeProps = {
  role: "ADMIN" | "USER";
};

const adminStats = [
  { label: "Total Users", value: "128", trend: "+18%", progress: 82, icon: Users, tone: "success" as const },
  { label: "Active Users", value: "116", trend: "+12%", progress: 91, icon: ShieldCheck, tone: "success" as const },
  { label: "Today's Messages", value: "6,770", trend: "+9%", progress: 78, icon: MessageSquareText, tone: "info" as const },
  { label: "Monthly Revenue", value: "$34.8K", trend: "+36%", progress: 94, icon: DollarSign, tone: "success" as const },
  { label: "Completed Tasks", value: "284", trend: "+17%", progress: 88, icon: CheckCircle2, tone: "success" as const },
  { label: "Pending Tasks", value: "42", trend: "-6%", progress: 28, icon: Clock3, tone: "warning" as const },
  { label: "AI Performance", value: "91%", trend: "+7%", progress: 91, icon: Bot, tone: "info" as const },
  { label: "WhatsApp Active", value: "109", trend: "+8%", progress: 85, icon: MessageSquareText, tone: "success" as const },
  { label: "Warning Accounts", value: "7", trend: "-2", progress: 14, icon: AlertTriangle, tone: "warning" as const },
  { label: "Growth Rate", value: "12.3%", trend: "+3.2%", progress: 76, icon: TrendingUp, tone: "success" as const }
];

const userStats = [
  { label: "Today's Target", value: "160", trend: "92%", progress: 92, icon: Target, tone: "success" as const },
  { label: "Today's Messages", value: "148", trend: "+12%", progress: 92, icon: MessageSquareText, tone: "success" as const },
  { label: "Monthly Messages", value: "3,180", trend: "+18%", progress: 88, icon: Activity, tone: "info" as const },
  { label: "Assigned Tasks", value: "18", trend: "+3", progress: 68, icon: CheckCircle2, tone: "info" as const },
  { label: "Pending Tasks", value: "5", trend: "-2", progress: 25, icon: Clock3, tone: "warning" as const },
  { label: "Completed Tasks", value: "13", trend: "+6", progress: 72, icon: CheckCircle2, tone: "success" as const },
  { label: "AI Score", value: "91%", trend: "+7%", progress: 91, icon: Bot, tone: "info" as const },
  { label: "WhatsApp Status", value: "Active", trend: "94%", progress: 94, icon: ShieldCheck, tone: "success" as const },
  { label: "Calendar Events", value: "6", trend: "2 today", progress: 60, icon: CalendarDays, tone: "info" as const },
  { label: "Performance", value: "A+", trend: "+2 levels", progress: 95, icon: Zap, tone: "success" as const }
];

// Additional data for enhanced charts
const performanceData = [
  { name: "Messages", value: 6770, color: "#0ea5e9" },
  { name: "Replies", value: 2890, color: "#10b981" },
  { name: "Conversions", value: 445, color: "#f59e0b" },
  { name: "Follow-ups", value: 1230, color: "#8b5cf6" }
];

const teamPerformance = [
  { name: "Outbound AI", score: 94, members: 12, tasks: 48 },
  { name: "Growth Command", score: 91, members: 8, tasks: 32 },
  { name: "Retention", score: 87, members: 6, tasks: 24 },
  { name: "Agency Pods", score: 82, members: 10, tasks: 40 }
];

const recentActivities = [
  { user: "Noah Patel", action: "Completed lead campaign", time: "2 mins ago", type: "success" },
  { user: "Maya Chen", action: "WhatsApp warning triggered", time: "15 mins ago", type: "warning" },
  { user: "Leo Martin", action: "New task assigned", time: "1 hour ago", type: "info" },
  { user: "Ava Sterling", action: "Monthly report generated", time: "2 hours ago", type: "info" },
  { user: "System", action: "AI model updated", time: "3 hours ago", type: "success" }
];

const upcomingTasks = [
  { title: "Review Q3 campaigns", assignee: "Noah Patel", priority: "High", due: "Today", progress: 75 },
  { title: "WhatsApp account audit", assignee: "Maya Chen", priority: "Medium", due: "Tomorrow", progress: 30 },
  { title: "Team performance review", assignee: "Ava Sterling", priority: "High", due: "Jul 15", progress: 50 },
  { title: "AI model training", assignee: "System", priority: "Low", due: "Jul 20", progress: 10 }
];

export function DashboardHome({ role }: DashboardHomeProps) {
  const stats = role === "ADMIN" ? adminStats : userStats;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {role === "ADMIN" ? "Admin Dashboard" : "My Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {role === "ADMIN" 
              ? "Monitor team performance, track activities, and manage your marketing operations." 
              : "Track your progress, manage tasks, and optimize your marketing performance."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button size="sm">
            <Activity className="mr-2 h-4 w-4" />
            {role === "ADMIN" ? "Generate Report" : "Update Activity"}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* Main Analytics Section */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Primary Chart */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{role === "ADMIN" ? "Marketing Performance Overview" : "Personal Performance"}</CardTitle>
              <CardDescription>Messages, replies, tasks, and AI score trends over time</CardDescription>
            </div>
            <Button variant="secondary" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="messages" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="replies" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                      <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Area type="monotone" dataKey="messages" stroke="#14b8a6" fill="url(#messages)" strokeWidth={2} />
                      <Area type="monotone" dataKey="replies" stroke="#0ea5e9" fill="url(#replies)" strokeWidth={2} />
                      <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                      <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="messages" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="replies" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                      <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="tasks" stroke="#14b8a6" strokeWidth={3} />
                      <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>Today's activity distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Team Performance & Activity Feed */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Team Performance (Admin) / Monthly Progress (User) */}
        <Card>
          <CardHeader>
            <CardTitle>{role === "ADMIN" ? "Team Performance" : "Monthly Progress"}</CardTitle>
            <CardDescription>
              {role === "ADMIN" ? "Compare team scores and task completion" : "Track your monthly achievements"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {role === "ADMIN" ? (
              <div className="space-y-4">
                {teamPerformance.map((team, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-muted-foreground">{team.members} members • {team.tasks} tasks</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{team.score}%</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <div className="w-20">
                        <Progress value={team.score} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                    <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                    <YAxis stroke="currentColor" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="productivity" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="growth" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest team updates and system events</CardDescription>
            </div>
            <Button variant="secondary" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/avatars/${activity.user.toLowerCase().replace(' ', '-')}.png`} />
                    <AvatarFallback>
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.user}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      tone={activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'info'}
                      className="text-xs"
                    >
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Tasks & Quick Actions */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Upcoming Tasks */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks requiring attention in the next few days</CardDescription>
            </div>
            <Button variant="secondary" size="sm">Manage Tasks</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{task.title}</p>
                      <Badge 
                        tone={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'info'}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Assigned to {task.assignee}</span>
                      <span>Due: {task.due}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Insights */}
        <Card>
          <CardHeader>
            <CardTitle>{role === "ADMIN" ? "Quick Actions" : "AI Insights"}</CardTitle>
            <CardDescription>
              {role === "ADMIN" ? "Common admin operations" : "Personalized recommendations"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(role === "ADMIN"
              ? [
                  { title: "Create User", description: "Add new team member", icon: Users },
                  { title: "Generate Report", description: "Export monthly analytics", icon: FileBarChart },
                  { title: "System Health", description: "Check all services", icon: ShieldCheck },
                  { title: "Bulk Actions", description: "Manage multiple users", icon: Settings }
                ]
              : [
                  { title: "Optimize Send Time", description: "Best window: 10:00-11:30 AM", icon: Clock3 },
                  { title: "Follow-up Reminder", description: "32 prospects need attention", icon: MessageSquareText },
                  { title: "Performance Tip", description: "Shorter CTAs improve replies", icon: Target },
                  { title: "Calendar Sync", description: "6 events scheduled today", icon: CalendarDays }
                ]
            ).map(({ title, description, icon: Icon }, index) => (
              <Button 
                key={index} 
                variant="secondary" 
                className="w-full h-auto p-4 flex flex-col items-start gap-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{title}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">{description}</span>
              </Button>
            ))}

            <div className="rounded-lg bg-muted p-4 mt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Overall Performance
                </span>
                <span className="font-medium">94%</span>
              </div>
              <Progress value={94} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                {role === "ADMIN" 
                  ? "Team performance is excellent. All metrics trending upward."
                  : "You're performing exceptionally well. Keep up the great work!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
