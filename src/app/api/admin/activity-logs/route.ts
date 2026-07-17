import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    // Parse date or use today
    let targetDate: Date;
    if (dateParam) {
      targetDate = new Date(dateParam);
      if (isNaN(targetDate.getTime())) {
        return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
      }
    } else {
      targetDate = new Date();
    }
    
    // Normalize to start of day
    targetDate.setHours(0, 0, 0, 0);

    const activityLogs = await prisma.activityLog.findMany({
      where: {
        date: targetDate
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            whatsAppAccounts: {
              select: {
                id: true,
                phoneNumber: true,
                label: true,
                status: true,
              },
              orderBy: { monthlyMessages: "desc" }
            }
          }
        },
        whatsAppAccount: {
          select: {
            id: true,
            phoneNumber: true,
            label: true,
            status: true,
          }
        }
      },
      orderBy: {
        messageCount: "desc"
      }
    });

    return NextResponse.json({ activityLogs, date: targetDate.toISOString() });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 });
  }
}
