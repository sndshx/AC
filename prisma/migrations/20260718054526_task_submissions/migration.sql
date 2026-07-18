-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'NEEDS_REVISION', 'REJECTED');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'SUBMISSION_REVIEWED';

-- CreateTable
CREATE TABLE "TaskSubmission" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workDescription" TEXT,
    "remarks" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "fileUrls" TEXT[],
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "adminRemark" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,

    CONSTRAINT "TaskSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskSubmission_taskId_idx" ON "TaskSubmission"("taskId");

-- CreateIndex
CREATE INDEX "TaskSubmission_userId_idx" ON "TaskSubmission"("userId");

-- CreateIndex
CREATE INDEX "TaskSubmission_submittedAt_idx" ON "TaskSubmission"("submittedAt");

-- AddForeignKey
ALTER TABLE "TaskSubmission" ADD CONSTRAINT "TaskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "MarketingTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
