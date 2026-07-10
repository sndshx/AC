import { PublicInfoPage } from "@/components/shared/public/public-info-page";

export default function ContactPage() {
  return (
    <PublicInfoPage
      badge="Contact"
      title="Talk to us about your marketing operations workflow."
      description="The landing page includes a working validated contact form. This page is ready for expanded sales and support routing."
      items={[
        "Connect contact submissions to Slack, email, HubSpot, or your preferred CRM.",
        "Use role-based dashboards to onboard admin and user teams cleanly.",
        "Extend reports into branded PDF and spreadsheet templates.",
        "Add UploadThing or Cloudinary when you are ready for profile and report attachments."
      ]}
    />
  );
}
