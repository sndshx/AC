import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/db";
import { requireAdmin } from "@/lib/shared/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await context.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      whatsAppStatus: true,
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

  return NextResponse.json({
    user: safeUser,
    summary: {
      totalAssigned,
      totalCompleted,
      totalPending,
      latestAiScore: parseFloat(latestAiScore.toFixed(1)),
      todayMessages: user.whatsAppStatus?.dailyMessages ?? 0,
      monthlyMessages: user.whatsAppStatus?.monthlyMessages ?? 0,
      whatsAppHealth: user.whatsAppStatus?.status ?? null,
      whatsAppHealthScore: user.whatsAppStatus?.healthScore ?? null,
      completionRate: totalAssigned > 0 ? parseFloat(((totalCompleted / totalAssigned) * 100).toFixed(1)) : 0,
    },
    chartData,
  });
}
