import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/shared/auth";
import { prisma } from "@/lib/shared/db";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accounts = await prisma.whatsAppAccount.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching WhatsApp accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch WhatsApp accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { phoneNumber, label } = body;

    if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim().length < 5) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const cleanPhoneNumber = phoneNumber.trim();

    // Check if the phone number already exists in the system
    const existing = await prisma.whatsAppAccount.findUnique({
      where: { phoneNumber: cleanPhoneNumber }
    });

    if (existing) {
      return NextResponse.json(
        { error: "This phone number is already registered under a WhatsApp account." },
        { status: 409 }
      );
    }

    const newAccount = await prisma.whatsAppAccount.create({
      data: {
        userId: session.id,
        phoneNumber: cleanPhoneNumber,
        label: label?.trim() || null,
        status: "ACTIVE",
        healthScore: 100,
        dailyMessages: 0,
        monthlyMessages: 0,
        warningHistory: [],
        banHistory: []
      }
    });

    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch (error) {
    console.error("Error creating WhatsApp account:", error);
    return NextResponse.json(
      { error: "Failed to create WhatsApp account" },
      { status: 500 }
    );
  }
}
