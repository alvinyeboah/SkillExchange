"use client"

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboardStore } from '@/hooks/use-dashboard-store'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const { stats, isLoading, error, fetchDashboardStats } = useDashboardStore()

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Community Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Currently online and engaged</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.total_users || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Services</CardTitle>
            <CardDescription>Available on marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.total_services || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Challenges</CardTitle>
            <CardDescription>Ongoing community challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.active_challenges || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills">
        <TabsList className="mb-8">
          <TabsTrigger value="skills">Popular Skills</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Most Requested Skills</CardTitle>
              <CardDescription>Based on marketplace activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {stats?.popular_skills.map((skill) => (
                  <li key={skill.skill} className="flex justify-between items-center">
                    <span>{skill.skill}</span>
                    <Badge variant="secondary">{skill.usage_count} requests</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>Based on SkillCoins earned this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {stats?.leaderboard?.map((user, index) => (
                  <li key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-bold mr-4 w-4">{index + 1}</span>
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username}</AvatarFallback>
                      </Avatar>
                      <span>{user.username}</span>
                    </div>
                    <Badge variant="secondary">{user.points} points</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
