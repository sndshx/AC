import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch task statistics
export async function GET(request: NextRequest) {
  try {
    const [total, todo, inProgress, completed, blocked, overdue] = await Promise.all([
      prisma.marketingTask.count(),
      prisma.marketingTask.count({ where: { status: 'TODO' } }),
      prisma.marketingTask.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.marketingTask.count({ where: { status: 'COMPLETED' } }),
      prisma.marketingTask.count({ where: { status: 'BLOCKED' } }),
      prisma.marketingTask.count({
        where: {
          status: { not: 'COMPLETED' },
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        todo,
        inProgress,
        completed,
        blocked,
        overdue,
      },
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task statistics' },
      { status: 500 }
    );
  }
}
