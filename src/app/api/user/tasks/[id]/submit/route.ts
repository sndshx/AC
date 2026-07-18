import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UploadedFileMetadata {
  url: string;
  name: string;
  fileSize?: number;
  mimeType?: string;
  publicId?: string;
  resourceType?: string;
}

// POST - Submit a task (creates a new TaskSubmission record + SubmissionFile records)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const body = await request.json();
    const { userId, workDescription, remarks, progress, fileUrls, files } = body as {
      userId: string;
      workDescription?: string;
      remarks?: string;
      progress?: number;
      fileUrls?: string[];
      files?: UploadedFileMetadata[];
    };

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    // Find the task
    const task = await prisma.marketingTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    // Resolve plain URL list (for legacy fileUrls field on MarketingTask)
    const plainUrls: string[] =
      files && files.length > 0
        ? files.map((f) => f.url)
        : fileUrls ?? [];

    // Create a new submission record (history-preserving)
    const submission = await prisma.taskSubmission.create({
      data: {
        taskId,
        userId,
        workDescription: workDescription?.trim() || null,
        remarks: remarks?.trim() || null,
        progress: Math.min(100, Math.max(0, progress || 0)),
        fileUrls: plainUrls,
        submittedAt: new Date(),
        status: "PENDING",
      },
    });

    // Create SubmissionFile records for rich metadata if provided
    if (files && files.length > 0) {
      await prisma.submissionFile.createMany({
        data: files.map((f) => {
          // Derive a safe filename from the URL if not explicitly provided
          const rawName = f.url.split("?")[0].split("/").pop() || f.url;
          return {
            submissionId: submission.id,
            fileName: rawName,
            originalName: f.name || rawName,
            mimeType: f.mimeType || "application/octet-stream",
            fileSize: f.fileSize ?? 0,
            fileUrl: f.url,
          };
        }),
      });
    }

    // Update the MarketingTask itself: mark as COMPLETED and update denormalised fields
    await prisma.marketingTask.update({
      where: { id: taskId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        submittedAt: new Date(),
        submissionNote: remarks?.trim() || workDescription?.trim() || null,
        // Append new files to the existing submittedFiles array (never overwrite)
        submittedFiles: {
          push: plainUrls,
        },
      },
    });

    // Create a progress log entry
    await prisma.taskProgress.create({
      data: {
        taskId,
        userId,
        status: "COMPLETED",
        progress: Math.min(100, Math.max(0, progress || 100)),
        comment: remarks?.trim() || workDescription?.trim() || null,
      },
    });

    // Notify the admin/creator
    await prisma.notification.create({
      data: {
        userId: task.createdById,
        type: "TASK_COMPLETED",
        title: "Task Submission Received",
        message: `Task "${task.title}" has been submitted for review${workDescription ? `: ${workDescription.slice(0, 80)}${workDescription.length > 80 ? "…" : ""}` : ""}.`,
      },
    });

    // Return submission with files
    const fullSubmission = await prisma.taskSubmission.findUnique({
      where: { id: submission.id },
      include: { files: true },
    });

    return NextResponse.json({
      success: true,
      data: fullSubmission,
      message: "Task submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit task" },
      { status: 500 }
    );
  }
}
