import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/shared/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, hasReply, replyContent, deliveredAt, readAt, repliedAt } = body;

    const updateData: any = {};
    
    if (status) updateData.status = status;
    if (hasReply !== undefined) updateData.hasReply = hasReply;
    if (replyContent) updateData.replyContent = replyContent;
    if (deliveredAt) updateData.deliveredAt = new Date(deliveredAt);
    if (readAt) updateData.readAt = new Date(readAt);
    if (repliedAt) updateData.repliedAt = new Date(repliedAt);

    const chatMessage = await prisma.chatMessage.update({
      where: { id: params.id },
      data: updateData,
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

    // Update user activity if there's a reply
    if (hasReply && repliedAt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.activity.upsert({
        where: {
          userId_date: {
            userId: chatMessage.userId,
            date: today,
          },
        },
        update: {
          successfulReplies: { increment: 1 },
        },
        create: {
          userId: chatMessage.userId,
          date: today,
          successfulReplies: 1,
        },
      });
    }

    return NextResponse.json(chatMessage);
  } catch (error) {
    console.error("Error updating chat message:", error);
    return NextResponse.json(
      { error: "Failed to update chat message" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.chatMessage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Chat message deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat message:", error);
    return NextResponse.json(
      { error: "Failed to delete chat message" },
      { status: 500 }
    );
  }
}
