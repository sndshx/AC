import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/prisma";

// PUT - Update a remark
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const remark = await prisma.remark.update({
      where: { id: params.id },
      data: { content },
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

    return NextResponse.json(remark);
  } catch (error) {
    console.error("Error updating remark:", error);
    return NextResponse.json(
      { error: "Failed to update remark" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a remark
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.remark.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting remark:", error);
    return NextResponse.json(
      { error: "Failed to delete remark" },
      { status: 500 }
    );
  }
}
