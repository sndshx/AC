"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Ban, Eye, Search, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/providers/toast-provider";
import { demoUsers } from "@/lib/shared/demo-data";

type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "DISABLED";
  teamName?: string | null;
  aiScore?: number;
  whatsAppAccounts?: Array<{
    status: string;
    healthScore: number;
  }> | null;
  _count?: {
    assignedTasks: number;
    activities: number;
  };
};

type PendingAction =
  | { type: "promote"; user: AdminUser }
  | { type: "disable"; user: AdminUser }
  | { type: "delete"; user: AdminUser }
  | null;

export function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/users")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setUsers(data.users))
      .catch(() => setUsers(demoUsers as AdminUser[]))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatches = roleFilter === "ALL" || user.role === roleFilter;
      const statusMatches = statusFilter === "ALL" || user.status === statusFilter;
      return roleMatches && statusMatches;
    });
  }, [roleFilter, statusFilter, users]);

  async function updateUser(user: AdminUser, data: Partial<Pick<AdminUser, "role" | "status">>) {
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null);

    setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, ...data } : item)));

    if (response && !response.ok) {
      const body = await response.json().catch(() => ({ error: "Action was applied locally for the demo." }));
      showToast({ title: "Action needs database setup", description: body.error, tone: "error" });
      return;
    }

    showToast({ title: "User updated", description: `${user.fullName} was updated.` });
  }

  async function deleteUser(user: AdminUser) {
    const response = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" }).catch(() => null);
    setUsers((current) => current.filter((item) => item.id !== user.id));

    if (response && !response.ok) {
      const body = await response.json().catch(() => ({ error: "Action was applied locally for the demo." }));
      showToast({ title: "Delete needs database setup", description: body.error, tone: "error" });
      return;
    }

    showToast({ title: "User deleted", description: `${user.fullName} was removed.` });
  }

  async function confirmAction() {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);

    if (action.type === "promote") {
      await updateUser(action.user, { role: action.user.role === "ADMIN" ? "USER" : "ADMIN" });
    }
    if (action.type === "disable") {
      await updateUser(action.user, { status: action.user.status === "ACTIVE" ? "DISABLED" : "ACTIVE" });
    }
    if (action.type === "delete") {
      await deleteUser(action.user);
    }
  }

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "User",
        cell: ({ row }) => {
          const name = row.original.fullName || "";
          const initials = name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "U";
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-900 dark:text-white leading-tight">{name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{row.original.email}</p>
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge 
            className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" 
            tone={row.original.role === "ADMIN" ? "info" : "default"}
          >
            {row.original.role}
          </Badge>
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge 
            className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" 
            tone={row.original.status === "ACTIVE" ? "success" : "danger"}
          >
            {row.original.status}
          </Badge>
        )
      },
      {
        accessorKey: "teamName",
        header: "Team",
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {row.original.teamName ?? "Unassigned"}
          </span>
        )
      },
      {
        accessorFn: (row) => {
          const accs = row.whatsAppAccounts;
          if (!accs || accs.length === 0) return row.aiScore ?? 0;
          return Math.round(accs.reduce((sum, a) => sum + a.healthScore, 0) / accs.length);
        },
        header: "Health",
        cell: ({ row }) => {
          const accs = row.original.whatsAppAccounts;
          const health = accs && accs.length > 0
            ? Math.round(accs.reduce((sum, a) => sum + a.healthScore, 0) / accs.length)
            : (row.original.aiScore ?? 0);
          
          const statusPriority = { BANNED: 4, LIMITED: 3, WARNING: 2, ACTIVE: 1 } as const;
          const worstStatus = accs && accs.length > 0
            ? accs.reduce((worst, acc) => {
                const p = statusPriority[acc.status as keyof typeof statusPriority] ?? 0;
                return p > (statusPriority[worst as keyof typeof statusPriority] ?? 0) ? acc.status : worst;
              }, "ACTIVE")
            : "AI score";

          const isBanned = worstStatus === "BANNED";
          const isWarning = worstStatus === "WARNING" || worstStatus === "LIMITED";
          
          let dotColor = "bg-emerald-500";
          let textColor = "text-emerald-700 dark:text-emerald-400";
          let barBg = "bg-emerald-500 dark:bg-emerald-600";
          
          if (isBanned) {
            dotColor = "bg-red-500";
            textColor = "text-red-600 dark:text-red-400";
            barBg = "bg-red-500 dark:bg-red-600";
          } else if (isWarning) {
            dotColor = "bg-amber-500";
            textColor = "text-amber-600 dark:text-amber-400";
            barBg = "bg-amber-500 dark:bg-amber-600";
          } else if (worstStatus === "AI score") {
            dotColor = "bg-sky-500";
            textColor = "text-sky-600 dark:text-sky-400";
            barBg = "bg-sky-500 dark:bg-sky-600";
          }

          return (
            <div className="min-w-[130px] max-w-[160px] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <div className="flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                  <span className={textColor}>{worstStatus}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400">{health}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-[2px] overflow-hidden">
                <div
                  className={`h-full rounded-[2px] transition-all ${barBg}`}
                  style={{ width: `${Math.max(0, Math.min(health, 100))}%` }}
                />
              </div>
            </div>
          );
        }
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Link 
              href={`/admin/users/${row.original.id}`} 
              className="grid h-7 w-7 place-items-center rounded-[4px] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" 
              title="View user details" 
              aria-label="View user"
            >
              <Eye className="h-3.5 w-3.5" />
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-[4px] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-400 transition-colors" 
              title="Change user role" 
              aria-label="Change role" 
              onClick={() => setPendingAction({ type: "promote", user: row.original })}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-[4px] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20 dark:hover:text-amber-400 transition-colors" 
              title="Disable user account" 
              aria-label="Disable user" 
              onClick={() => setPendingAction({ type: "disable", user: row.original })}
            >
              <Ban className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-[4px] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors" 
              title="Delete user permanently" 
              aria-label="Delete user" 
              onClick={() => setPendingAction({ type: "delete", user: row.original })}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="space-y-4 p-4">
      <section className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="mt-0.5 max-w-3xl text-[10px] text-muted-foreground">
            Search, filter, promote users to admin, disable accounts, delete users, and inspect performance.
          </p>
        </div>
        <Button 
          size="sm" 
          className="h-8 text-xs px-3"
          onClick={() => {
            console.log('Inviting new user...');
            alert('Invite User functionality - would open invite user modal/form');
          }}
        >
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
          Invite User
        </Button>
      </section>

      <Card className="rounded-sm border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100">Search & Filters</CardTitle>
          <CardDescription className="text-[10px] text-slate-400 dark:text-slate-500">Filter by name, email, role, status, AI score, or WhatsApp health.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-[1fr_150px_150px] pt-1 px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Search users..." className="pl-8 h-8 text-xs rounded-sm border-slate-200 dark:border-slate-800" />
          </div>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-8 rounded-sm border border-slate-200 dark:border-slate-800 bg-background px-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-ring">
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-8 rounded-sm border border-slate-200 dark:border-slate-800 bg-background px-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-ring">
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </CardContent>
      </Card>

      <Card className="rounded-sm border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100">Workspace Users</CardTitle>
          <CardDescription className="text-[10px] text-slate-400 dark:text-slate-500">TanStack Table with pagination-ready controls and admin actions.</CardDescription>
        </CardHeader>
        <CardContent className="pt-1 px-4 pb-3">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-sm" />
              <Skeleton className="h-8 w-full rounded-sm" />
              <Skeleton className="h-8 w-full rounded-sm" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-sm border border-slate-200/80 dark:border-slate-800">
                <table className="w-full min-w-[820px] text-left text-xs">
                  <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider font-bold">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} className="px-3 py-2.5 font-bold">
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-3 py-2.5 align-middle">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-col gap-2 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {table.getRowModel().rows.length} of {filteredUsers.length} users
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="h-7 text-xs px-3 rounded-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                  </Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs px-3 rounded-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        open={Boolean(pendingAction)}
        title={
          pendingAction?.type === "delete"
            ? "Delete user?"
            : pendingAction?.type === "disable"
              ? "Change account status?"
              : "Change user role?"
        }
        description={
          pendingAction
            ? `${pendingAction.user.fullName} will be ${
                pendingAction.type === "delete"
                  ? "removed from the workspace"
                  : pendingAction.type === "disable"
                    ? pendingAction.user.status === "ACTIVE"
                      ? "disabled"
                      : "enabled"
                    : pendingAction.user.role === "ADMIN"
                      ? "changed to User"
                      : "promoted to Admin"
              }.`
            : ""
        }
        confirmLabel={pendingAction?.type === "delete" ? "Delete" : "Apply"}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmAction}
      />
    </div>
  );
}
