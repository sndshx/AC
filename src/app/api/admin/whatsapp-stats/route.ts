import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/shared/db";
import { requireAdmin } from "@/lib/shared/auth";

/** Normalise a phone number to its last 10 digits for matching. */
function getPhoneMatchKey(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-10);
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  // 1. Total WhatsApp messages across all accounts (sum of monthlyMessages)
  const accounts = await prisma.whatsAppAccount.findMany({
    select: {
      phoneNumber: true,
      label: true,
      monthlyMessages: true,
      dailyMessages: true,
      healthScore: true,
      status: true,
      user: { select: { id: true, fullName: true } },
    },
    orderBy: { monthlyMessages: "desc" },
    take: 5,
  });

  const totalMonthlyMessages = await prisma.whatsAppAccount.aggregate({
    _sum: { monthlyMessages: true },
  });

  const totalDailyMessages = await prisma.whatsAppAccount.aggregate({
    _sum: { dailyMessages: true },
  });

  // 2. Build top-contributor info from top account
  const topAccount = accounts[0] ?? null;

  let topContributorName: string | null = null;
  if (topAccount) {
    // Use label if set, else user's full name, else the phone number itself
    topContributorName =
      topAccount.label ||
      topAccount.user?.fullName ||
      topAccount.phoneNumber;
  }

  return NextResponse.json({
    totalMonthly: totalMonthlyMessages._sum.monthlyMessages ?? 0,
    totalDaily: totalDailyMessages._sum.dailyMessages ?? 0,
    topContributor: topAccount
      ? {
          name: topContributorName,
          phone: topAccount.phoneNumber,
          count: topAccount.monthlyMessages,
        }
      : null,
    topAccounts: accounts.map((a) => ({
      phoneNumber: a.phoneNumber,
      label: a.label,
      userName: a.user?.fullName ?? null,
      monthlyMessages: a.monthlyMessages,
      dailyMessages: a.dailyMessages,
      healthScore: a.healthScore,
      status: a.status,
      matchKey: getPhoneMatchKey(a.phoneNumber),
    })),
  });
}
