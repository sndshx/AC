import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/db";
import { requireAdmin } from "@/lib/shared/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim() || "";
  const teamFilter = searchParams.get("team") || "all";
  const roleFilter = searchParams.get("role") || "all";
  const whatsAppFilter = searchParams.get("whatsAppStatus") || "all";
  const sortBy = searchParams.get("sortBy") || "fullName";
  const sortDir = (searchParams.get("sortDir") || "asc") as "asc" | "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(50, Math.max(5, parseInt(searchParams.get("pageSize") || "10")));

  // Build where clause
  const where: Record<string, unknown> = {
    AND: [
      search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { teamName: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      teamFilter !== "all" ? { teamName: teamFilter } : {},
      roleFilter === "ADMIN" || roleFilter === "USER" ? { role: roleFilter } : {},
      whatsAppFilter !== "all"
        ? { whatsAppStatus: { status: whatsAppFilter } }
        : {},
    ],
  };

  // Today boundaries
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: (() => {
        // For computed fields, fall back to fullName sort since Prisma can't sort by aggregates
        const directSorts: Record<string, Record<string, string>> = {
          fullName: { fullName: sortDir },
          teamName: { teamName: sortDir },
          role: { role: sortDir },
          createdAt: { createdAt: sortDir },
        };
        return directSorts[sortBy] ?? { fullName: "asc" };
      })(),
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        teamName: true,
        createdAt: true,
        lastLoginAt: true,
        whatsAppStatus: {
          select: {
            status: true,
            healthScore: true,
            dailyMessages: true,
            monthlyMessages: true,
          },
        },
        aiProgress: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            aiScore: true,
            productivityScore: true,
            period: true,
          },
        },
        assignedTasks: {
          select: {
            id: true,
            status: true,
          },
        },
        activityLogs: {
          where: { date: { gte: todayStart } },
          select: { messageCount: true },
        },
      },
    }),
  ]);

  // Transform into enriched user report rows
  const rows = users.map((u) => {
    const assignedCount = u.assignedTasks.length;
    const completedCount = u.assignedTasks.filter((t) => t.status === "COMPLETED").length;
    const pendingCount = u.assignedTasks.filter(
      (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
    ).length;

    const todayMarketing =
      u.whatsAppStatus?.dailyMessages ??
      u.activityLogs.reduce((s, l) => s + l.messageCount, 0);

    const monthlyMarketing = u.whatsAppStatus?.monthlyMessages ?? 0;
    const aiScore = u.aiProgress[0]?.aiScore ?? 0;

    return {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      status: u.status,
      teamName: u.teamName ?? "—",
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      todayMarketingCount: todayMarketing,
      monthlyMarketingCount: monthlyMarketing,
      assignedTasks: assignedCount,
      completedTasks: completedCount,
      pendingTasks: pendingCount,
      aiScore: parseFloat(aiScore.toFixed(1)),
      whatsAppStatus: u.whatsAppStatus?.status ?? null,
      whatsAppHealthScore: u.whatsAppStatus?.healthScore ?? null,
    };
  });

  // Get distinct teams for filter options
  const teams = await prisma.user.findMany({
    where: { teamName: { not: null } },
    select: { teamName: true },
    distinct: ["teamName"],
  });

  return NextResponse.json({
    rows,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    teams: teams.map((t) => t.teamName).filter(Boolean) as string[],
  });
}
