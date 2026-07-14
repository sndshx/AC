import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  teamName: z.string().max(100).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export async function PATCH(request: NextRequest) {
  const session = await getSessionFromCookies();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: validated,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        teamName: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
