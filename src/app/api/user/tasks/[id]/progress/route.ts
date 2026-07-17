import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Update task progress
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { userId, status, progress, comment } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { success: false, error: "userId and status are required" },
        { status: 400 }
      );
    }

    // Create progress update
    const progressUpdate = await prisma.taskProgress.create({
      data: {
        taskId: id,
        userId,
        status,
        progress: progress || 0,
        comment: comment || null,
      },
    });

    // If status is COMPLETED, update task
    if (status === "COMPLETED") {
      await prisma.marketingTask.update({
        where: { id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      // Create notification
      const task = await prisma.marketingTask.findUnique({
        where: { id },
        select: { title: true, createdById: true },
      });

      if (task) {
        await prisma.notification.create({
          data: {
            userId: task.createdById,
            type: "TASK_COMPLETED",
            title: "Task Completed",
            message: `Task "${task.title}" has been marked as completed`,
          },
        });
      }
    } else {
      // Update task status if not completed
      await prisma.marketingTask.update({
        where: { id },
        data: { status },
      });
    }

    return NextResponse.json({
      success: true,
      data: progressUpdate,
      message: "Progress updated successfully",
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
