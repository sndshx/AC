import { PublicInfoPage } from "@/components/shared/public/public-info-page";

export default function FAQPage() {
  return (
    <PublicInfoPage
      badge="FAQ"
      title="Implementation notes for the Article Craft platform."
      description="The platform is scaffolded to make the required production integrations straightforward."
      items={[
        "Both admins and users authenticate through one login page.",
        "JWT middleware protects admin and user route groups with role-based redirects.",
        "New public registrations always default to User.",
        "Only admins can create admins, promote users, disable accounts, delete accounts, and manage team-wide data."
      ]}
    />
  );
}
