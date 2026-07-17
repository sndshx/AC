import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/db";
import { requireAdmin } from "@/lib/shared/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  // Get today normalized to start of day
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Get start of current month normalized to start of day
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      whatsAppAccounts: {
        select: {
          id: true,
          phoneNumber: true,
          label: true,
          status: true,
          healthScore: true,
          dailyMessages: true,
          monthlyMessages: true,
          lastActivityAt: true,
          createdAt: true,
        },
      },
      aiProgress: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
      activities: {
        orderBy: { date: "desc" },
        take: 30,
      },
      activityLogs: {
        orderBy: { date: "desc" },
        take: 30,
        include: {
          whatsAppAccount: {
            select: {
              id: true,
              label: true,
              phoneNumber: true,
            }
          }
        }
      },
      assignedTasks: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          completedAt: true,
          createdAt: true,
          category: true,
          description: true,
        },
      },
      receivedRemarks: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          createdBy: {
            select: { fullName: true, role: true },
          },
        },
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  // Fetch all activity logs of the current month to calculate real counts
  const thisMonthLogs = await prisma.activityLog.findMany({
    where: {
      userId: id,
      date: {
        gte: startOfMonth,
      },
    },
  });

  const todayMessages = thisMonthLogs
    .filter((log) => new Date(log.date).getTime() === startOfToday.getTime())
    .reduce((sum, log) => sum + log.messageCount, 0);

  const monthlyMessages = thisMonthLogs.reduce((sum, log) => sum + log.messageCount, 0);

  const { passwordHash, ...safeUser } = user;
  void passwordHash;

  // Compute summary stats
  const totalAssigned = user.assignedTasks.length;
  const totalCompleted = user.assignedTasks.filter((t) => t.status === "COMPLETED").length;
  const totalPending = user.assignedTasks.filter(
    (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
  ).length;
  const latestAiScore = user.aiProgress[0]?.aiScore ?? 0;

  // Build activity chart data (last 30 days from activityLogs)
  const chartData = user.activityLogs.map((log) => ({
    date: log.date,
    messageCount: log.messageCount,
    remarks: log.remarks,
  }));

  // Sort WhatsApp accounts: BANNED first → WARNING → LIMITED → ACTIVE, then by lastActivityAt desc
  const statusPriority = { BANNED: 4, LIMITED: 3, WARNING: 2, ACTIVE: 1 } as const;
  const sortedWaAccounts = [...user.whatsAppAccounts].sort((a, b) => {
    const pa = statusPriority[a.status as keyof typeof statusPriority] ?? 0;
    const pb = statusPriority[b.status as keyof typeof statusPriority] ?? 0;
    if (pb !== pa) return pb - pa; // higher priority (worse status) first
    // Within same status: most recently active first
    const ta = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
    const tb = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
    return tb - ta;
  });

  const worstWaStatus = sortedWaAccounts.length > 0 ? sortedWaAccounts[0].status : null;
  const avgWaHealthScore = sortedWaAccounts.length > 0
    ? Math.round(sortedWaAccounts.reduce((sum, acc) => sum + acc.healthScore, 0) / sortedWaAccounts.length)
    : null;

  return NextResponse.json({
    user: { ...safeUser, whatsAppAccounts: sortedWaAccounts },
    summary: {
      totalAssigned,
      totalCompleted,
      totalPending,
      latestAiScore: parseFloat(latestAiScore.toFixed(1)),
      todayMessages,
      monthlyMessages,
      whatsAppHealth: worstWaStatus,
      whatsAppHealthScore: avgWaHealthScore,
      completionRate: totalAssigned > 0 ? parseFloat(((totalCompleted / totalAssigned) * 100).toFixed(1)) : 0,
    },
    chartData,
  });
}
