import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single task details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;

    const task = await prisma.marketingTask.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
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
            email: true,
          },
        },
        progressUpdates: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        submissions: {
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PATCH - Update task status (start, complete, block)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const body = await request.json();
    const { status, userId, submissionNote, submittedFiles, submittedAt } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["TODO", "IN_PROGRESS", "COMPLETED", "BLOCKED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update task
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    // If completing task, set completedAt and submission data
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
      if (submissionNote) {
        updateData.submissionNote = submissionNote;
      }
      if (submittedFiles && submittedFiles.length > 0) {
        updateData.submittedFiles = submittedFiles;
      }
      if (submittedAt) {
        updateData.submittedAt = new Date(submittedAt);
      }
    }

    const task = await prisma.marketingTask.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
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

    // Create progress update if userId provided
    if (userId) {
      await prisma.taskProgress.create({
        data: {
          taskId,
          userId,
          status,
          progress: status === "COMPLETED" ? 100 : status === "IN_PROGRESS" ? 50 : 0,
          comment: submissionNote || null,
        },
      });
    }

    // Create notification for admin/creator
    if (status === "COMPLETED") {
      await prisma.notification.create({
        data: {
          userId: task.createdById,
          type: "TASK_COMPLETED",
          title: "Task Completed",
          message: `Task "${task.title}" has been completed${submissionNote ? `: ${submissionNote}` : ""}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: `Task ${status === "COMPLETED" ? "completed" : status === "IN_PROGRESS" ? "started" : "updated"} successfully`,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    );
  }
}
