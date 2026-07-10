import { NextResponse } from "next/server";
import { expiredAuthCookie } from "@/lib/shared/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(expiredAuthCookie());
  return response;
}
