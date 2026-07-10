import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/db";
import { createAuditLog, requireAdmin } from "@/lib/shared/auth";
import { updateUserSchema } from "@/lib/shared/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await context.params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { date: "desc" }, take: 30 },
      assignedTasks: { orderBy: { createdAt: "desc" }, take: 20 },
      calendarEvents: { orderBy: { startAt: "asc" }, take: 20 },
      receivedRemarks: { orderBy: { createdAt: "desc" }, take: 20 },
      aiProgress: { orderBy: { createdAt: "desc" }, take: 10 },
      whatsAppStatus: true,
      notifications: { orderBy: { createdAt: "desc" }, take: 20 }
    }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  return NextResponse.json({ user: safeUser });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { session, error } = await requireAdmin(request);
  if (error || !session) return error;

  const { id } = await context.params;
  const parsed = updateUserSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid user update." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      teamName: true,
      updatedAt: true
    }
  });

  await createAuditLog({
    actorId: session.id,
    action: "admin.user.update",
    entity: "User",
    entityId: id,
    metadata: parsed.data
  });

  return NextResponse.json({ user });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { session, error } = await requireAdmin(request);
  if (error || !session) return error;

  const { id } = await context.params;
  if (id === session.id) {
    return NextResponse.json({ error: "Admins cannot delete their own account." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  await createAuditLog({
    actorId: session.id,
    action: "admin.user.delete",
    entity: "User",
    entityId: id
  });

  return NextResponse.json({ ok: true });
}
