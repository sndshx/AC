import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Return full submission history for a task, including SubmissionFile records
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;

    const submissions = await prisma.taskSubmission.findMany({
      where: { taskId },
      orderBy: { submittedAt: "desc" },
      include: {
        files: {
          orderBy: { uploadedAt: "asc" },
        },
      },
    });

    // Enrich each submission with submitter info
    const userIds = [...new Set(submissions.map((s) => s.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, email: true, avatarUrl: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const enriched = submissions.map((s) => ({
      ...s,
      user: userMap[s.userId] || null,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
