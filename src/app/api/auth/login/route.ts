import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/db";
import { authCookie, createAuditLog, signSession } from "@/lib/shared/auth";
import { rateLimit } from "@/lib/shared/rate-limit";
import { loginSchema } from "@/lib/shared/validators";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`login:${ip}`, 10, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Too many login attempts. Please try again shortly." }, { status: 429 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.status === "DISABLED") {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordMatches) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  const sessionUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };
  const token = await signSession(sessionUser);
  const redirectTo = user.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";
  const response = NextResponse.json({ user: sessionUser, redirectTo });
  response.cookies.set(authCookie(token));

  await createAuditLog({
    actorId: user.id,
    action: "auth.login",
    entity: "User",
    entityId: user.id,
    ipAddress: ip
  });

  return response;
}
