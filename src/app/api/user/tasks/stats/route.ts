import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch user's task statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    // Get user's teams
    const userTeams = await prisma.teamMember.findMany({
      where: { userId },
      select: { teamId: true },
    });

    const teamIds = userTeams.map((tm) => tm.teamId);

    // Build base query
    const baseWhere: any = {
      OR: [
        // Individually assigned tasks
        { assignmentType: "INDIVIDUAL", assignedToId: userId },
        // Team assigned tasks
        {
          assignmentType: "TEAM",
          assignedToTeamId: { in: teamIds },
        },
        // All users tasks
        { assignmentType: "ALL_USERS" },
      ],
    };

    // Get total tasks
    const total = await prisma.marketingTask.count({ where: baseWhere });

    // Get counts by status
    const todo = await prisma.marketingTask.count({
      where: { ...baseWhere, status: "TODO" },
    });

    const inProgress = await prisma.marketingTask.count({
      where: { ...baseWhere, status: "IN_PROGRESS" },
    });

    const completed = await prisma.marketingTask.count({
      where: { ...baseWhere, status: "COMPLETED" },
    });

    const blocked = await prisma.marketingTask.count({
      where: { ...baseWhere, status: "BLOCKED" },
    });

    // Get overdue tasks count
    const now = new Date();
    const overdue = await prisma.marketingTask.count({
      where: {
        ...baseWhere,
        status: { not: "COMPLETED" },
        dueDate: { lt: now },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        total,
        todo,
        inProgress,
        completed,
        blocked,
        overdue,
      },
    });
  } catch (error) {
    console.error("Error fetching user task stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch task statistics" },
      { status: 500 }
    );
  }
}
