import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const userId = searchParams.get("userId");

    // Default to last 30 days if no dates provided
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    // Parse provided dates
    if (startDateParam) {
      startDate = new Date(startDateParam);
      startDate.setHours(0, 0, 0, 0);
    }

    if (endDateParam) {
      endDate = new Date(endDateParam);
      endDate.setHours(23, 59, 59, 999);
    }

    // Build where clause
    const whereClause: any = {
      date: {
        gte: startDate,
        lte: endDate
      }
    };

    if (userId) {
      whereClause.userId = userId;
    }

    // Fetch all activity logs in date range
    const activityLogs = await prisma.activityLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true
          }
        }
      },
      orderBy: [
        { date: "desc" },
        { messageCount: "desc" }
      ]
    });

    // Calculate summary statistics
    const totalMessages = activityLogs.reduce((sum, log) => sum + log.messageCount, 0);
    const uniqueUsers = new Set(activityLogs.map(log => log.userId)).size;
    const totalEntries = activityLogs.length;
    const averagePerEntry = totalEntries > 0 ? Math.round(totalMessages / totalEntries) : 0;

    // Group by date for timeline
    const dateGroups = activityLogs.reduce((acc, log) => {
      const dateKey = log.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          count: 0,
          totalMessages: 0,
          users: new Set()
        };
      }
      acc[dateKey].count += 1;
      acc[dateKey].totalMessages += log.messageCount;
      acc[dateKey].users.add(log.userId);
      return acc;
    }, {} as Record<string, any>);

    const timeline = Object.values(dateGroups).map((group: any) => ({
      date: group.date,
      entries: group.count,
      totalMessages: group.totalMessages,
      activeUsers: group.users.size
    }));

    // Group by user for rankings
    const userGroups = activityLogs.reduce((acc, log) => {
      if (!acc[log.userId]) {
        acc[log.userId] = {
          userId: log.userId,
          userName: log.user.fullName,
          userEmail: log.user.email,
          totalMessages: 0,
          totalEntries: 0,
          dates: []
        };
      }
      acc[log.userId].totalMessages += log.messageCount;
      acc[log.userId].totalEntries += 1;
      acc[log.userId].dates.push(log.date.toISOString().split('T')[0]);
      return acc;
    }, {} as Record<string, any>);

    const userRankings = Object.values(userGroups)
      .map((group: any) => ({
        ...group,
        averageMessages: Math.round(group.totalMessages / group.totalEntries)
      }))
      .sort((a: any, b: any) => b.totalMessages - a.totalMessages);

    return NextResponse.json({
      activityLogs,
      summary: {
        totalMessages,
        uniqueUsers,
        totalEntries,
        averagePerEntry,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dateRange: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      },
      timeline,
      userRankings
    });
  } catch (error) {
    console.error("Error fetching all activity logs:", error);
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 });
  }
}
