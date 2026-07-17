"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Download, Users, MessageSquare, TrendingUp, TrendingDown,
  Target, Clock, CheckCircle2, Filter, Search,
  FileText, BarChart3, Activity, Zap, ArrowUpRight, ArrowDownRight, X,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Shield, Wifi, WifiOff, Star, User, Loader2, RefreshCw, XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/shared/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar
} from "recharts";

// ── Types & Data ────────────────────────────────────────────────────────
interface CampaignReport {
  id: string;
  name: string;
  channel: "WhatsApp" | "Email" | "SMS";
  status: "Active" | "Completed" | "Paused" | "Draft";
  startDate: string;
  endDate?: string;
  totalSent: number;
  delivered: number;
  opened: number;
  replied: number;
  converted: number;
  budget: number;
  spent: number;
  roi: number;
  deliveryRate: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
}

interface UserPerformance {
  id: string;
  name: string;
  email: string;
  role: "Manager" | "Marketer" | "Specialist";
  campaignsManaged: number;
  totalSent: number;
  avgReplyRate: number;
  avgConversionRate: number;
  tasksCompleted: number;
  tasksOverdue: number;
  efficiency: number;
  lastActive: string;
}

interface ChannelMetrics {
  channel: "WhatsApp" | "Email" | "SMS";
  totalCampaigns: number;
  activeCampaigns: number;
  totalSent: number;
  delivered: number;
  opened: number;
  replied: number;
  avgDeliveryRate: number;
  avgOpenRate: number;
  avgReplyRate: number;
  avgConversionRate: number;
  monthlyGrowth: number;
}

interface UserActivity {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: any;
  ipAddress?: string;
  createdAt: string;
  actor?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

// ── User Report Types ────────────────────────────────────────────────────
interface UserReportRow {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "DISABLED";
  teamName: string;
  createdAt: string;
  lastLoginAt: string | null;
  todayMarketingCount: number;
  monthlyMarketingCount: number;
  assignedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  aiScore: number;
  whatsAppStatus: "ACTIVE" | "WARNING" | "LIMITED" | "BANNED" | null;
  whatsAppHealthScore: number | null;
}

interface UserDetailData {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    teamName: string | null;
    createdAt: string;
    lastLoginAt: string | null;
    whatsAppAccounts: Array<{
      id: string;
      phoneNumber: string;
      label: string | null;
      status: string;
      healthScore: number;
      dailyMessages: number;
      monthlyMessages: number;
      lastActivityAt: string | null;
      createdAt: string;
    }>;
    aiProgress: Array<{
      id: string;
      aiScore: number;
      productivityScore: number;
      period: string;
      createdAt: string;
    }>;
    assignedTasks: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      dueDate: string | null;
      completedAt: string | null;
      createdAt: string;
      category: string | null;
    }>;
    receivedRemarks: Array<{
      id: string;
      content: string;
      createdAt: string;
      createdBy: { fullName: string; role: string };
    }>;
    auditLogs: Array<{
      id: string;
      action: string;
      entity: string;
      createdAt: string;
    }>;
    activityLogs: Array<{
      id: string;
      date: string;
      messageCount: number;
    }>;
  };
  summary: {
    totalAssigned: number;
    totalCompleted: number;
    totalPending: number;
    latestAiScore: number;
    todayMessages: number;
    monthlyMessages: number;
    whatsAppHealth: string | null;
    whatsAppHealthScore: number | null;
    completionRate: number;
  };
  chartData: Array<{ date: string; messageCount: number }>;
}

// Sample Data
const campaignReports: CampaignReport[] = [
  {
    id: "1",
    name: "Summer Sale 2026",
    channel: "WhatsApp",
    status: "Active",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    totalSent: 15420,
    delivered: 14876,
    opened: 11789,
    replied: 2945,
    converted: 587,
    budget: 25000,
    spent: 18750,
    roi: 234,
    deliveryRate: 96.5,
    openRate: 79.2,
    replyRate: 25.0,
    conversionRate: 19.9
  },
  {
    id: "2", 
    name: "Product Launch Email",
    channel: "Email",
    status: "Completed",
    startDate: "2026-06-15",
    endDate: "2026-06-30",
    totalSent: 28950,
    delivered: 27234,
    opened: 18967,
    replied: 1247,
    converted: 398,
    budget: 15000,
    spent: 12300,
    roi: 187,
    deliveryRate: 94.1,
    openRate: 69.6,
    replyRate: 6.6,
    conversionRate: 31.9
  },
  {
    id: "3",
    name: "Customer Retention SMS",
    channel: "SMS", 
    status: "Active",
    startDate: "2026-07-10",
    totalSent: 8750,
    delivered: 8534,
    opened: 7890,
    replied: 456,
    converted: 234,
    budget: 8000,
    spent: 5600,
    roi: 156,
    deliveryRate: 97.5,
    openRate: 92.4,
    replyRate: 5.8,
    conversionRate: 51.3
  },
  {
    id: "4",
    name: "Black Friday Promo",
    channel: "WhatsApp",
    status: "Draft",
    startDate: "2026-11-20",
    endDate: "2026-11-30",
    totalSent: 0,
    delivered: 0,
    opened: 0,
    replied: 0,
    converted: 0,
    budget: 35000,
    spent: 0,
    roi: 0,
    deliveryRate: 0,
    openRate: 0,
    replyRate: 0,
    conversionRate: 0
  }
];

// Chart Data
const performanceOverTime = [
  { month: "Jan", messages: 12000, replies: 2400, conversions: 480 },
  { month: "Feb", messages: 15000, replies: 3200, conversions: 640 },
  { month: "Mar", messages: 18000, replies: 4100, conversions: 820 },
  { month: "Apr", messages: 22000, replies: 4800, conversions: 960 },
  { month: "May", messages: 25000, replies: 5500, conversions: 1100 },
  { month: "Jun", messages: 28950, replies: 6200, conversions: 1247 },
  { month: "Jul", messages: 24170, replies: 5890, conversions: 1021 }
];

const channelDistribution = [
  { name: "WhatsApp", value: 45, color: "#25D366" },
  { name: "Email", value: 35, color: "#0ea5e9" },
  { name: "SMS", value: 20, color: "#8b5cf6" }
];

const conversionFunnel = [
  { stage: "Sent", count: 53120, percentage: 100 },
  { stage: "Delivered", count: 50644, percentage: 95.3 },
  { stage: "Opened", count: 38546, percentage: 72.6 },
  { stage: "Replied", count: 4648, percentage: 8.8 },
  { stage: "Converted", count: 1219, percentage: 2.3 }
];

const roiData = [
  { campaign: "Summer Sale", roi: 234, spent: 18750, revenue: 62025 },
  { campaign: "Product Launch", roi: 187, spent: 12300, revenue: 35001 },
  { campaign: "Retention SMS", roi: 156, spent: 5600, revenue: 14336 }
];
const userPerformance: UserPerformance[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com", 
    role: "Manager",
    campaignsManaged: 12,
    totalSent: 45680,
    avgReplyRate: 23.4,
    avgConversionRate: 18.7,
    tasksCompleted: 87,
    tasksOverdue: 2,
    efficiency: 97.7,
    lastActive: "2 minutes ago"
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.c@company.com",
    role: "Marketer", 
    campaignsManaged: 8,
    totalSent: 32150,
    avgReplyRate: 25.8,
    avgConversionRate: 22.1,
    tasksCompleted: 64,
    tasksOverdue: 1,
    efficiency: 98.4,
    lastActive: "15 minutes ago"
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.d@company.com",
    role: "Specialist",
    campaignsManaged: 6,
    totalSent: 18960,
    avgReplyRate: 19.2,
    avgConversionRate: 16.3,
    tasksCompleted: 42,
    tasksOverdue: 4,
    efficiency: 91.3,
    lastActive: "1 hour ago"
  },
  {
    id: "4", 
    name: "Alex Kumar",
    email: "alex.k@company.com",
    role: "Manager",
    campaignsManaged: 10,
    totalSent: 38470,
    avgReplyRate: 27.1,
    avgConversionRate: 24.5,
    tasksCompleted: 78,
    tasksOverdue: 0,
    efficiency: 100.0,
    lastActive: "5 minutes ago"
  },
  {
    id: "5",
    name: "Lisa Wong", 
    email: "lisa.w@company.com",
    role: "Marketer",
    campaignsManaged: 7,
    totalSent: 25890,
    avgReplyRate: 21.6,
    avgConversionRate: 19.8,
    tasksCompleted: 56,
    tasksOverdue: 3,
    efficiency: 94.9,
    lastActive: "30 minutes ago"
  }
];

const channelMetrics: ChannelMetrics[] = [
  {
    channel: "WhatsApp",
    totalCampaigns: 24,
    activeCampaigns: 8,
    totalSent: 89350,
    delivered: 86240,
    opened: 72890,
    replied: 18460,
    avgDeliveryRate: 96.5,
    avgOpenRate: 81.6,
    avgReplyRate: 25.3,
    avgConversionRate: 20.7,
    monthlyGrowth: 18.4
  },
  {
    channel: "Email", 
    totalCampaigns: 18,
    activeCampaigns: 5,
    totalSent: 156780,
    delivered: 147560,
    opened: 98450,
    replied: 6890,
    avgDeliveryRate: 94.1,
    avgOpenRate: 66.7,
    avgReplyRate: 7.0,
    avgConversionRate: 28.3,
    monthlyGrowth: 12.7
  },
  {
    channel: "SMS",
    totalCampaigns: 12,
    activeCampaigns: 3, 
    totalSent: 45680,
    delivered: 44520,
    opened: 41230,
    replied: 2890,
    avgDeliveryRate: 97.5,
    avgOpenRate: 92.6,
    avgReplyRate: 7.0,
    avgConversionRate: 45.2,
    monthlyGrowth: 8.9
  }
];

// Helper Functions
const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
const formatNumber = (value: number) => value.toLocaleString();

// CSV Generation for User Activities
const generateUserActivitiesCSV = (activities: UserActivity[]) => {
  const headers = ['User Name', 'Email', 'Role', 'Action', 'Entity', 'Entity ID', 'IP Address', 'Date', 'Time', 'Metadata'];
  const rows = activities.map(activity => [
    activity.actor?.fullName || 'System',
    activity.actor?.email || 'system@app.local',
    activity.actor?.role || 'SYSTEM',
    activity.action,
    activity.entity,
    activity.entityId || '-',
    activity.ipAddress || '-',
    new Date(activity.createdAt).toLocaleDateString(),
    new Date(activity.createdAt).toLocaleTimeString(),
    activity.metadata ? JSON.stringify(activity.metadata) : '-'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// Separate component for each user activity group to fix hooks order issue
function UserActivityGroup({ userId, activities }: { userId: string; activities: UserActivity[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const user = activities[0]?.actor;
  const activityCount = activities.length;

  const downloadUserReport = (format: 'CSV' | 'PDF' | 'Excel' | 'JSON') => {
    const userName = user?.fullName || 'System';
    const userEmail = user?.email || 'system@app.local';
    const userRole = user?.role || 'SYSTEM';
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${userName.replace(/\s+/g, '-')}-activity-report-${timestamp}`;

    if (format === 'CSV') {
      // CSV Format
      const headers = ['Action', 'Entity', 'Entity ID', 'IP Address', 'Date', 'Time', 'Description', 'Metadata'];
      const rows = activities.map(activity => [
        activity.action,
        activity.entity,
        activity.entityId || '-',
        activity.ipAddress || '-',
        new Date(activity.createdAt).toLocaleDateString(),
        new Date(activity.createdAt).toLocaleTimeString(),
        (() => {
          if (activity.action === 'auth.login') return 'Logged into the system';
          if (activity.action === 'auth.logout') return 'Logged out from the system';
          if (activity.action === 'auth.register') return 'Registered a new account';
          if (activity.action.includes('task.create')) return 'Created a new task';
          if (activity.action.includes('task.update')) return 'Updated task details';
          if (activity.action.includes('task.complete')) return 'Completed a task';
          if (activity.action.includes('user.create')) return 'Created a new user';
          if (activity.action.includes('user.update')) return 'Updated user information';
          if (activity.action.includes('user.delete')) return 'Deleted a user';
          return activity.action;
        })(),
        activity.metadata ? JSON.stringify(activity.metadata) : '-'
      ]);
      
      const csvContent = [
        `User Activity Report`,
        `Name: ${userName}`,
        `Email: ${userEmail}`,
        `Role: ${userRole}`,
        `Total Activities: ${activityCount}`,
        `Report Generated: ${new Date().toLocaleString()}`,
        '',
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'JSON') {
      // JSON Format
      const jsonData = {
        report: {
          user: {
            name: userName,
            email: userEmail,
            role: userRole
          },
          summary: {
            totalActivities: activityCount,
            reportGenerated: new Date().toISOString()
          },
          activities: activities.map(activity => ({
            id: activity.id,
            action: activity.action,
            entity: activity.entity,
            entityId: activity.entityId,
            ipAddress: activity.ipAddress,
            timestamp: activity.createdAt,
            metadata: activity.metadata
          }))
        }
      };
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'PDF') {
      // PDF Format - Generate HTML and print
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>User Activity Report - ${userName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 3px solid #00C853; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #00C853; margin: 0; }
            .info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
            .info-item { margin: 8px 0; }
            .info-label { font-weight: bold; color: #555; }
            .activity { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
            .activity-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .badge-create { background: #e8f5e9; color: #2e7d32; }
            .badge-update { background: #e3f2fd; color: #1565c0; }
            .badge-delete { background: #ffebee; color: #c62828; }
            .badge-login { background: #e0f2f1; color: #00695c; }
            .badge-logout { background: #f5f5f5; color: #424242; }
            .activity-detail { color: #666; margin: 5px 0; }
            .timestamp { color: #999; font-size: 12px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 User Activity Report</h1>
            <p style="color: #666;">Comprehensive activity log and analytics</p>
          </div>
          
          <div class="info">
            <div class="info-item"><span class="info-label">👤 User:</span> ${userName}</div>
            <div class="info-item"><span class="info-label">📧 Email:</span> ${userEmail}</div>
            <div class="info-item"><span class="info-label">🎭 Role:</span> ${userRole}</div>
            <div class="info-item"><span class="info-label">📈 Total Activities:</span> ${activityCount}</div>
            <div class="info-item"><span class="info-label">📅 Report Generated:</span> ${new Date().toLocaleString()}</div>
          </div>

          <h2 style="color: #00C853; margin-bottom: 20px;">Activity Log</h2>
          ${activities.map(activity => `
            <div class="activity">
              <div class="activity-header">
                <div>
                  <span class="badge badge-${activity.action.includes('create') ? 'create' : activity.action.includes('update') ? 'update' : activity.action.includes('delete') ? 'delete' : activity.action.includes('login') ? 'login' : 'logout'}">
                    ${activity.action}
                  </span>
                  <span class="badge" style="background: #f5f5f5; color: #666;">${activity.entity}</span>
                </div>
                <div class="timestamp">${new Date(activity.createdAt).toLocaleString()}</div>
              </div>
              <div class="activity-detail">
                ${activity.action === 'auth.login' ? '🔐 Logged into the system' :
                  activity.action === 'auth.logout' ? '👋 Logged out from the system' :
                  activity.action === 'auth.register' ? '✨ Registered a new account' :
                  activity.action.includes('task.create') ? '📝 Created a new task' :
                  activity.action.includes('task.update') ? '✏️ Updated task details' :
                  activity.action.includes('task.complete') ? '✅ Completed a task' :
                  activity.action.includes('user.create') ? '👤 Created a new user' :
                  activity.action.includes('user.update') ? '🔄 Updated user information' :
                  activity.action.includes('user.delete') ? '🗑️ Deleted a user' :
                  activity.action}
              </div>
              ${activity.entityId ? `<div class="activity-detail"><strong>ID:</strong> ${activity.entityId}</div>` : ''}
              ${activity.ipAddress ? `<div class="activity-detail"><strong>IP:</strong> ${activity.ipAddress}</div>` : ''}
            </div>
          `).join('')}

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            Generated by AI Marketing System - ${new Date().toLocaleString()}
          </div>
        </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } else if (format === 'Excel') {
      // Excel Format (HTML table that Excel can open)
      const excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #00C853; color: white; font-weight: bold; }
            .header { background-color: #f5f5f5; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>User Activity Report</h2>
          <table>
            <tr class="header"><td>User Name:</td><td>${userName}</td></tr>
            <tr class="header"><td>Email:</td><td>${userEmail}</td></tr>
            <tr class="header"><td>Role:</td><td>${userRole}</td></tr>
            <tr class="header"><td>Total Activities:</td><td>${activityCount}</td></tr>
            <tr class="header"><td>Report Generated:</td><td>${new Date().toLocaleString()}</td></tr>
          </table>
          <br><br>
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>IP Address</th>
                <th>Date</th>
                <th>Time</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${activities.map(activity => `
                <tr>
                  <td>${activity.action}</td>
                  <td>${activity.entity}</td>
                  <td>${activity.entityId || '-'}</td>
                  <td>${activity.ipAddress || '-'}</td>
                  <td>${new Date(activity.createdAt).toLocaleDateString()}</td>
                  <td>${new Date(activity.createdAt).toLocaleTimeString()}</td>
                  <td>${
                    activity.action === 'auth.login' ? 'Logged into the system' :
                    activity.action === 'auth.logout' ? 'Logged out from the system' :
                    activity.action === 'auth.register' ? 'Registered a new account' :
                    activity.action.includes('task.create') ? 'Created a new task' :
                    activity.action.includes('task.update') ? 'Updated task details' :
                    activity.action.includes('task.complete') ? 'Completed a task' :
                    activity.action.includes('user.create') ? 'Created a new user' :
                    activity.action.includes('user.update') ? 'Updated user information' :
                    activity.action.includes('user.delete') ? 'Deleted a user' :
                    activity.action
                  }</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="border border-slate-200 shadow-md bg-gradient-to-br from-white to-slate-50/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* User Header - Clickable with improved styling */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            {/* User Info - Enhanced */}
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-4 cursor-pointer flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#00C853] to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-base font-bold text-white">
                    {user?.fullName?.split(' ').map(n => n[0]).join('') || 'SYS'}
                  </span>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-0.5">
                  {user?.fullName || 'System'}
                </h3>
                <p className="text-xs text-slate-600 mb-2">
                  {user?.email || 'system@app.local'}
                </p>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "text-[9px] font-semibold shadow-sm",
                    user?.role === "ADMIN" && "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
                    user?.role === "USER" && "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
                    !user?.role && "bg-gradient-to-r from-slate-500 to-slate-600 text-white"
                  )}>
                    {user?.role || 'SYSTEM'}
                  </Badge>
                  <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-1 rounded-full font-medium">
                    {activityCount} {activityCount === 1 ? 'activity' : 'activities'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-9 text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download Report
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => downloadUserReport('CSV')} className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2 text-green-600" />
                    <span className="font-medium">Download as CSV</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadUserReport('Excel')} className="cursor-pointer">
                    <BarChart3 className="h-4 w-4 mr-2 text-emerald-600" />
                    <span className="font-medium">Download as Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadUserReport('PDF')} className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2 text-red-600" />
                    <span className="font-medium">Download as PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadUserReport('JSON')} className="cursor-pointer">
                    <Activity className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">Download as JSON</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="text-right bg-slate-100/70 px-3 py-2 rounded-lg">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  Last Activity
                </p>
                <p className="text-xs text-slate-900 font-medium">
                  {new Date(activities[0].createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "transition-transform duration-300 bg-[#00C853]/10 p-2 rounded-lg cursor-pointer hover:bg-[#00C853]/20",
                  isExpanded && "rotate-180"
                )}
              >
                <TrendingDown className="h-5 w-5 text-[#00C853]" />
              </div>
            </div>
          </div>
        </div>

        {/* Activities List - Expandable with improved design */}
        {isExpanded && (
          <div className="bg-gradient-to-b from-slate-50 to-white p-5 space-y-3">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#00C853] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Action Details - Enhanced */}
                  <div className="lg:col-span-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn(
                          "text-[10px] font-semibold shadow-sm",
                          activity.action.includes('create') && "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
                          activity.action.includes('update') && "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
                          activity.action.includes('delete') && "bg-gradient-to-r from-red-500 to-red-600 text-white",
                          activity.action.includes('login') && "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
                          activity.action.includes('logout') && "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
                          !activity.action.includes('create') && !activity.action.includes('update') && 
                          !activity.action.includes('delete') && !activity.action.includes('login') && 
                          !activity.action.includes('logout') && "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        )}>
                          {activity.action.includes('create') && <Zap className="h-3 w-3 mr-1" />}
                          {activity.action.includes('update') && <FileText className="h-3 w-3 mr-1" />}
                          {activity.action.includes('delete') && <X className="h-3 w-3 mr-1" />}
                          {activity.action.includes('login') && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {activity.action}
                        </Badge>
                        <Badge className="text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                          {activity.entity}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {activity.action === 'auth.login' && `🔐 Logged into the system`}
                        {activity.action === 'auth.logout' && `👋 Logged out from the system`}
                        {activity.action === 'auth.register' && `✨ Registered a new account`}
                        {activity.action.includes('task.create') && `📝 Created a new task`}
                        {activity.action.includes('task.update') && `✏️ Updated task details`}
                        {activity.action.includes('task.complete') && `✅ Completed a task`}
                        {activity.action.includes('user.create') && `👤 Created a new user`}
                        {activity.action.includes('user.update') && `🔄 Updated user information`}
                        {activity.action.includes('user.delete') && `🗑️ Deleted a user`}
                        {!activity.action.includes('auth') && !activity.action.includes('task') && 
                         !activity.action.includes('user') && `${activity.action}`}
                      </p>
                      
                      {activity.entityId && (
                        <p className="text-[10px] text-slate-600 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-700">ID:</span> {activity.entityId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* IP & Metadata - Enhanced */}
                  <div className="lg:col-span-3 space-y-2">
                    {activity.ipAddress && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-200">
                        <p className="text-[9px] text-blue-700 font-semibold uppercase tracking-wide mb-1">IP Address</p>
                        <p className="text-[11px] text-blue-900 font-mono font-medium">{activity.ipAddress}</p>
                      </div>
                    )}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-3 border border-purple-200">
                        <p className="text-[9px] text-purple-700 font-semibold uppercase tracking-wide mb-2">Details</p>
                        <div className="space-y-1">
                          {Object.entries(activity.metadata).slice(0, 2).map(([key, value]) => (
                            <p key={key} className="text-[10px] text-purple-900 truncate">
                              <span className="font-semibold">{key}:</span> {String(value)}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp - Enhanced */}
                  <div className="lg:col-span-3">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200 h-full flex flex-col items-center justify-center text-center">
                      <Clock className="h-4 w-4 text-slate-600 mb-2" />
                      <p className="text-xs text-slate-900 font-semibold mb-1">
                        {new Date(activity.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium mb-2">
                        {new Date(activity.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <Badge className="text-[9px] font-semibold bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20">
                        {(() => {
                          const diff = Date.now() - new Date(activity.createdAt).getTime();
                          const minutes = Math.floor(diff / 60000);
                          const hours = Math.floor(minutes / 60);
                          const days = Math.floor(hours / 24);
                          
                          if (days > 0) return `${days}d ago`;
                          if (hours > 0) return `${hours}h ago`;
                          if (minutes > 0) return `${minutes}m ago`;
                          return 'Just now';
                        })()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── WhatsApp Numbers List ─────────────────────────────────────────────
function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

type WaAccount = {
  id: string;
  phoneNumber: string;
  label: string | null;
  status: string;
  healthScore: number;
  dailyMessages: number;
  monthlyMessages: number;
  lastActivityAt: string | null;
  createdAt: string;
};

const WA_STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string; bar: string }> = {
  ACTIVE:  { bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-200", dot: "bg-emerald-500",  bar: "bg-emerald-500"  },
  WARNING: { bg: "bg-amber-50",    text: "text-amber-700",    border: "border-amber-200",   dot: "bg-amber-500",    bar: "bg-amber-500"    },
  LIMITED: { bg: "bg-orange-50",   text: "text-orange-700",   border: "border-orange-200",  dot: "bg-orange-500",   bar: "bg-orange-500"   },
  BANNED:  { bg: "bg-red-50",      text: "text-red-700",      border: "border-red-200",     dot: "bg-red-500",      bar: "bg-red-500"      },
};

function WhatsAppNumbersList({ accounts }: { accounts: WaAccount[] }) {
  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <Wifi className="h-3.5 w-3.5 text-[#00C853] shrink-0" />
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          WhatsApp Numbers ({accounts.length})
        </h4>
      </div>

      {accounts.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center gap-2 py-7 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <WifiOff className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-xs font-semibold text-slate-500">No WhatsApp numbers added yet</p>
          <p className="text-[10px] text-slate-400 max-w-[200px]">
            This user hasn&apos;t connected any WhatsApp accounts.
          </p>
        </div>
      ) : (
        /* ── Account cards (capped height, internal scroll when >4) ── */
        <div className={cn("space-y-2", accounts.length > 4 && "max-h-72 overflow-y-auto pr-1")}>
          {accounts.map((acc) => {
            const cfg = WA_STATUS_CONFIG[acc.status] ?? WA_STATUS_CONFIG.ACTIVE;
            const scoreColor =
              acc.healthScore >= 80 ? "text-emerald-600" :
              acc.healthScore >= 50 ? "text-amber-600" : "text-red-600";
            return (
              <div
                key={acc.id}
                className={cn(
                  "rounded-xl border p-3 space-y-2.5 transition-shadow hover:shadow-sm",
                  cfg.bg, cfg.border
                )}
              >
                {/* Top row: phone + label | status badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-tight tracking-wide">
                      {acc.phoneNumber}
                    </p>
                    {acc.label && (
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{acc.label}</p>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-wide border shrink-0 flex items-center gap-1",
                      cfg.bg, cfg.text, cfg.border
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dot)} />
                    {acc.status}
                  </Badge>
                </div>

                {/* Health score bar */}
                <div className="space-y-1">
                  <div className="h-1 w-full bg-white/70 rounded-[2px] overflow-hidden border border-white/50">
                    <div
                      className={cn("h-full rounded-[2px] transition-all", cfg.bar)}
                      style={{ width: `${Math.min(acc.healthScore, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 text-[10px] text-slate-600">
                    <span className="font-semibold">Health:</span>
                    <span className={cn("font-bold", scoreColor)}>{acc.healthScore}</span>
                  </span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className="text-[10px] text-slate-600">
                    <span className="font-semibold">Daily:</span>{" "}
                    <span className="font-bold text-slate-700">{acc.dailyMessages}</span>
                  </span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className="text-[10px] text-slate-600">
                    <span className="font-semibold">Monthly:</span>{" "}
                    <span className="font-bold text-slate-700">{acc.monthlyMessages}</span>
                  </span>
                  <span className="ml-auto text-[9px] text-slate-400 italic">
                    Last active {relativeTime(acc.lastActivityAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── WhatsApp Status Badge ─────────────────────────────────────────────
function WhatsAppBadge({ status, score }: { status: string | null; score: number | null }) {
  if (!status) return <span className="text-xs text-slate-400">—</span>;
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    ACTIVE:   { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <Wifi className="h-3 w-3" />, label: "Active" },
    WARNING:  { color: "bg-amber-100 text-amber-700 border-amber-200",     icon: <Shield className="h-3 w-3" />,  label: "Warning" },
    LIMITED:  { color: "bg-orange-100 text-orange-700 border-orange-200",  icon: <WifiOff className="h-3 w-3" />, label: "Limited" },
    BANNED:   { color: "bg-red-100 text-red-700 border-red-200",           icon: <XCircle className="h-3 w-3" />, label: "Banned" },
  };
  const c = config[status] ?? config["WARNING"];
  return (
    <Badge className={cn("flex items-center gap-1 text-[10px] font-semibold border", c.color)}>
      {c.icon}
      {c.label}{score !== null ? ` (${score})` : ""}
    </Badge>
  );
}

// ── User Detail Drawer ────────────────────────────────────────────────
function UserDetailDrawer({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [data, setData] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/reports/users/${userId}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  const user = data?.user;
  const summary = data?.summary;
  const chartData = (data?.chartData ?? []).slice().reverse();

  const initials = user?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "??";

  const downloadReport = () => {
    if (!data) return;
    const { user: u, summary: s } = data;
    const rows = [
      ["Field", "Value"],
      ["Name", u.fullName],
      ["Email", u.email],
      ["Role", u.role],
      ["Team", u.teamName ?? "—"],
      ["Status", u.status],
      ["Today's Marketing", s.todayMessages],
      ["Monthly Marketing", s.monthlyMessages],
      ["Assigned Tasks", s.totalAssigned],
      ["Completed Tasks", s.totalCompleted],
      ["Pending Tasks", s.totalPending],
      ["AI Score", s.latestAiScore],
      ["WhatsApp Status", s.whatsAppHealth ?? "—"],
      ["WhatsApp Health Score", s.whatsAppHealthScore ?? "—"],
      ["Completion Rate", `${s.completionRate}%`],
      ["", ""],
      ["WhatsApp Accounts", ""],
      ["Label", "Phone Number", "Status", "Health Score", "Daily Messages", "Monthly Messages"],
      ...(u.whatsAppAccounts || []).map((wa) => [
        wa.label ?? "—",
        wa.phoneNumber,
        wa.status,
        wa.healthScore,
        wa.dailyMessages,
        wa.monthlyMessages,
      ]),
      ["", ""],
      ["Tasks", ""],
      ["Title", "Status", "Priority", "Due Date", "Completed At"],
      ...(u.assignedTasks || []).map((t) => [
        t.title,
        t.status,
        t.priority,
        t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—",
        t.completedAt ? new Date(t.completedAt).toLocaleDateString() : "—",
      ]),
      ["", ""],
      ["AI Progress History", ""],
      ["Period", "AI Score", "Productivity Score", "Recorded At"],
      ...(u.aiProgress || []).map((p) => [
        p.period,
        p.aiScore,
        p.productivityScore,
        p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—",
      ]),
      ["", ""],
      ["Daily Activity Logs", ""],
      ["Date", "Message Count"],
      ...(u.activityLogs || []).map((log) => [
        log.date ? new Date(log.date).toLocaleDateString() : "—",
        log.messageCount,
      ]),
      ["", ""],
      ["Remarks", ""],
      ["Created By", "Role", "Content", "Date"],
      ...(u.receivedRemarks || []).map((r) => [
        r.createdBy?.fullName ?? "—",
        r.createdBy?.role ?? "—",
        r.content,
        r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${u.fullName.replace(/\s+/g, "-")}-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C853] to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow">
              {initials}
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">{user?.fullName ?? "Loading..."}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={downloadReport} disabled={!data}>
              <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
            </Button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-[#00C853] animate-spin" />
              <p className="text-sm text-slate-500">Loading user report...</p>
            </div>
          </div>
        ) : !data ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-slate-500">Failed to load user data.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">

              {/* ── Overview ── */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b pb-1.5 border-slate-100 dark:border-slate-800">
                  Overview
                </h3>
                
                {/* Profile Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Role</p>
                    <Badge className={cn(
                      "text-xs font-semibold",
                      user!.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    )}>{user!.role}</Badge>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Team</p>
                    <p className="text-sm font-bold text-slate-800">{user!.teamName ?? "—"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Status</p>
                    <Badge className={cn(
                      "text-xs font-semibold",
                      user!.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>{user!.status}</Badge>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Last Login</p>
                    <p className="text-xs font-medium text-slate-700">
                      {user!.lastLoginAt ? new Date(user!.lastLoginAt).toLocaleString() : "Never"}
                    </p>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Today's Marketing", value: summary!.todayMessages, color: "text-[#00C853]", bg: "bg-emerald-50" },
                    { label: "Monthly Marketing", value: summary!.monthlyMessages, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "AI Score", value: `${summary!.latestAiScore}`, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Assigned Tasks", value: summary!.totalAssigned, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Completed Tasks", value: summary!.totalCompleted, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Completion Rate", value: `${summary!.completionRate}%`, color: "text-indigo-600", bg: "bg-indigo-50" },
                  ].map((s) => (
                    <div key={s.label} className={cn("rounded-xl p-4 border border-slate-200", s.bg)}>
                      <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1">{s.label}</p>
                      <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Numbers — per-account breakdown */}
                <WhatsAppNumbersList accounts={user!.whatsAppAccounts} />

                {/* Activity Chart */}
                {chartData.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-3">Daily Marketing Activity</p>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="drawerGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00C853" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#00C853" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="2 6" stroke="rgba(0,0,0,0.07)" vertical={false} />
                          <XAxis
                            dataKey="date"
                            fontSize={8}
                            stroke="rgba(0,0,0,0.4)"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
                          />
                          <YAxis fontSize={8} stroke="rgba(0,0,0,0.4)" tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "11px" }}
                            labelFormatter={(v) => new Date(v).toLocaleDateString()}
                          />
                          <Area
                            type="monotone"
                            dataKey="messageCount"
                            name="Messages"
                            stroke="#00C853"
                            strokeWidth={2}
                            fill="url(#drawerGrad)"
                            dot={false}
                            activeDot={{ r: 3, fill: "#00C853", stroke: "#fff", strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Tasks ── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-1.5 border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Assigned Tasks ({user!.assignedTasks.length})
                  </h3>
                  <div className="flex gap-2 text-[10px]">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">{summary!.totalCompleted} done</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">{summary!.totalPending} pending</span>
                  </div>
                </div>
                {user!.assignedTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No tasks assigned</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {user!.assignedTasks.map((task) => (
                      <div key={task.id} className="border border-slate-200 rounded-xl p-3 hover:border-[#00C853] hover:shadow-sm transition-all bg-white">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-800">{task.title}</p>
                            {task.category && <p className="text-[10px] text-slate-500 mt-0.5">{task.category}</p>}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge className={cn(
                              "text-[9px] font-semibold",
                              task.status === "COMPLETED" && "bg-emerald-100 text-emerald-700",
                              task.status === "IN_PROGRESS" && "bg-blue-100 text-blue-700",
                              task.status === "TODO" && "bg-slate-100 text-slate-600",
                              task.status === "BLOCKED" && "bg-red-100 text-red-700",
                            )}>{task.status.replace("_", " ")}</Badge>
                            <Badge className={cn(
                              "text-[9px] font-semibold",
                              task.priority === "URGENT" && "bg-red-100 text-red-700",
                              task.priority === "HIGH" && "bg-orange-100 text-orange-700",
                              task.priority === "MEDIUM" && "bg-amber-100 text-amber-700",
                              task.priority === "LOW" && "bg-slate-100 text-slate-600",
                            )}>{task.priority}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {task.completedAt && (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              Done: {new Date(task.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── AI Progress ── */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b pb-1.5 border-slate-100 dark:border-slate-800">
                  AI Score & Productivity History
                </h3>
                {user!.aiProgress.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No AI score data available</p>
                ) : (
                  <>
                    <div className="h-40 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={user!.aiProgress.slice().reverse()} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="2 6" stroke="rgba(0,0,0,0.07)" vertical={false} />
                          <XAxis dataKey="period" fontSize={8} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 100]} fontSize={8} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "11px" }} />
                          <Line type="monotone" dataKey="aiScore" name="AI Score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }} />
                          <Line type="monotone" dataKey="productivityScore" name="Productivity" stroke="#00C853" strokeWidth={2} dot={{ fill: "#00C853", strokeWidth: 2, r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 max-h-48 overflow-y-auto pr-1">
                      {user!.aiProgress.map((p) => (
                        <div key={p.id} className="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-white">
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{p.period}</p>
                            <p className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-[10px] text-purple-600 font-semibold">AI Score</p>
                              <p className="text-base font-bold text-purple-700">{p.aiScore.toFixed(1)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-emerald-600 font-semibold">Productivity</p>
                              <p className="text-base font-bold text-emerald-700">{p.productivityScore.toFixed(1)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ── Activity Log ── */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b pb-1.5 border-slate-100 dark:border-slate-800">
                  Recent Audit Activity ({user!.auditLogs.length})
                </h3>
                {user!.auditLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No audit activity found</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {user!.auditLogs.map((log) => (
                      <div key={log.id} className="border border-slate-100 rounded-lg px-3 py-2 flex items-center justify-between hover:border-slate-300 transition-all bg-slate-50/50">
                        <div>
                          <Badge className={cn(
                            "text-[9px] font-semibold mb-0.5",
                            log.action.includes("create") && "bg-emerald-100 text-emerald-700",
                            log.action.includes("update") && "bg-blue-100 text-blue-700",
                            log.action.includes("delete") && "bg-red-100 text-red-700",
                            log.action.includes("login") && "bg-teal-100 text-teal-700",
                            !log.action.includes("create") && !log.action.includes("update") && !log.action.includes("delete") && !log.action.includes("login") && "bg-slate-100 text-slate-700",
                          )}>{log.action}</Badge>
                          <p className="text-[10px] text-slate-500">{log.entity}</p>
                        </div>
                        <p className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Remarks ── */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b pb-1.5 border-slate-100 dark:border-slate-800">
                  Admin Remarks ({user!.receivedRemarks.length})
                </h3>
                {user!.receivedRemarks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No remarks found</p>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {user!.receivedRemarks.map((r) => (
                      <div key={r.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                        <p className="text-xs text-slate-700 leading-relaxed mb-2">{r.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
                            By {r.createdBy.fullName} ({r.createdBy.role})
                          </span>
                          <span className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Users Tab Component ───────────────────────────────────────────────
type SortField = "fullName" | "teamName" | "role" | "todayMarketingCount" | "monthlyMarketingCount" | "assignedTasks" | "completedTasks" | "pendingTasks" | "aiScore" | "createdAt";

function UsersReportTab() {
  const [rows, setRows] = useState<UserReportRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [waFilter, setWaFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("fullName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        team: teamFilter,
        role: roleFilter,
        whatsAppStatus: waFilter,
        sortBy,
        sortDir,
        page: String(page),
        pageSize: String(pageSize),
      });
      const res = await fetch(`/api/admin/reports/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.rows ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setTeams(data.teams ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, teamFilter, roleFilter, waFilter, sortBy, sortDir, page, pageSize]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // Reset page on filter/search change
  useEffect(() => { setPage(1); }, [search, teamFilter, roleFilter, waFilter, sortBy]);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ChevronDown className="h-3 w-3 text-slate-300" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 text-[#00C853]" />
      : <ChevronDown className="h-3 w-3 text-[#00C853]" />;
  };

  // Client-side sort for computed fields not sortable via DB
  const sortedRows = useMemo(() => {
    const serverSorted = ["fullName", "teamName", "role", "createdAt"];
    if (serverSorted.includes(sortBy)) return rows;
    return [...rows].sort((a, b) => {
      const av = a[sortBy as keyof UserReportRow] as number;
      const bv = b[sortBy as keyof UserReportRow] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [rows, sortBy, sortDir]);

  const downloadCSV = () => {
    const header = ["User ID", "Name", "Email", "Role", "Team", "Status", "Today Marketing", "Monthly Marketing", "Assigned Tasks", "Completed Tasks", "Pending Tasks", "AI Score", "WhatsApp Status", "WA Health Score"];
    const csvRows = sortedRows.map((r) => [
      r.id, r.fullName, r.email, r.role, r.teamName, r.status,
      r.todayMarketingCount, r.monthlyMarketingCount,
      r.assignedTasks, r.completedTasks, r.pendingTasks,
      r.aiScore, r.whatsAppStatus ?? "—", r.whatsAppHealthScore ?? "—",
    ]);
    const csv = [header, ...csvRows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: { key: SortField | null; label: string; sortable?: boolean }[] = [
    { key: null, label: "#" },
    { key: "fullName", label: "User", sortable: true },
    { key: "teamName", label: "Team", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "todayMarketingCount", label: "Today", sortable: true },
    { key: "monthlyMarketingCount", label: "Monthly", sortable: true },
    { key: "assignedTasks", label: "Assigned", sortable: true },
    { key: "completedTasks", label: "Done", sortable: true },
    { key: "pendingTasks", label: "Pending", sortable: true },
    { key: null, label: "WhatsApp" },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, team…"
                className="h-8 pl-8 text-xs"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="h-8 px-3 text-xs border border-slate-200 rounded-md bg-white focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none"
              >
                <option value="all">All Teams</option>
                {teams.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-8 px-3 text-xs border border-slate-200 rounded-md bg-white focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none"
              >
                <option value="all">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
              <select
                value={waFilter}
                onChange={(e) => setWaFilter(e.target.value)}
                className="h-8 px-3 text-xs border border-slate-200 rounded-md bg-white focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853] outline-none"
              >
                <option value="all">All WA Status</option>
                <option value="ACTIVE">Active</option>
                <option value="WARNING">Warning</option>
                <option value="LIMITED">Limited</option>
                <option value="BANNED">Banned</option>
              </select>
              <Button size="sm" variant="secondary" onClick={fetchRows} className="h-8 text-xs">
                <RefreshCw className="h-3 w-3 mr-1" /> Refresh
              </Button>
              <Button size="sm" onClick={downloadCSV} className="h-8 text-xs bg-[#00C853] hover:bg-[#00C853]/90">
                <Download className="h-3 w-3 mr-1" /> Export CSV
              </Button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-[10px] text-slate-500 mt-2">
            Showing {rows.length} of {total} users · Page {page} of {totalPages}
          </p>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                {columns.map((col) => (
                  <th
                    key={col.label}
                    onClick={() => col.sortable && col.key && toggleSort(col.key as SortField)}
                    className={cn(
                      "px-3 py-3 text-left font-semibold text-slate-600 whitespace-nowrap select-none",
                      col.sortable && "cursor-pointer hover:text-[#00C853] hover:bg-slate-200/50 transition-colors"
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && col.key && <SortIcon field={col.key as SortField} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    <Loader2 className="h-6 w-6 text-[#00C853] animate-spin mx-auto mb-2" />
                    <p className="text-slate-400 text-xs">Loading users…</p>
                  </td>
                </tr>
              )}
              {!loading && sortedRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    <User className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs">No users found matching your filters</p>
                  </td>
                </tr>
              )}
              {!loading && sortedRows.map((row, idx) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedUserId(row.id)}
                  className="border-b border-slate-100 hover:bg-[#00C853]/5 cursor-pointer transition-colors group"
                >
                  {/* Index */}
                  <td className="px-3 py-3 text-slate-400 font-mono">
                    {(page - 1) * pageSize + idx + 1}
                  </td>

                  {/* User */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C853] to-emerald-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                        {row.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-[#00C853] transition-colors">{row.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{row.id.slice(0, 8)}…</p>
                      </div>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="px-3 py-3">
                    <span className="text-slate-600">{row.teamName}</span>
                  </td>

                  {/* Role */}
                  <td className="px-3 py-3">
                    <Badge className={cn(
                      "text-[9px] font-semibold",
                      row.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    )}>{row.role}</Badge>
                  </td>

                  {/* Today Marketing */}
                  <td className="px-3 py-3">
                    <span className={cn(
                      "font-bold",
                      row.todayMarketingCount > 50 ? "text-emerald-600" :
                      row.todayMarketingCount > 0 ? "text-blue-600" : "text-slate-400"
                    )}>{row.todayMarketingCount}</span>
                  </td>

                  {/* Monthly Marketing */}
                  <td className="px-3 py-3">
                    <span className="font-semibold text-slate-700">{row.monthlyMarketingCount.toLocaleString()}</span>
                  </td>

                  {/* Assigned */}
                  <td className="px-3 py-3">
                    <span className="font-semibold text-amber-600">{row.assignedTasks}</span>
                  </td>

                  {/* Completed */}
                  <td className="px-3 py-3">
                    <span className="font-semibold text-emerald-600">{row.completedTasks}</span>
                  </td>

                  {/* Pending */}
                  <td className="px-3 py-3">
                    <span className={cn(
                      "font-semibold",
                      row.pendingTasks > 5 ? "text-red-600" : row.pendingTasks > 0 ? "text-orange-600" : "text-slate-400"
                    )}>{row.pendingTasks}</span>
                  </td>



                  {/* WhatsApp */}
                  <td className="px-3 py-3">
                    <WhatsAppBadge status={row.whatsAppStatus} score={row.whatsAppHealthScore} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-[10px] text-slate-500">
              {total} total users
            </p>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = i + 1;
                return (
                  <Button
                    key={pg}
                    size="sm"
                    variant="secondary"
                    onClick={() => setPage(pg)}
                    className={cn(
                      "h-7 w-7 p-0 text-xs",
                      page === pg && "bg-[#00C853] hover:bg-[#00C853]/90 text-white"
                    )}
                  >
                    {pg}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="text-xs text-slate-400">…</span>}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* User Detail Drawer */}
      {selectedUserId && (
        <UserDetailDrawer userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </div>
  );
}

export function AdminReports() {
  const [selectedTab, setSelectedTab] = useState("users");

  // Calculate totals and metrics
  const totalMetrics = useMemo(() => {
    const activeCampaigns = campaignReports.filter(c => c.status === "Active");
    const completedCampaigns = campaignReports.filter(c => c.status === "Completed");
    
    return {
      totalCampaigns: campaignReports.length,
      activeCampaigns: activeCampaigns.length,
      completedCampaigns: completedCampaigns.length,
      totalSent: campaignReports.reduce((sum, c) => sum + c.totalSent, 0),
      totalDelivered: campaignReports.reduce((sum, c) => sum + c.delivered, 0),
      totalReplies: campaignReports.reduce((sum, c) => sum + c.replied, 0),
      totalConversions: campaignReports.reduce((sum, c) => sum + c.converted, 0),
      totalBudget: campaignReports.reduce((sum, c) => sum + c.budget, 0),
      totalSpent: campaignReports.reduce((sum, c) => sum + c.spent, 0),
      avgDeliveryRate: campaignReports.reduce((sum, c) => sum + c.deliveryRate, 0) / campaignReports.length,
      avgOpenRate: campaignReports.reduce((sum, c) => sum + c.openRate, 0) / campaignReports.length,
      avgReplyRate: campaignReports.reduce((sum, c) => sum + c.replyRate, 0) / campaignReports.length,
      avgConversionRate: campaignReports.reduce((sum, c) => sum + c.conversionRate, 0) / campaignReports.length
    };
  }, []);

  const handleExport = (format: "PDF" | "Excel") => {
    // Export functionality
    console.log(`Exporting ${format} report...`);
    
    if (format === "PDF") {
      // Simulate PDF export
      alert('PDF report exported successfully!');
      // In a real app, you would call an API to generate and download PDF
      // Example: window.open('/api/reports/export?format=pdf', '_blank');
    } else if (format === "Excel") {
      // Simulate Excel export
      alert('Excel report exported successfully!');
      // In a real app, you would call an API to generate and download Excel
      // Example: window.open('/api/reports/export?format=excel', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white px-3 py-3 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-black flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#00C853]" />
            Reports & Analytics
          </h1>
          <p className="text-[10px] text-black mt-0.5 font-medium">
            Comprehensive performance insights and campaign analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleExport("PDF")} 
            variant="secondary" 
            size="sm" 
            className="h-7 text-[10px] px-2 font-semibold"
          >
            <Download className="h-3 w-3 mr-1" /> 
            PDF Report
          </Button>
          <Button 
            onClick={() => handleExport("Excel")} 
            className="h-7 text-[10px] px-2 gap-1 font-semibold bg-[#00C853] hover:bg-[#00C853]/90"
          >
            <Download className="h-3 w-3" />
            Excel Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Activity className="h-3.5 w-3.5 text-blue-600" />
              <p className="text-[9px] text-blue-600 font-medium">Total Campaigns</p>
            </div>
            <p className="text-xl font-bold text-blue-600">{totalMetrics.totalCampaigns}</p>
            <p className="text-[8px] text-black mt-0.5">{totalMetrics.activeCampaigns} active</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-[#00C853]" />
              <p className="text-[9px] text-emerald-600 font-medium">Messages Sent</p>
            </div>
            <p className="text-xl font-bold text-emerald-600">{formatNumber(totalMetrics.totalSent)}</p>
            <p className="text-[8px] text-black mt-0.5">{formatPercentage(totalMetrics.avgDeliveryRate)} delivered</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target className="h-3.5 w-3.5 text-orange-600" />
              <p className="text-[9px] text-orange-600 font-medium">Conversions</p>
            </div>
            <p className="text-xl font-bold text-orange-600">{formatNumber(totalMetrics.totalConversions)}</p>
            <p className="text-[8px] text-black mt-0.5">{formatPercentage(totalMetrics.avgConversionRate)} rate</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-600" />
              <p className="text-[9px] text-amber-600 font-medium">Budget Used</p>
            </div>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(totalMetrics.totalSpent)}</p>
            <p className="text-[8px] text-black mt-0.5">of {formatCurrency(totalMetrics.totalBudget)}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Users className="h-3.5 w-3.5 text-indigo-600" />
              <p className="text-[9px] text-indigo-600 font-medium">Team Members</p>
            </div>
            <p className="text-xl font-bold text-indigo-600">{userPerformance.length}</p>
            <p className="text-[8px] text-black mt-0.5">active users</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100/90 border border-slate-200/50 p-1 rounded-xl shadow-sm">
          <TabsTrigger
            value="users"
            className="flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-[#00C853] data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 hover:text-slate-900 data-[state=active]:hover:text-white"
          >
            <User className="h-3.5 w-3.5" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-[#00C853] data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 hover:text-slate-900 data-[state=active]:hover:text-white"
          >
            <Users className="h-3.5 w-3.5" />
            Team
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-[#00C853] data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 hover:text-slate-900 data-[state=active]:hover:text-white"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Performance Over Time Chart */}
            <Card className="border border-slate-200 shadow-lg bg-white overflow-hidden">
              <CardHeader className="pb-2 pt-3 px-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-bold text-black">Performance Trends</CardTitle>
                  <div className="flex items-center gap-2 text-[8px]">
                    <span className="flex items-center gap-1 text-black"><span className="h-1 w-1 rounded-full bg-[#00E676]" />Messages</span>
                    <span className="flex items-center gap-1 text-black"><span className="h-1 w-1 rounded-full bg-[#7C93FF]" />Replies</span>
                    <span className="flex items-center gap-1 text-black"><span className="h-1 w-1 rounded-full bg-[#FFB454]" />Conversions</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceOverTime} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="msgGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00E676" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="#00E676" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 6" stroke="rgba(0,0,0,0.1)" vertical={false} />
                      <XAxis dataKey="month" fontSize={9} stroke="rgba(0,0,0,0.6)" tickLine={false} axisLine={false} />
                      <YAxis yAxisId="left" fontSize={9} stroke="rgba(0,0,0,0.6)" tickLine={false} axisLine={false} width={30} />
                      <YAxis yAxisId="right" orientation="right" hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          fontSize: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        labelStyle={{ color: '#000', fontWeight: 600 }}
                        itemStyle={{ color: '#333' }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="messages"
                        stroke="#00E676"
                        strokeWidth={2}
                        fill="url(#msgGlow)"
                        dot={false}
                        activeDot={{ r: 3, fill: '#00E676', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="replies"
                        stroke="#7C93FF"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3, fill: '#7C93FF', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="conversions"
                        stroke="#FFB454"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 3, fill: '#FFB454', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Channel Distribution Chart */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-black">Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={88}
                        paddingAngle={4}
                        cornerRadius={6}
                        dataKey="value"
                        stroke="none"
                      >
                        {channelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '11px'
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={28}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span className="text-[10px] text-black font-medium">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: 28 }}>
                    <p className="text-2xl font-bold text-black">100%</p>
                    <p className="text-[9px] text-black font-medium">Total Volume</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Conversion Funnel */}
            <Card className="lg:col-span-2 border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-black">Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-2.5">
                  {conversionFunnel.map((stage, index) => {
                    const widthPct = Math.max((stage.count / conversionFunnel[0].count) * 100, 6);
                    const stageStyles = [
                      { bar: "from-slate-400 to-slate-500", text: "text-black", chip: "bg-slate-100 text-black" },
                      { bar: "from-emerald-400 to-emerald-500", text: "text-emerald-700", chip: "bg-emerald-100 text-emerald-700" },
                      { bar: "from-blue-400 to-blue-500", text: "text-blue-700", chip: "bg-blue-100 text-blue-700" },
                      { bar: "from-purple-400 to-purple-500", text: "text-purple-700", chip: "bg-purple-100 text-purple-700" },
                      { bar: "from-orange-400 to-orange-500", text: "text-orange-700", chip: "bg-orange-100 text-orange-700" },
                    ][index];
                    return (
                      <div key={stage.stage} className="flex items-center gap-3">
                        <span className="w-16 shrink-0 text-[10px] font-semibold text-black">{stage.stage}</span>
                        <div className="flex-1 h-8 bg-slate-50 rounded-lg overflow-hidden">
                          <div
                            className={cn("h-full rounded-lg bg-gradient-to-r flex items-center justify-end px-2.5 transition-all", stageStyles.bar)}
                            style={{ width: `${widthPct}%` }}
                          >
                            <span className="text-[10px] font-bold text-white whitespace-nowrap">{formatNumber(stage.count)}</span>
                          </div>
                        </div>
                        <span className={cn("w-12 shrink-0 text-right text-[10px] font-bold", stageStyles.text)}>
                          {formatPercentage(stage.percentage)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ROI Performance */}
            <Card className="border border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-black">ROI Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {roiData.map((c, index) => {
                  const maxRoi = Math.max(...roiData.map(r => r.roi));
                  const colors = ["#00C853", "#0ea5e9", "#8b5cf6"];
                  return (
                    <div key={c.campaign}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-black truncate pr-2">{c.campaign}</span>
                        <span className="text-xs font-bold shrink-0" style={{ color: colors[index] }}>{c.roi}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(c.roi / maxRoi) * 100}%`,
                            background: `linear-gradient(90deg, ${colors[index]}99, ${colors[index]})`
                          }}
                        />
                      </div>
                      <p className="text-[9px] text-black mt-1">{formatCurrency(c.spent)} spent → {formatCurrency(c.revenue)} revenue</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Performance Tab */}
        <TabsContent value="team" className="space-y-5">
          <div className="space-y-4">
            {userPerformance.map((user) => (
              <Card key={user.id} className="border border-slate-200/60 shadow-sm bg-white hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* User Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#00C853]/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-[#00C853]">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-black">{user.name}</h3>
                          <p className="text-[10px] text-black">{user.email}</p>
                          <Badge className={cn(
                            "text-[9px] font-semibold mt-1",
                            user.role === "Manager" && "bg-purple-100 text-purple-700",
                            user.role === "Marketer" && "bg-blue-100 text-blue-700",
                            user.role === "Specialist" && "bg-emerald-100 text-emerald-700"
                          )}>
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Metrics */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-black mb-2">Campaign Metrics</h4>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-[10px] text-black font-medium">Campaigns Managed</span>
                          <span className="text-xs font-bold text-black">{user.campaignsManaged}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-[10px] text-black font-medium">Messages Sent</span>
                          <span className="text-xs font-bold text-black">{formatNumber(user.totalSent)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <span className="text-[10px] text-purple-700 font-medium">Avg Reply Rate</span>
                          <span className="text-xs font-bold text-purple-700">{formatPercentage(user.avgReplyRate)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span className="text-[10px] text-orange-700 font-medium">Avg Conversion</span>
                          <span className="text-xs font-bold text-orange-700">{formatPercentage(user.avgConversionRate)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Task Performance */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-black mb-2">Task Performance</h4>
                        <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                          <span className="text-[10px] text-emerald-700 font-medium">Completed</span>
                          <span className="text-xs font-bold text-emerald-700">{user.tasksCompleted}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="text-[10px] text-red-700 font-medium">Overdue</span>
                          <span className="text-xs font-bold text-red-700">{user.tasksOverdue}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-indigo-50 rounded">
                          <span className="text-[10px] text-indigo-700 font-medium">Efficiency</span>
                          <span className="text-xs font-bold text-indigo-700">{formatPercentage(user.efficiency)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-[10px] text-black font-medium">Last Active</span>
                          <span className="text-xs font-bold text-black">{user.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="lg:col-span-1">
                      <div className="text-center p-4 bg-gradient-to-br from-[#00C853]/10 to-[#00C853]/5 rounded-lg">
                        <div className="mb-3">
                          <div className={cn(
                            "w-16 h-16 rounded-full border-4 border-[#00C853]/20 flex items-center justify-center mx-auto mb-2",
                            user.efficiency >= 95 && "border-[#00C853]",
                            user.efficiency >= 90 && user.efficiency < 95 && "border-blue-500",
                            user.efficiency < 90 && "border-amber-500"
                          )}>
                            <span className={cn(
                              "text-lg font-bold",
                              user.efficiency >= 95 && "text-[#00C853]",
                              user.efficiency >= 90 && user.efficiency < 95 && "text-blue-600",
                              user.efficiency < 90 && "text-amber-600"
                            )}>
                              {Math.round(user.efficiency)}
                            </span>
                          </div>
                          <p className="text-[10px] text-black font-medium">Overall Score</p>
                        </div>
                        <Badge className={cn(
                          "text-[9px] font-semibold",
                          user.efficiency >= 95 && "bg-[#00C853]/20 text-[#00C853]",
                          user.efficiency >= 90 && user.efficiency < 95 && "bg-blue-100 text-blue-700",
                          user.efficiency < 90 && "bg-amber-100 text-amber-700"
                        )}>
                          {user.efficiency >= 95 ? "Excellent" : 
                           user.efficiency >= 90 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Users Tab ── */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-[#00C853]" />
                User Performance Report
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Individual user data — click any row to view complete history</p>
            </div>
          </div>
          <UsersReportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}