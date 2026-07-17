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

    const { searchParams } = new URL(request.url);
    const whatsAppAccountId = searchParams.get("whatsAppAccountId") || null;

    const activityLog = await prisma.activityLog.findFirst({
      where: {
        userId: session.id,
        date: today,
        whatsAppAccountId: whatsAppAccountId || null
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
    const { messageCount, remarks, whatsAppAccountId, whatsAppAccountStatus } = body;

    // Validate messageCount
    if (typeof messageCount !== "number" || messageCount < 0) {
      return NextResponse.json({ error: "Invalid message count" }, { status: 400 });
    }

    if (whatsAppAccountId) {
      // Verify ownership before any update
      const account = await prisma.whatsAppAccount.findFirst({
        where: {
          id: whatsAppAccountId,
          userId: session.id
        }
      });
      if (!account) {
        return NextResponse.json({ error: "Invalid WhatsApp account" }, { status: 400 });
      }

      // If a status update was requested, apply it (only ACTIVE or BANNED allowed from this control)
      if (whatsAppAccountStatus === "ACTIVE" || whatsAppAccountStatus === "BANNED") {
        await prisma.whatsAppAccount.update({
          where: { id: whatsAppAccountId },
          data: { status: whatsAppAccountStatus }
        });
      }
    }

    // Get today's date (normalized to start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Look for an existing activity log for this user, date, and WhatsApp account
    const existingLog = await prisma.activityLog.findFirst({
      where: {
        userId: session.id,
        date: today,
        whatsAppAccountId: whatsAppAccountId || null
      }
    });

    let activityLog;
    if (existingLog) {
      activityLog = await prisma.activityLog.update({
        where: { id: existingLog.id },
        data: {
          messageCount,
          remarks: remarks || null,
          updatedAt: new Date()
        }
      });
    } else {
      activityLog = await prisma.activityLog.create({
        data: {
          userId: session.id,
          date: today,
          messageCount,
          remarks: remarks || null,
          whatsAppAccountId: whatsAppAccountId || null
        }
      });
    }

    return NextResponse.json({ activityLog }, { status: 200 });
  } catch (error) {
    console.error("Error saving activity log:", error);
    return NextResponse.json({ error: "Failed to save activity log" }, { status: 500 });
  }
}
