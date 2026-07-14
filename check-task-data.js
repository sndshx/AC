// Check actual task data in database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTaskData() {
  try {
    const task = await prisma.marketingTask.findFirst({
      where: { 
        title: 'Blogg post',
        status: 'COMPLETED'
      }
    });

    if (!task) {
      console.log('❌ Task not found');
      return;
    }

    console.log('✅ Task found!');
    console.log('-------------------');
    console.log('ID:', task.id);
    console.log('Title:', task.title);
    console.log('Status:', task.status);
    console.log('-------------------');
    console.log('submissionNote:', task.submissionNote || 'NULL');
    console.log('submittedAt:', task.submittedAt || 'NULL');
    console.log('submittedFiles:', task.submittedFiles || 'EMPTY ARRAY');
    console.log('submittedFiles length:', task.submittedFiles?.length || 0);
    console.log('-------------------');
    
    // Check if condition would pass
    const hasNote = !!task.submissionNote;
    const hasFiles = task.submittedFiles && task.submittedFiles.length > 0;
    const shouldShow = hasNote || hasFiles;
    
    console.log('Has note?', hasNote);
    console.log('Has files?', hasFiles);
    console.log('Should show submission section?', shouldShow);
    
    if (!shouldShow) {
      console.log('\n⚠️ No submission data found!');
      console.log('💡 Submit the task as a user to add data.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTaskData();
