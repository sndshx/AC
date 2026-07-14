import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/shared/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const channel = searchParams.get("channel");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: any = {};
    
    if (userId) where.userId = userId;
    if (channel) where.channel = channel;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.sentAt = {};
      if (startDate) where.sentAt.gte = new Date(startDate);
      if (endDate) where.sentAt.lte = new Date(endDate);
    }

    const chatMessages = await prisma.chatMessage.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { sentAt: "desc" },
      take: limit,
    });

    // Get statistics
    const stats = await prisma.chatMessage.groupBy({
      by: ["status"],
      _count: true,
      where: startDate || endDate ? {
        sentAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      } : undefined,
    });

    const channelStats = await prisma.chatMessage.groupBy({
      by: ["channel"],
      _count: true,
      where: startDate || endDate ? {
        sentAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      } : undefined,
    });

    const totalWithReply = await prisma.chatMessage.count({
      where: {
        hasReply: true,
        ...(startDate || endDate ? {
          sentAt: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        } : {}),
      },
    });

    const totalMessages = await prisma.chatMessage.count({
      where: startDate || endDate ? {
        sentAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      } : undefined,
    });

    return NextResponse.json({
      messages: chatMessages,
      stats: {
        total: totalMessages,
        byStatus: stats,
        byChannel: channelStats,
        replyRate: totalMessages > 0 ? (totalWithReply / totalMessages) * 100 : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { content, recipient, channel = "WhatsApp", metadata } = body;

    if (!content || !recipient) {
      return NextResponse.json(
        { error: "Content and recipient are required" },
        { status: 400 }
      );
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        userId: session.id,
        content,
        recipient,
        channel,
        status: "SENT",
        metadata,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Update user activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.activity.upsert({
      where: {
        userId_date: {
          userId: session.id,
          date: today,
        },
      },
      update: {
        dailyMessagesSent: { increment: 1 },
        monthlyMessagesSent: { increment: 1 },
      },
      create: {
        userId: session.id,
        date: today,
        dailyMessagesSent: 1,
        monthlyMessagesSent: 1,
      },
    });

    return NextResponse.json(chatMessage);
  } catch (error) {
    console.error("Error creating chat message:", error);
    return NextResponse.json(
      { error: "Failed to create chat message" },
      { status: 500 }
    );
  }
}
