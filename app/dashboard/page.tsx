"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { Loader2, Briefcase, Award } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";

export default function UserDashboard() {
  const { stats, isLoading, error, fetchDashboardStats } = useDashboardStore();
  const {user} = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchDashboardStats(user.id);
    }
  }, [fetchDashboardStats, user?.id]);

  console.log(stats);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My SkillCoins
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.skillcoins || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.skillcoins_earned_this_week || 0} from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Services
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_services || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.my_services?.length || 0} total services
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Participating Challenges
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.participating_challenges.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completed_challenges || 0} completed challenges
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-services">My Services</TabsTrigger>
          <TabsTrigger value="requested-services">Requested Services</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="my-services" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">My Services</h2>
          <ScrollArea className="h-[400px]">
            {stats?.my_services?.map((service) => (
              <Card key={service.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{service.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Badge>{service.category}</Badge>
                    <span className="font-semibold">{service.price} SkillCoins</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <Button>Add New Service</Button>
        </TabsContent>
        <TabsContent value="requested-services" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Requested Services</h2>
          <ScrollArea className="h-[400px]">
            {stats?.requested_services?.map((service) => (
              <Card key={service.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{service.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Badge>{service.status}</Badge>
                    <span className="font-semibold">{service.price} SkillCoins</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <Button>Request New Service</Button>
        </TabsContent>
        <TabsContent value="challenges" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Participating Challenges</h2>
          <ScrollArea className="h-[400px]">
            {stats?.participating_challenges?.map((challenge) => (
              <Card key={challenge.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{challenge.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Badge>{challenge.status}</Badge>
                    <span className="font-semibold">Reward: {challenge.reward} SkillCoins</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <Button>Find New Challenges</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
