// Test script to add submission data to an existing completed task
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTestSubmission() {
  try {
    // Find a completed task
    const completedTask = await prisma.marketingTask.findFirst({
      where: { status: 'COMPLETED' },
    });

    if (!completedTask) {
      console.log('❌ No completed task found. Please complete a task first.');
      return;
    }

    console.log('✅ Found completed task:', completedTask.title);

    // Update with submission data
    const updated = await prisma.marketingTask.update({
      where: { id: completedTask.id },
      data: {
        submissionNote: 'This is a test submission note from the student. I have completed all the requirements.',
        submittedAt: new Date(),
        submittedFiles: [
          'https://example.com/files/24046063_Sandesh_Khatri.pdf',
          'https://example.com/files/screenshot.png',
          'https://example.com/files/document.docx'
        ]
      }
    });

    console.log('✅ Successfully added submission data!');
    console.log('Task ID:', updated.id);
    console.log('Submission Note:', updated.submissionNote);
    console.log('Submitted At:', updated.submittedAt);
    console.log('Files:', updated.submittedFiles);
    
    console.log('\n🎉 Now refresh your admin tasks page to see the submission details!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestSubmission();
