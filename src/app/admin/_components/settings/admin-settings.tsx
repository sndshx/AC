"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Moon,
  LogOut,
  Upload,
  Mail,
  Briefcase,
  Shield,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

type AdminProfile = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  teamName: string | null;
  avatarUrl: string | null;
};

export function AdminSettings() {
  const [profileData, setProfileData] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [notificationPreferences, setNotificationPreferences] = useState({
    userRegistration: true,
    taskCompletion: true,
    whatsappWarnings: true,
    systemAlerts: true,
    reportGeneration: true,
    aiInsights: true,
    emailNotifications: true,
    pushNotifications: true
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;
    
    try {
      setIsSaving(true);
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profileData.fullName,
          teamName: profileData.teamName,
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  if (isLoading || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#00C853]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-8 w-8 text-[#00C853]" />
            Admin Settings
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your admin account and system preferences
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#00C853]" />
                Admin Profile Information
              </CardTitle>
              <CardDescription>Update your admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-[#00C853]/20">
                  <AvatarImage src={profileData.avatarUrl || undefined} />
                  <AvatarFallback className="bg-[#00C853] text-white text-2xl">
                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Admin Profile Picture</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upload a new profile picture (JPG, PNG, max 2MB)
                  </p>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      className="pl-10"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Team</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="team"
                      value={profileData.teamName || "Not assigned"}
                      onChange={(e) => setProfileData({ ...profileData, teamName: e.target.value })}
                      className="pl-10"
                      placeholder="e.g., Leadership Team"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="role"
                      value={profileData.role}
                      className="pl-10 font-semibold text-[#00C853]"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-[#00C853]/10 border border-[#00C853]/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#00C853] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Administrator Account</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You have full administrative access to manage users, view all reports, 
                      and configure system settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => fetchAdminProfile()} disabled={isSaving}>
                  Cancel
                </Button>
                <Button 
                  className="bg-[#00C853] hover:bg-[#00C853]/90"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#00C853]" />
                Change Password
              </CardTitle>
              <CardDescription>Update your admin password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#00C853] hover:bg-[#00C853]/90">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Security Settings</CardTitle>
              <CardDescription>Manage your admin account security and sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Active Sessions</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">You're logged in on 1 device</div>
                </div>
                <Button variant="outline" size="sm">Manage Sessions</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Add extra security to your admin account</div>
                </div>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>

              <Separator />

              <Button 
                variant="danger" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#00C853]" />
                Admin Notification Preferences
              </CardTitle>
              <CardDescription>Choose what admin notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">System Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">User Registration</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">New user sign-ups and registrations</div>
                    </div>
                    <Switch
                      checked={notificationPreferences.userRegistration}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, userRegistration: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Task Completion</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">When users complete assigned tasks</div>
                    </div>
                    <Switch
                      checked={notificationPreferences.taskCompletion}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, taskCompletion: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">WhatsApp Warnings</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Account health warnings and alerts</div>
                    </div>
                    <Switch
                      checked={notificationPreferences.whatsappWarnings}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, whatsappWarnings: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">System Alerts</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Critical system notifications</div>
                    </div>
                    <Switch
                      checked={notificationPreferences.systemAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, systemAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Reports & Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Report Generation</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">When reports are generated</div>
                    </div>
                    <Switch
                      checked={notificationPreferences.reportGeneration}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, reportGeneration: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">AI Insights</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">AI-powered insights and recommendations</div>
                    </div>
                    <Switch
                      checked={notificationPreferences.aiInsights}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, aiInsights: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Delivery Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Email Notifications</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Receive notifications via email</div>
                    </div>
                    <Switch
                      checked={notificationPreferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Push Notifications</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Browser push notifications</div>
                    </div>
                    <Switch
                      checked={notificationPreferences.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Reset to Default</Button>
                <Button className="bg-[#00C853] hover:bg-[#00C853]/90">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-[#00C853]" />
                Display Preferences
              </CardTitle>
              <CardDescription>Customize your admin dashboard appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Dark Mode</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Toggle dark/light theme</div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Compact View</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Show more content in less space</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Show User Activity</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Display real-time user activity on dashboard</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Show System Stats</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Display system performance metrics</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
