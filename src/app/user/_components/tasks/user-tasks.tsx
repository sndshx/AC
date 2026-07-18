"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Search,
  Loader2,
  Clock,
  CheckCheck,
  AlertCircle,
  Target,
  Calendar,
  Flag,
  ClipboardList,
  Eye,
  Play,
  MessageSquare,
  Paperclip,
  User,
  Users,
  BarChart3,
  TrendingUp,
  MoreVertical,
  Filter,
  FileText,
  History,
  Plus,
  X
} from "lucide-react";

type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
};

type TaskComment = {
  id: string;
  content: string;
  createdAt: string;
  user: User;
};

type TaskProgress = {
  id: string;
  percentage: number;
  note: string;
  createdAt: string;
};

type Submission = {
  id: string;
  taskId: string;
  userId: string;
  workDescription: string | null;
  remarks: string | null;
  progress: number;
  fileUrls: string[];
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "NEEDS_REVISION" | "REJECTED";
  adminRemark: string | null;
  reviewedAt: string | null;
  reviewedById: string | null;
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
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  progress: number;
  assignmentType: "INDIVIDUAL" | "TEAM" | "ALL_USERS";
  assignedTo: User | null;
  assignedToTeam: { id: string; name: string } | null;
  createdBy: User;
  comments?: TaskComment[];
  progressHistory?: TaskProgress[];
  attachments?: string[];
  submissionNote?: string | null;
  submittedAt?: string | null;
  submittedFiles?: string[];
  submissions?: Submission[];
};

type TaskStats = {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  blocked: number;
  overdue: number;
};

export function UserTasks() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
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
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [submissionNote, setSubmissionNote] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [submissionProgress, setSubmissionProgress] = useState(100);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressNote, setProgressNote] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchTasks();
      fetchStats();
    }
  }, [currentUserId, statusFilter, searchQuery]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const result = await response.json();
      if (result.user?.id) {
        setCurrentUserId(result.user.id);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchTasks = async () => {
    if (!currentUserId) return;

    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append("userId", currentUserId);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("q", searchQuery);

      const response = await fetch(`/api/user/tasks?${params.toString()}`);
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

  const fetchStats = async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(`/api/user/tasks/stats?userId=${currentUserId}`);
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const response = await fetch(`/api/user/tasks/${taskId}`, {
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

  const handleStartTask = async (taskId: string) => {
    await handleUpdateStatus(taskId, "IN_PROGRESS");
  };

  const handleMarkComplete = async (taskId: string) => {
    // Open submission dialog instead of directly completing
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsSubmitDialogOpen(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Check file size (100MB max per file)
      const maxSize = 100 * 1024 * 1024; // 100MB
      const validFiles = fileArray.filter(file => {
        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Max size is 100MB`);
          return false;
        }
        return true;
      });
      setUploadedFiles([...uploadedFiles, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmitTask = async () => {
    if (!selectedTask || !currentUserId) return;

    if (!workDescription.trim() && !submissionNote.trim() && uploadedFiles.length === 0) {
      alert("Please enter work description, remarks, or upload at least one file");
      return;
    }

    try {
      setIsUploading(true);

      // Upload files first if any — capture full metadata, not just URLs
      let uploadedFileObjects: Array<{ url: string; name: string; fileSize: number; mimeType: string }> = [];
      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        uploadedFiles.forEach(file => {
          formData.append('files', file);
        });
        formData.append('folder', 'ai-marketing-command/task-submissions');
        formData.append('taskId', selectedTask.id);
        formData.append('userId', currentUserId);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          // Prefer the full files[] array with metadata; fall back to plain URLs
          if (uploadResult.files && uploadResult.files.length > 0) {
            uploadedFileObjects = uploadResult.files.map((f: { url: string; name: string; fileSize?: number; mimeType?: string }) => ({
              url: f.url,
              name: f.name,
              fileSize: f.fileSize ?? 0,
              mimeType: f.mimeType ?? 'application/octet-stream',
            }));
          } else if (uploadResult.urls) {
            // Legacy fallback: plain URLs with names inferred from local files list
            uploadedFileObjects = uploadResult.urls.map((url: string, i: number) => ({
              url,
              name: uploadedFiles[i]?.name || url.split('/').pop() || 'file',
              fileSize: uploadedFiles[i]?.size ?? 0,
              mimeType: uploadedFiles[i]?.type || 'application/octet-stream',
            }));
          }
        } else {
          const uploadError = await uploadResponse.json().catch(() => ({}));
          alert(uploadError.error || "File upload failed. Please try again.");
          setIsUploading(false);
          return;
        }
      }

      // Submit task completion using the new endpoint
      const response = await fetch(`/api/user/tasks/${selectedTask.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          workDescription: workDescription.trim(),
          remarks: submissionNote.trim(),
          progress: submissionProgress,
          files: uploadedFileObjects,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTasks();
        await fetchStats();
        setIsSubmitDialogOpen(false);
        setSubmissionNote("");
        setWorkDescription("");
        setSubmissionProgress(100);
        setUploadedFiles([]);
        alert("Task submitted successfully! Admin has been notified.");
      } else {
        alert(result.error || "Failed to submit task");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Network error occurred");
    } finally {
      setIsUploading(false);
    }

  };

  const handleUpdateProgress = async (taskId: string) => {
    if (!progressNote.trim()) {
      alert("Please add a progress note");
      return;
    }

    try {
      const response = await fetch(`/api/user/tasks/${taskId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          percentage: progressValue,
          note: progressNote,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTasks();
        setProgressValue(0);
        setProgressNote("");
        alert("Progress updated successfully");
      } else {
        alert(result.error || "Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Network error occurred");
    }
  };

  const handleAddComment = async (taskId: string) => {
    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const response = await fetch(`/api/user/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      const result = await response.json();

      if (result.success) {
        setNewComment("");
        if (selectedTask?.id === taskId) {
          const taskResponse = await fetch(`/api/user/tasks/${taskId}`);
          const taskResult = await taskResponse.json();
          if (taskResult.success) {
            setSelectedTask(taskResult.data);
          }
        }
        alert("Comment added successfully");
      } else {
        alert(result.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Network error occurred");
    }
  };

  const handleViewDetails = async (task: Task) => {
    try {
      const response = await fetch(`/api/user/tasks/${task.id}`);
      const result = await response.json();

      if (result.success) {
        setSelectedTask(result.data);
        setIsDetailDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      setSelectedTask(task);
      setIsDetailDialogOpen(true);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    if (statusFilter === "dueToday") {
      const today = new Date().toDateString();
      const taskDue = task.dueDate ? new Date(task.dueDate).toDateString() : null;
      return matchesSearch && taskDue === today;
    }
    if (statusFilter === "overdue") {
      return matchesSearch && isOverdue(task);
    }

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingTasks = filteredTasks.filter(
    (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
  );
  const completedTasks = filteredTasks.filter((t) => t.status === "COMPLETED");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "border-red-500 bg-red-50 text-red-700";
      case "HIGH":
        return "border-orange-500 bg-orange-50 text-orange-700";
      case "MEDIUM":
        return "border-blue-500 bg-blue-50 text-blue-700";
      default:
        return "border-slate-500 bg-slate-50 text-slate-700";
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

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === "COMPLETED") return false;
    return new Date(task.dueDate) < new Date();
  };

  const getAssignmentLabel = (task: Task) => {
    if (task.assignmentType === "ALL_USERS") return "All Users";
    if (task.assignmentType === "TEAM") return task.assignedToTeam?.name || "Team";
    return "Me";
  };

  const calculateOverallProgress = () => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
    return Math.round(totalProgress / tasks.length);
  };

  const getCompletionPercentage = () => {
    if (tasks.length === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-blue-50/30 dark:bg-black px-3 py-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Tasks</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track and manage your assigned tasks
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Completion Rate</span>
                <span className="font-bold text-emerald-600">{getCompletionPercentage()}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="text-center p-2 bg-slate-50 rounded">
                <div className="text-xl font-bold text-slate-900">{stats.completed}</div>
                <div className="text-[10px] text-slate-600">Completed</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded">
                <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-[10px] text-slate-600">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Task Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-xs text-slate-700">Pending</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{stats.todo}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs text-slate-700">In Progress</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{stats.inProgress}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                <span className="text-xs text-slate-700">Blocked</span>
              </div>
              <span className="text-sm font-bold text-red-600">{stats.blocked}</span>
            </div>

            {stats.overdue > 0 && (
              <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-red-700" />
                  <span className="text-xs font-semibold text-red-900">Overdue</span>
                </div>
                <span className="text-sm font-bold text-red-700">{stats.overdue}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Summary Cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Task Summary
        </h2>
        <div className="grid gap-3 md:grid-cols-6">
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <Target className="h-4 w-4 text-slate-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <p className="text-[10px] font-semibold text-slate-600 mt-0.5">Total</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <Clock className="h-4 w-4 text-slate-600" />
              </div>
              <div className="text-2xl font-bold text-slate-700">{stats.todo}</div>
              <p className="text-[10px] font-semibold text-slate-600 mt-0.5">Pending</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 shadow-sm hover:shadow-md transition-shadow bg-blue-50/30">
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <Loader2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-[10px] font-semibold text-blue-600 mt-0.5">In Progress</p>
            </CardContent>
          </Card>

          <Card className="border border-emerald-200 shadow-sm hover:shadow-md transition-shadow bg-emerald-50/30">
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <CheckCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
              <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">Completed</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
              <p className="text-[10px] font-semibold text-red-600 mt-0.5">Blocked</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-400 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-red-50 via-white to-red-50 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-transparent to-red-400/10 animate-pulse"></div>
            <CardContent className="p-4 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all">
                  <AlertCircle className="h-4 w-4 text-red-800 animate-bounce" />
                </div>
                {stats.overdue > 0 && (
                  <div className="relative">
                    <span className="text-[9px] font-bold text-white bg-red-600 px-2 py-1 rounded-full shadow-lg animate-pulse">
                      URGENT!
                    </span>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-red-800 mb-1">{stats.overdue}</div>
              <p className="text-[11px] font-bold text-red-800">🔥 Overdue</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setTimeout(() => fetchTasks(), 300);
                }}
                className="pl-8 h-8 text-xs"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setTimeout(() => fetchTasks(), 100);
              }}
            >
              <SelectTrigger className="w-full sm:w-[130px] h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="TODO">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="dueToday">Due Today</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-full sm:w-[130px] h-8 text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Task List
        </h2>
        <Tabs defaultValue="all" className="space-y-3">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-2">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
                <TabsTrigger value="all" className="text-[10px] font-semibold">
                  All ({filteredTasks.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-[10px] font-semibold">
                  Pending ({pendingTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-[10px] font-semibold">
                  Completed ({completedTasks.length})
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* All Tasks Tab */}
          <TabsContent value="all" className="space-y-3">
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </CardContent>
              </Card>
            ) : filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No tasks found</p>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={handleViewDetails}
                  onStartTask={handleStartTask}
                  onMarkComplete={handleMarkComplete}
                  onUpdateStatus={handleUpdateStatus}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  isOverdue={isOverdue}
                  getAssignmentLabel={getAssignmentLabel}
                />
              ))
            )}
          </TabsContent>

          {/* Pending Tasks Tab */}
          <TabsContent value="pending" className="space-y-3">
            {pendingTasks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No pending tasks</p>
                </CardContent>
              </Card>
            ) : (
              pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={handleViewDetails}
                  onStartTask={handleStartTask}
                  onMarkComplete={handleMarkComplete}
                  onUpdateStatus={handleUpdateStatus}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  isOverdue={isOverdue}
                  getAssignmentLabel={getAssignmentLabel}
                />
              ))
            )}
          </TabsContent>

          {/* Completed Tasks Tab */}
          <TabsContent value="completed" className="space-y-3">
            {completedTasks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No completed tasks</p>
                </CardContent>
              </Card>
            ) : (
              completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={handleViewDetails}
                  onStartTask={handleStartTask}
                  onMarkComplete={handleMarkComplete}
                  onUpdateStatus={handleUpdateStatus}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  isOverdue={isOverdue}
                  getAssignmentLabel={getAssignmentLabel}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Task Details Dialog - Redesigned with Green Theme */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Task Details
                  <Badge className="text-xs px-2 py-1">1</Badge>
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-600 mt-1">
                  View complete task information
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-[#00C853]/10 text-[#00C853] border-[#00C853]/30 font-semibold">
                  In Progress
                </Badge>
                <Badge className="bg-red-100 text-red-700 border-red-300 font-semibold">
                  Blocked
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-5 pt-4">
              {/* Task Title and Badges */}
              <div>
                <h2 className="text-2xl font-bold text-[#00C853] mb-3">
                  {selectedTask.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-red-100 text-red-700 border-2 border-red-300 px-3 py-1">
                    <Flag className="h-3 w-3 mr-1" />
                    {selectedTask.priority} Priority
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-700 border-2 border-slate-300 px-3 py-1">
                    <User className="h-3 w-3 mr-1" />
                    Assigned To: {getAssignmentLabel(selectedTask)}
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-700 border-2 border-slate-300 px-3 py-1">
                    <User className="h-3 w-3 mr-1" />
                    Assigned By: {selectedTask.createdBy?.fullName || "Article Craft"}
                  </Badge>
                  {isOverdue(selectedTask) && (
                    <Badge className="bg-red-500 text-white px-3 py-1 animate-pulse">
                      OVERDUE
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description Card */}
              <Card className="border-2 border-slate-200">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTask.description || "No description provided"}
                  </p>
                </CardContent>
              </Card>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Created Date</span>
                    </div>
                    <p className="text-base font-bold text-slate-900">
                      {formatDate(selectedTask.createdAt)}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`border-2 ${isOverdue(selectedTask) ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Due Date</span>
                    </div>
                    <p className={`text-base font-bold ${isOverdue(selectedTask) ? 'text-red-600' : 'text-slate-900'}`}>
                      {formatDate(selectedTask.dueDate)}
                    </p>
                    {isOverdue(selectedTask) && (
                      <Badge className="text-xs mt-2 bg-red-500 text-white">OVERDUE</Badge>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Remarks from Admin */}
              {selectedTask.remarks && (
                <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50/50">
                  <CardHeader className="bg-amber-100/50 border-b border-amber-200">
                    <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Remarks from Admin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">
                      {selectedTask.remarks}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Attachments */}
              {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                <Card className="border-2 border-slate-200">
                  <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Attachments ({selectedTask.attachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {selectedTask.attachments.map((attachment, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-[#00C853]/10 flex items-center justify-center">
                              <Paperclip className="h-5 w-5 text-[#00C853]" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{attachment}</span>
                          </div>
                          <Button size="sm" variant="ghost" className="text-[#00C853] hover:text-[#00C853]/80">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submission History Section */}
              {selectedTask.submissions && selectedTask.submissions.length > 0 && (
                <Card className="border-2 border-emerald-100 bg-white">
                  <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                    <CardTitle className="text-sm font-semibold text-emerald-950 flex items-center gap-2">
                      <History className="h-4 w-4 text-[#00C853]" />
                      Submission History ({selectedTask.submissions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-6">
                    <div className="relative border-l-2 border-emerald-100 pl-4 ml-2 space-y-6">
                      {selectedTask.submissions.map((sub) => {
                        const statusColors = {
                          PENDING: "bg-amber-100 text-amber-800 border-amber-200",
                          APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
                          NEEDS_REVISION: "bg-orange-100 text-orange-800 border-orange-200",
                          REJECTED: "bg-red-100 text-red-800 border-red-200",
                        };
                        const statusLabels = {
                          PENDING: "Pending Review",
                          APPROVED: "Approved",
                          NEEDS_REVISION: "Needs Revision",
                          REJECTED: "Rejected",
                        };

                        return (
                          <div key={sub.id} className="relative space-y-2">
                            {/* Dot on timeline */}
                            <div className="absolute -left-[25px] mt-1 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-white" />

                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-slate-500">
                                Submitted on {new Date(sub.submittedAt).toLocaleString()}
                              </span>
                              <Badge className={`text-xs px-2 py-0.5 border ${statusColors[sub.status] || 'bg-slate-100 text-slate-800'}`}>
                                {statusLabels[sub.status] || sub.status}
                              </Badge>
                            </div>

                            {/* Work Description */}
                            {sub.workDescription && (
                              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                                  Work Description
                                </span>
                                <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                                  {sub.workDescription}
                                </p>
                              </div>
                            )}

                            {/* Remarks */}
                            {sub.remarks && (
                              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                                  User's Remarks
                                </span>
                                <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                                  {sub.remarks}
                                </p>
                              </div>
                            )}

                            {/* Submitted Files */}
                            {sub.fileUrls && sub.fileUrls.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                                  Submitted Files ({sub.fileUrls.length})
                                </span>
                                <div className="grid gap-1.5 sm:grid-cols-2">
                                  {sub.fileUrls.map((url, fIdx) => {
                                    const filename = url.split('/').pop() || 'file';
                                    return (
                                      <div key={fIdx} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                                        <span className="truncate font-medium text-slate-700 max-w-[150px]" title={filename}>
                                          {filename}
                                        </span>
                                        <div className="flex gap-1.5">
                                          <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#00C853] hover:underline font-semibold"
                                          >
                                            Open
                                          </a>
                                          <a
                                            href={url}
                                            download
                                            className="text-blue-600 hover:underline font-semibold"
                                          >
                                            Download
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Admin Remarks / Feedback */}
                            {sub.adminRemark && (
                              <div className="bg-emerald-50/50 p-2.5 rounded border border-emerald-200">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-950 block mb-1">
                                  Admin Feedback
                                </span>
                                <p className="text-xs text-emerald-950 whitespace-pre-wrap leading-relaxed">
                                  {sub.adminRemark}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              <Card className="border-2 border-slate-200">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments & Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {selectedTask.comments && selectedTask.comments.length > 0 && (
                    <div className="space-y-3">
                      {selectedTask.comments.map((comment) => (
                        <div key={comment.id} className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm text-slate-900">{comment.user.fullName}</span>
                            <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-900">
                      Add Comment / Work Update
                    </Label>
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your progress, updates, or ask questions..."
                      className="text-sm min-h-[100px] border-2 border-slate-200 focus:border-[#00C853] focus:ring-[#00C853]"
                    />
                    <Button
                      onClick={() => selectedTask && handleAddComment(selectedTask.id)}
                      size="sm"
                      className="w-full bg-[#00C853] hover:bg-[#00C853]/90 text-white font-semibold shadow-lg"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedTask.status === "TODO" && (
                  <Button
                    onClick={() => handleStartTask(selectedTask.id)}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Task
                  </Button>
                )}
                {selectedTask.status === "IN_PROGRESS" && (
                  <Button
                    onClick={() => handleMarkComplete(selectedTask.id)}
                    className="flex-1 h-11 bg-[#00C853] hover:bg-[#00C853]/90 text-white font-semibold shadow-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                {selectedTask.status === "COMPLETED" && (
                  <Button
                    onClick={() => handleMarkComplete(selectedTask.id)}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Resubmit Task
                  </Button>
                )}
                <Button
                  onClick={() => setIsDetailDialogOpen(false)}
                  variant="ghost"
                  className="flex-1 h-11 font-semibold"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Submission Dialog - Redesigned */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-3 text-slate-900">
              <div className="h-10 w-10 rounded-lg bg-[#00C853]/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#00C853]" />
              </div>
              Submit Assignment
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-2">
              You are about to submit this assignment. You can edit your submission later if you want to.
              Please add remarks and/or attachment if you have any.
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-6 py-4">
              {/* Task Info Card */}
              <Card className="border-2 border-[#00C853]/20 bg-gradient-to-br from-[#00C853]/5 to-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 mb-2">
                        {selectedTask.title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Work Description Section */}
              <div className="space-y-3">
                <Label htmlFor="work-desc" className="text-base font-semibold text-slate-900">
                  Work Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="work-desc"
                  placeholder="Describe the work you completed, results, or steps taken..."
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="min-h-[100px] text-sm border-2 border-slate-200 focus:border-[#00C853] focus:ring-[#00C853] rounded-lg resize-none"
                  required
                />
              </div>

              {/* Progress Slider Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="progress-slider" className="text-base font-semibold text-slate-900">
                    Progress Percentage
                  </Label>
                  <span className="text-sm font-bold text-[#00C853]">{submissionProgress}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    id="progress-slider"
                    min="0"
                    max="100"
                    step="5"
                    value={submissionProgress}
                    onChange={(e) => setSubmissionProgress(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 accent-[#00C853] rounded-lg appearance-none cursor-pointer"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={submissionProgress}
                    onChange={(e) => setSubmissionProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-20 text-xs text-center border-2 border-[#00C853]/20"
                  />
                </div>
              </div>

              {/* Remarks Section */}
              <div className="space-y-3">
                <Label htmlFor="remarks" className="text-base font-semibold text-slate-900">
                  Remarks / Comments
                </Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter any additional notes or remarks here..."
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  className="min-h-[100px] text-sm border-2 border-slate-200 focus:border-[#00C853] focus:ring-[#00C853] rounded-lg resize-none"
                />
              </div>

              {/* File Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-slate-900">
                    Remarks File or Link
                  </Label>
                  <span className="text-xs text-slate-500">
                    Max file size per attachment = 100 MB
                  </span>
                </div>

                {/* Uploaded Files List */}
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-[#00C853]/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-[#00C853]/10 flex items-center justify-center shrink-0">
                          <Paperclip className="h-5 w-5 text-[#00C853]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleRemoveFile(index)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Upload Button */}
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#00C853] hover:bg-[#00C853]/5 transition-all cursor-pointer group">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.txt,.xlsx,.xls,.ppt,.pptx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="h-10 w-10 rounded-lg bg-slate-100 group-hover:bg-[#00C853]/10 flex items-center justify-center transition-colors">
                      <Plus className="h-5 w-5 text-slate-600 group-hover:text-[#00C853]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700 group-hover:text-[#00C853]">
                        Click to upload files
                      </p>
                      <p className="text-xs text-slate-500">
                        PDF, DOC, ZIP, Images, etc.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setIsSubmitDialogOpen(false);
                    setSubmissionNote("");
                    setUploadedFiles([]);
                  }}
                  variant="ghost"
                  className="px-6"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitTask}
                  disabled={!workDescription.trim() || isUploading}
                  className="px-8 bg-[#00C853] hover:bg-[#00C853]/90 text-white font-semibold shadow-lg shadow-[#00C853]/20 hover:shadow-xl hover:shadow-[#00C853]/30 transition-all"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>

              {/* Info Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">
                        What happens next?
                      </h4>
                      <ul className="space-y-1.5 text-xs text-blue-800">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          Task will be marked as completed
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          Admin will receive a notification
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          Your submission note and files will be recorded
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          Task will move to completed list
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Task Card Component
type TaskCardProps = {
  task: Task;
  onView: (task: Task) => void;
  onStartTask: (id: string) => void;
  onMarkComplete: (id: string) => void;
  onUpdateStatus: (id: string, status: Task["status"]) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  formatDate: (date: string | null) => string;
  isOverdue: (task: Task) => boolean;
  getAssignmentLabel: (task: Task) => string;
};

function TaskCard({
  task,
  onView,
  onStartTask,
  onMarkComplete,
  onUpdateStatus,
  getPriorityColor,
  getStatusColor,
  formatDate,
  isOverdue,
  getAssignmentLabel,
}: TaskCardProps) {
  return (
    <Card className={`border-l-4 shadow-sm hover:shadow-lg transition-all duration-300 ${isOverdue(task)
        ? 'border-l-red-500 bg-red-50/30'
        : task.status === 'IN_PROGRESS'
          ? 'border-l-blue-500 bg-blue-50/20'
          : task.status === 'COMPLETED'
            ? 'border-l-[#00C853] bg-emerald-50/20'
            : 'border-l-slate-300 bg-white'
      }`}>
      <CardContent className="p-0">
        {/* Main Content */}
        <div className="p-5">
          {/* Header with Title and Badges */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">
                {task.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`text-xs px-2.5 py-1 font-semibold ${getStatusColor(task.status)}`}>
                  {task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status}
                </Badge>
                <Badge className={`text-xs px-2.5 py-1 border-2 ${getPriorityColor(task.priority)}`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority}
                </Badge>
                {isOverdue(task) && (
                  <Badge className="text-xs px-2.5 py-1 bg-red-500 text-white font-semibold animate-pulse">
                    OVERDUE
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                >
                  <MoreVertical className="h-4 w-4 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView(task)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2 text-slate-600" />
                  View Details
                </DropdownMenuItem>
                {task.status === "TODO" && (
                  <DropdownMenuItem onClick={() => onStartTask(task.id)} className="cursor-pointer">
                    <Play className="h-4 w-4 mr-2 text-blue-600" />
                    Start Task
                  </DropdownMenuItem>
                )}
                {task.status === "IN_PROGRESS" && (
                  <DropdownMenuItem onClick={() => onMarkComplete(task.id)} className="cursor-pointer">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-[#00C853]" />
                    Submit Task
                  </DropdownMenuItem>
                )}
                {task.status === "COMPLETED" && (
                  <DropdownMenuItem onClick={() => onMarkComplete(task.id)} className="cursor-pointer">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" />
                    Resubmit Task
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Assigned By */}
            <div className="flex items-start gap-2">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-medium mb-0.5">Assigned By</p>
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {task.createdBy?.fullName || "Article Craft"}
                </p>
              </div>
            </div>

            {/* Assigned To */}
            <div className="flex items-start gap-2">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-medium mb-0.5">Assigned To</p>
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {getAssignmentLabel(task)}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start gap-2">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Target className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-medium mb-0.5">Category</p>
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {task.category || "General"}
                </p>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-start gap-2">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${isOverdue(task) ? 'bg-red-100' : 'bg-slate-100'
                }`}>
                <Calendar className={`h-4 w-4 ${isOverdue(task) ? 'text-red-600' : 'text-slate-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-medium mb-0.5">Due Date</p>
                <p className={`text-xs font-semibold truncate ${isOverdue(task) ? 'text-red-600' : 'text-slate-900'
                  }`}>
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {task.progress !== undefined && task.progress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Progress</span>
                <span className="text-xs font-bold text-[#00C853]">{task.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00C853] to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="border-t bg-slate-50/50 px-5 py-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onView(task)}
              variant="ghost"
              size="sm"
              className="flex-1 h-9 text-xs font-semibold hover:bg-white"
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View Details
            </Button>

            {task.status === "TODO" && (
              <Button
                onClick={() => onStartTask(task.id)}
                size="sm"
                className="flex-1 h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Start Task
              </Button>
            )}

            {task.status === "IN_PROGRESS" && (
              <Button
                onClick={() => onMarkComplete(task.id)}
                size="sm"
                className="flex-1 h-9 text-xs font-semibold bg-[#00C853] hover:bg-[#00C853]/90 text-white shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Submit Task
              </Button>
            )}

            {task.status === "COMPLETED" && (
              <Button
                onClick={() => onMarkComplete(task.id)}
                size="sm"
                className="flex-1 h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Resubmit Task
              </Button>
            )}

            <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${task.status === 'IN_PROGRESS'
                ? 'bg-blue-100 text-blue-700'
                : task.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
              {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
