"use client";

import {
  Activity,
  AlertCircle,
  Award,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MessageCircle,
  RefreshCw,
  Target,
  TrendingUp,
  User,
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
  YAxis,
  RadialBarChart,
  RadialBar
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/shared/dashboard/stat-card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

// User-specific stat configuration
const userStatConfig = [
  { key: "todayTarget", label: "Today's Target", icon: Target, tone: "success" as const },
  { key: "todayMessages", label: "Messages Sent", icon: MessageCircle, tone: "success" as const },
  { key: "monthlyMessages", label: "Monthly Total", icon: Activity, tone: "info" as const },
  { key: "assignedTasks", label: "Active Tasks", icon: CheckCircle2, tone: "info" as const },
  { key: "completedTasks", label: "Completed", icon: CheckCircle2, tone: "success" as const },
  { key: "aiScore", label: "AI Score", icon: Bot, tone: "info" as const },
  { key: "conversionRate", label: "Conversion Rate", icon: TrendingUp, tone: "success" as const },
  { key: "performance", label: "Performance", icon: Award, tone: "success" as const }
];

export function UserDashboard() {
  const { data, loading, error, refetch } = useDashboardData("USER");

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Failed to load your dashboard
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

  const stats = userStatConfig.map(config => ({
    ...config,
    ...data.stats[config.key]
  }));

  // Calculate progress circle data for AI Score
  const aiScoreValue = parseInt(data.stats.aiScore?.value?.replace('%', '') || '85');
  const progressData = [
    { name: 'Progress', value: aiScoreValue, fill: '#10b981' },
    { name: 'Remaining', value: 100 - aiScoreValue, fill: '#e5e7eb' }
  ];

  return (
    <div className="space-y-8">
      {/* Personal Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src="/avatars/user.png" />
              <AvatarFallback className="bg-white text-indigo-600 text-2xl font-bold">
                NP
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold mb-3">My Performance Hub</h1>
              <p className="text-xl text-indigo-100 max-w-2xl">
                Track your progress, optimize performance, and achieve your marketing goals
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={refetch} className="text-base px-6 py-3">
              <RefreshCw className="mr-2 h-5 w-5" />
              Refresh
            </Button>
            <Button variant="secondary" size="lg" className="text-base px-6 py-3">
              <Eye className="mr-2 h-5 w-5" />
              My Reports
            </Button>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 text-base px-6 py-3">
              <Activity className="mr-2 h-5 w-5" />
              Update Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Stats Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <User className="h-6 w-6" />
          Today's Performance
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="transform transition-all hover:scale-105">
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>

      {/* Personal Analytics & AI Score */}
      <div className="grid gap-8 xl:grid-cols-3">
        {/* Personal Performance Chart */}
        <Card className="xl:col-span-2 shadow-lg border-0">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <TrendingUp className="h-6 w-6" />
                  My Performance Trends
                </CardTitle>
                <CardDescription className="text-lg mt-3">
                  Your daily message activity, replies, and performance score over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="userMessagesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="userRepliesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
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
                  <Area type="monotone" dataKey="messages" stroke="#8b5cf6" fill="url(#userMessagesGradient)" strokeWidth={3} />
                  <Area type="monotone" dataKey="replies" stroke="#06b6d4" fill="url(#userRepliesGradient)" strokeWidth={3} />
                  <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Performance Score */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Bot className="h-6 w-6" />
              AI Performance
            </CardTitle>
            <CardDescription className="text-lg">Your AI-powered marketing score</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="relative w-36 h-36 mx-auto mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{aiScoreValue}%</div>
                    <div className="text-base text-slate-500 font-medium">AI Score</div>
                  </div>
                </div>
              </div>
              <Badge tone="success" className="mb-4 text-base px-4 py-2">Excellent Performance</Badge>
            </div>

            {/* AI Insights */}
            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-base font-semibold text-green-800 dark:text-green-300">Best Time</span>
                </div>
                <p className="text-base text-green-700 dark:text-green-400">10:00-11:30 AM shows highest reply rates</p>
              </div>

              <div className="p-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-base font-semibold text-blue-800 dark:text-blue-300">Goal Progress</span>
                </div>
                <p className="text-base text-blue-700 dark:text-blue-400">You're 8% above monthly target</p>
              </div>

              <div className="p-5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span className="text-base font-semibold text-purple-800 dark:text-purple-300">Tip</span>
                </div>
                <p className="text-base text-purple-700 dark:text-purple-400">Shorter CTAs increase reply rates by 12%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Breakdown & Monthly Progress */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Activity Breakdown */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <MessageCircle className="h-6 w-6" />
              Today's Activity Breakdown
            </CardTitle>
            <CardDescription className="text-lg">Distribution of your messaging activities</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
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
            <div className="grid grid-cols-2 gap-4">
              {data.performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-4 w-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-base font-semibold">{item.name}</span>
                  </div>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="h-6 w-6" />
              Monthly Progress
            </CardTitle>
            <CardDescription className="text-lg">Your performance trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                  <YAxis stroke="currentColor" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="productivity" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Productivity" />
                  <Bar dataKey="growth" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Growth" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Personal Activity */}
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Clock className="h-6 w-6" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-lg">Your latest actions and achievements</CardDescription>
            </div>
            <Button variant="secondary" size="lg" className="text-base px-4 py-2">View All</Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {data.activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-base">
                      {activity.user === 'You' ? 'ME' : activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-slate-900 dark:text-white truncate">
                      {activity.user === 'You' ? 'You' : activity.user}
                    </p>
                    <p className="text-base text-slate-600 dark:text-slate-400 truncate">{activity.action}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      tone={activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'info'}
                      className="text-sm font-medium px-3 py-1"
                    >
                      {activity.type === 'success' ? '✓' : activity.type === 'warning' ? '⚠' : 'ℹ'}
                    </Badge>
                    <span className="text-sm text-slate-500 whitespace-nowrap font-medium">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
            <CardDescription className="text-lg">Frequently used tools</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Button variant="outline" className="w-full justify-start h-auto p-5 flex flex-col items-start gap-3">
              <div className="flex items-center gap-3 w-full">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold text-base">Send Messages</span>
              </div>
              <span className="text-base text-muted-foreground text-left">Start new outreach campaign</span>
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto p-5 flex flex-col items-start gap-3">
              <div className="flex items-center gap-3 w-full">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold text-base">Update Tasks</span>
              </div>
              <span className="text-base text-muted-foreground text-left">Mark tasks as completed</span>
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto p-5 flex flex-col items-start gap-3">
              <div className="flex items-center gap-3 w-full">
                <Activity className="h-5 w-5" />
                <span className="font-semibold text-base">Log Activity</span>
              </div>
              <span className="text-base text-muted-foreground text-left">Record daily performance</span>
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto p-5 flex flex-col items-start gap-3">
              <div className="flex items-center gap-3 w-full">
                <Calendar className="h-5 w-5" />
                <span className="font-semibold text-base">Schedule Follow-ups</span>
              </div>
              <span className="text-base text-muted-foreground text-left">Plan prospect meetings</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Achievement Summary */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-800">
                <Award className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Outstanding Performance!
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  You're exceeding your targets and performing in the top 10% of users.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {data.stats.aiScore?.value || '85%'}
                </div>
                <div className="text-base text-slate-600 dark:text-slate-400 font-medium">AI Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {data.stats.todayMessages?.value || '0'}
                </div>
                <div className="text-base text-slate-600 dark:text-slate-400 font-medium">Messages Today</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {data.stats.conversionRate?.value || '0%'}
                </div>
                <div className="text-base text-slate-600 dark:text-slate-400 font-medium">Conversion Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}