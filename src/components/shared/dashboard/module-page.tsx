"use client";

import { useState } from "react";
import { 
  Download, Filter, Plus, Search, RefreshCw, Calendar, Activity, 
  CheckCircle2, Mail, MessageSquare, Phone, Share2, Sparkles, Clock, 
  Target, Bot, User, Lock, Users, CreditCard, Link, Shield, Bell, Settings 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/providers/toast-provider";
import { 
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar 
} from "recharts";
import { chartData } from "@/lib/shared/demo-data";

type ModulePageProps = {
  moduleKey: string;
  role: "ADMIN" | "USER";
  detailId?: string;
};

export function ModulePage({ moduleKey, role, detailId }: ModulePageProps) {
  const [activeTab, setActiveTab] = useState("default");
  const { showToast } = useToast();

  const handleExport = (format: string) => {
    showToast({
      title: "Export Started",
      description: `Your report is being generated in ${format} format...`,
    });
  };

  // Render Marketing Tab Layout
  if (moduleKey === "marketing") {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Marketing Center</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-xs">
              Create, launch, and monitor campaigns across multiple outbound channels.
            </p>
          </div>

          <Tabs defaultValue="email" className="space-y-6">
            <TabsList className="flex flex-wrap p-1 gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-2xl">
              <TabsTrigger value="email" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <Mail className="h-3.5 w-3.5" /> Email Campaign
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Campaign
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <Phone className="h-3.5 w-3.5" /> SMS Campaign
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <Share2 className="h-3.5 w-3.5" /> Social Media
              </TabsTrigger>
            </TabsList>

            {["email", "whatsapp", "sms", "social"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-6 animate-fade-up">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-bold text-slate-800 capitalize">{tab} Status</CardTitle>
                      <CardDescription className="text-[10px] text-slate-400">Live telemetry metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Deliverability</span>
                        <span className="text-sm font-bold text-[#00C853]">99.2%</span>
                      </div>
                      <Progress value={99.2} className="h-2 bg-emerald-50 dark:bg-emerald-950" />
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-bold text-slate-800">Engagements</CardTitle>
                      <CardDescription className="text-[10px] text-slate-400">Average clicks & replies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Response Rate</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">24.5%</span>
                      </div>
                      <Progress value={24.5} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-bold text-slate-800">Safety Threshold</CardTitle>
                      <CardDescription className="text-[10px] text-slate-400">ISP Warning check status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Spam Score</span>
                        <Badge tone="success">Optimal</Badge>
                      </div>
                      <Progress value={8} className="h-2 bg-rose-50 dark:bg-rose-950" />
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-800 capitalize">Active {tab} Pipelines</CardTitle>
                      <CardDescription className="text-[10px] text-slate-400">Outbound campaign sequence triggers</CardDescription>
                    </div>
                    <Button className="bg-[#143D2C] hover:bg-[#143D2C]/90 text-white font-bold text-xs h-8 px-3">
                      <Plus className="h-3.5 w-3.5 mr-1.5" /> New Template
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Pipeline Name</th>
                            <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Total Target</th>
                            <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Completed</th>
                            <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                          <tr>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Summer Launch Sequence</td>
                            <td className="px-4 py-3 text-slate-500">1,250 users</td>
                            <td className="px-4 py-3 text-slate-500">820 sent</td>
                            <td className="px-4 py-3"><Badge tone="success">Running</Badge></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">AI Newsletter Digest</td>
                            <td className="px-4 py-3 text-slate-500">3,400 users</td>
                            <td className="px-4 py-3 text-slate-500">3,400 sent</td>
                            <td className="px-4 py-3"><Badge tone="default">Completed</Badge></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }

  // Render Reports Page Layout
  if (moduleKey === "reports") {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Reports & Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-xs">
                Inspect performance statistics and export data sheets.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleExport("PDF")} variant="secondary" className="shadow-sm text-xs h-8 px-3">
                <Download className="h-3.5 w-3.5 mr-1.5" /> PDF Report
              </Button>
              <Button onClick={() => handleExport("Excel")} className="bg-[#143D2C] hover:bg-[#143D2C]/90 text-white font-bold shadow-sm text-xs h-8 px-3">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Excel Sheet
              </Button>
            </div>
          </div>

          <Tabs defaultValue="daily" className="space-y-6">
            <TabsList className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-md">
              <TabsTrigger value="daily" className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg">Monthly</TabsTrigger>
            </TabsList>

            {["daily", "weekly", "monthly"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-6 animate-fade-up">
                <div className="grid gap-6 lg:grid-cols-3">
                  <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-850">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-bold text-slate-800 capitalize">{tab} Outreach Velocity</CardTitle>
                      <CardDescription className="text-[10px] text-slate-400">Volume activity tracking over current period</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                            <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis fontSize={9} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="messages" stroke="#143D2C" fill="rgba(20, 61, 44, 0.15)" strokeWidth={3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-bold text-slate-800">Conversion Overview</CardTitle>
                      <CardDescription className="text-[10px] text-slate-400">Reply vs Click statistics</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                            <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis fontSize={9} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Bar dataKey="replies" fill="#00C853" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }

  // Render AI Insights Layout
  if (moduleKey === "ai-insights") {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI Insights</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-xs">
                  Automated machine learning recommendations and predictive analysis tags.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm border-slate-200 dark:border-slate-850">
              <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-4 px-4">
                <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800">AI Recommendations</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Generative workflow corrections</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium">
                  🚀 Your CTAs have a 14% higher reply rate when they are kept below 150 characters. Consider shortening current active templates.
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium">
                  ⚠️ Inbound filter alerts suggest that 2 WhatsApp channels are currently approaching warning limits. Consider resting them.
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 dark:border-slate-850">
              <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-4 px-4">
                <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800">Best Posting Time</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Maximum client delivery engagement windows</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Outbound WhatsApp</span>
                  <Badge tone="success">10:00 AM - 11:30 AM</Badge>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Outbound SMS</span>
                  <Badge tone="success">2:00 PM - 3:30 PM</Badge>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Social Media Campaigns</span>
                  <Badge tone="success">5:00 PM - 6:30 PM</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 dark:border-slate-850">
              <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-4 px-4">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800">Lead Score</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Predictive lead scores and conversion indicators</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Average conversion score</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2 bg-blue-50 dark:bg-blue-950" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>High intent conversions</span>
                    <span>42 leads this week</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 dark:border-slate-850">
              <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-4 px-4">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800">Campaign Suggestions</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Generated outreach campaign plans</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4">
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl space-y-1.5 text-xs font-semibold">
                  <p className="text-indigo-950 dark:text-indigo-300">💡 Suggested: Summer Outreach Segment</p>
                  <p className="text-slate-500 font-medium text-[11px]">Trigger an SMS sequence to cold leads on Thursdays for 18% higher reply rate.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Render Settings Layout
  if (moduleKey === "settings") {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-xs">
              Configure system features, workspace profile, account safety threshold, and team permissions.
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="flex flex-wrap p-1 gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-4xl">
              <TabsTrigger value="profile" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <User className="h-3.5 w-3.5" /> Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <Settings className="h-3.5 w-3.5" /> Account
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <Users className="h-3.5 w-3.5" /> Team
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <Lock className="h-3.5 w-3.5" /> Security
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <Link className="h-3.5 w-3.5" /> Integrations
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs font-semibold">
                <CreditCard className="h-3.5 w-3.5" /> Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 animate-fade-up">
              <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-bold text-slate-800">My Profile Info</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Setup your workspace identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-xl px-4 pb-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                    <Input defaultValue={role === "ADMIN" ? "Admin Owner" : "Marketer User"} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                    <Input disabled defaultValue={role === "ADMIN" ? "admin@articlecraft.com" : "user@articlecraft.com"} className="h-8 text-xs" />
                  </div>
                  <Button className="bg-[#143D2C] hover:bg-[#143D2C]/90 text-white font-bold shadow-sm text-xs h-8 px-3">
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6 animate-fade-up">
              <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-bold text-slate-800">Account Workspace Options</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Workspace preferences configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-xl px-4 pb-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Workspace Domain</label>
                    <Input defaultValue="articlecraft" className="h-8 text-xs" />
                  </div>
                  <Button className="bg-[#143D2C] hover:bg-[#143D2C]/90 text-white font-bold shadow-sm text-xs h-8 px-3">
                    Save Workspace settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6 animate-fade-up">
              <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-bold text-slate-800">Team Management</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Permissions and active team members list</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Name</th>
                          <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Role</th>
                          <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        <tr>
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Sarah Johnson</td>
                          <td className="px-4 py-3 text-slate-500">Manager</td>
                          <td className="px-4 py-3"><Badge tone="success">Online</Badge></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Mike Chen</td>
                          <td className="px-4 py-3 text-slate-500">Marketer</td>
                          <td className="px-4 py-3"><Badge tone="success">Online</Badge></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 animate-fade-up">
              <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-bold text-slate-800">Security Configuration</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Update passwords and sessions safety defaults</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-w-xl px-4 pb-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Change Password</label>
                    <Input type="password" placeholder="New Password" className="h-8 text-xs" />
                  </div>
                  <Button className="bg-[#143D2C] hover:bg-[#143D2C]/90 text-white font-bold shadow-sm text-xs h-8 px-3">
                    Update Security
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6 animate-fade-up">
              <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-bold text-slate-800">Integrations Panel</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Setup external CRM and Messaging APIs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-4 pb-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">WhatsApp API Cloud</p>
                        <p className="text-[10px] text-slate-500">Official Facebook Graph Integration</p>
                      </div>
                    </div>
                    <Badge tone="success">Connected</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6 animate-fade-up">
              <Card className="shadow-sm border-slate-200 dark:border-slate-850">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-bold text-slate-800">Billing details</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400">Manage workspace subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-4 pb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">Current Plan: Growth Command Tier</p>
                    <p className="text-[10px] text-slate-500 mt-1">Renewal date: July 28, 2026</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Fallback to standard generic layout if not overridden
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex items-center gap-4">
          <Settings className="h-6 w-6 text-[#00C853]" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">{moduleKey} Page</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-xs">
              Review stats and manage {moduleKey} configurations.
            </p>
          </div>
        </div>

        <Card className="shadow-sm border-slate-200 dark:border-slate-850">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-bold text-slate-800 capitalize">{moduleKey} logs</CardTitle>
            <CardDescription className="text-[10px] text-slate-400">Live telemetry metrics</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-slate-500 text-xs">Logging metrics are successfully synchronized with the Neon database layer.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
