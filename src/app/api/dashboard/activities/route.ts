import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";
import { formatDistanceToNow } from "date-fns";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "ADMIN") {
    // Admin - get recent activities from all users
    const [recentTasks, recentActivities, notifications] = await Promise.all([
      // Recent task completions
      prisma.marketingTask.findMany({
        where: {
          OR: [
            { status: "COMPLETED" },
            { status: "IN_PROGRESS" },
            { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // Last 24 hours
          ]
        },
        include: {
          assignedTo: { select: { fullName: true } },
          createdBy: { select: { fullName: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      }),

      // Recent user activities
      prisma.activity.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 6 * 60 * 60 * 1000) } // Last 6 hours
        },
        include: {
          user: { select: { fullName: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      }),

      // Recent notifications
      prisma.notification.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 12 * 60 * 60 * 1000) } // Last 12 hours
        },
        include: {
          user: { select: { fullName: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Format activities
    const formattedActivities = [];

    // Add task activities
    for (const task of recentTasks) {
      const timeAgo = formatDistanceToNow(task.updatedAt, { addSuffix: true });
      let action = "";
      let type: "success" | "warning" | "info" = "info";

      if (task.status === "COMPLETED") {
        action = "Completed task";
        type = "success";
      } else if (task.status === "IN_PROGRESS") {
        action = "Started working on task";
        type = "info";
      } else {
        action = "New task assigned";
        type = "info";
      }

      formattedActivities.push({
        user: task.assignedTo.fullName,
        action: `${action}: ${task.title}`,
        time: timeAgo,
        type
      });
    }

    // Add user activities
    for (const activity of recentActivities) {
      const timeAgo = formatDistanceToNow(activity.updatedAt, { addSuffix: true });
      let action = "";
      let type: "success" | "warning" | "info" = "info";

      if (activity.dailyMessagesSent > activity.dailyTarget * 0.9) {
        action = `Achieved daily target (${activity.dailyMessagesSent} messages)`;
        type = "success";
      } else if (activity.successRate < 50) {
        action = "Low success rate detected";
        type = "warning";
      } else {
        action = `Updated activity (${activity.dailyMessagesSent} messages sent)`;
        type = "info";
      }

      formattedActivities.push({
        user: activity.user.fullName,
        action,
        time: timeAgo,
        type
      });
    }

    // Add notifications
    for (const notification of notifications) {
      const timeAgo = formatDistanceToNow(notification.createdAt, { addSuffix: true });
      let type: "success" | "warning" | "info" = "info";

      if (notification.type === "WHATSAPP_WARNING" || notification.type === "WHATSAPP_BAN") {
        type = "warning";
      } else if (notification.type === "TASK_COMPLETED") {
        type = "success";
      }

      formattedActivities.push({
        user: notification.user.fullName,
        action: notification.message,
        time: timeAgo,
        type
      });
    }

    // Sort by most recent and take top 10
    formattedActivities.sort((a, b) => {
      // Simple sort by checking if "ago" is present and extracting time
      const getTimeValue = (timeStr: string) => {
        const parts = timeStr.split(' ');
        const num = parseInt(parts[0]) || 0;
        if (timeStr.includes('minute')) return num;
        if (timeStr.includes('hour')) return num * 60;
        if (timeStr.includes('day')) return num * 1440;
        return num;
      };
      
      return getTimeValue(a.time) - getTimeValue(b.time);
    });

    return NextResponse.json({
      activities: formattedActivities.slice(0, 10)
    });

  } else {
    // User - get personal activities
    const [userTasks, userActivities, userNotifications] = await Promise.all([
      // User's recent tasks
      prisma.marketingTask.findMany({
        where: {
          assignedToId: session.id
        },
        include: {
          createdBy: { select: { fullName: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: 5
      }),

      // User's recent activities
      prisma.activity.findMany({
        where: {
          userId: session.id
        },
        orderBy: { updatedAt: 'desc' },
        take: 5
      }),

      // User's notifications
      prisma.notification.findMany({
        where: {
          userId: session.id
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      })
    ]);

    const formattedActivities = [];

    // Add task activities
    for (const task of userTasks) {
      const timeAgo = formatDistanceToNow(task.updatedAt, { addSuffix: true });
      let action = "";
      let type: "success" | "warning" | "info" = "info";

      if (task.status === "COMPLETED") {
        action = "Completed task";
        type = "success";
      } else if (task.status === "IN_PROGRESS") {
        action = "Working on task";
        type = "info";
      } else if (task.dueDate && task.dueDate < new Date()) {
        action = "Task overdue";
        type = "warning";
      } else {
        action = "Task assigned";
        type = "info";
      }

      formattedActivities.push({
        user: "You",
        action: `${action}: ${task.title}`,
        time: timeAgo,
        type
      });
    }

    // Add personal activities
    for (const activity of userActivities) {
      const timeAgo = formatDistanceToNow(activity.updatedAt, { addSuffix: true });
      let action = "";
      let type: "success" | "warning" | "info" = "success";

      if (activity.dailyMessagesSent >= activity.dailyTarget) {
        action = `Daily target achieved (${activity.dailyMessagesSent}/${activity.dailyTarget})`;
      } else {
        action = `Progress update (${activity.dailyMessagesSent}/${activity.dailyTarget})`;
        type = "info";
      }

      formattedActivities.push({
        user: "You",
        action,
        time: timeAgo,
        type
      });
    }

    // Add notifications
    for (const notification of userNotifications) {
      const timeAgo = formatDistanceToNow(notification.createdAt, { addSuffix: true });
      let type: "success" | "warning" | "info" = "info";

      if (notification.type === "WHATSAPP_WARNING" || notification.type === "WHATSAPP_BAN") {
        type = "warning";
      } else if (notification.type === "TASK_COMPLETED" || notification.type === "AI_RECOMMENDATION") {
        type = "success";
      }

      formattedActivities.push({
        user: "System",
        action: notification.message,
        time: timeAgo,
        type
      });
    }

    // Sort and limit
    formattedActivities.sort((a, b) => {
      const getTimeValue = (timeStr: string) => {
        const parts = timeStr.split(' ');
        const num = parseInt(parts[0]) || 0;
        if (timeStr.includes('minute')) return num;
        if (timeStr.includes('hour')) return num * 60;
        if (timeStr.includes('day')) return num * 1440;
        return num;
      };
      
      return getTimeValue(a.time) - getTimeValue(b.time);
    });

    return NextResponse.json({
      activities: formattedActivities.slice(0, 8)
    });
  }
}