// Clear submission data
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearSubmission() {
  try {
    const updated = await prisma.marketingTask.updateMany({
      where: { 
        title: 'Blogg post',
        status: 'COMPLETED'
      },
      data: {
        submissionNote: null,
        submittedAt: null,
        submittedFiles: []
      }
    });

    console.log('✅ Submission data cleared!');
    console.log('Updated tasks:', updated.count);
    console.log('\n📝 Now the task has NO submission data.');
    console.log('🎯 Submit it as a REAL USER to test the actual flow!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearSubmission();
