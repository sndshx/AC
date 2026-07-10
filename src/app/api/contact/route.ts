import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/shared/validators";
import { rateLimit } from "@/lib/shared/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`contact:${ip}`, 5, 60_000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Too many messages. Please try again shortly." }, { status: 429 });
  }

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid contact form." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks. Your message has been received.",
    submission: {
      ...parsed.data,
      receivedAt: new Date().toISOString()
    }
  });
}
