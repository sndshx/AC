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
    const userId = searchParams.get("userId");
    const daysParam = searchParams.get("days");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    let startDate: Date;
    let days: number;
    
    // Support "all" or specific number of days
    if (daysParam === 'all') {
      // Fetch all history - set a very early date
      startDate = new Date('2000-01-01');
      days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    } else {
      days = parseInt(daysParam || "7");
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);
    }

    // Fetch user's activity history
    const activityHistory = await prisma.activityLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    });

    // Calculate statistics
    const totalMessages = activityHistory.reduce((sum, log) => sum + log.messageCount, 0);
    const averageMessages = activityHistory.length > 0 
      ? Math.round(totalMessages / activityHistory.length) 
      : 0;
    const maxMessages = activityHistory.length > 0
      ? Math.max(...activityHistory.map(log => log.messageCount))
      : 0;
    const minMessages = activityHistory.length > 0
      ? Math.min(...activityHistory.map(log => log.messageCount))
      : 0;
    
    // Calculate consistency (percentage of days with logs)
    const consistency = daysParam === 'all' 
      ? 100 // For all time view, show 100% since we're showing all recorded days
      : Math.round((activityHistory.length / days) * 100);

    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(activityHistory.length / 2);
    const firstHalf = activityHistory.slice(0, midPoint);
    const secondHalf = activityHistory.slice(midPoint);
    
    const firstHalfAvg = firstHalf.length > 0
      ? firstHalf.reduce((sum, log) => sum + log.messageCount, 0) / firstHalf.length
      : 0;
    const secondHalfAvg = secondHalf.length > 0
      ? secondHalf.reduce((sum, log) => sum + log.messageCount, 0) / secondHalf.length
      : 0;
    
    const trendPercentage = firstHalfAvg > 0
      ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
      : 0;

    return NextResponse.json({
      activityHistory,
      statistics: {
        totalMessages,
        averageMessages,
        maxMessages,
        minMessages,
        consistency,
        trendPercentage,
        totalDays: daysParam === 'all' ? activityHistory.length : days,
        activeDays: activityHistory.length
      }
    });
  } catch (error) {
    console.error("Error fetching activity history:", error);
    return NextResponse.json({ error: "Failed to fetch activity history" }, { status: 500 });
  }
}
