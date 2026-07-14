"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle,
  Search,
  TrendingDown,
  TrendingUp
} from "lucide-react";

type WhatsAppAccount = {
  userId: string;
  userName: string;
  status: "ACTIVE" | "WARNING" | "LIMITED" | "BANNED";
  healthScore: number;
  dailyMessages: number;
  monthlyMessages: number;
  lastChecked: string;
  warningCount: number;
  banCount: number;
};

export function AdminWhatsApp() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "WARNING": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "LIMITED": return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "BANNED": return <Ban className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "WARNING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
      case "LIMITED": return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
      case "BANNED": return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      default: return "";
    }
  };

  const accountCounts = {
    all: accounts.length,
    active: accounts.filter(a => a.status === "ACTIVE").length,
    warning: accounts.filter(a => a.status === "WARNING").length,
    limited: accounts.filter(a => a.status === "LIMITED").length,
    banned: accounts.filter(a => a.status === "BANNED").length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-[#00C853]" />
            WhatsApp Monitoring
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Monitor team WhatsApp account health and activity
          </p>
        </div>
        <Button className="bg-[#00C853] hover:bg-[#00C853]/90">
          Run Health Check
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{accountCounts.active}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{accountCounts.warning}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Limited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{accountCounts.limited}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Banned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{accountCounts.banned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{accountCounts.all}</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search accounts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="warning">Warning</TabsTrigger>
          <TabsTrigger value="limited">Limited</TabsTrigger>
          <TabsTrigger value="banned">Banned</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {accounts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No WhatsApp accounts found</p>
              </CardContent>
            </Card>
          ) : (
            accounts.map((account) => (
              <Card key={account.userId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-[#00C853] flex items-center justify-center text-white font-bold">
                          {account.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {account.userName}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Last checked: {account.lastChecked}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(account.status)}>
                        {getStatusIcon(account.status)}
                        <span className="ml-1">{account.status}</span>
                      </Badge>
                    </div>

                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Health Score
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {account.healthScore}
                      </div>
                      <Progress value={account.healthScore} className="h-2" />
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Daily Messages
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {account.dailyMessages}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Monthly Messages
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {account.monthlyMessages}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Warnings
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {account.warningCount}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1 mt-2">
                        Bans
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {account.banCount}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
