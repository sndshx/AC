"use client";

import { useState, useMemo } from "react";
import { 
  Bot, Sparkles, Target, TrendingUp, TrendingDown, Brain, Zap, 
  Clock, MessageSquare, Users, Activity, AlertTriangle, CheckCircle2,
  RefreshCw, Download, Settings, Eye, BarChart3, PieChart,
  ArrowRight, ArrowUp, ArrowDown, Lightbulb, Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/shared/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter
} from "recharts";

// ── Types & Interfaces ──────────────────────────────────────────────
interface AIInsight {
  id: string;
  type: "recommendation" | "prediction" | "alert" | "optimization";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number;
  category: string;
  actionable: boolean;
  estimatedImprovement?: number;
}

interface PredictiveMetric {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
  trend: "up" | "down" | "stable";
}
// ── Sample Data ────────────────────────────────────────────────────
const aiInsights: AIInsight[] = [
  {
    id: "1",
    type: "recommendation",
    title: "Optimize WhatsApp Send Times",
    description: "Shift WhatsApp campaigns to 10:30 AM - 12:00 PM window for 23% higher engagement",
    impact: "high",
    confidence: 87,
    category: "Timing",
    actionable: true,
    estimatedImprovement: 23
  },
  {
    id: "2", 
    type: "prediction",
    title: "Email Deliverability Risk",
    description: "Current sender reputation may cause 15% delivery decline in next 7 days",
    impact: "high",
    confidence: 92,
    category: "Deliverability",
    actionable: true,
    estimatedImprovement: -15
  },
  {
    id: "3",
    type: "optimization",
    title: "SMS Character Length",
    description: "Reducing SMS to 145 characters could improve reply rates by 18%",
    impact: "medium",
    confidence: 75,
    category: "Content",
    actionable: true,
    estimatedImprovement: 18
  },
  {
    id: "4",
    type: "alert",
    title: "Campaign Budget Anomaly",
    description: "Summer Sale campaign spending 34% above optimal allocation",
    impact: "medium",
    confidence: 81,
    category: "Budget",
    actionable: true,
    estimatedImprovement: -34
  }
];

const predictiveMetrics: PredictiveMetric[] = [
  {
    metric: "Reply Rate",
    current: 24.5,
    predicted: 28.7,
    confidence: 89,
    timeframe: "Next 30 days",
    trend: "up"
  },
  {
    metric: "Conversion Rate", 
    current: 18.2,
    predicted: 21.8,
    confidence: 84,
    timeframe: "Next 30 days",
    trend: "up"
  },
  {
    metric: "Campaign ROI",
    current: 187,
    predicted: 201,
    confidence: 76,
    timeframe: "Next 30 days", 
    trend: "up"
  }
];
// Chart Data
const performancePrediction = [
  { week: "Week 1", actual: 24.5, predicted: 25.2, upper: 27.1, lower: 23.3 },
  { week: "Week 2", actual: 25.1, predicted: 26.0, upper: 28.2, lower: 23.8 },
  { week: "Week 3", actual: null, predicted: 27.3, upper: 29.8, lower: 24.8 },
  { week: "Week 4", actual: null, predicted: 28.7, upper: 31.2, lower: 26.2 }
];

const sentimentAnalysis = [
  { category: "Positive", value: 68, color: "#10b981" },
  { category: "Neutral", value: 23, color: "#6b7280" },
  { category: "Negative", value: 9, color: "#ef4444" }
];

const channelOptimization = [
  { channel: "WhatsApp", current: 78.5, optimized: 85.2, improvement: 6.7 },
  { channel: "Email", current: 65.3, optimized: 72.8, improvement: 7.5 },
  { channel: "SMS", current: 82.1, optimized: 88.9, improvement: 6.8 }
];

const leadScoringData = [
  { score: 90, count: 45, conversion: 85 },
  { score: 80, count: 120, conversion: 72 },
  { score: 70, count: 230, conversion: 58 },
  { score: 60, count: 180, conversion: 42 },
  { score: 50, count: 95, conversion: 28 },
  { score: 40, count: 55, conversion: 15 }
];

const aiProcessingMetrics = [
  { timestamp: "00:00", processing: 1250, accuracy: 94.2 },
  { timestamp: "04:00", processing: 890, accuracy: 95.1 },
  { timestamp: "08:00", processing: 2340, accuracy: 93.8 },
  { timestamp: "12:00", processing: 3450, accuracy: 94.7 },
  { timestamp: "16:00", processing: 2890, accuracy: 95.3 },
  { timestamp: "20:00", processing: 1560, accuracy: 94.9 }
];

// Helper Functions
const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
const formatNumber = (value: number) => value.toLocaleString();
export function AdminAIInsights() {
  const [selectedTab, setSelectedTab] = useState("insights");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleExportInsights = () => {
    console.log("Exporting AI insights...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-blue-50/30 px-5 py-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              AI Insights & Analytics
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Machine learning recommendations and predictive performance analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="secondary" 
            size="sm" 
            disabled={refreshing}
            className="h-8 text-xs px-3 font-semibold"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", refreshing && "animate-spin")} /> 
            Refresh AI
          </Button>
          <Button 
            onClick={handleExportInsights} 
            className="h-8 text-xs px-3 gap-1.5 font-semibold bg-[#00C853] hover:bg-[#00C853]/90"
          >
            <Download className="h-3.5 w-3.5" />
            Export Report
          </Button>
        </div>
      </div>
      {/* AI Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-indigo-600" />
              <p className="text-[10px] text-indigo-600 font-medium">AI Models Active</p>
            </div>
            <p className="text-2xl font-bold text-indigo-600">8</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Processing data</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-[#00C853]" />
              <p className="text-[10px] text-emerald-600 font-medium">Predictions Made</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">1,247</p>
            <p className="text-[9px] text-slate-500 mt-0.5">This month</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-amber-600" />
              <p className="text-[10px] text-amber-600 font-medium">Accuracy Rate</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">94.7%</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Model precision</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <p className="text-[10px] text-purple-600 font-medium">Optimizations</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">23</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Implemented today</p>
          </CardContent>
        </Card>
      </div>
      {/* Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-lg p-1">
          <TabsTrigger value="insights" className="text-xs font-semibold">AI Insights</TabsTrigger>
          <TabsTrigger value="predictions" className="text-xs font-semibold">Predictions</TabsTrigger>
          <TabsTrigger value="optimization" className="text-xs font-semibold">Optimization</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs font-semibold">AI Analytics</TabsTrigger>
        </TabsList>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* AI Recommendations */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-600" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {aiInsights.filter(insight => insight.type === "recommendation").map((insight) => (
                  <div key={insight.id} className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-900">{insight.title}</span>
                      </div>
                      <Badge className={cn(
                        "text-[9px] font-semibold",
                        insight.impact === "high" && "bg-red-100 text-red-700",
                        insight.impact === "medium" && "bg-amber-100 text-amber-700",
                        insight.impact === "low" && "bg-emerald-100 text-emerald-700"
                      )}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-700 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500">Confidence: {insight.confidence}%</span>
                      {insight.estimatedImprovement && (
                        <span className="text-[9px] font-semibold text-green-600">
                          +{insight.estimatedImprovement}% improvement
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* AI Alerts & Warnings */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-600" />
                  AI Alerts & Predictions  
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {aiInsights.filter(insight => insight.type === "alert" || insight.type === "prediction").map((insight) => (
                  <div key={insight.id} className={cn(
                    "p-3 border rounded-lg",
                    insight.type === "alert" && "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
                    insight.type === "prediction" && "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {insight.type === "alert" && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        {insight.type === "prediction" && <TrendingDown className="h-4 w-4 text-red-600" />}
                        <span className="text-xs font-bold text-slate-900">{insight.title}</span>
                      </div>
                      <Badge className={cn(
                        "text-[9px] font-semibold",
                        insight.impact === "high" && "bg-red-100 text-red-700",
                        insight.impact === "medium" && "bg-amber-100 text-amber-700",
                        insight.impact === "low" && "bg-emerald-100 text-emerald-700"
                      )}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-700 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500">Confidence: {insight.confidence}%</span>
                      {insight.actionable && (
                        <Button 
                          size="sm" 
                          className="h-6 text-[9px] px-2 bg-slate-600 hover:bg-slate-700"
                          onClick={() => {
                            console.log('Taking action for insight:', insight.title);
                            alert(`Taking action for: ${insight.title}`);
                          }}
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Analysis Chart */}
          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Customer Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={sentimentAnalysis}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Performance Prediction Chart */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Performance Forecast</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performancePrediction}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="week" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Area type="monotone" dataKey="upper" stackId="1" stroke="none" fill="#ddd6fe" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="lower" stackId="1" stroke="none" fill="#ffffff" />
                      <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                      <Area type="monotone" dataKey="actual" stroke="#00C853" strokeWidth={3} fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Lead Scoring Distribution */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Lead Score Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={leadScoringData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="score" name="Lead Score" fontSize={10} />
                      <YAxis dataKey="conversion" name="Conversion %" fontSize={10} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Scatter dataKey="count" fill="#00C853" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Predictive Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictiveMetrics.map((metric, index) => (
              <Card key={index} className="border border-slate-200/60 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-700">{metric.metric}</span>
                    <div className="flex items-center gap-1">
                      {metric.trend === "up" && <ArrowUp className="h-3 w-3 text-green-600" />}
                      {metric.trend === "down" && <ArrowDown className="h-3 w-3 text-red-600" />}
                      <Badge className={cn(
                        "text-[9px] font-semibold",
                        metric.trend === "up" && "bg-green-100 text-green-700",
                        metric.trend === "down" && "bg-red-100 text-red-700",
                        metric.trend === "stable" && "bg-slate-100 text-slate-700"
                      )}>
                        {metric.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Current</span>
                      <span className="text-sm font-bold text-slate-900">{formatPercentage(metric.current)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Predicted</span>
                      <span className="text-sm font-bold text-indigo-600">{formatPercentage(metric.predicted)}</span>
                    </div>
                    <Progress value={metric.confidence} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-400">{metric.timeframe}</span>
                      <span className="text-[9px] text-slate-400">{metric.confidence}% confidence</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Channel Optimization Chart */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Channel Optimization Potential</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelOptimization}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="channel" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Bar dataKey="current" fill="#94a3b8" name="Current Performance" />
                      <Bar dataKey="optimized" fill="#00C853" name="Optimized Performance" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Recommendations */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Optimization Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {aiInsights.filter(insight => insight.type === "optimization").map((insight) => (
                  <div key={insight.id} className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900">{insight.title}</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-semibold">
                        {insight.category}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-700 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500">Confidence: {insight.confidence}%</span>
                      <Button 
                        size="sm" 
                        className="h-6 text-[9px] px-2 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          console.log('Applying insight:', insight.title);
                          alert(`Applied recommendation: ${insight.title}`);
                        }}
                      >
                        Apply <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Optimization Impact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channelOptimization.map((channel, index) => (
              <Card key={index} className="border border-slate-200/60 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-700">{channel.channel}</span>
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      channel.channel === "WhatsApp" && "bg-green-500",
                      channel.channel === "Email" && "bg-blue-500",
                      channel.channel === "SMS" && "bg-purple-500"
                    )} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Current Rate</span>
                      <span className="text-sm font-bold text-slate-900">{formatPercentage(channel.current)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Optimized Rate</span>
                      <span className="text-sm font-bold text-emerald-600">{formatPercentage(channel.optimized)}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                      <span className="text-[10px] text-emerald-700 font-medium">Improvement</span>
                      <span className="text-xs font-bold text-emerald-700">+{formatPercentage(channel.improvement)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {/* AI Analytics Tab */}
        <TabsContent value="analytics" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* AI Processing Metrics */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">AI Processing Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aiProcessingMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="timestamp" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Area type="monotone" dataKey="processing" fill="#8b5cf6" fillOpacity={0.6} stroke="#8b5cf6" />
                      <Area type="monotone" dataKey="accuracy" fill="#00C853" fillOpacity={0.3} stroke="#00C853" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Model Performance Summary */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xl font-bold text-indigo-600">94.7%</p>
                    <p className="text-[9px] text-indigo-600 font-medium">Avg Accuracy</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-xl font-bold text-emerald-600">2.3s</p>
                    <p className="text-[9px] text-emerald-600 font-medium">Response Time</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-[10px] text-slate-600 font-medium">Sentiment Analysis</span>
                    <span className="text-xs font-bold text-slate-900">96.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-[10px] text-slate-600 font-medium">Lead Scoring</span>
                    <span className="text-xs font-bold text-slate-900">91.8%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-[10px] text-slate-600 font-medium">Content Optimization</span>
                    <span className="text-xs font-bold text-slate-900">89.4%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-[10px] text-slate-600 font-medium">Timing Prediction</span>
                    <span className="text-xs font-bold text-slate-900">87.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI System Health */}
          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">AI System Health</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-emerald-900">Models Online</p>
                  <p className="text-lg font-bold text-emerald-600">8/8</p>
                </div>
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-blue-900">CPU Usage</p>
                  <p className="text-lg font-bold text-blue-600">67%</p>
                </div>
                <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-purple-900">Memory</p>
                  <p className="text-lg font-bold text-purple-600">4.2 GB</p>
                </div>
                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-amber-900">Uptime</p>
                  <p className="text-lg font-bold text-amber-600">99.8%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}