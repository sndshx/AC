// Add submission data to ALL completed tasks
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMultipleSubmissions() {
  try {
    // Find all completed tasks
    const completedTasks = await prisma.marketingTask.findMany({
      where: { status: 'COMPLETED' }
    });

    if (completedTasks.length === 0) {
      console.log('❌ No completed tasks found.');
      return;
    }

    console.log(`✅ Found ${completedTasks.length} completed task(s)`);
    console.log('-------------------\n');

    // Add submission data to each completed task
    for (const task of completedTasks) {
      const updated = await prisma.marketingTask.update({
        where: { id: task.id },
        data: {
          submissionNote: `I have completed "${task.title}" with the following:\n\n- All requirements implemented\n- Tested thoroughly\n- Documentation added\n- Ready for review\n\nPlease find the attached files for verification.`,
          submittedAt: new Date(),
          submittedFiles: [
            'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            'https://res.cloudinary.com/demo/raw/upload/sample.pdf'
          ]
        }
      });

      console.log(`✅ Added submission to: ${updated.title}`);
    }

    console.log('\n-------------------');
    console.log(`🎉 Added submission data to ${completedTasks.length} task(s)!`);
    console.log('📍 Refresh admin tasks page to see all submissions!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMultipleSubmissions();
