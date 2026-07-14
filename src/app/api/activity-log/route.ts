import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get today's date (normalized to start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activityLog = await prisma.activityLog.findUnique({
      where: {
        userId_date: {
          userId: session.id,
          date: today
        }
      }
    });

    return NextResponse.json({ activityLog });
  } catch (error) {
    console.error("Error fetching activity log:", error);
    return NextResponse.json({ error: "Failed to fetch activity log" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { messageCount, remarks } = body;

    // Validate messageCount
    if (typeof messageCount !== "number" || messageCount < 0) {
      return NextResponse.json({ error: "Invalid message count" }, { status: 400 });
    }

    // Get today's date (normalized to start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert the activity log
    const activityLog = await prisma.activityLog.upsert({
      where: {
        userId_date: {
          userId: session.id,
          date: today
        }
      },
      update: {
        messageCount,
        remarks: remarks || null,
        updatedAt: new Date()
      },
      create: {
        userId: session.id,
        date: today,
        messageCount,
        remarks: remarks || null
      }
    });

    return NextResponse.json({ activityLog }, { status: 200 });
  } catch (error) {
    console.error("Error saving activity log:", error);
    return NextResponse.json({ error: "Failed to save activity log" }, { status: 500 });
  }
}
