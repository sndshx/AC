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
          whatsAppAccounts: { select: { status: true, healthScore: true } }
        }
      }
    }
  });

  const rows = activities.map((activity) => {
    const waAccounts = activity.user.whatsAppAccounts;
    const statusPriority = { BANNED: 4, LIMITED: 3, WARNING: 2, ACTIVE: 1 } as const;
    const worstWaStatus = waAccounts.length > 0
      ? waAccounts.reduce((worst: string, acc: { status: string; healthScore: number }) => {
          const p = statusPriority[acc.status as keyof typeof statusPriority] ?? 0;
          return p > (statusPriority[worst as keyof typeof statusPriority] ?? 0) ? acc.status : worst;
        }, "ACTIVE")
      : "UNKNOWN";
    const avgWaScore = waAccounts.length > 0
      ? Math.round(waAccounts.reduce((sum: number, acc: { status: string; healthScore: number }) => sum + acc.healthScore, 0) / waAccounts.length)
      : "";
    return [
    activity.user.fullName,
    activity.user.email,
    activity.date.toISOString().slice(0, 10),
    activity.dailyMessagesSent,
    activity.monthlyMessagesSent,
    activity.successRate,
    activity.performanceScore,
    activity.productivity,
    activity.completionPercentage,
    worstWaStatus,
    avgWaScore
    ];
  });

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
