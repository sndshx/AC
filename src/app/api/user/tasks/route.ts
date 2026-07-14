import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch user's tasks (individual, team, or all users)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

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

    // Build query
    const where: any = {
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

    if (status && status !== "all") {
      where.status = status;
    }

    const tasks = await prisma.marketingTask.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            fullName: true,
          },
        },
        assignedToTeam: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        progressUpdates: {
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
