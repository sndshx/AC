"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, Send, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { adminNav, userNav } from "@/lib/shared/demo-data";
import { cn } from "@/lib/shared/utils";
import { useAppStore } from "@/store/app-store";

type AppShellProps = {
  role: "ADMIN" | "USER";
  children: React.ReactNode;
};

type SessionUser = {
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  avatarUrl?: string | null;
};

export function AppShell({ role, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const nav = role === "ADMIN" ? adminNav : userNav;
  const { sidebarOpen, setSidebarOpen, searchQuery, setSearchQuery } = useAppStore();
  const title = useMemo(() => {
    const active = nav.find((item) => pathname.startsWith(item.href));
    return active?.label ?? "Dashboard";
  }, [nav, pathname]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
          <Send className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Article Craft</p>
          <p className="text-xs text-muted-foreground">{role === "ADMIN" ? "Admin Console" : "User Workspace"}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-background">
            <UserRound className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.fullName ?? "Workspace user"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">{sidebar}</div>
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/40" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 shadow-soft">{sidebar}</div>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Close navigation"
            title="Close navigation"
            className="absolute right-4 top-4"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : null}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/84 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button variant="ghost" size="icon" aria-label="Open navigation" title="Open navigation" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-muted-foreground">{role === "ADMIN" ? "Admin" : "User"} / {title}</p>
              <h1 className="truncate text-lg font-semibold">{title}</h1>
            </div>
            <div className="hidden w-full max-w-sm items-center md:flex">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search users, status, role..."
                  className="h-10 pl-9"
                />
              </div>
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Logout" title="Logout" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
