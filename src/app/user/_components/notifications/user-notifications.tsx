"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar,
  MessageSquare,
  Brain,
  User,
  Settings,
  X,
  Check
} from "lucide-react";

type Notification = {
  id: string;
  type: "task" | "ai" | "admin" | "calendar" | "deadline" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionable: boolean;
};

const notificationData: Notification[] = [
  {
    id: "1",
    type: "task",
    title: "New Task Assigned",
    message: "Follow up with warm leads from yesterday - Due today",
    timestamp: "5 minutes ago",
    isRead: false,
    priority: "high",
    actionable: true
  },
  {
    id: "2",
    type: "ai",
    title: "AI Recommendation",
    message: "Your best send time has shifted to 10:00-11:00 AM based on recent data",
    timestamp: "1 hour ago",
    isRead: false,
    priority: "medium",
    actionable: true
  },
  {
    id: "3",
    type: "deadline",
    title: "Deadline Alert",
    message: "Task 'Update messaging templates' is due tomorrow",
    timestamp: "2 hours ago",
    isRead: false,
    priority: "high",
    actionable: true
  },
  {
    id: "4",
    type: "admin",
    title: "Admin Remark",
    message: "Great job on maintaining 93% reply rate! Keep up the quality work.",
    timestamp: "3 hours ago",
    isRead: true,
    priority: "medium",
    actionable: false
  },
  {
    id: "5",
    type: "calendar",
    title: "Calendar Reminder",
    message: "Team meeting: Weekly AI review - Starting in 30 minutes",
    timestamp: "4 hours ago",
    isRead: false,
    priority: "medium",
    actionable: true
  },
  {
    id: "6",
    type: "task",
    title: "Task Update",
    message: "Your task 'Review banned account logs' has been marked as Blocked",
    timestamp: "5 hours ago",
    isRead: true,
    priority: "high",
    actionable: true
  },
  {
    id: "7",
    type: "ai",
    title: "Performance Insight",
    message: "Your AI performance score increased to 91 (+6 from last week)",
    timestamp: "6 hours ago",
    isRead: true,
    priority: "low",
    actionable: false
  },
  {
    id: "8",
    type: "system",
    title: "System Notification",
    message: "Your daily message quota is 75% complete (150/200)",
    timestamp: "Yesterday",
    isRead: true,
    priority: "low",
    actionable: false
  },
  {
    id: "9",
    type: "calendar",
    title: "Event Reminder",
    message: "Follow-up sprint scheduled for 2:00 PM today",
    timestamp: "Yesterday",
    isRead: true,
    priority: "medium",
    actionable: true
  },
  {
    id: "10",
    type: "admin",
    title: "Team Announcement",
    message: "New AI features added to the platform - Check AI Insights tab",
    timestamp: "2 days ago",
    isRead: true,
    priority: "low",
    actionable: false
  }
];

export function UserNotifications() {
  const [notifications, setNotifications] = useState(notificationData);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task": return CheckCircle2;
      case "ai": return Brain;
      case "admin": return User;
      case "calendar": return Calendar;
      case "deadline": return AlertCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-500";
      case "ai": return "bg-[#00C853]";
      case "admin": return "bg-purple-500";
      case "calendar": return "bg-orange-500";
      case "deadline": return "bg-red-500";
      default: return "bg-slate-500";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge tone="danger">High</Badge>;
      case "medium": return <Badge tone="warning">Medium</Badge>;
      default: return <Badge tone="default">Low</Badge>;
    }
  };

  const filterNotifications = (filter?: string) => {
    if (!filter || filter === "all") return notifications;
    if (filter === "unread") return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === filter);
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const Icon = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(notification.type);

    return (
      <Card className={`hover:shadow-md transition-all ${!notification.isRead ? 'border-[#00C853] bg-[#E8F7EE]/20 dark:bg-[#143D2C]/10' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colorClass} flex items-center justify-center`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-[#00C853]" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{notification.message}</p>
                </div>
                {getPriorityBadge(notification.priority)}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  {notification.timestamp}
                </div>
                
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                      className="h-7 text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark Read
                    </Button>
                  )}
                  {notification.actionable && (
                    <Button 
                      size="sm" 
                      className="h-7 text-xs bg-[#00C853] hover:bg-[#00C853]/90"
                    >
                      Take Action
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => deleteNotification(notification.id)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-8 w-8 text-[#00C853]" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white ml-2">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Stay updated with tasks, AI insights, and team communications
          </p>
        </div>
        <Button 
          onClick={markAllAsRead}
          variant="outline"
          className="border-[#00C853] text-[#00C853]"
          disabled={unreadCount === 0}
        >
          <Check className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{notifications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Unread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00C853]">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {notifications.filter(n => n.priority === "high").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Actionable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {notifications.filter(n => n.actionable && !n.isRead).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="task">Tasks</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="deadline">Deadlines</TabsTrigger>
        </TabsList>

        {/* All Notifications */}
        <TabsContent value="all" className="space-y-4">
          {filterNotifications("all").length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No notifications</p>
              </CardContent>
            </Card>
          ) : (
            filterNotifications("all").map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        {/* Unread Notifications */}
        <TabsContent value="unread" className="space-y-4">
          {filterNotifications("unread").length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-[#00C853] mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">All caught up! No unread notifications.</p>
              </CardContent>
            </Card>
          ) : (
            filterNotifications("unread").map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        {/* Task Notifications */}
        <TabsContent value="task" className="space-y-4">
          {filterNotifications("task").map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>

        {/* AI Notifications */}
        <TabsContent value="ai" className="space-y-4">
          {filterNotifications("ai").map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>

        {/* Admin Notifications */}
        <TabsContent value="admin" className="space-y-4">
          {filterNotifications("admin").map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>

        {/* Calendar Notifications */}
        <TabsContent value="calendar" className="space-y-4">
          {filterNotifications("calendar").map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>

        {/* Deadline Notifications */}
        <TabsContent value="deadline" className="space-y-4">
          {filterNotifications("deadline").map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
