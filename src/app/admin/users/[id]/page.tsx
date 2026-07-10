import { ModulePage } from "@/components/shared/dashboard/module-page";

type UserDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;
  return <ModulePage moduleKey="users" role="ADMIN" detailId={id} />;
}
