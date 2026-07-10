import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/shared/db";
import { createAuditLog, requireAdmin } from "@/lib/shared/auth";
import { registerSchema } from "@/lib/shared/validators";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const role = searchParams.get("role");
  const status = searchParams.get("status");

  const users = await prisma.user.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { fullName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
              ]
            }
          : {},
        role === "ADMIN" || role === "USER" ? { role } : {},
        status === "ACTIVE" || status === "DISABLED" ? { status } : {}
      ]
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      teamName: true,
      createdAt: true,
      lastLoginAt: true,
      whatsAppStatus: {
        select: {
          status: true,
          healthScore: true
        }
      },
      _count: {
        select: {
          assignedTasks: true,
          activities: true
        }
      }
    }
  });

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin(request);
  if (error || !session) return error;

  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid user details." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      fullName: parsed.data.fullName.trim(),
      email,
      passwordHash,
      role: parsed.data.role === "ADMIN" ? Role.ADMIN : Role.USER
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    }
  });

  await createAuditLog({
    actorId: session.id,
    action: "admin.user.create",
    entity: "User",
    entityId: user.id,
    metadata: { role: user.role }
  });

  return NextResponse.json({ user }, { status: 201 });
}
