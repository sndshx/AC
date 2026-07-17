import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/db";
import { requireAdmin } from "@/lib/shared/auth";

// Helper to format "time ago"
function formatTimeAgo(date: Date | null): string {
  if (!date) return "never";
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// Helper to get relative due date string
function formatDueDate(date: Date | null): string {
  if (!date) return "no due date";
  const now = new Date();
  const target = new Date(date);
  
  // Normalize both to start of day for accurate day diff
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  
  const diffMs = targetStart.getTime() - nowStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

// Hour bucket helper for pattern
function getHourBucket(date: Date): string {
  const h = new Date(date).getHours();
  if (h >= 23 || h < 2) return "12am";
  if (h >= 2 && h < 5) return "3am";
  if (h >= 5 && h < 8) return "6am";
  if (h >= 8 && h < 11) return "9am";
  if (h >= 11 && h < 14) return "12pm";
  if (h >= 14 && h < 17) return "3pm";
  if (h >= 17 && h < 20) return "6pm";
  return "9pm";
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const now = new Date();
    
    // 1. Setup date ranges
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const startOf7DaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOf14DaysAgo = new Date(startOfToday.getTime() - 14 * 24 * 60 * 60 * 1000);

    // 2. Fetch User Metrics
    const totalTeamMembers = await prisma.user.count();
    const newUsersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: startOfMonth } },
    });
    const newUsersLastMonth = await prisma.user.count({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
    });
    
    let totalTeamMembersTrend = "";
    if (newUsersLastMonth === 0) {
      totalTeamMembersTrend = newUsersThisMonth > 0 ? `+${newUsersThisMonth} new this month` : "0 new this month";
    } else {
      const pct = Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100);
      totalTeamMembersTrend = `${pct >= 0 ? "+" : ""}${pct}% vs last month`;
    }

    // 3. Fetch WhatsApp Account Metrics
    const waAccounts = await prisma.whatsAppAccount.findMany({
      include: {
        user: { select: { fullName: true } },
      },
      orderBy: { monthlyMessages: "desc" },
    });

    const whatsappMessagesMonthly = waAccounts.reduce((sum, a) => sum + a.monthlyMessages, 0);
    const whatsappMessagesDaily = waAccounts.reduce((sum, a) => sum + a.dailyMessages, 0);
    
    const topAccount = waAccounts[0] ?? null;
    const whatsappTopContributor = topAccount
      ? {
          name: topAccount.label || topAccount.user?.fullName || topAccount.phoneNumber,
          phone: topAccount.phoneNumber,
          count: topAccount.monthlyMessages,
        }
      : null;

    // 4. Fetch Campaign Replies Metrics
    const allActivities = await prisma.activity.findMany();
    const campaignReplies = allActivities.reduce((sum, a) => sum + a.successfulReplies, 0);
    const totalDailyMessagesSent = allActivities.reduce((sum, a) => sum + a.dailyMessagesSent, 0);
    const replyRate = totalDailyMessagesSent > 0 ? Math.round((campaignReplies / totalDailyMessagesSent) * 100) : 0;
    const campaignRepliesSub = `${replyRate}% conversion • ${campaignReplies} qualified leads`;

    // Replies trend (last 7 days vs previous 7 days)
    const repliesThisWeekAct = await prisma.activity.aggregate({
      where: { date: { gte: startOf7DaysAgo } },
      _sum: { successfulReplies: true },
    });
    const repliesLastWeekAct = await prisma.activity.aggregate({
      where: { date: { gte: startOf14DaysAgo, lt: startOf7DaysAgo } },
      _sum: { successfulReplies: true },
    });
    const repliesThisWeek = repliesThisWeekAct._sum.successfulReplies ?? 0;
    const repliesLastWeek = repliesLastWeekAct._sum.successfulReplies ?? 0;
    const repliesDiff = repliesThisWeek - repliesLastWeek;
    const campaignRepliesTrend = `${repliesDiff >= 0 ? "+" : ""}${repliesDiff} vs last week`;

    // 5. Fetch Marketing Tasks Metrics
    const totalTasks = await prisma.marketingTask.count();
    const completedTasks = await prisma.marketingTask.count({ where: { status: "COMPLETED" } });
    const inProgressTasks = await prisma.marketingTask.count({ where: { status: "IN_PROGRESS" } });
    const todoTasks = await prisma.marketingTask.count({ where: { status: "TODO" } });
    const blockedTasks = await prisma.marketingTask.count({ where: { status: "BLOCKED" } });
    
    const completedTasksToday = await prisma.marketingTask.count({
      where: {
        status: "COMPLETED",
        completedAt: { gte: startOfToday },
      },
    });

    const marketingTasksSub = `${completedTasks} completed • ${inProgressTasks} in progress • ${todoTasks + blockedTasks} pending`;
    const marketingTasksTrend = `+${completedTasksToday} completed today`;

    // 6. Weekly Campaign Performance Chart (Last 7 Days)
    const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyActivities = await prisma.activity.findMany({
      where: { date: { gte: startOf7DaysAgo } },
    });

    const weeklyCampaignPerformance = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOf7DaysAgo.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      const dayName = daysShort[date.getDay()];
      
      const dayActivities = weeklyActivities.filter((a) => {
        const d = new Date(a.date);
        return (
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
        );
      });

      const messages = dayActivities.reduce((sum, a) => sum + a.dailyMessagesSent, 0);
      const replies = dayActivities.reduce((sum, a) => sum + a.successfulReplies, 0);

      return { day: dayName, messages, replies };
    });

    // 7. Team Composition & Role Distribution
    const allUsers = await prisma.user.findMany({
      include: { teamMemberships: true },
    });

    let adminsCount = 0;
    let managersCount = 0;
    let marketersCount = 0;

    for (const u of allUsers) {
      if (u.role === "ADMIN") {
        adminsCount++;
      } else {
        const isManager =
          u.teamName?.toLowerCase().includes("manager") ||
          u.teamName?.toLowerCase().includes("lead") ||
          u.teamMemberships.some(
            (m) =>
              m.role.toLowerCase() === "manager" ||
              m.role.toLowerCase() === "leader"
          );
        if (isManager) {
          managersCount++;
        } else {
          marketersCount++;
        }
      }
    }

    const teamRoleDistribution = [
      { name: "Marketers", value: marketersCount, color: "#00C853" },
      { name: "Managers", value: managersCount, color: "#143D2C" },
      { name: "Admins", value: adminsCount, color: "#3B82F6" },
    ];

    // 8. Task Statuses Details
    const taskStatuses = [
      {
        label: "Completed",
        count: completedTasks,
        pct: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        color: "#00C853",
      },
      {
        label: "In Progress",
        count: inProgressTasks,
        pct: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0,
        color: "#3B82F6",
      },
      {
        label: "Todo",
        count: todoTasks + blockedTasks,
        pct: totalTasks > 0 ? Math.round(((todoTasks + blockedTasks) / totalTasks) * 100) : 0,
        color: "#94a3b8",
      },
    ];

    // 9. WhatsApp Health Stats (Top Accounts List)
    const whatsappHealthStats = await Promise.all(
      waAccounts.slice(0, 5).map(async (acc) => {
        const userAct = await prisma.activity.findMany({
          where: { userId: acc.userId },
        });
        const replies = userAct.reduce((sum, a) => sum + a.successfulReplies, 0);
        const rate =
          userAct.reduce((sum, a) => sum + a.dailyMessagesSent, 0) > 0
            ? Number(
                (
                  (replies / userAct.reduce((sum, a) => sum + a.dailyMessagesSent, 0)) *
                  100
                ).toFixed(1)
              )
            : 0;

        return {
          user: acc.label || acc.user?.fullName || acc.phoneNumber,
          status: acc.status,
          health: acc.healthScore,
          messages: acc.monthlyMessages,
          replies,
          rate,
        };
      })
    );

    // 10. Active Team Members (Recent logins or creations)
    const recentActiveUsers = allUsers
      .map((u) => ({
        name: u.fullName,
        email: u.email,
        role: u.role,
        status: u.status,
        lastActive: formatTimeAgo(u.lastLoginAt || u.createdAt),
        rawLastActive: u.lastLoginAt || u.createdAt,
      }))
      .sort((a, b) => new Date(b.rawLastActive).getTime() - new Date(a.rawLastActive).getTime())
      .slice(0, 5);

    // 11. Recent Tasks
    const dbRecentTasks = await prisma.marketingTask.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        assignedTo: { select: { fullName: true } },
      },
    });

    const recentTasks = dbRecentTasks.map((t) => ({
      title: t.title,
      assignee: t.assignedTo?.fullName || "Unassigned",
      priority: t.priority,
      status: t.status,
      dueDate: formatDueDate(t.dueDate),
    }));

    // 12. Hourly Activity Pattern (Bucketed Chat Messages over the last 24h)
    const messages24h = await prisma.chatMessage.findMany({
      where: {
        sentAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
    });

    const hourBuckets: Record<string, number> = {
      "12am": 0,
      "3am": 0,
      "6am": 0,
      "9am": 0,
      "12pm": 0,
      "3pm": 0,
      "6pm": 0,
      "9pm": 0,
    };

    messages24h.forEach((m) => {
      const bucket = getHourBucket(m.sentAt);
      hourBuckets[bucket] = (hourBuckets[bucket] || 0) + 1;
    });

    const hourlyActivityData = [
      { hour: "12am", activity: hourBuckets["12am"] },
      { hour: "3am", activity: hourBuckets["3am"] },
      { hour: "6am", activity: hourBuckets["6am"] },
      { hour: "9am", activity: hourBuckets["9am"] },
      { hour: "12pm", activity: hourBuckets["12pm"] },
      { hour: "3pm", activity: hourBuckets["3pm"] },
      { hour: "6pm", activity: hourBuckets["6pm"] },
      { hour: "9pm", activity: hourBuckets["9pm"] },
    ];

    // 13. Top Performers (Sorted by reply rate)
    const topPerformers = [...whatsappHealthStats]
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3);

    // 14. Campaign Statistics Card
    const avgScoreAct = await prisma.activity.aggregate({
      _avg: { performanceScore: true },
    });
    
    const campaignStats = {
      activeCampaigns: inProgressTasks,
      avgOpenRate: Math.round(avgScoreAct._avg.performanceScore ?? 72),
      conversionRate: replyRate,
    };

    return NextResponse.json({
      success: true,
      totalTeamMembers,
      totalTeamMembersTrend,
      whatsappMessagesMonthly,
      whatsappMessagesDaily,
      whatsappTopContributor,
      campaignReplies,
      campaignRepliesTrend,
      campaignRepliesSub,
      marketingTasks: totalTasks,
      marketingTasksSub,
      marketingTasksTrend,
      weeklyCampaignPerformance,
      teamRoleDistribution,
      taskStatuses,
      whatsappHealthStats,
      recentActiveUsers,
      recentTasks,
      hourlyActivityData,
      topPerformers,
      campaignStats,
    });
  } catch (err: any) {
    console.error("Error in admin dashboard-stats route:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
