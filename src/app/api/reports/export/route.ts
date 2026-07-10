import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";

  const activities = await prisma.activity.findMany({
    where: session.role === "ADMIN" ? {} : { userId: session.id },
    orderBy: { date: "desc" },
    take: 250,
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          whatsAppStatus: { select: { status: true, healthScore: true } }
        }
      }
    }
  });

  const rows = activities.map((activity) => [
    activity.user.fullName,
    activity.user.email,
    activity.date.toISOString().slice(0, 10),
    activity.dailyMessagesSent,
    activity.monthlyMessagesSent,
    activity.successRate,
    activity.performanceScore,
    activity.productivity,
    activity.completionPercentage,
    activity.user.whatsAppStatus?.status ?? "UNKNOWN",
    activity.user.whatsAppStatus?.healthScore ?? ""
  ]);

  const header = [
    "User",
    "Email",
    "Date",
    "Daily Messages",
    "Monthly Messages",
    "Success Rate",
    "AI Score",
    "Productivity",
    "Completion",
    "WhatsApp Status",
    "Health Score"
  ];

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  if (format === "excel") {
    return new Response(csv, {
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition": "attachment; filename=ai-marketing-report.xls"
      }
    });
  }

  if (format === "pdf") {
    return new Response(`AI Marketing Report\n\n${csv}`, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=ai-marketing-report.pdf"
      }
    });
  }

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=ai-marketing-report.csv"
    }
  });
}
