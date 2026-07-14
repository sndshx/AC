import { AppShell } from "@/components/shared/dashboard/layout-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="ADMIN">{children}</AppShell>;
}
