// Add sample submission data for testing admin view
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSampleSubmission() {
  try {
    const task = await prisma.marketingTask.findFirst({
      where: { 
        title: 'Blogg post',
        status: 'COMPLETED'
      }
    });

    if (!task) {
      console.log('❌ Task not found. Create a completed task first.');
      return;
    }

    // Add sample submission (simulating what user would submit)
    const updated = await prisma.marketingTask.update({
      where: { id: task.id },
      data: {
        submissionNote: 'I have completed my blog page with the following:\n\n- Homepage with hero section\n- About page with team information\n- Contact form with validation\n- Responsive design for mobile devices\n\nAll requirements have been met.',
        submittedAt: new Date('2026-07-13T14:30:00Z'),
        submittedFiles: [
          'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          'https://res.cloudinary.com/demo/raw/upload/sample.pdf'
        ]
      }
    });

    console.log('✅ Sample submission added!');
    console.log('-------------------');
    console.log('Task ID:', updated.id);
    console.log('Task Title:', updated.title);
    console.log('-------------------');
    console.log('Submission Note:', updated.submissionNote);
    console.log('Submitted At:', updated.submittedAt);
    console.log('Submitted Files:', updated.submittedFiles);
    console.log('-------------------');
    console.log('\n🎉 Now refresh the admin tasks page to see the submission!');
    console.log('📍 Go to: Admin → Tasks → Completed tab → Blogg post');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleSubmission();
