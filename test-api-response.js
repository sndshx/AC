// Test what API returns
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testApiResponse() {
  try {
    // Simulate what the API does
    const tasks = await prisma.marketingTask.findMany({
      where: { status: 'COMPLETED' },
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
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    console.log('📊 API Response Simulation');
    console.log('===========================\n');
    
    tasks.forEach(task => {
      console.log(`Task: ${task.title}`);
      console.log(`Status: ${task.status}`);
      console.log(`submissionNote: ${task.submissionNote ? 'EXISTS' : 'NULL'}`);
      console.log(`submittedAt: ${task.submittedAt ? task.submittedAt : 'NULL'}`);
      console.log(`submittedFiles: ${JSON.stringify(task.submittedFiles)}`);
      console.log('-------------------\n');
    });

    // Check if fields exist in schema
    const sampleTask = tasks[0];
    if (sampleTask) {
      console.log('✅ Fields in response:');
      console.log('- submissionNote:', 'submissionNote' in sampleTask ? '✓' : '✗');
      console.log('- submittedAt:', 'submittedAt' in sampleTask ? '✓' : '✗');
      console.log('- submittedFiles:', 'submittedFiles' in sampleTask ? '✓' : '✗');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testApiResponse();
