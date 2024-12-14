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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import {
  Loader2,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Activity,
} from "lucide-react";
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

interface Activity {
  id: number;
  user_id: number;
  activity_type: 'post' | 'share';
  description: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
}

interface ChartDataPoint {
  hour: string;
  post: number;
  share: number;
}


export default function Dashboard() {
  const {
    stats,
    isLoading,
    error,
    fetchDashboardStats,
    fetchActivityData,
    activityData,
  } = useDashboardStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchDashboardStats();
        await fetchActivityData();
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, [fetchDashboardStats, fetchActivityData]);

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

  const processData = (data: Activity[]): ChartDataPoint[] => {
    const activityCounts: Record<string, ChartDataPoint> = {};
    data?.forEach((item) => {
      const date = new Date(item.created_at);
      const hour = date.getHours();
      const formattedHour = `${hour}:00`;
      
      if (!activityCounts[formattedHour]) {
        activityCounts[formattedHour] = {
          hour: formattedHour,
          post: 0,
          share: 0
        };
      }
      
      activityCounts[formattedHour][item.activity_type]++;
    });
    return Object.values(activityCounts).sort((a, b) => {
      return parseInt(a.hour) - parseInt(b.hour);
    });
  };
  console.log(activityData, "here");
  
  const chartData = processData(activityData);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Community Dashboard</h1>
        <Button>Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Users"
          value={stats?.total_users || 0}
          description="Currently online and engaged"
          icon={<Users className="h-6 w-6 text-blue-500" />}
          trend="+5.2%"
        />
        <StatCard
          title="Total Services"
          value={stats?.total_services || 0}
          description="Available on marketplace"
          icon={<Briefcase className="h-6 w-6 text-green-500" />}
          trend="+2.4%"
        />
        <StatCard
          title="Active Challenges"
          value={stats?.active_challenges || 0}
          description="Ongoing community challenges"
          icon={<Award className="h-6 w-6 text-yellow-500" />}
          trend="+12.5%"
        />
        <StatCard
          title="Total SkillCoins"
          value={stats?.total_skillcoins || 0}
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
            <ResponsiveContainer width="100%" height="100%">
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
                {stats?.popular_skills?.map((skill) => (
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
              {stats?.leaderboard?.map((user, index) => (
                <div
                  key={`${user.id}-${user.username}`}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    <span className="font-bold mr-4 w-4">{index + 1}</span>
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={user.avatar_url} />
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
