import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/shared/validators";
import { rateLimit } from "@/lib/shared/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`forgot:${ip}`, 5, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.pick({ email: true }).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  return NextResponse.json({
    message: "If an account exists, a password reset link will be sent to that email."
  });
}
