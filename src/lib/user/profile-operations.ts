import { prisma } from '../shared/prisma'
import { UserStatus } from '@prisma/client'

/**
 * User-specific profile and personal data operations
 */

export async function getUserProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      teamName: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
      // Exclude sensitive data
      role: false,
      passwordHash: false
    }
  })
}

export async function updateUserProfile(userId: string, data: {
  fullName?: string
  teamName?: string
}) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      updatedAt: new Date()
    }
  })
}

export async function getUserTasks(userId: string) {
  return await prisma.marketingTask.findMany({
    where: { assignedToId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      createdAt: true
    }
  })
}

export async function getUserActivity(userId: string, limit = 50) {
  return await prisma.activity.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: limit,
    select: {
      id: true,
      action: true,
      description: true,
      timestamp: true
    }
  })
}

export async function getUserStats(userId: string) {
  const [totalTasks, completedTasks, pendingTasks, totalActivity] = await Promise.all([
    prisma.marketingTask.count({ where: { assignedToId: userId } }),
    prisma.marketingTask.count({ 
      where: { 
        assignedToId: userId,
        status: 'COMPLETED'
      }
    }),
    prisma.marketingTask.count({ 
      where: { 
        assignedToId: userId,
        status: { in: ['TODO', 'IN_PROGRESS'] }
      }
    }),
    prisma.activity.count({ where: { userId } })
  ])
  
  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    totalActivity,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  }
}