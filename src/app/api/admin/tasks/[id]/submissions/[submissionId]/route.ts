import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH - Admin reviews a specific submission: set status + adminRemark
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; submissionId: string }> }
) {
  try {
    const { id: taskId, submissionId } = await params;
    const body = await request.json();
    const { status, adminRemark, reviewedById } = body;

    const validStatuses = ["PENDING", "APPROVED", "NEEDS_REVISION", "REJECTED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Find the submission to make sure it belongs to this task
    const existing = await prisma.taskSubmission.findFirst({
      where: { id: submissionId, taskId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminRemark !== undefined) updateData.adminRemark = adminRemark;
    if (status && status !== "PENDING") {
      updateData.reviewedAt = new Date();
      if (reviewedById) updateData.reviewedById = reviewedById;
    }

    const updated = await prisma.taskSubmission.update({
      where: { id: submissionId },
      data: updateData,
    });

    // Notify the submitting user
    const statusLabels: Record<string, string> = {
      APPROVED: "approved ✅",
      NEEDS_REVISION: "marked as needing revision 🔄",
      REJECTED: "rejected ❌",
      PENDING: "set back to pending",
    };

    const task = await prisma.marketingTask.findUnique({
      where: { id: taskId },
      select: { title: true },
    });

    await prisma.notification.create({
      data: {
        userId: existing.userId,
        type: "SUBMISSION_REVIEWED",
        title: "Submission Reviewed",
        message: `Your submission for "${task?.title}" has been ${statusLabels[status] || status}.${adminRemark ? ` Admin note: ${adminRemark.slice(0, 100)}` : ""}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Submission reviewed successfully",
    });
  } catch (error) {
    console.error("Error reviewing submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to review submission" },
      { status: 500 }
    );
  }
}
