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
            <p className="font-medium">{row.original.fullName}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
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
              <div className="mb-2 flex items-center justify-between text-xs">
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
          <div className="flex items-center gap-1">
            <Link href={`/admin/users/${row.original.id}`} className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" title="View user" aria-label="View user">
              <Eye className="h-4 w-4" />
            </Link>
            <Button variant="ghost" size="icon" title="Change role" aria-label="Change role" onClick={() => setPendingAction({ type: "promote", user: row.original })}>
              <ShieldCheck className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Disable user" aria-label="Disable user" onClick={() => setPendingAction({ type: "disable", user: row.original })}>
              <Ban className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete user" aria-label="Delete user" onClick={() => setPendingAction({ type: "delete", user: row.original })}>
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
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-2xl font-semibold">User Management</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Search, filter, promote users to admin, disable accounts, delete users, and inspect performance.
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>Filter by name, email, role, status, AI score, or WhatsApp health.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Search users..." className="pl-10" />
          </div>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring">
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring">
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Users</CardTitle>
          <CardDescription>TanStack Table with pagination-ready controls and admin actions.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} className="px-4 py-3 font-medium">
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
                          <td key={cell.id} className="px-4 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {table.getRowModel().rows.length} of {filteredUsers.length} users
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
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
