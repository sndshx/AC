"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Send, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  TrendingUp,
  Activity,
  BarChart3
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const dailyProgressData = [
  { hour: "9AM", sent: 12, replies: 4 },
  { hour: "10AM", sent: 24, replies: 9 },
  { hour: "11AM", sent: 31, replies: 11 },
  { hour: "12PM", sent: 18, replies: 5 },
  { hour: "1PM", sent: 14, replies: 4 },
  { hour: "2PM", sent: 28, replies: 10 },
  { hour: "3PM", sent: 22, replies: 8 },
  { hour: "4PM", sent: 19, replies: 6 },
  { hour: "5PM", sent: 15, replies: 5 }
];

const monthlyProgressData = [
  { day: "1", messages: 142, success: 38 },
  { day: "5", messages: 167, success: 45 },
  { day: "10", messages: 189, success: 52 },
  { day: "15", messages: 176, success: 48 },
  { day: "20", messages: 198, success: 58 },
  { day: "25", messages: 204, success: 63 },
  { day: "30", messages: 187, success: 56 }
];

const activityTimeline = [
  { time: "2 hours ago", action: "Sent 24 messages", status: "completed", replies: 8 },
  { time: "4 hours ago", action: "Follow-up batch completed", status: "completed", replies: 12 },
  { time: "6 hours ago", action: "Sent 18 messages", status: "completed", replies: 5 },
  { time: "Yesterday", action: "Daily goal achieved", status: "completed", replies: 47 },
  { time: "2 days ago", action: "Sent 31 messages", status: "completed", replies: 11 }
];

export function UserMarketing() {
  const [todayCount, setTodayCount] = useState(187);
  const [dailyGoal] = useState(200);
  const [monthlyTotal] = useState(4284);
  const [monthlyGoal] = useState(5000);
  const [successfulReplies] = useState(62);
  const [failedReplies] = useState(8);
  const [followupsCompleted] = useState(34);

  const successRate = ((successfulReplies / todayCount) * 100).toFixed(1);
  const dailyProgress = ((todayCount / dailyGoal) * 100).toFixed(0);
  const monthlyProgress = ((monthlyTotal / monthlyGoal) * 100).toFixed(0);

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="h-8 w-8 text-[#00C853]" />
            Marketing Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track your daily messaging activity and performance
          </p>
        </div>
        <Button className="bg-[#00C853] hover:bg-[#00C853]/90">
          <Send className="h-4 w-4 mr-2" />
          Update Today's Count
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#00C853]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Messages Sent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{todayCount}</div>
              <Badge variant="outline" className="border-[#00C853] text-[#00C853]">
                {dailyProgress}%
              </Badge>
            </div>
            <Progress value={Number(dailyProgress)} className="mt-3 h-2" />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Goal: {dailyGoal} messages
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Monthly Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{monthlyTotal}</div>
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                {monthlyProgress}%
              </Badge>
            </div>
            <Progress value={Number(monthlyProgress)} className="mt-3 h-2" />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Goal: {monthlyGoal} messages
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Successful Replies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{successfulReplies}</div>
              <Badge variant="outline" className="border-green-500 text-green-500">
                {successRate}%
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Strong engagement rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Failed Replies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{failedReplies}</div>
              <Badge variant="outline" className="border-red-500 text-red-500">
                {((failedReplies / todayCount) * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Low failure rate
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Today's Count Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-[#00C853]" />
            Update Today's Marketing Count
          </CardTitle>
          <CardDescription>Record your messaging activity for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="messages-sent">Messages Sent</Label>
              <Input 
                id="messages-sent" 
                type="number" 
                placeholder="Enter count"
                value={todayCount}
                onChange={(e) => setTodayCount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="successful-replies">Successful Replies</Label>
              <Input 
                id="successful-replies" 
                type="number" 
                placeholder="Enter count"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="failed-replies">Failed/No Response</Label>
              <Input 
                id="failed-replies" 
                type="number" 
                placeholder="Enter count"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div>
              <Label htmlFor="followups">Follow-ups Completed</Label>
              <Input 
                id="followups" 
                type="number" 
                placeholder="Enter count"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-[#00C853] hover:bg-[#00C853]/90">
                Save Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for History and Progress */}
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="daily">Daily Progress</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
        </TabsList>

        {/* Daily Progress */}
        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#00C853]" />
                Today's Activity Timeline
              </CardTitle>
              <CardDescription>Hourly breakdown of messages and replies</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#00C853" radius={[8, 8, 0, 0]} name="Messages Sent" />
                  <Bar dataKey="replies" fill="#143D2C" radius={[8, 8, 0, 0]} name="Replies Received" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Peak Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#00C853]">11:00 AM</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">31 messages sent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Best Reply Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#00C853]">37.5%</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">At 10:00 AM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Follow-ups Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#00C853]">{followupsCompleted}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">85% completion rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monthly Progress */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#00C853]" />
                Monthly Performance Overview
              </CardTitle>
              <CardDescription>30-day messaging trend and success rate</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyProgressData}>
                  <defs>
                    <linearGradient id="messagesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="messages" stroke="#00C853" fillOpacity={1} fill="url(#messagesGradient)" />
                  <Line type="monotone" dataKey="success" stroke="#143D2C" strokeWidth={2} dot={{ fill: "#143D2C" }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{monthlyTotal}</div>
                <div className="flex items-center gap-1 mt-1 text-[#00C853]">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+18%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg Daily</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">187</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">messages/day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#00C853]">29.8%</div>
                <div className="flex items-center gap-1 mt-1 text-[#00C853]">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+4.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">28/30</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">93% consistency</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Timeline */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#00C853]" />
                Recent Activity Timeline
              </CardTitle>
              <CardDescription>Your recent messaging activity and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityTimeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 border-l-2 border-[#00C853] pl-4 pb-4 last:pb-0">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-[#E8F7EE] dark:bg-[#143D2C]/40 flex items-center justify-center">
                        {item.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-[#00C853]" />
                        ) : (
                          <Clock className="h-4 w-4 text-[#00C853]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{item.action}</p>
                        <Badge variant="outline" className="border-[#00C853] text-[#00C853]">
                          {item.replies} replies
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Marketing History Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#00C853]" />
            Marketing History Summary
          </CardTitle>
          <CardDescription>Performance overview for the current period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="border rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">This Week</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">1,247</div>
              <Progress value={87} className="mt-2 h-2" />
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Last Week</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">1,189</div>
              <Progress value={83} className="mt-2 h-2" />
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">This Month</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{monthlyTotal}</div>
              <Progress value={Number(monthlyProgress)} className="mt-2 h-2" />
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Last Month</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">3,967</div>
              <Progress value={79} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
