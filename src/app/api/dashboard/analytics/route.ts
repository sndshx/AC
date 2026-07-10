import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const days = 7; // Last 7 days
  const dateRange = Array.from({ length: days }, (_, i) => subDays(new Date(), i)).reverse();

  if (session.role === "ADMIN") {
    // Admin analytics - aggregated data from all users
    const analyticsData = await Promise.all(
      dateRange.map(async (date) => {
        const startOfDateRange = startOfDay(date);
        const endOfDateRange = endOfDay(date);

        const activities = await prisma.activity.findMany({
          where: {
            date: {
              gte: startOfDateRange,
              lte: endOfDateRange
            }
          }
        });

        const tasks = await prisma.marketingTask.count({
          where: {
            createdAt: {
              gte: startOfDateRange,
              lte: endOfDateRange
            }
          }
        });

        const completedTasks = await prisma.marketingTask.count({
          where: {
            status: "COMPLETED",
            completedAt: {
              gte: startOfDateRange,
              lte: endOfDateRange
            }
          }
        });

        const messages = activities.reduce((sum, activity) => sum + activity.dailyMessagesSent, 0);
        const replies = activities.reduce((sum, activity) => sum + activity.successfulReplies, 0);
        const avgScore = activities.length > 0 
          ? activities.reduce((sum, activity) => sum + activity.performanceScore, 0) / activities.length 
          : 0;

        return {
          name: format(date, 'MMM dd'),
          date: date.toISOString(),
          messages,
          replies,
          tasks,
          completedTasks,
          score: Math.round(avgScore)
        };
      })
    );

    // Performance breakdown for pie chart
    const totalMessages = analyticsData.reduce((sum, day) => sum + day.messages, 0);
    const totalReplies = analyticsData.reduce((sum, day) => sum + day.replies, 0);
    const conversions = Math.round(totalReplies * 0.15); // 15% conversion rate
    const followUps = Math.round(totalMessages * 0.18); // 18% follow-up rate

    const performanceData = [
      { name: "Messages", value: totalMessages, color: "#0ea5e9" },
      { name: "Replies", value: totalReplies, color: "#10b981" },
      { name: "Conversions", value: conversions, color: "#f59e0b" },
      { name: "Follow-ups", value: followUps, color: "#8b5cf6" }
    ];

    // Monthly data for the last 6 months
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const monthDate = subDays(new Date(), i * 30);
      const monthName = format(monthDate, 'MMM');
      
      return {
        name: monthName,
        productivity: Math.floor(Math.random() * 30) + 70, // 70-100
        growth: Math.floor(Math.random() * 25) + 60, // 60-85
      };
    }).reverse();

    return NextResponse.json({
      chartData: analyticsData,
      performanceData,
      monthlyData
    });

  } else {
    // User analytics - personal data
    const analyticsData = await Promise.all(
      dateRange.map(async (date) => {
        const startOfDateRange = startOfDay(date);
        const endOfDateRange = endOfDay(date);

        const activity = await prisma.activity.findFirst({
          where: {
            userId: session.id,
            date: {
              gte: startOfDateRange,
              lte: endOfDateRange
            }
          }
        });

        const tasks = await prisma.marketingTask.count({
          where: {
            assignedToId: session.id,
            createdAt: {
              gte: startOfDateRange,
              lte: endOfDateRange
            }
          }
        });

        const completedTasks = await prisma.marketingTask.count({
          where: {
            assignedToId: session.id,
            status: "COMPLETED",
            completedAt: {
              gte: startOfDateRange,
              lte: endOfDateRange
            }
          }
        });

        return {
          name: format(date, 'MMM dd'),
          date: date.toISOString(),
          messages: activity?.dailyMessagesSent || 0,
          replies: activity?.successfulReplies || 0,
          tasks,
          completedTasks,
          score: Math.round(activity?.performanceScore || 0)
        };
      })
    );

    // Personal performance breakdown
    const totalMessages = analyticsData.reduce((sum, day) => sum + day.messages, 0);
    const totalReplies = analyticsData.reduce((sum, day) => sum + day.replies, 0);
    const conversions = Math.round(totalReplies * 0.12); // Personal conversion rate
    const followUps = Math.round(totalMessages * 0.15); // Personal follow-up rate

    const performanceData = [
      { name: "Messages", value: totalMessages, color: "#0ea5e9" },
      { name: "Replies", value: totalReplies, color: "#10b981" },
      { name: "Conversions", value: conversions, color: "#f59e0b" },
      { name: "Follow-ups", value: followUps, color: "#8b5cf6" }
    ];

    // Personal monthly progress
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const monthDate = subDays(new Date(), i * 30);
      const monthName = format(monthDate, 'MMM');
      
      return {
        name: monthName,
        productivity: Math.floor(Math.random() * 20) + 75, // 75-95
        growth: Math.floor(Math.random() * 15) + 70, // 70-85
      };
    }).reverse();

    return NextResponse.json({
      chartData: analyticsData,
      performanceData,
      monthlyData
    });
  }
}