"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Award,
  Briefcase,
  Camera,
  Coins,
  Loader,
  Plus,
  Star,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/protected-route";
import { AddSkillForm } from "@/components/forms/addSkillform";
import { Skill } from "@/types/database.types";

export default function SettingsPage() {
  const { user, updateUser, addSkill } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    updateUserProfile,
  } = useSettings();

  useEffect(() => {
    if (user?.user_id) {
      fetchSettings(user.user_id);
    }
  }, [user?.user_id, fetchSettings]);

  const handleAddSkill = async (newSkill: Skill) => {
    try {
      if (!user) throw new Error("User not authenticated");
      await addSkill(newSkill);
      // Update local user state with new skill
      if (updateUser) {
        updateUser({
          ...user,
          skills: [...(user.skills || []), { skill_id: newSkill.skill_id, name: newSkill.name, category: newSkill.category, description: newSkill.description, proficiency_level: newSkill.proficiency_level, endorsed_count: 0 }]
        });
      }
      setIsDialogOpen(false);
      toast.success("Skill added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add skill");
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    if (!user?.user_id) return;
    try {
      await updateSettings(user.user_id, { [key]: value });
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update notification settings");
    }
  };

  const handleFrequencyUpdate = async (value: string) => {
    if (!user?.user_id) return;
    try {
      await updateSettings(user.user_id, {
        notification_frequency: value as "realtime" | "daily" | "weekly",
      });
      toast.success("Notification frequency updated");
    } catch (error) {
      toast.error("Failed to update notification frequency");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleProfileUpdate(formData);
    setIsEditing(false);
  };

  const handlePrivacyUpdate = async (key: string, value: any) => {
    if (!user?.user_id) return;
    try {
      await updateSettings(user.user_id, { [key]: value });
      toast.success("Privacy settings updated");
    } catch (error) {
      toast.error("Failed to update privacy settings");
    }
  };

  const handleProfileUpdate = async (formData: FormData) => {
    if (!user?.user_id) return;
    try {
      await updateUserProfile(user.user_id, {
        name: formData.get("fullName") as string,
        username: formData.get("username") as string,
        bio: formData.get("bio") as string,
        email: formData.get("email") as string,
      });

      if (updateUser && user) {
        updateUser({
          ...user,
          name: formData.get("fullName") as string,
          username: formData.get("username") as string,
          bio: formData.get("bio") as string,
          email: formData.get("email") as string,
        });
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.user_id) return;

    const formData = new FormData(e.currentTarget);
    try {
      const accountData = {
        email: formData.get("email") as string,
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
        confirmPassword: formData.get("confirmPassword") as string,
        language: formData.get("language") as string,
      };

      if (accountData.newPassword !== accountData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      await fetch(`/api/users/${user.user_id}/account`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountData),
      });

      toast.success("Account settings updated");
    } catch (error) {
      toast.error("Failed to update account settings");
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user?.user_id) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/users/${user.user_id}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      if (updateUser && user) {
        updateUser({
          ...user,
          avatar_url: data.avatar_url,
        });
      }

      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload profile image"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading settings: {error}
        </div>
      </div>
    );
  }

  // Render the Skills section
  const renderSkillsSection = () => {
    const hasSkills = user?.skills && user.skills.length > 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Skills</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {hasSkills ? "Add Skill" : "Add Your First Skill"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Skill</DialogTitle>
                </DialogHeader>
                <AddSkillForm onAddSkill={handleAddSkill} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasSkills ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't added any skills yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.skills?.map((skill: any, index: number) => (
                <TooltipProvider key={skill.Skills.skill_id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {skill.Skills.name}
                                </h3>
                                <Badge variant="outline" className="mt-1">
                                  {skill.Skills.category}
                                </Badge>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Lvl {skill.proficiency_level}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {skill.Skills.description}
                            </p>
                            <div className="mt-2 text-xs text-muted-foreground">
                              Endorsements: {skill.endorsed_count}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{skill.Skills.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };


  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          User Profile
        </h1>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start gap-2 mb-4 md:w-fit">
            <TabsTrigger value="profile" className="flex-grow sm:flex-grow-0">
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="flex-grow sm:flex-grow-0">
              Account
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex-grow sm:flex-grow-0"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex-grow sm:flex-grow-0">
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
                <CardDescription>
                  Manage your account details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={user?.avatar_url || ""}
                          alt={user?.name}
                        />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span className="sr-only">Change avatar</span>
                        </label>
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-semibold">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        @{user?.username}
                      </p>
                    </div>
                    <input
                      id="avatar-upload"
                      name="avatar"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        defaultValue={user?.name}
                        disabled={!isEditing}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        defaultValue={user?.username}
                        disabled={!isEditing}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        defaultValue={user?.email}
                        disabled={!isEditing}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={user?.bio}
                        disabled={!isEditing}
                        className="h-[104px] w-full"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <CardFooter className="px-0 pt-6">
                      <Button type="submit" className="w-full sm:w-auto">
                        Save Changes
                      </Button>
                    </CardFooter>
                  )}
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    SkillCoins
                  </CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.skillcoins}</div>
                  <p className="text-xs text-muted-foreground">
                    Your current balance
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user?.rating.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on your performance
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Services Offered</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {user?.services?.map((service, index) => (
                    <motion.div
                      key={service.service_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-4 last:mb-0"
                    >
                      <div
                        key={service.service_id}
                        className="flex justify-between items-center"
                      >
                        <h3 className="font-semibold">{service.title}</h3>
                        <Badge variant="secondary">
                          {service.skillcoin_price} SC
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {service.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Delivery: {service.delivery_time} days
                        </span>
                      </div>
                      <Separator className="my-2" />
                    </motion.div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Skills</span>
                  </div>
                  {user?.skills?.length === 0 ? null : (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Skill
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add a New Skill</DialogTitle>
                        </DialogHeader>
                        <AddSkillForm onAddSkill={handleAddSkill} />
                      </DialogContent>
                    </Dialog>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.skills?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't added any skills yet.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Skill
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user?.skills?.map((skill: any, index: any) => (
                      <TooltipProvider key={skill.Skills.skill_id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="font-semibold text-lg">
                                        {skill.Skills.name}
                                      </h3>
                                      <Badge variant="outline" className="mt-1">
                                        {skill.Skills.category}
                                      </Badge>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Lvl {skill.proficiency_level}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {skill.Skills.description}
                                  </p>
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    Endorsements: {skill.endorsed_count}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{skill.Skills.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <form onSubmit={handleAccountUpdate}>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user?.email || ""}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      name="language"
                      defaultValue={settings?.language || "en"}
                      onValueChange={(value) =>
                        handlePrivacyUpdate("language", value)
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full sm:w-auto">
                    Update Account
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings?.email_notifications}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("email_notifications", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <Switch
                    id="pushNotifications"
                    checked={settings?.push_notifications}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("push_notifications", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <Switch
                    id="smsNotifications"
                    checked={settings?.sms_notifications}
                    onCheckedChange={(checked) =>
                      handleNotificationUpdate("sms_notifications", checked)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificationFrequency">
                    Notification Frequency
                  </Label>
                  <Select
                    defaultValue={
                      settings?.notification_frequency || "realtime"
                    }
                    onValueChange={handleFrequencyUpdate}
                  >
                    <SelectTrigger id="notificationFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select
                    defaultValue={settings?.profile_visibility || "public"}
                    onValueChange={(value) =>
                      handlePrivacyUpdate("profile_visibility", value)
                    }
                  >
                    <SelectTrigger id="profileVisibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showOnlineStatus">Show Online Status</Label>
                  <Switch
                    id="showOnlineStatus"
                    checked={settings?.show_online_status}
                    onCheckedChange={(checked) =>
                      handlePrivacyUpdate("show_online_status", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowMessagesFromStrangers">
                    Allow Messages from Non-Friends
                  </Label>
                  <Switch
                    id="allowMessagesFromStrangers"
                    checked={settings?.allow_messages_from_strangers}
                    onCheckedChange={(checked) =>
                      handlePrivacyUpdate(
                        "allow_messages_from_strangers",
                        checked
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dataUsageConsent">
                    Allow Data Usage for Personalization
                  </Label>
                  <Switch
                    id="dataUsageConsent"
                    checked={settings?.data_usage_consent}
                    onCheckedChange={(checked) =>
                      handlePrivacyUpdate("data_usage_consent", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
