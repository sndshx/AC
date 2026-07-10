import { NextResponse } from "next/server";
import { expiredAuthCookie, getSessionFromCookies } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

export async function GET() {
  const session = await getSessionFromCookies();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      avatarUrl: true,
      teamName: true
    }
  });

  if (!user || user.status === "DISABLED") {
    const response = NextResponse.json({ user: null }, { status: 401 });
    response.cookies.set(expiredAuthCookie());
    return response;
  }

  return NextResponse.json({ user });
}
