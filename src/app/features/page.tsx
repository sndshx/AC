import { PublicInfoPage } from "@/components/shared/public/public-info-page";

export default function FeaturesPage() {
  return (
    <PublicInfoPage
      badge="Features"
      title="Article writing operations without scattered tools."
      description="A role-aware platform for tracking content creation, tasks, AI suggestions, reports, calendar events, and team collaboration."
      items={[
        "Daily and monthly marketing activity tracking with automatic score calculations.",
        "Admin-only user management for roles, disabled accounts, deletion, and admin creation.",
        "AI productivity summaries, risk alerts, inactive user detection, and follow-up suggestions.",
        "Notifications for assigned tasks, completed work, remarks, calendar reminders, and WhatsApp warnings."
      ]}
    />
  );
}
