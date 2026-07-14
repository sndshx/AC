"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, Send, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
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
    <aside className="flex h-full flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl">
      {/* Header Section with Logo */}
      <div className="flex h-14 items-center justify-center border-b border-slate-200 dark:border-slate-800 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <Logo href={role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"} size="sm" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <div className="mb-2">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {role === "ADMIN" ? "Admin Menu" : "My Workspace"}
          </p>
        </div>
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-xs font-semibold transition-all duration-200",
                active
                  ? "bg-[#E8F7EE] dark:bg-[#143D2C]/40 text-[#143D2C] dark:text-[#E8F7EE] shadow-sm border-l-4 border-[#00C853] scale-102"
                  : "text-slate-700 dark:text-slate-300 hover:bg-[#E8F7EE]/30 dark:hover:bg-slate-800/50 hover:text-[#143D2C] dark:hover:text-white"
              )}
            >
              <div
                className={cn(
                  "flex h-6.5 w-6.5 items-center justify-center rounded-md transition-all",
                  active
                    ? "bg-[#00C853] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-[#E8F7EE] dark:group-hover:bg-[#143D2C]/20 group-hover:text-[#143D2C] dark:group-hover:text-white"
                )}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
              </div>
              <span className="truncate font-semibold">{item.label}</span>
              {active && (
                <div className="absolute right-2 h-1 w-1 rounded-full bg-[#00C853] shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 p-2 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="h-8 w-8 rounded-full bg-[#2D5F4D] dark:bg-[#00C853] flex items-center justify-center shadow-sm flex-shrink-0">
            <UserRound className="h-4 w-4 text-[#E8F7EE] dark:text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
              {user?.fullName ?? "Workspace User"}
            </p>
            <p className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {user?.email ?? role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">{sidebar}</div>
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
            aria-label="Close sidebar" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl transform transition-transform">{sidebar}</div>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Close navigation"
            title="Close navigation"
            className="absolute right-4 top-4 bg-white dark:bg-slate-800 shadow-lg hover:rotate-90 transition-transform duration-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : null}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm">
          <div className="flex h-12 items-center gap-3 px-4 sm:px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Open navigation" 
              title="Open navigation" 
              className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 h-8 w-8" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-bold bg-gradient-to-r from-[#143D2C] to-[#00C853] dark:from-[#E8F7EE] dark:to-[#00C853] bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
            <div className="hidden w-full max-w-xs items-center md:flex">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search..."
                  className="h-8 pl-8 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Notifications" 
              title="Notifications"
              className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </Button>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Logout" 
              title="Logout" 
              onClick={logout}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="p-0 w-full">{children}</main>
      </div>
    </div>
  );
}
