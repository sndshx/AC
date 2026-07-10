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

  await prisma.whatsAppStatus.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
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
