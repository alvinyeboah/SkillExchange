import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

import { ErrorDisplay } from '@/components/ui/error-display'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { useCommunityStore } from '@/hooks/useCommunityStore'

export default function CommunityPage() {
  const { communityStats, isLoading, error, fetchCommunityStats } = useCommunityStore();
  
  useEffect(() => {
    fetchCommunityStats();
  }, [fetchCommunityStats]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Community Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Currently online and available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2 overflow-hidden">
              {communityStats.activeUsers.map((user) => (
                <Avatar key={user.id} className="inline-block border-2 border-background">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top-Rated Providers</CardTitle>
            <CardDescription>Users with highest ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar-3.jpg" alt="@topuser1" />
                  <AvatarFallback>T1</AvatarFallback>
                </Avatar>
                <span>John Doe</span>
                <Badge>4.9 ★</Badge>
              </li>
              <li className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar-4.jpg" alt="@topuser2" />
                  <AvatarFallback>T2</AvatarFallback>
                </Avatar>
                <span>Jane Smith</span>
                <Badge>4.8 ★</Badge>
              </li>
              {/* Add more top-rated users */}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trending Skills</CardTitle>
            <CardDescription>Most requested services</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Web Development</span>
                <Badge variant="outline">50 requests</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Graphic Design</span>
                <Badge variant="outline">35 requests</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Content Writing</span>
                <Badge variant="outline">28 requests</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

