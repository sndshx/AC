import { PrismaClient, Priority, Role, TaskStatus, WhatsAppHealth } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@12345", 12);
  const userPassword = await bcrypt.hash("User@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@aimarketing.local" },
    update: {},
    create: {
      fullName: "Ava Sterling",
      email: "admin@aimarketing.local",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      teamName: "Growth Command"
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "user@aimarketing.local" },
    update: {},
    create: {
      fullName: "Noah Patel",
      email: "user@aimarketing.local",
      passwordHash: userPassword,
      role: Role.USER,
      teamName: "Outbound AI"
    }
  });

  await prisma.whatsAppAccount.upsert({
    where: { phoneNumber: "9876543210" },
    update: {},
    create: {
      userId: user.id,
      phoneNumber: "9876543210",
      label: "Noah Patel (Main)",
      status: WhatsAppHealth.ACTIVE,
      healthScore: 94,
      dailyMessages: 148,
      monthlyMessages: 3180,
      warningHistory: [],
      banHistory: []
    }
  });

  await prisma.activity.createMany({
    data: [
      {
        userId: user.id,
        dailyMessagesSent: 148,
        monthlyMessagesSent: 3180,
        successfulReplies: 46,
        failedReplies: 9,
        pendingFollowUps: 32,
        completedFollowUps: 74,
        dailyTarget: 160,
        monthlyTarget: 3600,
        successRate: 31.1,
        productivity: 88,
        performanceScore: 91,
        completionPercentage: 92.5
      }
    ],
    skipDuplicates: true
  });

  await prisma.marketingTask.createMany({
    data: [
      {
        title: "Follow up with high-intent replies",
        description: "Prioritize leads tagged as warm by the AI scoring model.",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        assignedToId: user.id,
        createdById: admin.id,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24)
      },
      {
        title: "Refresh WhatsApp outreach copy",
        description: "Create two variants for the fintech campaign.",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        assignedToId: user.id,
        createdById: admin.id,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48)
      }
    ]
  });

  await prisma.aIProgress.create({
    data: {
      userId: user.id,
      period: "daily",
      summary: "Reply quality is improving; response windows around 10:00 and 16:00 perform best.",
      productivityScore: 88,
      aiScore: 91,
      bestSendTime: "10:00-11:30",
      suggestedFollowUps: ["Warm fintech prospects", "Missed calendar demo requests"],
      improvementTips: ["Shorten first-message CTA", "Use a proof point before pricing"],
      riskAlerts: []
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: "Follow up with high-intent replies before tomorrow."
      },
      {
        userId: admin.id,
        type: "AI_RECOMMENDATION",
        title: "AI trend detected",
        message: "Outbound AI team reply rate is up 8.4% this week."
      }
    ]
  });

  // Create sample chat messages
  await prisma.chatMessage.createMany({
    data: [
      {
        userId: user.id,
        content: "Hi! I noticed you're interested in improving your marketing ROI. Would you like to hear about our AI-powered solution?",
        recipient: "+1234567890",
        channel: "WhatsApp",
        status: "READ",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 2),
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 15),
        hasReply: true,
        repliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30),
        replyContent: "Yes, I'd love to learn more! Can you send me some details?"
      },
      {
        userId: user.id,
        content: "Great news! Our summer campaign is now live with special discounts up to 30% off. Click here to explore: bit.ly/summer-sale",
        recipient: "+1234567891",
        channel: "WhatsApp",
        status: "DELIVERED",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 12 + 1000 * 60),
        hasReply: false
      },
      {
        userId: user.id,
        content: "Thank you for your purchase! We'd love to hear your feedback. Reply with a rating from 1-5 stars.",
        recipient: "+1234567892",
        channel: "SMS",
        status: "READ",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 6 + 1000 * 60),
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        hasReply: true,
        repliedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
        replyContent: "5 stars! Absolutely loved the product and fast delivery!"
      },
      {
        userId: user.id,
        content: "Don't miss out! Limited time offer: Get 20% off your next order. Use code SAVE20 at checkout.",
        recipient: "customer@example.com",
        channel: "Email",
        status: "DELIVERED",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 48 + 1000 * 60 * 5),
        hasReply: false
      },
      {
        userId: user.id,
        content: "Hi there! Just checking in to see if you have any questions about our product demo last week?",
        recipient: "+1234567893",
        channel: "WhatsApp",
        status: "READ",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 168),
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 168 + 1000 * 60 * 3),
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 167),
        hasReply: true,
        repliedAt: new Date(Date.now() - 1000 * 60 * 60 * 166),
        replyContent: "Thanks for following up! I'd like to schedule another call with my team."
      },
      {
        userId: user.id,
        content: "Your order #12345 has been shipped! Track it here: track.example.com/12345",
        recipient: "+1234567894",
        channel: "SMS",
        status: "DELIVERED",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 3 + 1000 * 30),
        hasReply: false
      },
      {
        userId: user.id,
        content: "Exclusive invite: Join our VIP customer webinar on advanced marketing strategies. Register now!",
        recipient: "vip@example.com",
        channel: "Email",
        status: "READ",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 10),
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        hasReply: true,
        repliedAt: new Date(Date.now() - 1000 * 60 * 60 * 19),
        replyContent: "Registered! Looking forward to it."
      },
      {
        userId: user.id,
        content: "We noticed you left items in your cart. Complete your purchase now and get free shipping!",
        recipient: "+1234567895",
        channel: "WhatsApp",
        status: "SENT",
        sentAt: new Date(Date.now() - 1000 * 60 * 30),
        hasReply: false
      },
      {
        userId: user.id,
        content: "Important update: Our system maintenance is scheduled for tonight 10 PM - 2 AM. Plan accordingly.",
        recipient: "team@example.com",
        channel: "Email",
        status: "FAILED",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
        hasReply: false
      },
      {
        userId: user.id,
        content: "Congratulations! You've earned 500 loyalty points. Redeem them for exciting rewards in our app.",
        recipient: "+1234567896",
        channel: "SMS",
        status: "READ",
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
        deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 72 + 1000 * 60),
        readAt: new Date(Date.now() - 1000 * 60 * 60 * 70),
        hasReply: false
      }
    ],
    skipDuplicates: true
  });

  // Create comprehensive audit logs for user activities
  await prisma.auditLog.createMany({
    data: [
      // Today's activities
      {
        actorId: user.id,
        action: "auth.login",
        entity: "User",
        entityId: user.id,
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        actorId: user.id,
        action: "task.update",
        entity: "MarketingTask",
        entityId: "task-001",
        metadata: { status: "IN_PROGRESS", progress: 75 },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 25)
      },
      {
        actorId: user.id,
        action: "message.sent",
        entity: "ChatMessage",
        entityId: "msg-001",
        metadata: { channel: "WhatsApp", recipient: "+1234567890" },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 20)
      },
      {
        actorId: user.id,
        action: "task.complete",
        entity: "MarketingTask",
        entityId: "task-002",
        metadata: { completedAt: new Date(), timeSpent: "2h 30m" },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        actorId: user.id,
        action: "report.view",
        entity: "Report",
        metadata: { reportType: "performance", period: "weekly" },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 10)
      },
      
      // Yesterday's activities
      {
        actorId: user.id,
        action: "auth.login",
        entity: "User",
        entityId: user.id,
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 480) // Yesterday morning
      },
      {
        actorId: user.id,
        action: "task.create",
        entity: "MarketingTask",
        entityId: "task-003",
        metadata: { title: "Follow up with leads", priority: "HIGH" },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 470)
      },
      {
        actorId: user.id,
        action: "message.sent",
        entity: "ChatMessage",
        metadata: { channel: "Email", count: 15 },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 450)
      },
      {
        actorId: user.id,
        action: "profile.update",
        entity: "User",
        entityId: user.id,
        metadata: { fields: ["avatarUrl", "teamName"] },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 400)
      },
      {
        actorId: user.id,
        action: "calendar.event.view",
        entity: "CalendarEvent",
        metadata: { eventCount: 5 },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 350)
      },
      {
        actorId: user.id,
        action: "auth.logout",
        entity: "User",
        entityId: user.id,
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 60)
      },

      // Admin activities
      {
        actorId: admin.id,
        action: "auth.login",
        entity: "User",
        entityId: admin.id,
        ipAddress: "192.168.1.50",
        createdAt: new Date(Date.now() - 1000 * 60 * 45)
      },
      {
        actorId: admin.id,
        action: "admin.user.view",
        entity: "User",
        metadata: { action: "viewed_all_users" },
        ipAddress: "192.168.1.50",
        createdAt: new Date(Date.now() - 1000 * 60 * 40)
      },
      {
        actorId: admin.id,
        action: "admin.report.generate",
        entity: "Report",
        metadata: { reportType: "team_performance", usersCount: 10 },
        ipAddress: "192.168.1.50",
        createdAt: new Date(Date.now() - 1000 * 60 * 35)
      },
      {
        actorId: admin.id,
        action: "admin.task.assign",
        entity: "MarketingTask",
        entityId: "task-004",
        metadata: { assignedTo: user.id, priority: "URGENT" },
        ipAddress: "192.168.1.50",
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        actorId: admin.id,
        action: "admin.notification.send",
        entity: "Notification",
        metadata: { type: "TASK_ASSIGNED", recipientCount: 1 },
        ipAddress: "192.168.1.50",
        createdAt: new Date(Date.now() - 1000 * 60 * 25)
      },

      // Week old activities
      {
        actorId: user.id,
        action: "auth.login",
        entity: "User",
        entityId: user.id,
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      },
      {
        actorId: user.id,
        action: "task.complete",
        entity: "MarketingTask",
        metadata: { tasksCompleted: 5 },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60)
      },
      {
        actorId: user.id,
        action: "message.sent",
        entity: "ChatMessage",
        metadata: { channel: "WhatsApp", count: 50 },
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 120)
      }
    ],
    skipDuplicates: true
  });

  console.log("Seed complete");
  console.log("Admin: admin@aimarketing.local / Admin@12345");
  console.log("User: user@aimarketing.local / User@12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
