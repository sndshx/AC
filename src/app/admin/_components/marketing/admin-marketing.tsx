"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Users, 
  TrendingUp, 
  Activity,
  Search,
  Download,
  Calendar,
  BarChart3,
  Loader2
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TeamActivity = {
  userId: string;
  userName: string;
  teamName: string | null;
  dailyMessages: number;
  monthlyMessages: number;
  successfulReplies: number;
  failedReplies: number;
  followUps: number;
  successRate: number;
  productivity: number;
};

export function AdminMarketing() {
  const [isLoading, setIsLoading] = useState(true);
  const [teamActivities, setTeamActivities] = useState<TeamActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today");

  useEffect(() => {
    fetchTeamActivities();
  }, [selectedPeriod]);

  const fetchTeamActivities = async () => {
    setIsLoading(true);
    // TODO: Implement API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const filteredActivities = teamActivities.filter(activity =>
    activity.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const teamTotals = {
    dailyMessages: teamActivities.reduce((sum, a) => sum + a.dailyMessages, 0),
    monthlyMessages: teamActivities.reduce((sum, a) => sum + a.monthlyMessages, 0),
    successfulReplies: teamActivities.reduce((sum, a) => sum + a.successfulReplies, 0),
    failedReplies: teamActivities.reduce((sum, a) => sum + a.failedReplies, 0),
    followUps: teamActivities.reduce((sum, a) => sum + a.followUps, 0),
    avgSuccessRate: teamActivities.length > 0 
      ? teamActivities.reduce((sum, a) => sum + a.successRate, 0) / teamActivities.length 
      : 0,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="h-8 w-8 text-[#00C853]" />
            Team Marketing Activity
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Monitor and manage team marketing performance
          </p>
        </div>
        <Button className="bg-[#00C853] hover:bg-[#00C853]/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Team Totals */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Daily Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00C853]">{teamTotals.dailyMessages.toLocaleString()}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Team total today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Monthly Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{teamTotals.monthlyMessages.toLocaleString()}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Successful Replies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{teamTotals.successfulReplies.toLocaleString()}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {teamTotals.avgSuccessRate.toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Failed Replies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{teamTotals.failedReplies.toLocaleString()}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{teamTotals.followUps.toLocaleString()}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector & Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setSelectedPeriod("today")}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              selectedPeriod === "today" ? "bg-white dark:bg-slate-700 shadow-sm" : ""
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              selectedPeriod === "week" ? "bg-white dark:bg-slate-700 shadow-sm" : ""
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              selectedPeriod === "month" ? "bg-white dark:bg-slate-700 shadow-sm" : ""
            }`}
          >
            This Month
          </button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="history">Marketing History</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
        </TabsList>

        {/* Team Performance */}
        <TabsContent value="team" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
              </CardContent>
            </Card>
          ) : filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No team members found</p>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <Card key={activity.userId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-[#00C853] flex items-center justify-center text-white font-bold">
                          {activity.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{activity.userName}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {activity.teamName || "No Team"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00C853]">{activity.dailyMessages}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Daily</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{activity.monthlyMessages}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Monthly</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{activity.successfulReplies}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Success</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{activity.failedReplies}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Failed</div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <Badge className="bg-[#00C853] text-white mb-2">
                        {activity.successRate.toFixed(1)}% Success Rate
                      </Badge>
                      <Badge variant="outline">
                        {activity.productivity.toFixed(0)}% Productive
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Marketing History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing History</CardTitle>
              <CardDescription>Historical performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-600 dark:text-slate-400 py-8">
                Historical data will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Team marketing trends and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-600 dark:text-slate-400 py-8">
                Trend charts will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
