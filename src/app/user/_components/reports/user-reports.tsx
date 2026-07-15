"use client";

import { useState, useMemo } from "react";
import { 
  Download, Target, TrendingUp, TrendingDown, CheckCircle2, Clock, 
  MessageSquare, BarChart3, Activity, ArrowUpRight, ArrowDownRight,
  Search, Calendar, Award, Zap, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/shared/utils";

// ── Types & Data ────────────────────────────────────────────────────────
interface MyCampaign {
  id: string;
  name: string;
  channel: "WhatsApp" | "Email" | "SMS";
  status: "Active" | "Completed" | "Paused";
  startDate: string;
  endDate?: string;
  totalSent: number;
  delivered: number;
  opened: number;
  replied: number;
  converted: number;
  deliveryRate: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
  myRole: string;
}

interface MyTask {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Completed" | "In Progress" | "Todo" | "Overdue";
  dueDate: string;
  completedDate?: string;
  timeSpent: number; // in minutes
  category: "Campaign" | "Analysis" | "Meeting" | "Planning";
}

interface MyPerformance {
  totalCampaigns: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageTaskTime: number;
  totalMessagesSent: number;
  avgReplyRate: number;
  avgConversionRate: number;
  efficiency: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

// Sample Data
const myCampaigns: MyCampaign[] = [
  {
    id: "1",
    name: "Summer Sale 2026",
    channel: "WhatsApp",
    status: "Active", 
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    totalSent: 3420,
    delivered: 3298,
    opened: 2645,
    replied: 685,
    converted: 142,
    deliveryRate: 96.4,
    openRate: 80.2,
    replyRate: 25.9,
    conversionRate: 20.7,
    myRole: "Campaign Manager"
  },
  {
    id: "2",
    name: "Product Demo Email Series",
    channel: "Email", 
    status: "Completed",
    startDate: "2026-06-10",
    endDate: "2026-06-25",
    totalSent: 5680,
    delivered: 5324,
    opened: 3567,
    replied: 234,
    converted: 89,
    deliveryRate: 93.7,
    openRate: 67.0,
    replyRate: 6.6,
    conversionRate: 38.0,
    myRole: "Content Creator"
  },
  {
    id: "3", 
    name: "Weekly Newsletter",
    channel: "Email",
    status: "Active",
    startDate: "2026-07-01",
    totalSent: 2340,
    delivered: 2198,
    opened: 1567,
    replied: 67,
    converted: 34,
    deliveryRate: 93.9,
    openRate: 71.3,
    replyRate: 4.3,
    conversionRate: 50.7,
    myRole: "Content Manager"
  }
];
const myTasks: MyTask[] = [
  {
    id: "1",
    title: "Create WhatsApp Templates",
    description: "Design and test new message templates for summer campaign",
    priority: "High",
    status: "Completed",
    dueDate: "2026-07-10",
    completedDate: "2026-07-09",
    timeSpent: 180,
    category: "Campaign"
  },
  {
    id: "2", 
    title: "Analyze Email Performance",
    description: "Review Q2 email campaign metrics and create improvement plan",
    priority: "Medium",
    status: "Completed", 
    dueDate: "2026-07-12",
    completedDate: "2026-07-11",
    timeSpent: 240,
    category: "Analysis"
  },
  {
    id: "3",
    title: "Client Follow-up Campaign",
    description: "Set up automated follow-up sequence for new leads",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-07-15",
    timeSpent: 120,
    category: "Campaign"
  },
  {
    id: "4",
    title: "Weekly Team Meeting",
    description: "Present campaign performance and discuss optimization strategies",
    priority: "Medium", 
    status: "Todo",
    dueDate: "2026-07-16",
    timeSpent: 0,
    category: "Meeting"
  },
  {
    id: "5",
    title: "SMS Campaign Strategy",
    description: "Plan and outline SMS marketing strategy for Q3",
    priority: "Low",
    status: "Overdue",
    dueDate: "2026-07-05",
    timeSpent: 60,
    category: "Planning"
  }
];

const myPerformance: MyPerformance = {
  totalCampaigns: 8,
  totalTasks: 32,
  completedTasks: 27,
  overdueTasks: 2,
  averageTaskTime: 156, // minutes
  totalMessagesSent: 11440,
  avgReplyRate: 18.6,
  avgConversionRate: 36.5,
  efficiency: 94.7,
  monthlyGoal: 15000,
  monthlyProgress: 11440
};

// Helper Functions
const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
const formatNumber = (value: number) => value.toLocaleString();
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export function UserReports() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [taskFilter, setTaskFilter] = useState<string>("all");

  const filteredTasks = useMemo(() => {
    return myTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = taskFilter === "all" || task.status === taskFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, taskFilter]);

  const downloadMyTasks = async () => {
    try {
      // Fetch real tasks from API
      const response = await fetch('/api/tasks');
      const data = await response.ok ? await response.json() : { tasks: myTasks };
      
      const tasksToExport = data.tasks || myTasks;
      
      // Generate CSV content
      const csvContent = `
MY TASKS REPORT
Generated: ${new Date().toLocaleString()}
Filter Applied: ${taskFilter === "all" ? "All Tasks" : taskFilter}
Total Tasks: ${tasksToExport.length}

TASK DETAILS
Task ID,Title,Description,Priority,Status,Category,Due Date,Completed Date,Time Spent,Notes
${tasksToExport.map((t: MyTask) => 
  `"${t.id}","${t.title}","${t.description}",${t.priority},${t.status},${t.category},${t.dueDate},${t.completedDate || 'Not Completed'},${formatTime(t.timeSpent)},"Task assigned to me"`
).join('\n')}

SUMMARY BY STATUS
${Object.entries(
  tasksToExport.reduce((acc: any, t: MyTask) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {})
).map(([status, count]) => `${status},${count}`).join('\n')}

SUMMARY BY PRIORITY
${Object.entries(
  tasksToExport.reduce((acc: any, t: MyTask) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {})
).map(([priority, count]) => `${priority},${count}`).join('\n')}

SUMMARY BY CATEGORY
${Object.entries(
  tasksToExport.reduce((acc: any, t: MyTask) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {})
).map(([category, count]) => `${category},${count}`).join('\n')}

PERFORMANCE METRICS
Total Time Spent,${tasksToExport.reduce((sum: number, t: MyTask) => sum + t.timeSpent, 0)} minutes
Average Time Per Task,${Math.round(tasksToExport.reduce((sum: number, t: MyTask) => sum + t.timeSpent, 0) / tasksToExport.length)} minutes
Completed Tasks,${tasksToExport.filter((t: MyTask) => t.status === 'Completed').length}
In Progress Tasks,${tasksToExport.filter((t: MyTask) => t.status === 'In Progress').length}
Pending Tasks,${tasksToExport.filter((t: MyTask) => t.status === 'Todo').length}
Overdue Tasks,${tasksToExport.filter((t: MyTask) => t.status === 'Overdue').length}
      `.trim();

      // Create and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `My_Tasks_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Tasks downloaded successfully!');
    } catch (error) {
      console.error('Error downloading tasks:', error);
      alert('Failed to download tasks. Please try again.');
    }
  };

  const handleExport = async (format: "PDF" | "Excel") => {
    try {
      // Fetch real activity log data from API
      const response = await fetch('/api/user/activity-logs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity data');
      }
      
      const data = await response.json();
      
      if (format === "PDF") {
        // Generate PDF report
        generatePDFReport(data);
      } else {
        // Generate Excel report
        generateExcelReport(data);
      }
    } catch (error) {
      console.error(`Error exporting ${format} report:`, error);
      alert(`Failed to export ${format} report. Please try again.`);
    }
  };

  const generatePDFReport = (data: any) => {
    // Create PDF content
    const reportContent = `
===========================================
MY PERFORMANCE REPORT
===========================================
Generated: ${new Date().toLocaleString()}

PERFORMANCE OVERVIEW
-------------------------------------------
Total Campaigns: ${myPerformance.totalCampaigns}
Completed Tasks: ${myPerformance.completedTasks}/${myPerformance.totalTasks}
Messages Sent: ${formatNumber(myPerformance.totalMessagesSent)}
Reply Rate: ${formatPercentage(myPerformance.avgReplyRate)}
Efficiency Score: ${formatPercentage(myPerformance.efficiency)}
Monthly Progress: ${formatNumber(myPerformance.monthlyProgress)}/${formatNumber(myPerformance.monthlyGoal)}

CAMPAIGNS
-------------------------------------------
${myCampaigns.map((c, i) => `
${i + 1}. ${c.name}
   Channel: ${c.channel}
   Status: ${c.status}
   Role: ${c.myRole}
   Sent: ${formatNumber(c.totalSent)}
   Delivered: ${formatNumber(c.delivered)} (${formatPercentage(c.deliveryRate)})
   Opened: ${formatNumber(c.opened)} (${formatPercentage(c.openRate)})
   Replied: ${formatNumber(c.replied)} (${formatPercentage(c.replyRate)})
   Converted: ${formatNumber(c.converted)} (${formatPercentage(c.conversionRate)})
`).join('\n')}

TASKS
-------------------------------------------
${myTasks.map((t, i) => `
${i + 1}. ${t.title}
   Status: ${t.status}
   Priority: ${t.priority}
   Category: ${t.category}
   Due Date: ${t.dueDate}
   ${t.completedDate ? `Completed: ${t.completedDate}` : ''}
   Time Spent: ${formatTime(t.timeSpent)}
`).join('\n')}

ACTIVITY LOGS
-------------------------------------------
${data.activityLogs?.map((log: any, i: number) => `
${i + 1}. Date: ${new Date(log.date).toLocaleDateString()}
   Messages: ${log.messageCount}
   ${log.remarks ? `Notes: ${log.remarks}` : ''}
`).join('\n') || 'No activity logs available'}

===========================================
Report generated by AI Marketing System
===========================================
    `;

    // Create and download PDF
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `My_Performance_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExcelReport = (data: any) => {
    // Create CSV content (Excel compatible)
    const csvContent = `
MY PERFORMANCE REPORT
Generated: ${new Date().toLocaleString()}

OVERVIEW METRICS
Metric,Value
Total Campaigns,${myPerformance.totalCampaigns}
Total Tasks,${myPerformance.totalTasks}
Completed Tasks,${myPerformance.completedTasks}
Overdue Tasks,${myPerformance.overdueTasks}
Average Task Time,${formatTime(myPerformance.averageTaskTime)}
Total Messages Sent,${myPerformance.totalMessagesSent}
Average Reply Rate,${myPerformance.avgReplyRate}%
Average Conversion Rate,${myPerformance.avgConversionRate}%
Efficiency Score,${myPerformance.efficiency}%
Monthly Goal,${myPerformance.monthlyGoal}
Monthly Progress,${myPerformance.monthlyProgress}

CAMPAIGNS
Campaign Name,Channel,Status,Role,Total Sent,Delivered,Opened,Replied,Converted,Delivery Rate,Open Rate,Reply Rate,Conversion Rate,Start Date,End Date
${myCampaigns.map(c => 
  `"${c.name}",${c.channel},${c.status},"${c.myRole}",${c.totalSent},${c.delivered},${c.opened},${c.replied},${c.converted},${c.deliveryRate}%,${c.openRate}%,${c.replyRate}%,${c.conversionRate}%,${c.startDate},${c.endDate || 'Ongoing'}`
).join('\n')}

TASKS
Task Title,Description,Priority,Status,Category,Due Date,Completed Date,Time Spent (minutes)
${myTasks.map(t => 
  `"${t.title}","${t.description}",${t.priority},${t.status},${t.category},${t.dueDate},${t.completedDate || 'N/A'},${t.timeSpent}`
).join('\n')}

ACTIVITY LOGS
Date,Messages Sent,Remarks
${data.activityLogs?.map((log: any) => 
  `${new Date(log.date).toLocaleDateString()},${log.messageCount},"${log.remarks || ''}"`
).join('\n') || 'No activity logs available'}
    `.trim();

    // Create and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `My_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-blue-50/30 px-5 py-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#00C853]" />
            My Performance Report
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Track your tasks, campaigns, and achievements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleExport("PDF")} 
            variant="secondary" 
            size="sm" 
            className="h-8 text-xs px-3 font-semibold"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" /> 
            PDF Report
          </Button>
          <Button 
            onClick={() => handleExport("Excel")} 
            className="h-8 text-xs px-3 gap-1.5 font-semibold bg-[#00C853] hover:bg-[#00C853]/90"
          >
            <Download className="h-3.5 w-3.5" />
            Export Data
          </Button>
        </div>
      </div>
      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-[#00C853]" />
              <p className="text-[10px] text-emerald-600 font-medium">My Campaigns</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{myPerformance.totalCampaigns}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">managed</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <p className="text-[10px] text-blue-600 font-medium">Tasks Done</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{myPerformance.completedTasks}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">of {myPerformance.totalTasks}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <p className="text-[10px] text-purple-600 font-medium">Messages Sent</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatNumber(myPerformance.totalMessagesSent)}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">this month</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-indigo-600" />
              <p className="text-[10px] text-indigo-600 font-medium">Goal Progress</p>
            </div>
            <p className="text-2xl font-bold text-indigo-600">
              {formatPercentage((myPerformance.monthlyProgress / myPerformance.monthlyGoal) * 100)}
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5">of monthly goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-lg p-1">
          <TabsTrigger value="overview" className="text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs font-semibold">My Campaigns</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs font-semibold">My Tasks</TabsTrigger>
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Performance Summary */}
            <Card className="lg:col-span-2 border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-semibold text-slate-700">Campaign Success Rate</span>
                      <span className="text-sm font-bold text-[#00C853]">
                        {formatPercentage((myCampaigns.filter(c => c.status === "Completed").length / myCampaigns.length) * 100)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-semibold text-slate-700">Task Completion Rate</span>
                      <span className="text-sm font-bold text-blue-600">
                        {formatPercentage((myPerformance.completedTasks / myPerformance.totalTasks) * 100)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-semibold text-slate-700">Average Task Time</span>
                      <span className="text-sm font-bold text-purple-600">{formatTime(myPerformance.averageTaskTime)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-semibold text-slate-700">Conversion Rate</span>
                      <span className="text-sm font-bold text-orange-600">{formatPercentage(myPerformance.avgConversionRate)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-semibold text-slate-700">Overdue Tasks</span>
                      <span className="text-sm font-bold text-red-600">{myPerformance.overdueTasks}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-semibold text-slate-700">Monthly Goal</span>
                      <span className="text-sm font-bold text-indigo-600">
                        {formatNumber(myPerformance.monthlyProgress)}/{formatNumber(myPerformance.monthlyGoal)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Score */}
            <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-[#00C853]/10 to-[#00C853]/5">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Achievement Score</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#00C853] flex items-center justify-center bg-white">
                    <span className="text-2xl font-bold text-[#00C853]">{Math.round(myPerformance.efficiency)}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-2">Overall Performance</p>
                    <Badge className="bg-[#00C853]/20 text-[#00C853] text-xs font-semibold">
                      Excellent Performance
                    </Badge>
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Tasks Completed</span>
                      <span className="font-semibold">{myPerformance.completedTasks}/{myPerformance.totalTasks}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Campaigns Active</span>
                      <span className="font-semibold">{myCampaigns.filter(c => c.status === "Active").length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Efficiency Score</span>
                      <span className="font-semibold text-[#00C853]">{formatPercentage(myPerformance.efficiency)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-5">
          <div className="space-y-4">
            {myCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border border-slate-200/60 shadow-sm bg-white hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Campaign Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-slate-900 mb-1">{campaign.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={cn(
                              "text-[9px] font-semibold",
                              campaign.channel === "WhatsApp" && "bg-green-100 text-green-700",
                              campaign.channel === "Email" && "bg-blue-100 text-blue-700",
                              campaign.channel === "SMS" && "bg-purple-100 text-purple-700"
                            )}>
                              {campaign.channel}
                            </Badge>
                            <Badge className={cn(
                              "text-[9px] font-semibold",
                              campaign.status === "Active" && "bg-emerald-100 text-emerald-700",
                              campaign.status === "Completed" && "bg-slate-100 text-slate-700",
                              campaign.status === "Paused" && "bg-amber-100 text-amber-700"
                            )}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-slate-500 mb-1">
                            {campaign.startDate} {campaign.endDate && `- ${campaign.endDate}`}
                          </p>
                          <p className="text-[10px] text-[#00C853] font-medium">{campaign.myRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* Volume Metrics */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 mb-2">Volume</h4>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-[10px] text-slate-600 font-medium">Sent</span>
                          <span className="text-xs font-bold text-slate-900">{formatNumber(campaign.totalSent)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                          <span className="text-[10px] text-emerald-700 font-medium">Delivered</span>
                          <span className="text-xs font-bold text-emerald-700">{formatNumber(campaign.delivered)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-[10px] text-blue-700 font-medium">Opened</span>
                          <span className="text-xs font-bold text-blue-700">{formatNumber(campaign.opened)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <span className="text-[10px] text-purple-700 font-medium">Replied</span>
                          <span className="text-xs font-bold text-purple-700">{formatNumber(campaign.replied)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Rates */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 mb-2">Performance</h4>
                        <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                          <span className="text-[10px] text-emerald-700 font-medium">Delivery Rate</span>
                          <span className="text-xs font-bold text-emerald-700">{formatPercentage(campaign.deliveryRate)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-[10px] text-blue-700 font-medium">Open Rate</span>
                          <span className="text-xs font-bold text-blue-700">{formatPercentage(campaign.openRate)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <span className="text-[10px] text-purple-700 font-medium">Reply Rate</span>
                          <span className="text-xs font-bold text-purple-700">{formatPercentage(campaign.replyRate)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span className="text-[10px] text-orange-700 font-medium">Conversion</span>
                          <span className="text-xs font-bold text-orange-700">{formatPercentage(campaign.conversionRate)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Results */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 mb-2">Results</h4>
                        <div className="text-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                          <p className="text-lg font-bold text-slate-900">{formatNumber(campaign.converted)}</p>
                          <p className="text-[9px] text-slate-500 font-medium">Conversions</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-center p-2 bg-[#00C853]/10 rounded">
                            <p className="text-sm font-bold text-[#00C853]">{formatPercentage(campaign.replyRate)}</p>
                            <p className="text-[8px] text-slate-500">Reply</p>
                          </div>
                          <div className="text-center p-2 bg-orange-50 rounded">
                            <p className="text-sm font-bold text-orange-600">{formatPercentage(campaign.conversionRate)}</p>
                            <p className="text-[8px] text-slate-500">Convert</p>
                          </div>
                        </div>
                        <Badge className={cn(
                          "w-full text-[9px] font-semibold justify-center",
                          campaign.status === "Active" && "bg-emerald-100 text-emerald-700",
                          campaign.status === "Completed" && "bg-slate-100 text-slate-700",
                          campaign.status === "Paused" && "bg-amber-100 text-amber-700"
                        )}>
                          {campaign.status === "Active" ? "Currently Running" : 
                           campaign.status === "Completed" ? "Campaign Completed" : 
                           "Campaign Paused"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-5">
          {/* Task Filters */}
          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search my tasks..."
                    className="h-8 pl-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    className="h-8 px-3 text-xs border rounded-md bg-white"
                  >
                    <option value="all">All Tasks</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Todo">Todo</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <Button
                    onClick={() => downloadMyTasks()}
                    size="sm"
                    className="h-8 text-xs px-3 gap-1.5 bg-[#00C853] hover:bg-[#00C853]/90"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Tasks
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="border border-slate-200/60 shadow-sm bg-white hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                    {/* Task Info */}
                    <div className="lg:col-span-2">
                      <h3 className="font-bold text-sm text-slate-900 mb-1">{task.title}</h3>
                      <p className="text-xs text-slate-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "text-[9px] font-semibold",
                          task.priority === "High" && "bg-red-100 text-red-700",
                          task.priority === "Medium" && "bg-amber-100 text-amber-700",
                          task.priority === "Low" && "bg-slate-100 text-slate-700"
                        )}>
                          {task.priority}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700 text-[9px] font-semibold">
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                    {/* Status & Dates */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn(
                            "text-[9px] font-semibold",
                            task.status === "Completed" && "bg-[#00C853]/20 text-[#00C853]",
                            task.status === "In Progress" && "bg-blue-100 text-blue-700",
                            task.status === "Todo" && "bg-slate-100 text-slate-700",
                            task.status === "Overdue" && "bg-red-100 text-red-700"
                          )}>
                            {task.status}
                          </Badge>
                        </div>
                        <div className="text-xs">
                          <p className="text-slate-500">Due: {task.dueDate}</p>
                          {task.completedDate && (
                            <p className="text-[#00C853]">Done: {task.completedDate}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Time Tracking */}
                    <div className="lg:col-span-1">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm font-bold text-slate-900">{formatTime(task.timeSpent)}</p>
                        <p className="text-[9px] text-slate-500">Time Spent</p>
                      </div>
                    </div>

                    {/* Performance Indicator */}
                    <div className="lg:col-span-1">
                      <div className="text-center">
                        {task.status === "Completed" && (
                          <div className="p-3 bg-[#00C853]/10 rounded-lg">
                            <CheckCircle2 className="h-6 w-6 text-[#00C853] mx-auto mb-1" />
                            <p className="text-[9px] text-[#00C853] font-semibold">Completed</p>
                            {task.completedDate && new Date(task.completedDate) <= new Date(task.dueDate) && (
                              <p className="text-[8px] text-[#00C853]">On Time</p>
                            )}
                          </div>
                        )}
                        {task.status === "In Progress" && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Activity className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                            <p className="text-[9px] text-blue-600 font-semibold">Working</p>
                          </div>
                        )}
                        {task.status === "Todo" && (
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <Clock className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                            <p className="text-[9px] text-slate-500 font-semibold">Pending</p>
                          </div>
                        )}
                        {task.status === "Overdue" && (
                          <div className="p-3 bg-red-50 rounded-lg">
                            <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
                            <p className="text-[9px] text-red-600 font-semibold">Overdue</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}