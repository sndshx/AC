import { PublicInfoPage } from "@/components/shared/public/public-info-page";

export default function AboutPage() {
  return (
    <PublicInfoPage
      badge="About"
      title="A command center for article writing and content creation teams."
      description="Article Craft brings visibility, accountability, and intelligent recommendations into one operational workspace."
      items={[
        "Designed for admins who need team-wide visibility and strong access controls.",
        "Designed for users who need a clean personal workspace for targets, tasks, remarks, and reports.",
        "Built with Next.js, React, Tailwind CSS, Prisma, JWT auth, and PostgreSQL.",
        "Structured for production deployment with protected routes, validation, hashing, and audit logs."
      ]}
    />
  );
}
