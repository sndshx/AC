import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all tasks with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('q');
    const assignedToId = searchParams.get('assignedTo');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    const tasks = await prisma.marketingTask.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        assignedToTeam: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        progressUpdates: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        submissions: {
          orderBy: { submittedAt: 'desc' },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST - Create new task with team/individual/all users assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received task creation request:', body);
    
    const { 
      title, 
      description, 
      priority, 
      dueDate, 
      assignedToId, 
      assignedToTeamId, 
      assignToAll,
      category,
      remarks,
      attachments,
      createdById 
    } = body;

    // Validation
    if (!title || !createdById) {
      console.error('Validation failed - Missing title or createdById:', { title, createdById });
      return NextResponse.json(
        { success: false, error: 'Title and createdById are required' },
        { status: 400 }
      );
    }

    let assignmentType: 'INDIVIDUAL' | 'TEAM' | 'ALL_USERS' = 'INDIVIDUAL';
    let userIdsToNotify: string[] = [];

    // Determine assignment type
    if (assignToAll) {
      assignmentType = 'ALL_USERS';
      // Get all active users
      const allUsers = await prisma.user.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });
      userIdsToNotify = allUsers.map((u) => u.id);
    } else if (assignedToTeamId) {
      assignmentType = 'TEAM';
      // Get team members
      const teamMembers = await prisma.teamMember.findMany({
        where: { teamId: assignedToTeamId },
        select: { userId: true },
      });
      userIdsToNotify = teamMembers.map((m) => m.userId);
    } else if (assignedToId) {
      assignmentType = 'INDIVIDUAL';
      userIdsToNotify = [assignedToId];
    } else {
      return NextResponse.json(
        { success: false, error: 'Must specify assignment target' },
        { status: 400 }
      );
    }

    // Create task
    const task = await prisma.marketingTask.create({
      data: {
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        category: category || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignmentType,
        assignedToId: assignmentType === 'INDIVIDUAL' ? assignedToId : null,
        assignedToTeamId: assignmentType === 'TEAM' ? assignedToTeamId : null,
        createdById,
        remarks: remarks || null,
        attachments: attachments || [],
        status: 'TODO',
        notificationSent: true,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        assignedToTeam: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Create notifications for all affected users
    if (userIdsToNotify.length > 0) {
      await prisma.notification.createMany({
        data: userIdsToNotify.map((userId) => ({
          userId,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: `You have been assigned a new task: ${title}`,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('Error creating task:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return NextResponse.json(
        { success: false, error: `Failed to create task: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create task: Unknown error' },
      { status: 500 }
    );
  }
}
