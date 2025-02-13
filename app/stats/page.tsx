"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Users, Briefcase, Award, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatCard } from "@/components/stat-card";
import { useCommunityStore } from "@/hooks/useCommunityStatsStore";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useAuth } from "@/hooks/use-auth";
import * as XLSX from 'xlsx';


export default function CommunityStats() {
  const {
    services,
    isLoading:isServicesLoading,
    error:isServicesError,
    fetchServices,
  } = useMarketplace();
  const {user} = useAuth();

  const { communityStats, isLoading: communityLoading, fetchCommunityStats, error } = useCommunityStore();

  useEffect(() => {
    fetchServices();
    fetchCommunityStats();
  }, [fetchServices, fetchCommunityStats]);

  const isLoading = isServicesLoading && communityLoading  ;

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

  const chartData = [
    { hour: '0:00', post: 5, share: 2 },
    { hour: '1:00', post: 3, share: 1 },
    { hour: '2:00', post: 2, share: 3 },
    { hour: '3:00', post: 4, share: 4 },
    { hour: '4:00', post: 6, share: 2 },
    { hour: '5:00', post: 7, share: 5 },
    { hour: '6:00', post: 8, share: 6 },
    { hour: '7:00', post: 10, share: 4 },
    { hour: '8:00', post: 12, share: 7 },
    { hour: '9:00', post: 15, share: 9 },
    { hour: '10:00', post: 18, share: 11 },
    { hour: '11:00', post: 20, share: 13 },
    { hour: '12:00', post: 22, share: 15 },
    { hour: '13:00', post: 19, share: 12 },
    { hour: '14:00', post: 16, share: 10 },
    { hour: '15:00', post: 14, share: 8 },
    { hour: '16:00', post: 11, share: 6 },
    { hour: '17:00', post: 9, share: 5 },
    { hour: '18:00', post: 7, share: 4 },
    { hour: '19:00', post: 6, share: 3 },
    { hour: '20:00', post: 5, share: 2 },
    { hour: '21:00', post: 4, share: 1 },
    { hour: '22:00', post: 3, share: 2 },
    { hour: '23:00', post: 2, share: 1 }
  ];
  

  const generateReport = () => {
    const wb = XLSX.utils.book_new();
    const overviewData = [{
      'Active Users': communityStats.activeUsers,
      'Total Services': services.length,
      'Total Challenges': communityStats.availableChallenges.length,
      'Total SkillCoins': communityStats.totalSkillcoins
    }];
    const overviewSheet = XLSX.utils.json_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewSheet, "Overview");
    const skillsSheet = XLSX.utils.json_to_sheet(communityStats.topSkills);
    XLSX.utils.book_append_sheet(wb, skillsSheet, "Top Skills");
    const contributorsData = communityStats.topProviders.map(user => ({
      Username: user.username,
      Name: user.name || 'Community Member',
      SkillCoins: user.skillcoins,
      Rating: user.rating
    }));
    const contributorsSheet = XLSX.utils.json_to_sheet(contributorsData);
    XLSX.utils.book_append_sheet(wb, contributorsSheet, "Top Contributors");

    const challengesData = communityStats.availableChallenges.map(challenge => ({
      Title: challenge.title,
      Description: challenge.description,
      Reward: challenge.reward_skillcoins,
      Difficulty: challenge.difficulty,
      Category: challenge.category,
      Skills: challenge.skills,
      'Start Date': challenge.start_date,
      'End Date': challenge.end_date
    }));
    const challengesSheet = XLSX.utils.json_to_sheet(challengesData);
    XLSX.utils.book_append_sheet(wb, challengesSheet, "Challenges");
    const reviewsData = communityStats.recentReviews.map(review => ({
      'Service ID': review.service_id,
      Rating: review.rating,
      Content: review.content,
      'Created At': review.created_at
    }));
    const reviewsSheet = XLSX.utils.json_to_sheet(reviewsData);
    XLSX.utils.book_append_sheet(wb, reviewsSheet, "Recent Reviews");
    XLSX.writeFile(wb, "community-stats-report.xlsx");
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Community Stats</h1>
        {user && <Button onClick={generateReport}>Generate Report</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Users"
          value={communityStats?.activeUsers || 0}
          description="Currently online and engaged"
          icon={<Users className="h-6 w-6 text-blue-500" />}
          trend="+5.2%"
        />
        <StatCard
          title="Total Services"
          value={services.length || 0}
          description="Available on marketplace"
          icon={<Briefcase className="h-6 w-6 text-green-500" />}
          trend="+2.4%"
        />
        <StatCard
          title="All Challenges"
          value={communityStats.availableChallenges.length || 0}
          description="Existing community challenges"
          icon={<Award className="h-6 w-6 text-yellow-500" />}
          trend="+12.5%"
        />
        <StatCard
          title="Total SkillCoins"
          value={communityStats?.totalSkillcoins || 0}
          description="Circulating in the community"
          icon={<Activity className="h-6 w-6 text-purple-500" />}
          trend="+8.1%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Community Activity</CardTitle>
            <CardDescription>
              Users and services over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  label={{
                    value: "Time of Day",
                    position: "bottom",
                    offset: 0,
                  }}
                />
                <YAxis
                  label={{
                    value: "Number of Activities",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="post"
                  stroke="#8884d8"
                  name="Posts"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="share"
                  stroke="#82ca9d"
                  name="Shares"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Requested Skills</CardTitle>
            <CardDescription>Based on marketplace activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <ul className="space-y-4">
                {communityStats?.topSkills?.map((skill) => (
                  <li
                    key={skill.skill}
                    className="flex justify-between items-center"
                  >
                    <span>{skill.skill}</span>
                    <div className="flex items-center">
                      <Progress
                        value={skill.usage_count}
                        max={100}
                        className="w-24 mr-2"
                      />
                      <Badge variant="secondary">
                        {skill.usage_count} requests
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>
            Based on SkillCoins earned this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-8">
              {communityStats?.topProviders?.map((user, index) => (
                <div
                  key={`${user.user_id}-${user.username}`}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    <span className="font-bold mr-4 w-4">{index + 1}</span>
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={user.avatar_url || undefined}  />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.name || "Community Member"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-bold mr-2">{user.skillcoins}</span>
                    <Badge variant="secondary">SkillCoins</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

