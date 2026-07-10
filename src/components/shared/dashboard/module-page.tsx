"use client";

import { Download, Filter, Plus, Search } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { chartData, moduleContent, type ModuleKey } from "@/lib/shared/demo-data";

type ModulePageProps = {
  moduleKey: ModuleKey;
  role: "ADMIN" | "USER";
  detailId?: string;
};

export function ModulePage({ moduleKey, role, detailId }: ModulePageProps) {
  const content = moduleContent[moduleKey];
  const Icon = content.icon;
  const title = role === "USER" && moduleKey !== "profile" && !content.title.startsWith("My")
    ? content.title.replace("Task Assignment", "My Tasks").replace("Activity Tracking", "My Activity").replace("Reports", "My Reports")
    : content.title;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-primary text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{detailId ? "User Details" : title}</h2>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{content.description}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button>
            {moduleKey === "reports" ? <Download className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {content.primaryAction}
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.35fr]">
        <Card>
          <CardHeader>
            <CardTitle>Search & Filters</CardTitle>
            <CardDescription>Filter by name, email, date, role, status, AI score, and WhatsApp status.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search records..." className="pl-10" />
            </div>
            <select className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring">
              <option>All statuses</option>
              <option>Active</option>
              <option>Warning</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
            <Input type="date" />
            <select className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring">
              <option>Any role</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <select className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring">
              <option>Any WhatsApp status</option>
              <option>Active</option>
              <option>Warning</option>
              <option>Limited</option>
              <option>Banned</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Health</CardTitle>
            <CardDescription>Current operational readiness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Completion", 88],
              ["AI Score", 91],
              ["Data Quality", 84]
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <Progress value={Number(value)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.58fr_0.42fr]">
        <Card>
          <CardHeader>
            <CardTitle>{detailId ? `Profile ${detailId}` : title} Records</CardTitle>
            <CardDescription>Role-aware operational table with pagination-ready structure.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    {content.columns.map((column) => (
                      <th key={column} className="px-4 py-3 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(content.rows.length ? content.rows : [["No records yet", role, "Active", "Workspace", "91"]]).map((row, rowIndex) => (
                    <tr key={row.join("-") + rowIndex} className="hover:bg-muted/50">
                      {row.map((cell, index) => (
                        <td key={`${cell}-${index}`} className="px-4 py-3">
                          {index === 2 || String(cell).match(/active|warning|limited|todo|progress|blocked|read|unread/i) ? (
                            <Badge tone={String(cell).match(/warning|blocked|limited|unread/i) ? "warning" : String(cell).match(/active|complete|up|read/i) ? "success" : "info"}>
                              {cell}
                            </Badge>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Page 1 of 1</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled>Previous</Button>
                <Button variant="secondary" size="sm" disabled>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Snapshot</CardTitle>
            <CardDescription>Compact trend view for this module.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                  <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                  <YAxis stroke="currentColor" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="tasks" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
