import { PublicInfoPage } from "@/components/shared/public/public-info-page";

export default function PricingPage() {
  return (
    <PublicInfoPage
      badge="Pricing"
      title="Flexible plans for growing content creation teams."
      description="Start with essential tracking, then scale into full admin controls, reporting, monitoring, and enterprise governance."
      items={[
        "Starter for small teams that need daily activity and AI summaries.",
        "Growth for agencies and content-led teams managing article creation workflows.",
        "Scale for enterprise deployment, audit logs, custom reporting, and priority support.",
        "Neon PostgreSQL and Prisma architecture keeps the data layer portable and scalable."
      ]}
    />
  );
}
