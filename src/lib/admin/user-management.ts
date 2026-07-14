import { prisma } from '../shared/prisma'
import { Role, UserStatus } from '@prisma/client'

/**
 * Admin-specific user management operations
 */

export async function getAllUsers(search?: string) {
  return await prisma.user.findMany({
    where: search ? {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { teamName: { contains: search, mode: 'insensitive' } }
      ]
    } : undefined,
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

export async function promoteUserToAdmin(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role: Role.ADMIN }
  })
}

export async function suspendUser(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { status: UserStatus.DISABLED }
  })
}

export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId }
  })
}

export async function getUserStats() {
  const [totalUsers, activeUsers, adminCount, userCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.user.count({ where: { role: Role.USER } })
  ])
  
  return {
    totalUsers,
    activeUsers,
    adminCount,
    userCount
  }
}