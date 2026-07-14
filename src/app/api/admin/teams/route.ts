import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Get all teams
export async function GET(req: NextRequest) {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch teams",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new team
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, memberIds } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Team name is required",
        },
        { status: 400 }
      );
    }

    // Create team with members
    const team = await prisma.team.create({
      data: {
        name,
        description,
        members: memberIds
          ? {
              create: memberIds.map((userId: string) => ({
                userId,
                role: "member",
              })),
            }
          : undefined,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error: any) {
    console.error("Error creating team:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Team name already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create team",
      },
      { status: 500 }
    );
  }
}
