"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileBarChart,
  MessageCircle,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  ShieldCheck,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserX,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/shared/dashboard/stat-card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Admin comprehensive stat configuration
const adminStatConfig = [
  { key: "totalUsers", label: "Total Users", icon: Users, tone: "success" as const },
  { key: "activeUsers", label: "Active Users", icon: UserCheck, tone: "success" as const },
  { key: "todayMessages", label: "Today's Messages", icon: MessageSquareText, tone: "info" as const },
  { key: "monthlyRevenue", label: "Monthly Revenue", icon: DollarSign, tone: "success" as const },
  { key: "completedTasks", label: "Completed Tasks", icon: CheckCircle2, tone: "success" as const },
  { key: "aiPerformance", label: "AI Performance", icon: Bot, tone: "info" as const },
  { key: "whatsAppActive", label: "WhatsApp Active", icon: MessageCircle, tone: "success" as const },
  { key: "warningAccounts", label: "Warning Accounts", icon: AlertTriangle, tone: "warning" as const }
];

// WhatsApp Status Data
const whatsappStatusData = [
  { status: "Active", count: 109, color: "#10b981", percentage: 85 },
  { status: "Warning", count: 7, color: "#f59e0b", percentage: 5 },
  { status: "Limited", count: 8, color: "#ef4444", percentage: 6 },
  { status: "Banned", count: 4, color: "#6b7280", percentage: 4 }
];

// Recent Notifications
const recentNotifications = [
  { type: "TARGET_COMPLETED", user: "Maya Chen", message: "Daily target achieved", time: "5 mins ago", priority: "success" },
  { type: "WHATSAPP_WARNING", user: "Leo Martin", message: "WhatsApp account flagged", time: "12 mins ago", priority: "warning" },
  { type: "NEW_TASK", user: "Ava Sterling", message: "New campaign task created", time: "25 mins ago", priority: "info" },
  { type: "AI_ALERT", user: "System", message: "Performance drop detected", time: "1 hour ago", priority: "warning" }
];

// Analytics Data
const marketingTrends = [
  { month: "Jan", messages: 15420, success: 12336, conversion: 8.2 },
  { month: "Feb", messages: 18930, success: 15144, conversion: 9.1 },
  { month: "Mar", messages: 21250, success: 17850, conversion: 10.3 },
  { month: "Apr", messages: 19840, success: 16258, conversion: 9.8 },
  { month: "May", messages: 23180, success: 19254, conversion: 11.2 },
  { month: "Jun", messages: 26750, success: 22737, conversion: 12.4 }
];

export function AdminDashboard() {
  const { data, loading, error, refetch } = useDashboardData("ADMIN");

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <Skeleton className="xl:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Failed to load admin dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
            <Button onClick={refetch}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const stats = adminStatConfig.map(config => ({
    ...config,
    ...data.stats[config.key]
  }));

  return (
    <div className="space-y-8">
      {/* Admin Command Center Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-800 rounded-xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Shield className="h-12 w-12 text-yellow-400" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  ADMIN CONTROL CENTER
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-red-600 text-white font-bold px-3 py-1">ADMIN ACCESS</Badge>
                  <Badge className="bg-green-600 text-white font-bold px-3 py-1">SYSTEM ONLINE</Badge>
                </div>
              </div>
            </div>
            <p className="text-xl text-purple-100 max-w-3xl leading-relaxed">
              🚀 Master control panel for complete system oversight • User management • Analytics monitoring • Task delegation • AI performance tracking • Security management
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={refetch} className="text-base px-6 py-3 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20">
                <RefreshCw className="mr-2 h-5 w-5" />
                System Refresh
              </Button>
              <Button variant="secondary" size="lg" className="text-base px-6 py-3 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20">
                <Download className="mr-2 h-5 w-5" />
                Export Analytics
              </Button>
            </div>
            <div className="flex gap-3">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-base px-6 py-3 shadow-lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Add User
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-base px-6 py-3 shadow-lg">
                <AlertTriangle className="mr-2 h-5 w-5" />
                System Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Power Stats Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            🎯 ADMIN POWER DASHBOARD
          </h2>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 font-bold px-4 py-2 text-sm">
              🟢 SYSTEM HEALTHY
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 font-bold px-4 py-2 text-sm">
              👥 {stats.find(s => s.key === 'totalUsers')?.value || 'N/A'} USERS ACTIVE
            </Badge>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="transform transition-all hover:scale-110 hover:shadow-xl">
              <div className="relative overflow-hidden">
                <StatCard {...stat} />
                <div className="absolute top-2 right-2">
                  {stat.key === 'totalUsers' && <Users className="h-4 w-4 text-blue-500" />}
                  {stat.key === 'activeUsers' && <UserCheck className="h-4 w-4 text-green-500" />}
                  {stat.key === 'monthlyRevenue' && <DollarSign className="h-4 w-4 text-yellow-500" />}
                  {stat.key === 'warningAccounts' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Control Tabs */}
      <Tabs defaultValue="analytics" className="space-y-8">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-lg border">
          <TabsList className="grid w-full grid-cols-6 bg-transparent gap-2">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-base font-bold py-3 rounded-lg transition-all">
              📊 ANALYTICS HUB
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white text-base font-bold py-3 rounded-lg transition-all">
              👥 USER CONTROL
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white text-base font-bold py-3 rounded-lg transition-all">
              ✅ TASK MASTER
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white text-base font-bold py-3 rounded-lg transition-all">
              � WHATSAPP OPS
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 data-[state=active]:text-white text-base font-bold py-3 rounded-lg transition-all">
              🤖 AI COMMAND
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white text-base font-bold py-3 rounded-lg transition-all">
              📈 POWER REPORTS
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Analytics Tab - Admin Focused */}
        <TabsContent value="analytics" className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-3">
            {/* Marketing Performance Charts */}
            <Card className="xl:col-span-2 shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950">
              <CardHeader className="border-b border-blue-200 dark:border-blue-800 pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black flex items-center gap-3">
                      <TrendingUp className="h-8 w-8" />
                      📈 MASTER ANALYTICS CENTER
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-lg mt-3 font-medium">
                      Real-time marketing performance • Message analytics • Conversion tracking • Growth metrics
                    </CardDescription>
                  </div>
                  <Button variant="secondary" size="lg" className="text-base px-4 py-2 bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                      <div className="text-2xl font-black">{marketingTrends[marketingTrends.length - 1]?.conversion || '0'}%</div>
                      <div className="text-sm font-bold opacity-90">Conversion Rate</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                      <div className="text-2xl font-black">{(marketingTrends[marketingTrends.length - 1]?.messages || 0).toLocaleString()}</div>
                      <div className="text-sm font-bold opacity-90">Total Messages</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                      <div className="text-2xl font-black">{(marketingTrends[marketingTrends.length - 1]?.success || 0).toLocaleString()}</div>
                      <div className="text-sm font-bold opacity-90">Successful</div>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketingTrends}>
                      <defs>
                        <linearGradient id="adminMessagesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="adminSuccessGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
                      <XAxis dataKey="month" stroke="currentColor" fontSize={14} fontWeight="bold" />
                      <YAxis stroke="currentColor" fontSize={14} fontWeight="bold" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '2px solid #3b82f6',
                          borderRadius: '12px',
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                          fontWeight: 'bold'
                        }}
                      />
                      <Area type="monotone" dataKey="messages" stroke="#3b82f6" fill="url(#adminMessagesGradient)" strokeWidth={4} name="Total Messages" />
                      <Area type="monotone" dataKey="success" stroke="#10b981" fill="url(#adminSuccessGradient)" strokeWidth={4} name="Successful Messages" />
                      <Line type="monotone" dataKey="conversion" stroke="#f59e0b" strokeWidth={5} dot={{ fill: '#f59e0b', strokeWidth: 3, r: 6 }} name="Conversion Rate %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Team Performance Breakdown */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  Team Performance
                </CardTitle>
                <CardDescription className="text-lg">Individual and team metrics</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {data.teamPerformance && (
                  <div className="space-y-5">
                    {data.teamPerformance.slice(0, 3).map((team, index) => (
                      <div key={index} className="p-5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{team.name}</h3>
                            <p className="text-base text-slate-600 dark:text-slate-400">
                              {team.members} members • {team.tasks} tasks
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{team.score}%</p>
                            <p className="text-sm text-slate-500 font-medium">Performance</p>
                          </div>
                        </div>
                        <Progress value={team.score} className="h-3" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Action Buttons */}
                <div className="space-y-3 pt-6 border-t mt-6">
                  <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                    <BarChart3 className="mr-3 h-5 w-5" />
                    View Detailed Analytics
                  </Button>
                  <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                    <Download className="mr-3 h-5 w-5" />
                    Export Team Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Charts & Notifications */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Growth Trends */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <TrendingUp className="h-6 w-6" />
                  Growth Trends
                </CardTitle>
                <CardDescription className="text-lg">Monthly progress and growth metrics</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketingTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                      <XAxis dataKey="month" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="messages" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total Messages" />
                      <Bar dataKey="success" fill="#10b981" radius={[6, 6, 0, 0]} name="Successful Messages" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Live Notifications */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Bell className="h-6 w-6" />
                    Live Notifications
                  </CardTitle>
                  <CardDescription className="text-lg">Real-time system alerts and updates</CardDescription>
                </div>
                <Button variant="secondary" size="lg" className="text-base px-4 py-2">View All</Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentNotifications.map((notification, index) => (
                    <div key={index} className="flex items-center gap-4 p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-base">
                          {notification.user === 'System' ? 'SYS' : notification.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base text-slate-900 dark:text-white truncate">{notification.user}</p>
                        <p className="text-base text-slate-600 dark:text-slate-400 truncate">{notification.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          tone={notification.priority === 'success' ? 'success' : notification.priority === 'warning' ? 'warning' : 'info'}
                          className="text-sm font-medium px-3 py-1"
                        >
                          {notification.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-slate-500 whitespace-nowrap font-medium">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-3">
            {/* User Management Actions */}
            <Card className="xl:col-span-2 shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <Users className="h-6 w-6" />
                      User Management
                    </CardTitle>
                    <CardDescription className="text-lg mt-3">
                      Add, edit, activate, and manage all user accounts and permissions
                    </CardDescription>
                  </div>
                  <Button size="lg" className="text-base px-4 py-2">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* User Actions */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">User Actions</h3>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <UserPlus className="mr-3 h-5 w-5 text-green-600" />
                      Add New User
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Edit className="mr-3 h-5 w-5 text-blue-600" />
                      Edit User Details
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <UserCheck className="mr-3 h-5 w-5 text-green-600" />
                      Activate User
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <UserX className="mr-3 h-5 w-5 text-red-600" />
                      Deactivate User
                    </Button>
                  </div>

                  {/* Role Management */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Role & Permissions</h3>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Shield className="mr-3 h-5 w-5 text-purple-600" />
                      Change User Role
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Eye className="mr-3 h-5 w-5 text-blue-600" />
                      View User Details
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Trash2 className="mr-3 h-5 w-5 text-red-600" />
                      Delete User
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Settings className="mr-3 h-5 w-5 text-gray-600" />
                      User Settings
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t">
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-2xl font-bold text-green-600">{data.stats.activeUsers?.value || '0'}</div>
                    <div className="text-sm text-green-700 dark:text-green-400 font-medium">Active Users</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-2xl font-bold text-blue-600">{data.stats.totalUsers?.value || '0'}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">Total Users</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">Pending</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-red-700 dark:text-red-400 font-medium">Suspended</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent User Activity */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Activity className="h-6 w-6" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-lg">Latest user actions and changes</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {data.activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">{activity.user}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{activity.action}</p>
                      </div>
                      <span className="text-xs text-slate-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Task Management Tab - Complete Implementation */}
        <TabsContent value="tasks" className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-3">
            {/* Task Management Actions */}
            <Card className="xl:col-span-2 shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6" />
                      Task Management Center
                    </CardTitle>
                    <CardDescription className="text-lg mt-3">
                      Complete task lifecycle management - create, assign, edit, delete, and track progress
                    </CardDescription>
                  </div>
                  <Button size="lg" className="text-base px-4 py-2">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Task Actions */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📋 Task Actions</h3>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-4">
                      <Plus className="mr-3 h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <div className="font-semibold">Create New Task</div>
                        <div className="text-sm text-muted-foreground">Add marketing tasks</div>
                      </div>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-4">
                      <Users className="mr-3 h-6 w-6 text-blue-600" />
                      <div className="text-left">
                        <div className="font-semibold">Assign Task</div>
                        <div className="text-sm text-muted-foreground">Delegate to team members</div>
                      </div>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-4">
                      <Edit className="mr-3 h-6 w-6 text-yellow-600" />
                      <div className="text-left">
                        <div className="font-semibold">Edit Task</div>
                        <div className="text-sm text-muted-foreground">Modify task details</div>
                      </div>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-4">
                      <Trash2 className="mr-3 h-6 w-6 text-red-600" />
                      <div className="text-left">
                        <div className="font-semibold">Delete Task</div>
                        <div className="text-sm text-muted-foreground">Remove completed tasks</div>
                      </div>
                    </Button>
                  </div>

                  {/* Task Tracking */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📈 Task Tracking</h3>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-4">
                      <BarChart3 className="mr-3 h-6 w-6 text-purple-600" />
                      <div className="text-left">
                        <div className="font-semibold">Track Progress</div>
                        <div className="text-sm text-muted-foreground">Monitor completion rates</div>
                      </div>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-4">
                      <Clock className="mr-3 h-6 w-6 text-orange-600" />
                      <div className="text-left">
                        <div className="font-semibold">View Deadlines</div>
                        <div className="text-sm text-muted-foreground">Check due dates</div>
                      </div>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-4">
                      <CheckCircle2 className="mr-3 h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <div className="font-semibold">Mark Complete</div>
                        <div className="text-sm text-muted-foreground">Update task status</div>
                      </div>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-4">
                      <FileBarChart className="mr-3 h-6 w-6 text-blue-600" />
                      <div className="text-left">
                        <div className="font-semibold">Task Reports</div>
                        <div className="text-sm text-muted-foreground">Generate analytics</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Task Statistics Grid */}
                <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t">
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border">
                    <div className="text-3xl font-bold text-blue-600">45</div>
                    <div className="text-base text-blue-700 dark:text-blue-400 font-medium">Active Tasks</div>
                    <div className="text-sm text-blue-600 mt-1">In Progress</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border">
                    <div className="text-3xl font-bold text-green-600">{data.stats.completedTasks?.value || '284'}</div>
                    <div className="text-base text-green-700 dark:text-green-400 font-medium">Completed</div>
                    <div className="text-sm text-green-600 mt-1">This Month</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border">
                    <div className="text-3xl font-bold text-yellow-600">8</div>
                    <div className="text-base text-yellow-700 dark:text-yellow-400 font-medium">Pending</div>
                    <div className="text-sm text-yellow-600 mt-1">Awaiting Review</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border">
                    <div className="text-3xl font-bold text-red-600">2</div>
                    <div className="text-base text-red-700 dark:text-red-400 font-medium">Overdue</div>
                    <div className="text-sm text-red-600 mt-1">Needs Attention</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Progress Visualization */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  Progress Overview
                </CardTitle>
                <CardDescription className="text-lg">Weekly task completion trends</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                      <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total Tasks" />
                      <Bar dataKey="completedTasks" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Task Priority Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Priority Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        High Priority
                      </span>
                      <span className="text-base text-red-600 font-medium">12 tasks</span>
                    </div>
                    <Progress value={75} className="h-3" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        Medium Priority
                      </span>
                      <span className="text-base text-yellow-600 font-medium">28 tasks</span>
                    </div>
                    <Progress value={60} className="h-3" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        Low Priority
                      </span>
                      <span className="text-base text-green-600 font-medium">15 tasks</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WhatsApp Monitoring Tab - Complete Implementation */}
        <TabsContent value="whatsapp" className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-3">
            {/* WhatsApp Status Management */}
            <Card className="xl:col-span-2 shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <MessageCircle className="h-6 w-6" />
                      WhatsApp Monitoring Center
                    </CardTitle>
                    <CardDescription className="text-lg mt-3">
                      Complete WhatsApp account health monitoring, ban tracking, and message limits
                    </CardDescription>
                  </div>
                  <Badge tone="success" className="text-base px-4 py-2 text-lg font-semibold">
                    {data.stats.whatsAppActive?.value || '109'} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Status Distribution */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      📊 Account Status Distribution
                    </h3>
                    
                    {/* Active Status */}
                    <div className="p-5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-4 rounded-full bg-green-500"></div>
                          <span className="text-lg font-semibold text-green-800 dark:text-green-300">Active</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">109</span>
                      </div>
                      <Progress value={85} className="h-4 mb-2" />
                      <p className="text-sm text-green-700 dark:text-green-400">Accounts in good standing</p>
                    </div>

                    {/* Warning Status */}
                    <div className="p-5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                          <span className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Warning</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{data.stats.warningAccounts?.value || '7'}</span>
                      </div>
                      <Progress value={15} className="h-4 mb-2" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">Rate limits or temporary restrictions</p>
                    </div>

                    {/* Limited & Banned Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-center">
                        <div className="text-2xl font-bold text-red-600">3</div>
                        <div className="text-sm text-red-700 dark:text-red-400 font-medium">Limited</div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-gray-600">1</div>
                        <div className="text-sm text-gray-700 dark:text-gray-400 font-medium">Banned</div>
                      </div>
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      💊 Health Metrics
                    </h3>
                    
                    <div className="p-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-blue-800 dark:text-blue-300 font-semibold text-lg">Average Health Score</span>
                        <span className="text-3xl font-bold text-blue-600">94%</span>
                      </div>
                      <Progress value={94} className="h-4" />
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">Excellent overall health</p>
                    </div>

                    <div className="p-5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-purple-800 dark:text-purple-300 font-semibold text-lg">Daily Messages</span>
                        <span className="text-3xl font-bold text-purple-600">{data.stats.todayMessages?.value || '6,770'}</span>
                      </div>
                      <Progress value={78} className="h-4" />
                      <p className="text-sm text-purple-700 dark:text-purple-400 mt-2">Messages sent today</p>
                    </div>

                    <div className="p-5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-indigo-800 dark:text-indigo-300 font-semibold text-lg">Monthly Volume</span>
                        <span className="text-3xl font-bold text-indigo-600">245K</span>
                      </div>
                      <Progress value={68} className="h-4" />
                      <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-2">Messages this month</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                  <Button variant="outline" size="lg" className="text-base py-3">
                    <MessageCircle className="mr-2 h-5 w-5 text-blue-600" />
                    View Ban History
                  </Button>
                  <Button variant="outline" size="lg" className="text-base py-3">
                    <Shield className="mr-2 h-5 w-5 text-green-600" />
                    Health Check
                  </Button>
                  <Button variant="outline" size="lg" className="text-base py-3">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                    Manage Warnings
                  </Button>
                  <Button variant="outline" size="lg" className="text-base py-3">
                    <Settings className="mr-2 h-5 w-5 text-gray-600" />
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Status Chart & Alerts */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6" />
                  Status Overview
                </CardTitle>
                <CardDescription className="text-lg">Real-time account health</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Status Pie Chart */}
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Active", value: 109, fill: "#10b981" },
                          { name: "Warning", value: 7, fill: "#f59e0b" },
                          { name: "Limited", value: 3, fill: "#ef4444" },
                          { name: "Banned", value: 1, fill: "#6b7280" }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                        <Cell fill="#6b7280" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent WhatsApp Alerts */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    🚨 Recent Alerts
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-yellow-800 dark:text-yellow-300">Rate Limit Warning</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-400">Leo Martin - Account flagged</p>
                        </div>
                        <span className="text-xs text-yellow-600 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">2h ago</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-red-800 dark:text-red-300">Account Banned</p>
                          <p className="text-sm text-red-700 dark:text-red-400">Sarah Wilson - Suspended</p>
                        </div>
                        <span className="text-xs text-red-600 bg-red-100 dark:bg-red-900 px-2 py-1 rounded">1d ago</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-green-800 dark:text-green-300">Health Restored</p>
                          <p className="text-sm text-green-700 dark:text-green-400">Maya Chen - Back to 100%</p>
                        </div>
                        <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">3h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Dashboard Tab - Complete Implementation */}
        <TabsContent value="ai" className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-3">
            {/* AI Performance Analytics */}
            <Card className="xl:col-span-2 shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <Bot className="h-6 w-6" />
                      🤖 AI Performance Analysis
                    </CardTitle>
                    <CardDescription className="text-lg mt-3">
                      Comprehensive AI productivity metrics, performance scores, and optimization suggestions
                    </CardDescription>
                  </div>
                  <Button size="lg" className="text-base px-4 py-2">
                    <Zap className="mr-2 h-5 w-5" />
                    Optimize AI
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* AI Performance Metrics Grid */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      📊 Performance Metrics
                    </h3>
                    
                    {/* Overall AI Performance */}
                    <div className="p-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-blue-800 dark:text-blue-300 font-semibold text-lg">AI Performance Score</span>
                        <span className="text-3xl font-bold text-blue-600">{data.stats.aiPerformance?.value || '89%'}</span>
                      </div>
                      <Progress value={89} className="h-4 mb-2" />
                      <p className="text-sm text-blue-700 dark:text-blue-400">Excellent performance this month</p>
                    </div>

                    {/* Productivity Score */}
                    <div className="p-5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-purple-800 dark:text-purple-300 font-semibold text-lg">Productivity Score</span>
                        <span className="text-3xl font-bold text-purple-600">92%</span>
                      </div>
                      <Progress value={92} className="h-4 mb-2" />
                      <p className="text-sm text-purple-700 dark:text-purple-400">Above average productivity</p>
                    </div>

                    {/* Response Accuracy */}
                    <div className="p-5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-green-800 dark:text-green-300 font-semibold text-lg">Response Accuracy</span>
                        <span className="text-3xl font-bold text-green-600">94%</span>
                      </div>
                      <Progress value={94} className="h-4 mb-2" />
                      <p className="text-sm text-green-700 dark:text-green-400">High accuracy rate maintained</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      🧠 AI Insights
                    </h3>
                    
                    {/* AI Suggestions Generated */}
                    <div className="p-5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-orange-800 dark:text-orange-300 font-semibold text-lg">AI Suggestions</span>
                        <span className="text-3xl font-bold text-orange-600">247</span>
                      </div>
                      <Progress value={85} className="h-4 mb-2" />
                      <p className="text-sm text-orange-700 dark:text-orange-400">Generated this month</p>
                    </div>

                    {/* Best Time to Send */}
                    <div className="p-5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-indigo-800 dark:text-indigo-300 font-semibold text-lg">Optimal Send Time</span>
                        <span className="text-3xl font-bold text-indigo-600">2:30 PM</span>
                      </div>
                      <Progress value={78} className="h-4 mb-2" />
                      <p className="text-sm text-indigo-700 dark:text-indigo-400">Based on engagement data</p>
                    </div>

                    {/* Learning Progress */}
                    <div className="p-5 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-pink-800 dark:text-pink-300 font-semibold text-lg">Learning Progress</span>
                        <span className="text-3xl font-bold text-pink-600">76%</span>
                      </div>
                      <Progress value={76} className="h-4 mb-2" />
                      <p className="text-sm text-pink-700 dark:text-pink-400">Model adaptation rate</p>
                    </div>
                  </div>
                </div>

                {/* AI Analytics Chart */}
                <div className="pt-6 border-t">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    📈 Weekly AI Performance Trends
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { day: "Mon", performance: 85, accuracy: 91, suggestions: 35 },
                        { day: "Tue", performance: 88, accuracy: 93, suggestions: 42 },
                        { day: "Wed", performance: 92, accuracy: 94, suggestions: 38 },
                        { day: "Thu", performance: 89, accuracy: 92, suggestions: 45 },
                        { day: "Fri", performance: 94, accuracy: 96, suggestions: 41 },
                        { day: "Sat", performance: 87, accuracy: 90, suggestions: 28 },
                        { day: "Sun", performance: 91, accuracy: 94, suggestions: 33 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis dataKey="day" stroke="currentColor" fontSize={12} />
                        <YAxis stroke="currentColor" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} name="Performance %" />
                        <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} name="Accuracy %" />
                        <Line type="monotone" dataKey="suggestions" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} name="Daily Suggestions" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions & Recommendations */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Zap className="h-6 w-6" />
                  AI Recommendations
                </CardTitle>
                <CardDescription className="text-lg">Smart insights and optimization suggestions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* AI Suggestions List */}
                <div className="space-y-5 mb-8">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    💡 Latest AI Insights
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <Badge tone="info" className="text-sm">Performance</Badge>
                        <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">High Priority</span>
                      </div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Optimize message timing</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Send messages between 2-4 PM for 23% better engagement</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <Badge tone="success" className="text-sm">Content</Badge>
                        <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Medium Priority</span>
                      </div>
                      <p className="font-semibold text-green-900 dark:text-green-100">Personalize message content</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">Use customer names and interests for higher conversion rates</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200">
                      <div className="flex items-start justify-between mb-2">
                        <Badge tone="warning" className="text-sm">System</Badge>
                        <span className="text-xs text-yellow-600 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">Low Priority</span>
                      </div>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">Update AI training data</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">Retrain models with recent user interaction patterns</p>
                    </div>
                  </div>
                </div>

                {/* Weekly & Monthly Summary */}
                <div className="pt-6 border-t">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">📋 AI Summary Reports</h4>
                  
                  <div className="space-y-4">
                    <div className="p-5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h5 className="font-bold text-blue-900 dark:text-blue-100 text-lg">Weekly Summary</h5>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Performance insights for this week</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">92%</div>
                          <div className="text-xs text-blue-600">Avg Performance</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">287</div>
                          <div className="text-xs text-blue-600">Suggestions</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">15.3%</div>
                          <div className="text-xs text-blue-600">Improvement</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h5 className="font-bold text-purple-900 dark:text-purple-100 text-lg">Monthly Summary</h5>
                          <p className="text-sm text-purple-700 dark:text-purple-300">Complete month AI analytics</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-purple-600">89%</div>
                          <div className="text-xs text-purple-600">Avg Performance</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">1,247</div>
                          <div className="text-xs text-purple-600">Total Suggestions</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">28.7%</div>
                          <div className="text-xs text-purple-600">Growth Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Controls */}
                <div className="pt-6 border-t">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">⚙️ AI Controls</h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Bot className="mr-3 h-5 w-5 text-blue-600" />
                      Retrain AI Model
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Settings className="mr-3 h-5 w-5 text-gray-600" />
                      AI Configuration
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Zap className="mr-3 h-5 w-5 text-yellow-600" />
                      Performance Boost
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab - Complete Implementation */}
        <TabsContent value="reports" className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-3">
            {/* Report Generation Center */}
            <Card className="xl:col-span-2 shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <FileBarChart className="h-6 w-6" />
                      📊 Reports & Analytics Center
                    </CardTitle>
                    <CardDescription className="text-lg mt-3">
                      Generate comprehensive reports, export data, manage calendar events, and track notifications
                    </CardDescription>
                  </div>
                  <Button size="lg" className="text-base px-4 py-2">
                    <Download className="mr-2 h-5 w-5" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Report Types Grid */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      📈 Performance Reports
                    </h3>
                    
                    {/* Daily Report */}
                    <div className="p-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">Daily Report</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Today's performance metrics and activities</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{data.stats.todayMessages?.value || '6,770'}</div>
                          <div className="text-xs text-blue-600">Messages Sent</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">89%</div>
                          <div className="text-xs text-blue-600">Success Rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{data.stats.activeUsers?.value || '156'}</div>
                          <div className="text-xs text-blue-600">Active Users</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-blue-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          CSV
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Excel
                        </Button>
                      </div>
                    </div>

                    {/* Weekly Report */}
                    <div className="p-5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold text-green-900 dark:text-green-100 text-lg">Weekly Report</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">7-day performance summary and trends</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">47.4K</div>
                          <div className="text-xs text-green-600">Weekly Messages</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">92%</div>
                          <div className="text-xs text-green-600">Avg Success Rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{data.stats.completedTasks?.value || '284'}</div>
                          <div className="text-xs text-green-600">Tasks Completed</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-green-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          CSV
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Excel
                        </Button>
                      </div>
                    </div>

                    {/* Monthly Report */}
                    <div className="p-5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold text-purple-900 dark:text-purple-100 text-lg">Monthly Report</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">Complete month analytics and growth metrics</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-purple-600">245K</div>
                          <div className="text-xs text-purple-600">Monthly Messages</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">94%</div>
                          <div className="text-xs text-purple-600">Avg Success Rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{data.stats.monthlyRevenue?.value || '$45.2K'}</div>
                          <div className="text-xs text-purple-600">Revenue</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-purple-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          CSV
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Excel
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      📅 Calendar & Events Management
                    </h3>
                    
                    {/* Calendar Events */}
                    <div className="p-5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold text-orange-900 dark:text-orange-100 text-lg">📅 Calendar Events</h4>
                          <p className="text-sm text-orange-700 dark:text-orange-300">Manage marketing campaigns and deadlines</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Event
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                          <Calendar className="mr-3 h-5 w-5 text-blue-600" />
                          <div className="text-left">
                            <div className="font-semibold">Create Events</div>
                            <div className="text-sm text-muted-foreground">Schedule campaigns</div>
                          </div>
                        </Button>
                        <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                          <Users className="mr-3 h-5 w-5 text-green-600" />
                          <div className="text-left">
                            <div className="font-semibold">Assign Events</div>
                            <div className="text-sm text-muted-foreground">Delegate to team</div>
                          </div>
                        </Button>
                        <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                          <Edit className="mr-3 h-5 w-5 text-yellow-600" />
                          <div className="text-left">
                            <div className="font-semibold">Edit/Delete Events</div>
                            <div className="text-sm text-muted-foreground">Modify schedules</div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Remarks System */}
                    <div className="p-5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-lg">📝 Remarks System</h4>
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">Add notes and track important observations</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Remark
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                          <Plus className="mr-3 h-5 w-5 text-green-600" />
                          <div className="text-left">
                            <div className="font-semibold">Add Remarks</div>
                            <div className="text-sm text-muted-foreground">Create new notes</div>
                          </div>
                        </Button>
                        <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                          <Edit className="mr-3 h-5 w-5 text-blue-600" />
                          <div className="text-left">
                            <div className="font-semibold">Edit Remarks</div>
                            <div className="text-sm text-muted-foreground">Modify existing notes</div>
                          </div>
                        </Button>
                        <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                          <Trash2 className="mr-3 h-5 w-5 text-red-600" />
                          <div className="text-left">
                            <div className="font-semibold">Delete Remarks</div>
                            <div className="text-sm text-muted-foreground">Remove old notes</div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Notifications System */}
                    <div className="p-5 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold text-pink-900 dark:text-pink-100 text-lg">🔔 Notifications</h4>
                          <p className="text-sm text-pink-700 dark:text-pink-300">System alerts and important updates</p>
                        </div>
                        <Badge tone="warning" className="text-sm">4 New</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-800">
                          <span>✅ Target Completed - Maya Chen</span>
                          <span className="text-xs text-green-600">5m ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-800">
                          <span>📱 WhatsApp Warning - Leo Martin</span>
                          <span className="text-xs text-yellow-600">12m ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-800">
                          <span>✅ New Task - Ava Sterling</span>
                          <span className="text-xs text-blue-600">25m ago</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-800">
                          <span>🤖 AI Alert - System</span>
                          <span className="text-xs text-red-600">1h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Tracking Section */}
                <div className="pt-6 border-t">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    📊 Marketing Tracking Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border text-center">
                      <div className="text-2xl font-bold text-blue-600">{data.stats.todayMessages?.value || '6,770'}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">Daily Marketing Count</div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border text-center">
                      <div className="text-2xl font-bold text-green-600">47.4K</div>
                      <div className="text-sm text-green-700 dark:text-green-400 font-medium">Monthly Marketing Count</div>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border text-center">
                      <div className="text-2xl font-bold text-purple-600">5,987</div>
                      <div className="text-sm text-purple-700 dark:text-purple-400 font-medium">Successful Messages</div>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border text-center">
                      <div className="text-2xl font-bold text-red-600">783</div>
                      <div className="text-sm text-red-700 dark:text-red-400 font-medium">Failed Messages</div>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border text-center">
                      <div className="text-2xl font-bold text-yellow-600">156</div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">Pending Follow-ups</div>
                    </div>
                    <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border text-center">
                      <div className="text-2xl font-bold text-indigo-600">89%</div>
                      <div className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Settings */}
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Settings className="h-6 w-6" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-lg">Shortcuts and system settings</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Analytics Actions */}
                <div className="space-y-6 mb-8">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    📈 Analytics Actions
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <BarChart3 className="mr-3 h-5 w-5 text-blue-600" />
                      Team Performance
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <TrendingUp className="mr-3 h-5 w-5 text-green-600" />
                      Growth Charts
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <MessageCircle className="mr-3 h-5 w-5 text-purple-600" />
                      Message Trends
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start text-base py-3">
                      <Users className="mr-3 h-5 w-5 text-orange-600" />
                      User Performance
                    </Button>
                  </div>
                </div>

                {/* Company Settings */}
                <div className="pt-6 border-t">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    ⚙️ Company Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white">Company Profile</span>
                        <Button variant="secondary" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Update company information and branding</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white">Security Settings</span>
                        <Button variant="secondary" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Manage authentication and access controls</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white">System Configuration</span>
                        <Button variant="secondary" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Configure system-wide preferences</p>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="pt-6 border-t">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">📤 Export Options</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="lg" className="text-base py-3">
                      <Download className="mr-2 h-4 w-4 text-red-600" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="lg" className="text-base py-3">
                      <FileBarChart className="mr-2 h-4 w-4 text-green-600" />
                      Export CSV
                    </Button>
                    <Button variant="outline" size="lg" className="text-base py-3 col-span-2">
                      <BarChart3 className="mr-2 h-4 w-4 text-blue-600" />
                      Export Excel Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}