import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME } from "@/lib/shared/constants";

const protectedPrefixes = ["/admin", "/user"];
const authPages = ["/login", "/register"];

function secretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "development-secret-change-me");
}

async function readRole(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "ADMIN" ? "ADMIN" : payload.role === "USER" ? "USER" : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = authPages.includes(pathname);

  if (!isProtected && !isAuthPage) return NextResponse.next();

  const role = await readRole(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (isAuthPage && role) {
    return NextResponse.redirect(new URL(role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard", request.url));
  }

  if (!isProtected) return NextResponse.next();

  if (!role) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if (pathname.startsWith("/user") && role !== "USER") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/login", "/register"]
};
