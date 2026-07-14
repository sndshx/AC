"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Lightbulb, 
  Activity,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const performanceData = [
  { day: "Mon", score: 82, messages: 145, replies: 42 },
  { day: "Tue", score: 86, messages: 168, replies: 51 },
  { day: "Wed", score: 91, messages: 189, replies: 67 },
  { day: "Thu", score: 88, messages: 176, replies: 58 },
  { day: "Fri", score: 93, messages: 201, replies: 73 },
  { day: "Sat", score: 79, messages: 98, replies: 28 },
  { day: "Sun", score: 76, messages: 85, replies: 24 }
];

const weeklyTrend = [
  { week: "Week 1", score: 78, productivity: 72 },
  { week: "Week 2", score: 82, productivity: 78 },
  { week: "Week 3", score: 87, productivity: 84 },
  { week: "Week 4", score: 91, productivity: 89 }
];

const monthlyTrend = [
  { month: "Jan", score: 75, growth: 12 },
  { month: "Feb", score: 79, growth: 18 },
  { month: "Mar", score: 84, growth: 24 },
  { month: "Apr", score: 88, growth: 28 },
  { month: "May", score: 91, growth: 32 },
  { month: "Jun", score: 93, growth: 36 }
];

const bestSendTimes = [
  { time: "9:00 AM - 10:00 AM", successRate: 68, confidence: 94 },
  { time: "10:00 AM - 11:00 AM", successRate: 72, confidence: 96 },
  { time: "2:00 PM - 3:00 PM", successRate: 64, confidence: 89 },
  { time: "7:00 PM - 8:00 PM", successRate: 58, confidence: 82 }
];

const recommendations = [
  {
    id: 1,
    title: "Optimize Morning Messaging",
    description: "Your reply rate increases by 24% when sending messages between 10:00-11:00 AM",
    priority: "High",
    impact: "High",
    action: "Shift 30% of daily volume to this window"
  },
  {
    id: 2,
    title: "Improve Follow-up Timing",
    description: "Follow-ups sent within 2 hours show 31% better engagement",
    priority: "Medium",
    impact: "Medium",
    action: "Set automated 2-hour follow-up reminders"
  },
  {
    id: 3,
    title: "Shorter Message Copy",
    description: "Messages under 40 words have 19% higher reply rates",
    priority: "Medium",
    impact: "High",
    action: "Review and condense current templates"
  },
  {
    id: 4,
    title: "Weekend Rest Period",
    description: "Your productivity drops 18% on weekends with lower reply quality",
    priority: "Low",
    impact: "Low",
    action: "Consider focusing weekday volume"
  }
];

const improvementSuggestions = [
  {
    area: "Response Time",
    current: "2.4 hours",
    target: "1.5 hours",
    improvement: "38% faster",
    status: "in-progress"
  },
  {
    area: "Message Quality",
    current: "7.8/10",
    target: "8.5/10",
    improvement: "9% better",
    status: "planned"
  },
  {
    area: "Follow-up Rate",
    current: "64%",
    target: "80%",
    improvement: "16% increase",
    status: "completed"
  },
  {
    area: "Daily Consistency",
    current: "78%",
    target: "90%",
    improvement: "12% more consistent",
    status: "in-progress"
  }
];

export function UserAIInsights() {
  const [activeTab, setActiveTab] = useState("performance");
  const currentScore = 91;

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="h-8 w-8 text-[#00C853]" />
            AI Insights
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Personalized performance analysis and recommendations
          </p>
        </div>
        <Button className="bg-[#00C853] hover:bg-[#00C853]/90">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate New Insights
        </Button>
      </div>

      {/* AI Performance Score Card */}
      <Card className="border-[#00C853]/20 bg-gradient-to-br from-[#E8F7EE] to-white dark:from-[#143D2C]/20 dark:to-slate-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#00C853]" />
                AI Performance Score
              </CardTitle>
              <CardDescription>Your current AI-driven productivity rating</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-[#00C853]">{currentScore}</div>
              <Badge variant="outline" className="mt-2 border-[#00C853] text-[#00C853]">
                +6 from last week
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={currentScore} className="h-3" />
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">93%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Reply Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">1.8h</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">187</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Daily Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">4.2k</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Monthly Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="timing">Best Times</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="improvement">Improvement</TabsTrigger>
        </TabsList>

        {/* Performance Trends Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#00C853]" />
                  Daily Summary
                </CardTitle>
                <CardDescription>Your performance over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#00C853" fillOpacity={1} fill="url(#scoreGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#00C853]" />
                  Weekly Summary
                </CardTitle>
                <CardDescription>4-week performance progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#00C853" strokeWidth={3} dot={{ fill: "#00C853" }} />
                    <Line type="monotone" dataKey="productivity" stroke="#143D2C" strokeWidth={2} dot={{ fill: "#143D2C" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#00C853]" />
                  Monthly Summary
                </CardTitle>
                <CardDescription>6-month growth trajectory</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="score" fill="#00C853" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Productivity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#00C853]" />
                  Productivity Analysis
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Message Volume</span>
                    <span className="font-bold">187/day</span>
                  </div>
                  <Progress value={93} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reply Quality</span>
                    <span className="font-bold">8.4/10</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Consistency</span>
                    <span className="font-bold">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Follow-up Rate</span>
                    <span className="font-bold">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Best Times Tab */}
        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#00C853]" />
                Best Time to Send Messages
              </CardTitle>
              <CardDescription>AI-identified optimal sending windows based on your history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bestSendTimes.map((time, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:border-[#00C853] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#E8F7EE] dark:bg-[#143D2C]/40 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-[#00C853]" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{time.time}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {time.successRate}% success rate
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-[#00C853] text-[#00C853]">
                        {time.confidence}% confidence
                      </Badge>
                    </div>
                    <Progress value={time.successRate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#00C853]" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Personalized suggestions to improve your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{rec.title}</h3>
                          <Badge variant={rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{rec.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Impact: </span>
                        <span className="font-semibold text-slate-900 dark:text-white">{rec.impact}</span>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#00C853] text-[#00C853]">
                        {rec.action}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improvement Tab */}
        <TabsContent value="improvement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#00C853]" />
                Improvement Suggestions
              </CardTitle>
              <CardDescription>Track your progress toward optimization goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {improvementSuggestions.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.area}</div>
                      <Badge 
                        variant={item.status === "completed" ? "default" : item.status === "in-progress" ? "secondary" : "outline"}
                        className={item.status === "completed" ? "bg-[#00C853] text-white" : ""}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                      <div>
                        <div className="text-slate-600 dark:text-slate-400">Current</div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.current}</div>
                      </div>
                      <div>
                        <div className="text-slate-600 dark:text-slate-400">Target</div>
                        <div className="font-bold text-[#00C853]">{item.target}</div>
                      </div>
                      <div>
                        <div className="text-slate-600 dark:text-slate-400">Improvement</div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.improvement}</div>
                      </div>
                    </div>
                    <Progress 
                      value={item.status === "completed" ? 100 : item.status === "in-progress" ? 60 : 30} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
