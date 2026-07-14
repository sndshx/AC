import { AppShell } from "@/components/shared/dashboard/layout-shell";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="USER">{children}</AppShell>;
}
