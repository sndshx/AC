"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/providers/toast-provider";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  MessageSquare, 
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Calendar,
  Loader2,
  Mail
} from "lucide-react";
import { format } from "date-fns";

type Remark = {
  id: string;
  content: string;
  userId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    teamName: string | null;
  };
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
};

type UserOption = {
  id: string;
  fullName: string;
  email: string;
  teamName: string | null;
};

export function AdminRemarks() {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState<Remark | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    content: "",
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchRemarks();
    fetchUsers();
  }, []);

  const fetchRemarks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/remarks");
      if (!response.ok) throw new Error("Failed to fetch remarks");
      const data = await response.json();
      setRemarks(data);
    } catch (error) {
      console.error("Error fetching remarks:", error);
      showToast({
        title: "Error",
        description: "Failed to load remarks",
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users || data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateRemark = async () => {
    if (!formData.userId || !formData.content.trim()) {
      showToast({
        title: "Validation Error",
        description: "Please select a user and enter remark content",
        tone: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/admin/remarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create remark");

      const newRemark = await response.json();
      setRemarks([newRemark, ...remarks]);
      setIsCreateDialogOpen(false);
      setFormData({ userId: "", content: "" });
      
      showToast({
        title: "Success",
        description: "Remark added successfully",
        tone: "success",
      });
    } catch (error) {
      console.error("Error creating remark:", error);
      showToast({
        title: "Error",
        description: "Failed to add remark",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRemark = async () => {
    if (!selectedRemark || !formData.content.trim()) {
      showToast({
        title: "Validation Error",
        description: "Please enter remark content",
        tone: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/admin/remarks/${selectedRemark.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData.content }),
      });

      if (!response.ok) throw new Error("Failed to update remark");

      const updatedRemark = await response.json();
      setRemarks(remarks.map(r => r.id === updatedRemark.id ? updatedRemark : r));
      setIsEditDialogOpen(false);
      setSelectedRemark(null);
      setFormData({ userId: "", content: "" });
      
      showToast({
        title: "Success",
        description: "Remark updated successfully",
        tone: "success",
      });
    } catch (error) {
      console.error("Error updating remark:", error);
      showToast({
        title: "Error",
        description: "Failed to update remark",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRemark = async () => {
    if (!selectedRemark) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/admin/remarks/${selectedRemark.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete remark");

      setRemarks(remarks.filter(r => r.id !== selectedRemark.id));
      setIsDeleteDialogOpen(false);
      setSelectedRemark(null);
      
      showToast({
        title: "Success",
        description: "Remark deleted successfully",
        tone: "success",
      });
    } catch (error) {
      console.error("Error deleting remark:", error);
      showToast({
        title: "Error",
        description: "Failed to delete remark",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (remark: Remark) => {
    setSelectedRemark(remark);
    setFormData({ userId: remark.userId, content: remark.content });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (remark: Remark) => {
    setSelectedRemark(remark);
    setIsDeleteDialogOpen(true);
  };

  const filteredRemarks = remarks.filter((remark) => {
    const query = searchQuery.toLowerCase();
    return (
      remark.content.toLowerCase().includes(query) ||
      remark.user.fullName.toLowerCase().includes(query) ||
      remark.user.email.toLowerCase().includes(query) ||
      remark.createdBy.fullName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-[#00C853]" />
            User Remarks
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View and manage all admin remarks for team members
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00C853] hover:bg-[#00C853]/90" disabled={submitting}>
              <Plus className="h-4 w-4 mr-2" />
              Add Remark
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Remark</DialogTitle>
              <DialogDescription>Add a remark for a team member</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="user">Select User *</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, userId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span>{user.fullName}</span>
                          <span className="text-xs text-slate-500">
                            {user.email}
                            {user.teamName && ` • ${user.teamName}`}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remark">Remark *</Label>
                <Textarea
                  id="remark"
                  placeholder="Enter your remark..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="min-h-[150px]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setFormData({ userId: "", content: "" });
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#00C853] hover:bg-[#00C853]/90"
                  onClick={handleCreateRemark}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Remark
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            All Remarks ({filteredRemarks.length})
          </CardTitle>
          <CardDescription>
            View all remarks submitted by admins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by user, content, or admin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
              </div>
            ) : filteredRemarks.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  {searchQuery ? "No remarks found matching your search" : "No remarks yet"}
                </p>
              </div>
            ) : (
              filteredRemarks.map((remark) => (
                <Card key={remark.id} className="border-l-4 border-l-[#00C853]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="font-medium">
                            <User className="h-3 w-3 mr-1" />
                            {remark.user.fullName}
                          </Badge>
                          {remark.user.teamName && (
                            <Badge variant="secondary">
                              {remark.user.teamName}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="gap-1">
                            <Mail className="h-3 w-3" />
                            {remark.user.email}
                          </Badge>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                          <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                            {remark.content}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(remark.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                          </div>
                          <div>
                            By <span className="font-medium">{remark.createdBy.fullName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(remark)}
                          title="Edit remark"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openDeleteDialog(remark)}
                          title="Delete remark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Remark</DialogTitle>
            <DialogDescription>
              Update the remark for {selectedRemark?.user.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-remark">Remark *</Label>
              <Textarea
                id="edit-remark"
                placeholder="Enter your remark..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="min-h-[150px]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedRemark(null);
                  setFormData({ userId: "", content: "" });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#00C853] hover:bg-[#00C853]/90"
                onClick={handleEditRemark}
                disabled={submitting}
              >
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Remark
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the remark for{" "}
              <strong>{selectedRemark?.user.fullName}</strong>. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedRemark(null);
              }}
              disabled={submitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRemark}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
