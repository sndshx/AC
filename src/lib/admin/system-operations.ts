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
  
  return await prisma.activity.groupBy({
    by: ['action'],
    where: {
      timestamp: { gte: startDate }
    },
    _count: {
      action: true
    },
    orderBy: {
      _count: {
        action: 'desc'
      }
    }
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
  
  const [activeUsersLastHour, failedLoginsLastHour, systemErrors] = await Promise.all([
    prisma.user.count({
      where: {
        lastLoginAt: { gte: oneHourAgo }
      }
    }),
    prisma.activity.count({
      where: {
        action: 'LOGIN_FAILED',
        timestamp: { gte: oneHourAgo }
      }
    }),
    prisma.activity.count({
      where: {
        action: 'ERROR',
        timestamp: { gte: oneHourAgo }
      }
    })
  ])
  
  return {
    activeUsersLastHour,
    failedLoginsLastHour,
    systemErrors,
    status: systemErrors < 10 ? 'healthy' : 'warning'
  }
}