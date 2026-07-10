import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/shared/prisma'
import { updateUser, deleteUser } from '@/lib/shared/database-operations'
import { UserStatus } from '@prisma/client'

// GET: Single User लिनुहोस्
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { date: 'desc' },
          take: 10
        },
        assignedTasks: {
          include: {
            createdBy: { select: { fullName: true } }
          }
        },
        whatsAppStatus: true,
        notifications: {
          where: { readAt: null },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Password hash हटाउनुहोस्
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH: User Update गर्नुहोस्
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { fullName, status, teamName } = body

    const updatedUser = await updateUser(id, {
      ...(fullName && { fullName }),
      ...(status && { status: status as UserStatus }),
      ...(teamName !== undefined && { teamName })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'User updated successfully'
    })
  } catch (error: unknown) {
    console.error('Error updating user:', error)
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE: User Delete गर्नुहोस्
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await deleteUser(id)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error: unknown) {
    console.error('Error deleting user:', error)
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}