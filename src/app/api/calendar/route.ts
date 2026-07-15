import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.calendarEvent.findMany({
    where:
      session.role === "ADMIN"
        ? {} // Admin sees all events
        : {
            OR: [
              { assignedToId: session.id },
              { createdById: session.id },
            ],
          },
    include: {
      assignedTo: { select: { fullName: true } },
      createdBy: { select: { fullName: true } },
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json({ events });
}
