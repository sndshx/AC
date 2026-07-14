import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Get single team
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
                status: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          error: "Team not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team",
      },
      { status: 500 }
    );
  }
}

// PATCH - Update team
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, description, memberIds } = body;

    const team = await prisma.team.update({
      where: { id: params.id },
      data: {
        name,
        description,
        ...(memberIds && {
          members: {
            deleteMany: {},
            create: memberIds.map((userId: string) => ({
              userId,
              role: "member",
            })),
          },
        }),
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
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update team",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete team
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.team.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete team",
      },
      { status: 500 }
    );
  }
}
