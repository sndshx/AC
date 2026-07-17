import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

// GET - Fetch all remarks with user details
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
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
  } catch (err) {
    console.error("Error fetching remarks:", err);
    return NextResponse.json(
      { error: "Failed to fetch remarks" },
      { status: 500 }
    );
  }
}

// POST - Create a new remark
export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error || !session) return error;

  try {
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
        createdById: session.id,
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
  } catch (err) {
    console.error("Error creating remark:", err);
    return NextResponse.json(
      { error: "Failed to create remark" },
      { status: 500 }
    );
  }
}
