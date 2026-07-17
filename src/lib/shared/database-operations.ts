import { prisma } from './prisma'
import { Role, UserStatus, TaskStatus, Priority } from '@prisma/client'
import bcrypt from 'bcryptjs'

// ===============================
// USER OPERATIONS
// ===============================

// नयाँ User बनाउनुहोस्
export async function createUser(data: {
  fullName: string
  email: string
  password: string
  role?: Role
  teamName?: string
}) {
  const passwordHash = await bcrypt.hash(data.password, 12)
  
  return await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      role: data.role || Role.USER,
      teamName: data.teamName
    }
  })
}

// User खोज्नुहोस्
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      activities: true,
      assignedTasks: true,
      whatsAppAccounts: true
    }
  })
}

// सबै Users लिनुहोस्
export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      teamName: true,
      lastLoginAt: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

// User Update गर्नुहोस्
export async function updateUser(id: string, data: {
  fullName?: string
  status?: UserStatus
  teamName?: string
  lastLoginAt?: Date
}) {
  return await prisma.user.update({
    where: { id },
    data
  })
}

// User Delete गर्नुहोस्
export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id }
  })
}

// ===============================
// TASK OPERATIONS
// ===============================

// नयाँ Task बनाउनुहोस्
export async function createTask(data: {
  title: string
  description?: string
  priority: Priority
  dueDate?: Date
  assignedToId: string
  createdById: string
}) {
  return await prisma.marketingTask.create({
    data,
    include: {
      assignedTo: { select: { fullName: true, email: true } },
      createdBy: { select: { fullName: true } }
    }
  })
}

// Tasks लिनुहोस्
export async function getTasks(filters?: {
  assignedToId?: string
  status?: TaskStatus
  priority?: Priority
}) {
  return await prisma.marketingTask.findMany({
    where: filters,
    include: {
      assignedTo: { select: { fullName: true, email: true } },
      createdBy: { select: { fullName: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// Task Update गर्नुहोस्
export async function updateTask(id: string, data: {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: Date
  completedAt?: Date
}) {
  return await prisma.marketingTask.update({
    where: { id },
    data
  })
}

// ===============================
// ACTIVITY OPERATIONS
// ===============================

// Activity Record बनाउनुहोस्
export async function createActivity(data: {
  userId: string
  dailyMessagesSent: number
  monthlyMessagesSent: number
  successfulReplies: number
  failedReplies: number
  pendingFollowUps: number
  completedFollowUps: number
  dailyTarget?: number
  monthlyTarget?: number
}) {
  // Calculate derived fields
  const successRate = data.successfulReplies / (data.successfulReplies + data.failedReplies) * 100
  const completionPercentage = data.dailyMessagesSent / (data.dailyTarget || 100) * 100
  const productivity = (data.completedFollowUps / (data.completedFollowUps + data.pendingFollowUps)) * 100
  const performanceScore = (successRate + completionPercentage + productivity) / 3

  return await prisma.activity.create({
    data: {
      ...data,
      successRate,
      productivity,
      performanceScore,
      completionPercentage
    }
  })
}

// User को Activities लिनुहोस्
export async function getUserActivities(userId: string, limit = 30) {
  return await prisma.activity.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit
  })
}

// ===============================
// NOTIFICATION OPERATIONS
// ===============================

// Notification पठाउनुहोस्
export async function createNotification(data: {
  userId: string
  type: 'TASK_ASSIGNED' | 'TASK_COMPLETED' | 'AI_RECOMMENDATION' | 'WHATSAPP_WARNING'
  title: string
  message: string
}) {
  return await prisma.notification.create({
    data
  })
}

// User को Notifications लिनुहोस्
export async function getUserNotifications(userId: string, unreadOnly = false) {
  return await prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly && { readAt: null })
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
}

// Notification Read गर्नुहोस्
export async function markNotificationAsRead(id: string) {
  return await prisma.notification.update({
    where: { id },
    data: { readAt: new Date() }
  })
}

// ===============================
// WHATSAPP ACCOUNT OPERATIONS
// ===============================

// WhatsApp Account Update गर्नुहोस्
export async function updateWhatsAppAccount(phoneNumber: string, data: {
  status?: 'ACTIVE' | 'WARNING' | 'LIMITED' | 'BANNED'
  healthScore?: number
  dailyMessages?: number
  monthlyMessages?: number
}) {
  return await prisma.whatsAppAccount.update({
    where: { phoneNumber },
    data: {
      ...data,
      lastCheckedAt: new Date()
    }
  })
}

// ===============================
// ANALYTICS & REPORTS
// ===============================

// Dashboard Stats लिनुहोस्
export async function getDashboardStats(userId?: string) {
  const whereClause = userId ? { userId } : {}

  const [
    totalUsers,
    totalTasks,
    completedTasks,
    totalActivities,
    avgSuccessRate
  ] = await Promise.all([
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.marketingTask.count(userId ? { where: { assignedToId: userId } } : undefined),
    prisma.marketingTask.count({
      where: {
        ...(userId && { assignedToId: userId }),
        status: 'COMPLETED'
      }
    }),
    prisma.activity.count({ where: whereClause }),
    prisma.activity.aggregate({
      where: whereClause,
      _avg: { successRate: true }
    })
  ])

  return {
    totalUsers,
    totalTasks,
    completedTasks,
    totalActivities,
    avgSuccessRate: avgSuccessRate._avg.successRate || 0,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  }
}

// Monthly Performance लिनुहोस्
export async function getMonthlyPerformance(userId: string) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return await prisma.activity.findMany({
    where: {
      userId,
      date: { gte: thirtyDaysAgo }
    },
    select: {
      date: true,
      dailyMessagesSent: true,
      successfulReplies: true,
      successRate: true,
      performanceScore: true
    },
    orderBy: { date: 'asc' }
  })
}

// ===============================
// SEARCH & FILTERS
// ===============================

// Users Search गर्नुहोस्
export async function searchUsers(query: string) {
  return await prisma.user.findMany({
    where: {
      OR: [
        { fullName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { teamName: { contains: query, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      teamName: true
    }
  })
}

// Tasks Search गर्नुहोस्
export async function searchTasks(query: string, userId?: string) {
  return await prisma.marketingTask.findMany({
    where: {
      AND: [
        userId ? { assignedToId: userId } : {},
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        }
      ]
    },
    include: {
      assignedTo: { select: { fullName: true } },
      createdBy: { select: { fullName: true } }
    }
  })
}