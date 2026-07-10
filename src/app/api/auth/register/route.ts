import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/shared/db";
import { authCookie, createAuditLog, getSessionFromRequest, signSession } from "@/lib/shared/auth";
import { rateLimit } from "@/lib/shared/rate-limit";
import { registerSchema } from "@/lib/shared/validators";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`register:${ip}`, 6, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Too many registration attempts. Please try again shortly." }, { status: 429 });
  }

  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid registration details." }, { status: 400 });
  }

  const session = await getSessionFromRequest(request);
  const requestedRole = parsed.data.role ?? "USER";

  if (requestedRole === "ADMIN" && session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can create admin accounts." }, { status: 403 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      fullName: parsed.data.fullName.trim(),
      email,
      passwordHash,
      role: requestedRole === "ADMIN" ? Role.ADMIN : Role.USER
    }
  });

  await createAuditLog({
    actorId: session?.id ?? user.id,
    action: session?.role === "ADMIN" ? "admin.user.create" : "auth.register",
    entity: "User",
    entityId: user.id,
    metadata: { role: user.role },
    ipAddress: ip
  });

  const sessionUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };

  if (session?.role === "ADMIN") {
    return NextResponse.json({ user: sessionUser }, { status: 201 });
  }

  const token = await signSession(sessionUser);
  const response = NextResponse.json({ user: sessionUser, redirectTo: "/user/dashboard" }, { status: 201 });
  response.cookies.set(authCookie(token));
  return response;
}
