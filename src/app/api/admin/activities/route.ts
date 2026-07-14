import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/shared/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const dateRange = searchParams.get("dateRange") || "today";
    const limit = parseInt(searchParams.get("limit") || "100");

    // Calculate date filter
    const now = new Date();
    let startDate: Date | undefined;
    
    switch (dateRange) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = new Date(yesterday.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "all":
        startDate = undefined;
        break;
    }

    const where: any = {};
    
    if (userId && userId !== "all") {
      where.actorId = userId;
    }
    
    if (startDate) {
      where.createdAt = {
        gte: startDate,
      };
    }

    // Fetch audit logs (all user actions)
    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activities" },
      { status: 500 }
    );
  }
}
