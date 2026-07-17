import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

// PUT - Update a remark
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const remark = await prisma.remark.update({
      where: { id },
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
  } catch (err) {
    console.error("Error updating remark:", err);
    return NextResponse.json(
      { error: "Failed to update remark" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a remark
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.remark.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting remark:", err);
    return NextResponse.json(
      { error: "Failed to delete remark" },
      { status: 500 }
    );
  }
}
