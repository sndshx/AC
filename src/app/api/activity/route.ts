import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { calculateMarketingMetrics } from "@/lib/shared/calculations";
import { prisma } from "@/lib/shared/db";
import { activitySchema } from "@/lib/shared/validators";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId =
    session.role === "ADMIN" ? new URL(request.url).searchParams.get("userId") ?? session.id : session.id;

  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 60
  });

  return NextResponse.json({ activities });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = activitySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid activity." }, { status: 400 });
  }

  const metrics = calculateMarketingMetrics(parsed.data);
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const activity = await prisma.activity.upsert({
    where: { userId_date: { userId: session.id, date } },
    update: {
      ...parsed.data,
      ...metrics
    },
    create: {
      userId: session.id,
      date,
      ...parsed.data,
      ...metrics
    }
  });

  return NextResponse.json({ activity });
}
