import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";
import { taskSchema } from "@/lib/shared/validators";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.marketingTask.findMany({
    where: session.role === "ADMIN" ? {} : { assignedToId: session.id },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    include: {
      assignedTo: { select: { id: true, fullName: true, email: true } },
      createdBy: { select: { id: true, fullName: true, email: true } }
    },
    take: 100
  });

  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const parsed = taskSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid task." }, { status: 400 });
  }

  const task = await prisma.marketingTask.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      assignedToId: parsed.data.assignedToId,
      createdById: session.id,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined
    }
  });

  return NextResponse.json({ task }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing task ID or status" }, { status: 400 });
    }

    const task = await prisma.marketingTask.findUnique({
      where: { id }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (session.role !== "ADMIN" && task.assignedToId !== session.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updatedTask = await prisma.marketingTask.update({
      where: { id },
      data: { 
        status,
        completedAt: status === "COMPLETED" ? new Date() : null
      }
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

