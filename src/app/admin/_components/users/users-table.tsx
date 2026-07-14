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
  whatsAppStatus?: {
    status: string;
    healthScore: number;
  } | null;
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
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-xs">{row.original.fullName}</p>
            <p className="text-[10px] text-muted-foreground">{row.original.email}</p>
          </div>
        )
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <Badge tone={row.original.role === "ADMIN" ? "info" : "default"}>{row.original.role}</Badge>
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge tone={row.original.status === "ACTIVE" ? "success" : "danger"}>{row.original.status}</Badge>
      },
      {
        accessorKey: "teamName",
        header: "Team",
        cell: ({ row }) => row.original.teamName ?? "Unassigned"
      },
      {
        accessorFn: (row) => row.whatsAppStatus?.healthScore ?? row.aiScore ?? 0,
        header: "Health",
        cell: ({ row }) => {
          const health = row.original.whatsAppStatus?.healthScore ?? row.original.aiScore ?? 0;
          return (
            <div className="min-w-32">
              <div className="mb-1.5 flex items-center justify-between text-[10px]">
                <span>{row.original.whatsAppStatus?.status ?? "AI score"}</span>
                <span>{health}</span>
              </div>
              <Progress value={health} />
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
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-sm" 
              title="View user details" 
              aria-label="View user"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 hover:scale-105 hover:shadow-sm" 
              title="Change user role" 
              aria-label="Change role" 
              onClick={() => setPendingAction({ type: "promote", user: row.original })}
            >
              <ShieldCheck className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 hover:scale-105 hover:shadow-sm" 
              title="Disable user account" 
              aria-label="Disable user" 
              onClick={() => setPendingAction({ type: "disable", user: row.original })}
            >
              <Ban className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-105 hover:shadow-sm" 
              title="Delete user permanently" 
              aria-label="Delete user" 
              onClick={() => setPendingAction({ type: "delete", user: row.original })}
            >
              <Trash2 className="h-4 w-4" />
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

      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-bold text-slate-800">Search & Filters</CardTitle>
          <CardDescription className="text-[10px] text-slate-400">Filter by name, email, role, status, AI score, or WhatsApp health.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-[1fr_150px_150px] pt-1 px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Search users..." className="pl-8 h-8 text-xs" />
          </div>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-ring">
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-ring">
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-bold text-slate-800">Workspace Users</CardTitle>
          <CardDescription className="text-[10px] text-slate-400">TanStack Table with pagination-ready controls and admin actions.</CardDescription>
        </CardHeader>
        <CardContent className="pt-1 px-4 pb-3">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[820px] text-left text-xs">
                  <thead className="bg-muted text-muted-foreground text-[10px] uppercase tracking-wider font-bold">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} className="px-3 py-2 font-semibold">
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-border">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-3 py-2">
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
                  <Button variant="secondary" size="sm" className="h-7 text-xs px-3" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                  </Button>
                  <Button variant="secondary" size="sm" className="h-7 text-xs px-3" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
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
