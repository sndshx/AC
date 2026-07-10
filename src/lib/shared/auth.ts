import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/shared/db";
import { AUTH_COOKIE_NAME } from "@/lib/shared/constants";

export type SessionRole = "ADMIN" | "USER";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: SessionRole;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET ?? "development-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function signSession(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token?: string | null): Promise<SessionUser | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.id || !payload.email || !payload.fullName || !payload.role) return null;

    return {
      id: String(payload.id),
      email: String(payload.email),
      fullName: String(payload.fullName),
      role: payload.role === "ADMIN" ? "ADMIN" : "USER"
    };
  } catch {
    return null;
  }
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}

export async function getSessionFromRequest(request: NextRequest) {
  return verifySessionToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

export function authCookie(token: string) {
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  };
}

export function expiredAuthCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  };
}

export async function requireAdmin(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== "ADMIN") {
    return { session: null, error: Response.json({ error: "Admin access required" }, { status: 403 }) };
  }

  return { session, error: null };
}

export async function createAuditLog(input: {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      ipAddress: input.ipAddress ?? undefined
    }
  });
}

export { AUTH_COOKIE_NAME };
