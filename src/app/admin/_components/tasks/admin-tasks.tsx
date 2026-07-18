"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle2, 
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  UserPlus,
  Building2,
  Flag,
  Calendar,
  Loader2,
  MoreVertical,
  Clock,
  History,
  CheckCheck,
  AlertCircle,
  X,
  Target,
  Globe,
  MessageSquare,
  Paperclip,
  FileText,
  File,
  ExternalLink,
  Download,
  Image as ImageIcon,
  TrendingUp,
  User,
  ChevronDown,
  ChevronUp,
  Eye,
  Activity,
  Shield,
  Info
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
};

type Team = {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    members: number;
  };
};

type TaskProgressUpdate = {
  id: string;
  taskId: string;
  userId: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  progress: number;
  comment: string | null;
  createdAt: string;
};

type SubmissionFile = {
  id: string;
  submissionId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
};

type Submission = {
  id: string;
  taskId: string;
  userId: string;
  workDescription: string | null;
  remarks: string | null;
  progress: number;
  fileUrls: string[];
  files: SubmissionFile[];
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "NEEDS_REVISION" | "REJECTED";
  adminRemark: string | null;
  reviewedAt: string | null;
  reviewedById: string | null;
  user?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
  } | null;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category: string | null;
  dueDate: string | null;
  completedAt: string | null;
  assignmentType: "INDIVIDUAL" | "TEAM" | "ALL_USERS";
  assignedTo: User | null;
  assignedToTeam: { id: string; name: string } | null;
  createdBy: User;
  remarks: string | null;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  submissionNote?: string | null;
  submittedAt?: string | null;
  submittedFiles?: string[];
  progressUpdates?: TaskProgressUpdate[];
  submissions?: Submission[];
};

type TaskFormData = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category: string;
  startDate: string;
  dueDate: string;
  assignmentType: "INDIVIDUAL" | "TEAM" | "ALL_USERS";
  assignedToId: string;
  assignedToTeamId: string;
  remarks: string;
};

type TaskStats = {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  blocked: number;
  overdue: number;
};

// Returns a human-readable label for who/what a task is assigned to,
// regardless of assignment type (individual user, team, or all users).
function getAssigneeLabel(task: Task): string {
  if (task.assignmentType === "ALL_USERS") return "All Users";
  if (task.assignmentType === "TEAM") {
    return task.assignedToTeam?.name || "Unknown Team";
  }
  return task.assignedTo?.fullName || "Unassigned";
}

export function AdminTasks() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    blocked: 0,
    overdue: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "MEDIUM",
    category: "",
    startDate: "",
    dueDate: "",
    assignmentType: "INDIVIDUAL",
    assignedToId: "",
    assignedToTeamId: "",
    remarks: "",
  });
  const [teamFormData, setTeamFormData] = useState({
    name: "",
    description: "",
    memberIds: [] as string[],
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchTeams();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("q", searchQuery);

      const response = await fetch(`/api/admin/tasks?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setTasks(result.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/admin/teams");
      const result = await response.json();
      if (result.success) {
        setTeams(result.data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/tasks/stats");
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!formData.title) {
      alert("Please fill task title");
      return;
    }

    // Validate assignment
    if (formData.assignmentType === "INDIVIDUAL" && !formData.assignedToId) {
      alert("Please select a user to assign");
      return;
    }
    if (formData.assignmentType === "TEAM" && !formData.assignedToTeamId) {
      alert("Please select a team to assign");
      return;
    }

    try {
      // Get current user session
      const meResponse = await fetch("/api/auth/me");
      
      if (!meResponse.ok) {
        alert("Failed to get user session. Please login again.");
        return;
      }
      
      const meData = await meResponse.json();
      
      console.log("User session data:", meData);
      
      if (!meData.user?.id) {
        alert("Session expired. Please login again.");
        return;
      }

      const taskPayload = {
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority,
        category: formData.category || null,
        dueDate: formData.dueDate || null,
        assignmentType: formData.assignmentType,
        assignedToId: formData.assignmentType === "INDIVIDUAL" ? formData.assignedToId : null,
        assignedToTeamId: formData.assignmentType === "TEAM" ? formData.assignedToTeamId : null,
        assignToAll: formData.assignmentType === "ALL_USERS",
        remarks: formData.remarks || null,
        createdById: meData.user.id,
      };

      console.log("Creating task with payload:", taskPayload);

      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload),
      });

      const result = await response.json();
      
      console.log("Task creation response:", result);

      if (result.success) {
        await fetchTasks();
        await fetchStats();
        setIsCreateDialogOpen(false);
        setFormData({
          title: "",
          description: "",
          priority: "MEDIUM",
          category: "",
          startDate: "",
          dueDate: "",
          assignmentType: "INDIVIDUAL",
          assignedToId: "",
          assignedToTeamId: "",
          remarks: "",
        });
        alert("Task created successfully");
      } else {
        console.error("Task creation failed:", result.error);
        alert(result.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Network error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/admin/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTasks();
        await fetchStats();
        setIsEditDialogOpen(false);
        setEditingTask(null);
        alert("Task updated successfully");
      } else {
        alert(result.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Network error occurred");
    }
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${taskTitle}"?`)) return;

    try {
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        await fetchTasks();
        await fetchStats();
        alert("Task deleted successfully");
      } else {
        alert(result.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Network error occurred");
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      category: task.category || "",
      startDate: "", // Add logic to extract start date if stored
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assignmentType: task.assignmentType,
      assignedToId: task.assignedTo?.id || "",
      assignedToTeamId: task.assignedToTeam?.id || "",
      remarks: task.remarks || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTasks();
        await fetchStats();
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Network error occurred");
    }
  };

  const handleCreateTeam = async () => {
    if (!teamFormData.name) {
      alert("Please enter team name");
      return;
    }

    try {
      const response = await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamFormData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTeams();
        setIsTeamDialogOpen(false);
        setTeamFormData({ name: "", description: "", memberIds: [] });
        alert("Team created successfully");
      } else {
        alert(result.error || "Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Network error occurred");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingTasks = filteredTasks.filter(
    (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
  );
  const completedTasks = filteredTasks.filter((t) => t.status === "COMPLETED");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
      case "HIGH":
        return "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
      case "MEDIUM":
        return "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      default:
        return "border-slate-500 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-[#00C853] text-white";
      case "IN_PROGRESS":
        return "bg-blue-500 text-white";
      case "BLOCKED":
        return "bg-red-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && statusFilter !== "COMPLETED";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-blue-50/30 dark:bg-black px-3 py-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-white" />
            </div>
            Task Management Center
          </h1>

        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsTeamDialogOpen(true)}
            variant="outline"
            className="h-8 text-xs px-3 gap-1.5 font-semibold shadow-sm"
          >
            <Users className="h-3.5 w-3.5" />
            Manage Teams
          </Button>
          <Button
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                priority: "MEDIUM",
                category: "",
                startDate: "",
                dueDate: "",
                assignmentType: "INDIVIDUAL",
                assignedToId: "",
                assignedToTeamId: "",
                remarks: "",
              });
              setIsCreateDialogOpen(true);
            }}
            className="h-8 text-xs px-3 gap-1.5 font-semibold bg-[#00C853] hover:bg-[#00C853]/90 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:grid-cols-5">
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-50 to-transparent rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <CardContent className="p-3.5 relative">
            <div className="flex items-center justify-between mb-1.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shadow-sm">
                <Target className="h-3.5 w-3.5 text-slate-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
            <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">All Tasks</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shadow-sm">
                <Clock className="h-3.5 w-3.5 text-slate-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-700 dark:text-white">{stats.todo}</div>
            <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">To Do</p>
          </CardContent>
        </Card>

        <Card className="border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-blue-50/20 group">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm">
                <Loader2 className="h-3.5 w-3.5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
            <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">In Progress</p>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/20 group">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shadow-sm">
                <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#00C853]">{stats.completed}</div>
            <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">Completed</p>
          </CardContent>
        </Card>

        <Card className="border border-red-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-red-50/20 group">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-sm">
                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <p className="text-[10px] font-semibold text-red-600 mt-0.5">Blocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="border border-slate-200/60 shadow-sm bg-white">
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setTimeout(() => fetchTasks(), 300);
                }}
                className="pl-8 h-8 text-xs border-slate-200"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setTimeout(() => fetchTasks(), 100);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-8 text-xs border-slate-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Tabs defaultValue="all" className="space-y-3">
        <Card className="border border-slate-200/60 shadow-sm bg-white">
          <CardContent className="p-2">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1">
              <TabsTrigger value="all" className="text-[10px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <CheckCircle2 className="h-3 w-3 mr-1.5" />
                All ({filteredTasks.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-[10px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Clock className="h-3 w-3 mr-1.5" />
                Pending ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-[10px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <CheckCheck className="h-3 w-3 mr-1.5" />
                Completed ({completedTasks.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="text-[10px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <History className="h-3 w-3 mr-1.5" />
                History
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        {/* All Tasks Tab */}
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
              </CardContent>
            </Card>
          ) : filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No tasks found</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
                onStatusChange={handleUpdateStatus}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            ))
          )}
        </TabsContent>

        {/* Pending Tasks Tab */}
        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No pending tasks</p>
              </CardContent>
            </Card>
          ) : (
            pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
                onStatusChange={handleUpdateStatus}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            ))
          )}
        </TabsContent>

        {/* Completed Tasks Tab */}
        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCheck className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No completed tasks</p>
              </CardContent>
            </Card>
          ) : (
            completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
                onStatusChange={handleUpdateStatus}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            ))
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recent Task Activity</h3>
              <div className="space-y-3">
                {tasks.slice(0, 10).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{task.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {getAssigneeLabel(task)} •{" "}
                        {formatDate(task.updatedAt)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingTask(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl lg:max-w-3xl p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/60 shadow-2xl bg-white">
          {/* Header banner — matches the page header's emerald identity */}
          <DialogHeader className="px-6 py-6 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-50/20 border-b border-slate-200/40 space-y-0 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-50/30 to-transparent rounded-full -ml-12 -mb-12" />
            
            <div className="flex items-center gap-4 relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                {editingTask ? (
                  <Edit className="h-6 w-6 text-white" />
                ) : (
                  <Plus className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                  {editingTask ? "Edit Task" : "Create New Task"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-600 font-medium mt-1">
                  {editingTask
                    ? "Update the details below and save your changes"
                    : "Fill in the details and assign it to a user, team, or everyone"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable form body */}
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-5 bg-white">
            {/* Section: Task details */}
            <div className="space-y-4 rounded-xl border border-slate-200/40 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Target className="h-3.5 w-3.5" />
                Task Details
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Task Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="task-title"
                  placeholder="e.g., Publish Q3 blog post"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-white border-slate-200 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-description" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="task-description"
                  placeholder="What needs to be done?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[90px] bg-white border-slate-200 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            {/* Section: Assignment */}
            <div className="space-y-3 rounded-xl border border-slate-200/40 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Users className="h-3.5 w-3.5" />
                Assign To <span className="text-red-500 normal-case">*</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { type: "INDIVIDUAL" as const, label: "Individual", icon: UserPlus },
                    { type: "TEAM" as const, label: "Team", icon: Building2 },
                    { type: "ALL_USERS" as const, label: "All Users", icon: Globe },
                  ]
                ).map(({ type, label, icon: Icon }) => {
                  const isSelected = formData.assignmentType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, assignmentType: type })}
                      className={`h-20 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 transition-all duration-150 ${
                        isSelected
                          ? "border-[#00C853] bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? "text-[#00C853]" : "text-slate-400"}`} />
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Conditional Assignment Fields */}
              {formData.assignmentType === "INDIVIDUAL" && (
                <div className="space-y-1.5 pt-1">
                  <Label htmlFor="assign-to" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select User <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.assignedToId}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, assignedToId: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Choose a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.assignmentType === "TEAM" && (
                <div className="space-y-1.5 pt-1">
                  <Label htmlFor="assign-to-team" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Team <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.assignedToTeamId}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, assignedToTeamId: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Choose a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name} ({team._count?.members || 0} members)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.assignmentType === "ALL_USERS" && (
                <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-800 font-medium">
                    This task will be assigned to every active user in the system.
                  </p>
                </div>
              )}
            </div>

            {/* Section: Priority & Schedule */}
            <div className="space-y-3 rounded-xl border border-slate-200/40 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Flag className="h-3.5 w-3.5" />
                Priority & Schedule
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="priority" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Priority
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "LOW" | "MEDIUM" | "HIGH" | "URGENT") =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </Label>
                  <Input
                    id="category"
                    placeholder="e.g., Marketing"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="bg-white border-slate-200 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="start-date" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="bg-white border-slate-200 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="due-date" className="text-xs font-semibold text-slate-700">
                    End Date (Due Date)
                  </Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="bg-white border-slate-200 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Section: Notes */}
            <div className="space-y-1.5 rounded-xl border border-slate-200/40 bg-white p-4">
              <Label htmlFor="remarks" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <History className="h-3.5 w-3.5" />
                Remarks / Instructions
              </Label>
              <Textarea
                id="remarks"
                placeholder="Add any special instructions or notes"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                className="min-h-[70px] bg-white border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {/* Sticky footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200/60 bg-white">
            <Button
              variant="outline"
              className="border-slate-200 font-semibold"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setEditingTask(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#00C853] hover:bg-[#00C853]/90 font-semibold shadow-sm gap-1.5"
              onClick={editingTask ? handleUpdateTask : handleCreateTask}
            >
              {editingTask ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Update Task
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper: detect file type from URL/extension
function getFileType(url: string): 'image' | 'pdf' | 'doc' | 'spreadsheet' | 'video' | 'other' {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'odt', 'rtf', 'txt'].includes(ext)) return 'doc';
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'spreadsheet';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
  return 'other';
}

function FileTypeIcon({ fileType, className = "h-5 w-5" }: { fileType: string; className?: string }) {
  switch (fileType) {
    case 'image': return <ImageIcon className={className} />;
    case 'pdf': return <FileText className={className} />;
    case 'doc': return <FileText className={className} />;
    case 'spreadsheet': return <File className={className} />;
    default: return <Paperclip className={className} />;
  }
}

function FileTypeColors(fileType: string) {
  switch (fileType) {
    case 'image': return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
    case 'pdf': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
    case 'doc': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    case 'spreadsheet': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
    default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

// Comprehensive Student Submission Panel
function StudentSubmissionPanel({ task, formatDate }: { task: Task; formatDate: (date: string | null) => string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState<Record<string, string>>({});
  const [adminStatuses, setAdminStatuses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [adminUser, setAdminUser] = useState<any>(null);

  // Fetch admin user once
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setAdminUser(data.user);
      });
  }, []);

  // Fetch submissions lazily when expanded
  useEffect(() => {
    if (isExpanded) {
      fetchSubmissions();
    }
  }, [isExpanded]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/tasks/${task.id}/submissions`);
      const result = await res.json();
      if (result.success) {
        setSubmissions(result.data || []);
        // Initialize remarks and statuses state for editing
        const remarksMap: Record<string, string> = {};
        const statusMap: Record<string, string> = {};
        result.data.forEach((sub: Submission) => {
          remarksMap[sub.id] = sub.adminRemark || "";
          statusMap[sub.id] = sub.status;
        });
        setAdminRemarks(remarksMap);
        setAdminStatuses(statusMap);
      }
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReview = async (submissionId: string) => {
    try {
      setIsSaving((prev) => ({ ...prev, [submissionId]: true }));
      const status = adminStatuses[submissionId];
      const adminRemark = adminRemarks[submissionId];

      const res = await fetch(`/api/admin/tasks/${task.id}/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminRemark,
          reviewedById: adminUser?.id,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Submission review updated successfully!");
        fetchSubmissions();
      } else {
        alert(result.error || "Failed to update review");
      }
    } catch (err) {
      console.error("Failed to save review", err);
      alert("Network error occurred");
    } finally {
      setIsSaving((prev) => ({ ...prev, [submissionId]: false }));
    }
  };

  // We show submission block if there are submissions in the database OR if there are legacy fields
  const hasLegacySubmission = task.submissionNote || (task.submittedFiles && task.submittedFiles.length > 0);
  const hasDbSubmissions = task.submissions && task.submissions.length > 0;

  if (!hasLegacySubmission && !hasDbSubmissions) return null;

  return (
    <div className="mt-3">
      {/* Compact Summary Bar */}
      <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Student Submissions
                </span>
                {task.submittedAt && (
                  <span className="text-xs text-slate-500">
                    • Last Submitted: {formatDate(task.submittedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 px-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 gap-1"
          >
            {isExpanded ? (
              <><ChevronUp className="h-3.5 w-3.5" /> Hide</>
            ) : (
              <><ChevronDown className="h-3.5 w-3.5" /> See More</>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Details - Using the same green-bordered card styling */}
      {isExpanded && (
        <div className="mt-2 p-4 bg-white border-2 border-emerald-200 rounded-lg space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : submissions.length === 0 ? (
            // Fallback for legacy submission (before Submissions model was added)
            <div className="space-y-3 py-1 text-slate-700 dark:text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                  Legacy Submission Details
                </h4>
              </div>

              {/* Submitted By */}
              <div className="flex items-center gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 flex items-center gap-1.5">
                  <span>👤</span> Submitted By
                </div>
                <div className="flex-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {getAssigneeLabel(task)}
                </div>
              </div>

              {/* Submission Date & Time */}
              <div className="flex items-center gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 flex items-center gap-1.5">
                  <span>📅</span> Submission Date & Time
                </div>
                <div className="flex-1 text-xs text-slate-600 dark:text-slate-400">
                  {task.submittedAt ? formatDate(task.submittedAt) : "Not recorded"}
                </div>
              </div>

              {/* User Remarks */}
              <div className="flex items-start gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 pt-0.5 flex items-center gap-1.5">
                  <span>💬</span> User Remarks
                </div>
                <div className="flex-1 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {task.submissionNote || <span className="text-slate-400 italic">No remarks</span>}
                </div>
              </div>

              {/* Student's Attachments */}
              <div className="flex items-start gap-4 py-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 pt-2 flex items-center gap-1.5">
                  <span>📎</span> Student's Attachments
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {task.submittedFiles && task.submittedFiles.length > 0 ? (
                    task.submittedFiles.map((url, fIdx) => {
                      const rawName = url.split('?')[0].split('/').pop() || url;
                      const fileName = decodeURIComponent(rawName);
                      const ext = url.split('?')[0].split('.').pop()?.toLowerCase() || '';
                      const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext);
                      const isPdf = ext === 'pdf';
                      const isDoc = ['doc', 'docx'].includes(ext);
                      const isZip = ['zip', 'rar', '7z'].includes(ext);

                      return (
                        <div
                          key={fIdx}
                          className="group relative flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                        >
                          {isImage ? (
                            <div className="relative h-5 w-5 rounded overflow-hidden shrink-0 border border-slate-100">
                              <img src={url} alt={fileName} className="h-full w-full object-cover" loading="lazy" />
                            </div>
                          ) : (
                            <div className="shrink-0">
                              {isPdf ? (
                                <FileText className="h-5 w-5 text-red-500" />
                              ) : isDoc ? (
                                <File className="h-5 w-5 text-blue-500" />
                              ) : isZip ? (
                                <File className="h-5 w-5 text-amber-500" />
                              ) : (
                                <Paperclip className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                          )}

                          <div className="flex flex-col min-w-0">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-slate-700 hover:text-emerald-600 transition-colors truncate max-w-[160px]"
                              title={fileName}
                            >
                              {fileName}
                            </a>
                          </div>

                          <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-slate-100 shrink-0">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open in new tab"
                              className="p-0.5 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </a>
                            <a
                              href={url}
                              download
                              title="Download file"
                              className="p-0.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                      <Paperclip className="h-4 w-4 text-slate-300" />
                      <span className="text-xs text-slate-400 italic">No files uploaded.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Task Status */}
              <div className="flex items-center gap-4 py-1.5">
                <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 flex items-center gap-1.5">
                  <span>✅</span> Task Status
                </div>
                <div className="flex-1">
                  <Badge className="text-xs px-2 py-0.5 border bg-emerald-100 text-emerald-800 border-emerald-200">
                    {task.status}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            // Full interactive timeline of submissions
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Submission History Timeline
                </h4>
              </div>

              <div className="relative border-l-2 border-emerald-100 pl-4 ml-2 space-y-6">
                {submissions.map((sub) => {
                  const statusColors = {
                    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
                    APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
                    NEEDS_REVISION: "bg-orange-100 text-orange-800 border-orange-200",
                    REJECTED: "bg-red-100 text-red-800 border-red-200",
                  };

                  return (
                    <div key={sub.id} className="relative space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[25px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-white dark:bg-black" />

                      <div className="space-y-3 py-1 text-slate-700 dark:text-slate-200">
                        {/* Submitted By */}
                        <div className="flex items-center gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 flex items-center gap-1.5">
                            <span>👤</span> Submitted By
                          </div>
                          <div className="flex-1 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                            {sub.user?.fullName || "Student"}
                          </div>
                        </div>

                        {/* Submission Date & Time */}
                        <div className="flex items-center gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 flex items-center gap-1.5">
                            <span>📅</span> Submission Date & Time
                          </div>
                          <div className="flex-1 text-xs text-slate-600 dark:text-slate-400">
                            {new Date(sub.submittedAt).toLocaleString()}
                          </div>
                        </div>

                        {/* Work Description */}
                        <div className="flex items-start gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 pt-0.5 flex items-center gap-1.5">
                            <span>📝</span> Work Description
                          </div>
                          <div className="flex-1 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {sub.workDescription || <span className="text-slate-400 italic">No description provided</span>}
                          </div>
                        </div>

                        {/* User Remarks */}
                        <div className="flex items-start gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 pt-0.5 flex items-center gap-1.5">
                            <span>💬</span> User Remarks
                          </div>
                          <div className="flex-1 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {sub.remarks || <span className="text-slate-400 italic">No remarks</span>}
                          </div>
                        </div>

                        {/* Progress History */}
                        <div className="flex items-center gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 flex items-center gap-1.5">
                            <span>📊</span> Progress History
                          </div>
                          <div className="flex-1 flex items-center gap-3">
                            <div className="w-full max-w-xs h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sub.progress}%` }} />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{sub.progress}%</span>
                          </div>
                        </div>

                        {/* Student's Attachments */}
                        <div className="flex items-start gap-4 py-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 pt-2 flex items-center gap-1.5">
                            <span>📎</span> Student's Attachments
                          </div>
                          <div className="flex-1 flex flex-wrap gap-2">
                            {/* Rich SubmissionFile records (new submissions) */}
                            {sub.files && sub.files.length > 0 ? (
                              sub.files.map((sf) => {
                                const mime = sf.mimeType || "";
                                const isImage = mime.startsWith("image/");
                                const isPdf = mime === "application/pdf";
                                const isDoc = mime.includes("word") || mime.includes("msword");
                                const isSheet = mime.includes("sheet") || mime.includes("excel");
                                const isZip = mime.includes("zip") || mime.includes("compressed") || mime.includes("rar");

                                const sizeLabel = sf.fileSize > 0
                                  ? sf.fileSize >= 1024 * 1024
                                    ? `${(sf.fileSize / 1024 / 1024).toFixed(1)} MB`
                                    : `${(sf.fileSize / 1024).toFixed(0)} KB`
                                  : null;

                                return (
                                  <div
                                    key={sf.id}
                                    className="group relative flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                                  >
                                    {/* Icon / Thumbnail */}
                                    {isImage ? (
                                      <div className="relative h-5 w-5 rounded overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={sf.fileUrl}
                                          alt={sf.originalName}
                                          className="h-full w-full object-cover"
                                          loading="lazy"
                                        />
                                      </div>
                                    ) : (
                                      <div className="shrink-0">
                                        {isPdf ? (
                                          <FileText className="h-5 w-5 text-red-500" />
                                        ) : isDoc ? (
                                          <File className="h-5 w-5 text-blue-500" />
                                        ) : isSheet ? (
                                          <File className="h-5 w-5 text-emerald-500" />
                                        ) : isZip ? (
                                          <File className="h-5 w-5 text-amber-500" />
                                        ) : (
                                          <Paperclip className="h-5 w-5 text-slate-400" />
                                        )}
                                      </div>
                                    )}

                                    {/* Filename and Size */}
                                    <div className="flex flex-col min-w-0">
                                      <a
                                        href={sf.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate max-w-[160px]"
                                        title={sf.originalName}
                                      >
                                        {sf.originalName}
                                      </a>
                                      {sizeLabel && (
                                        <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                                          {sizeLabel}
                                        </span>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-slate-100 dark:border-slate-800 shrink-0">
                                      <a
                                        href={sf.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Open in new tab"
                                        className="p-0.5 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all"
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                      </a>
                                      <a
                                        href={sf.fileUrl}
                                        download={sf.originalName}
                                        title="Download file"
                                        className="p-0.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                                      >
                                        <Download className="h-3.5 w-3.5" />
                                      </a>
                                    </div>
                                  </div>
                                );
                              })
                            ) : sub.fileUrls && sub.fileUrls.length > 0 ? (
                              // Legacy fallback (old submissions before SubmissionFile model)
                              sub.fileUrls.map((url, fIdx) => {
                                const rawName = url.split('?')[0].split('/').pop() || url;
                                const fileName = decodeURIComponent(rawName);
                                const ext = url.split('?')[0].split('.').pop()?.toLowerCase() || '';
                                const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext);
                                const isPdf = ext === 'pdf';
                                const isDoc = ['doc', 'docx'].includes(ext);
                                const isZip = ['zip', 'rar', '7z'].includes(ext);

                                return (
                                  <div
                                    key={fIdx}
                                    className="group relative flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                                  >
                                    {isImage ? (
                                      <div className="relative h-5 w-5 rounded overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={fileName} className="h-full w-full object-cover" loading="lazy" />
                                      </div>
                                    ) : (
                                      <div className="shrink-0">
                                        {isPdf ? (
                                          <FileText className="h-5 w-5 text-red-500" />
                                        ) : isDoc ? (
                                          <File className="h-5 w-5 text-blue-500" />
                                        ) : isZip ? (
                                          <File className="h-5 w-5 text-amber-500" />
                                        ) : (
                                          <Paperclip className="h-5 w-5 text-slate-400" />
                                        )}
                                      </div>
                                    )}

                                    <div className="flex flex-col min-w-0">
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate max-w-[160px]"
                                        title={fileName}
                                      >
                                        {fileName}
                                      </a>
                                    </div>

                                    <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-slate-100 dark:border-slate-800 shrink-0">
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Open in new tab"
                                        className="p-0.5 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all"
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                      </a>
                                      <a
                                        href={url}
                                        download
                                        title="Download file"
                                        className="p-0.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                                      >
                                        <Download className="h-3.5 w-3.5" />
                                      </a>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                <Paperclip className="h-4 w-4 text-slate-300" />
                                <span className="text-xs text-slate-400 italic">No files uploaded.</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Task Status */}
                        <div className="flex items-center gap-4 py-1.5">
                          <div className="text-xs font-semibold text-slate-500 w-44 shrink-0 flex items-center gap-1.5">
                            <span>✅</span> Task Status
                          </div>
                          <div className="flex-1">
                            <Badge className={`text-xs px-2 py-0.5 border ${statusColors[sub.status]}`}>
                              {sub.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Admin Feedback Input Form */}
                      <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100 space-y-3">
                        <span className="text-xs font-bold text-emerald-900 block">
                          Review Submission
                        </span>
                        
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-slate-500">Status</Label>
                            <Select
                              value={adminStatuses[sub.id]}
                              onValueChange={(val) => setAdminStatuses(prev => ({ ...prev, [sub.id]: val }))}
                            >
                              <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending Review</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="NEEDS_REVISION">Needs Revision</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-slate-500">Remarks / Feedback</Label>
                            <Textarea
                              className="h-8 min-h-[32px] text-xs py-1.5 bg-white border-slate-200 resize-none"
                              placeholder="Feedback notes to user..."
                              value={adminRemarks[sub.id]}
                              onChange={(e) => setAdminRemarks(prev => ({ ...prev, [sub.id]: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-1">
                          <Button
                            size="sm"
                            disabled={isSaving[sub.id]}
                            onClick={() => handleSaveReview(sub.id)}
                            className="h-7 text-xs bg-emerald-600 text-white hover:bg-emerald-700 font-semibold gap-1"
                          >
                            {isSaving[sub.id] ? (
                              <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>
                            ) : (
                              "Save Feedback"
                            )}
                          </Button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// TaskCard Component
function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  getPriorityColor,
  getStatusColor,
  formatDate,
  isOverdue,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  formatDate: (date: string | null) => string;
  isOverdue: (date: string | null) => boolean;
}) {
  const isTaskOverdue = isOverdue(task.dueDate);

  return (
    <Card className={`hover:shadow-md transition-shadow ${isTaskOverdue ? "border-red-300" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPriorityColor(task.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace("_", " ")}
              </Badge>
              {isTaskOverdue && (
                <Badge className="bg-red-600 text-white">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  OVERDUE
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Assigned to:{" "}
                <span className="font-semibold">{getAssigneeLabel(task)}</span>
              </div>
              {task.dueDate && (
                <div className={`flex items-center gap-1 ${isTaskOverdue ? "text-red-600 font-semibold" : ""}`}>
                  <Calendar className="h-4 w-4" />
                  Due: <span className="font-semibold">{formatDate(task.dueDate)}</span>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed: {formatDate(task.completedAt)}
                </div>
              )}
            </div>

            {/* Student Submission Panel — shows whenever there is submission data or progress history */}
            <StudentSubmissionPanel 
              task={task}
              formatDate={formatDate}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              
              {task.status !== "TODO" && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "TODO")}>
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as To Do
                </DropdownMenuItem>
              )}
              
              {task.status !== "IN_PROGRESS" && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "IN_PROGRESS")}>
                  <Loader2 className="h-4 w-4 mr-2" />
                  Mark as In Progress
                </DropdownMenuItem>
              )}
              
              {task.status !== "COMPLETED" && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "COMPLETED")}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Completed
                </DropdownMenuItem>
              )}
              
              {task.status !== "BLOCKED" && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "BLOCKED")}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Mark as Blocked
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(task.id, task.title)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}