import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/prisma";

// GET - Fetch all remarks with user details
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const remarks = await prisma.remark.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            teamName: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(remarks);
  } catch (error) {
    console.error("Error fetching remarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch remarks" },
      { status: 500 }
    );
  }
}

// POST - Create a new remark
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { error: "User ID and content are required" },
        { status: 400 }
      );
    }

    const remark = await prisma.remark.create({
      data: {
        userId,
        content,
        createdById: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            teamName: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId,
        type: "ADMIN_REMARK",
        title: "New Admin Remark",
        message: `Admin added a remark: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
      },
    });

    return NextResponse.json(remark, { status: 201 });
  } catch (error) {
    console.error("Error creating remark:", error);
    return NextResponse.json(
      { error: "Failed to create remark" },
      { status: 500 }
    );
  }
}
