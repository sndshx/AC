import { prisma } from '../shared/prisma'

/**
 * Admin-specific system operations and analytics
 */

export async function getSystemStats() {
  const [totalUsers, totalTasks, totalActivity, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.marketingTask.count(),
    prisma.activity.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    })
  ])
  
  return {
    totalUsers,
    totalTasks,
    totalActivity,
    recentUsers
  }
}

export async function getActivityStats(days = 7) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  return await prisma.activity.findMany({
    where: {
      date: { gte: startDate }
    },
    select: {
      id: true,
      userId: true,
      dailyMessagesSent: true,
      successRate: true,
      date: true
    },
    orderBy: { date: 'desc' }
  })
}

export async function getTaskStatusDistribution() {
  return await prisma.marketingTask.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  })
}

export async function getUserRoleDistribution() {
  return await prisma.user.groupBy({
    by: ['role'],
    _count: {
      role: true
    }
  })
}

export async function getSystemHealth() {
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  
  const [activeUsersLastHour, systemActivity] = await Promise.all([
    prisma.user.count({
      where: {
        lastLoginAt: { gte: oneHourAgo }
      }
    }),
    prisma.activity.count({
      where: {
        date: { gte: oneHourAgo }
      }
    })
  ])

  return {
    activeUsersLastHour,
    failedLoginsLastHour: 0,
    systemErrors: 0,
    status: 'healthy'
  }
}