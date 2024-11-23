'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useSettings } from '@/hooks/use-settings'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  console.log(user)

  const { settings, isLoading, error, fetchSettings, updateSettings } = useSettings()

  useEffect(() => {
    if (user?.id) {
      fetchSettings(user.id)
    }
  }, [user?.id, fetchSettings])

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    if (!user?.id) return
    try {
      await updateSettings(user.id, { [key]: value })
      toast.success('Notification settings updated')
    } catch (error) {
      toast.error('Failed to update notification settings')
    }
  }

  const handleFrequencyUpdate = async (value: string) => {
    if (!user?.id) return
    try {
      await updateSettings(user.id, { notificationFrequency: value as 'realtime' | 'daily' | 'weekly' })
      toast.success('Notification frequency updated')
    } catch (error) {
      toast.error('Failed to update notification frequency')
    }
  }

  const handlePrivacyUpdate = async (key: string, value: any) => {
    if (!user?.id) return
    try {
      await updateSettings(user.id, { [key]: value })
      toast.success('Privacy settings updated')
    } catch (error) {
      toast.error('Failed to update privacy settings')
    }
  }

  const handleProfileUpdate = async (formData: FormData) => {
    if (!user?.id) return
    try {
      const profileData = {
        fullName: formData.get('fullName') as string,
        username: formData.get('username') as string,
        bio: formData.get('bio') as string,
        skills: formData.get('skills') as string,
      }
      await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })
      
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleAccountUpdate = async (formData: FormData) => {
    if (!user?.id) return
    try {
      const accountData = {
        email: formData.get('email') as string,
        currentPassword: formData.get('currentPassword') as string,
        newPassword: formData.get('newPassword') as string,
        confirmPassword: formData.get('confirmPassword') as string,
        language: formData.get('language') as string,
      }

      // Validate passwords match
      if (accountData.newPassword !== accountData.confirmPassword) {
        toast.error('New passwords do not match')
        return
      }

      // Update account data through your API
      await fetch(`/api/users/${user.id}/account`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData),
      })

      toast.success('Account settings updated')
    } catch (error) {
      toast.error('Failed to update account settings')
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!user?.id) return;
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`/api/users/${user.id}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Update local user state with new avatar URL
      if (updateUser && user) {
        updateUser({
          ...user,
          avatar_url: data.avatar_url,
        });
      }

      toast.success('Profile image updated successfully');
    } catch (error) {
      toast.error('Failed to upload profile image');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading settings: {error}
        </div>
      </div>
    )
  }

  console.log(user, "this from the settings page");
  

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleProfileUpdate(new FormData(e.currentTarget))
            }}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.avatar_url || ''} alt="Profile" />
                    <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, max 5MB
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
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName"
                    defaultValue={user?.name || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username"
                    defaultValue={user?.username || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    defaultValue={user?.bio || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input 
                    id="skills" 
                    name="skills"
                    placeholder="Enter your skills (comma-separated)"
                    defaultValue={user?.skills?.join(', ') || ''}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleAccountUpdate(new FormData(e.currentTarget))
            }}>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    defaultValue={user?.email || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword"
                    type="password" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword"
                    type="password" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select 
                    name="language" 
                    defaultValue={settings?.language || 'en'}
                    onValueChange={(value) => handlePrivacyUpdate('language', value)}
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
                <Button type="submit">Update Account</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch 
                  id="emailNotifications"
                  checked={settings?.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <Switch 
                  id="pushNotifications"
                  checked={settings?.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <Switch 
                  id="smsNotifications"
                  checked={settings?.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationUpdate('smsNotifications', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notificationFrequency">Notification Frequency</Label>
                <Select 
                  defaultValue={settings?.notificationFrequency || 'realtime'}
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
              <CardDescription>Manage your privacy preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select 
                  defaultValue={settings?.profileVisibility || 'public'}
                  onValueChange={(value) => handlePrivacyUpdate('profileVisibility', value)}
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
                  checked={settings?.showOnlineStatus}
                  onCheckedChange={(checked) => handlePrivacyUpdate('showOnlineStatus', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allowMessagesFromStrangers">Allow Messages from Non-Friends</Label>
                <Switch 
                  id="allowMessagesFromStrangers"
                  checked={settings?.allowMessagesFromStrangers}
                  onCheckedChange={(checked) => handlePrivacyUpdate('allowMessagesFromStrangers', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dataUsageConsent">Allow Data Usage for Personalization</Label>
                <Switch 
                  id="dataUsageConsent"
                  checked={settings?.dataUsageConsent}
                  onCheckedChange={(checked) => handlePrivacyUpdate('dataUsageConsent', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

