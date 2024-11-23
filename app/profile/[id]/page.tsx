import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Star, Award, TrendingUp, Users, MessageCircle } from "lucide-react"

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = {
    name: "John Doe",
    username: params.username,
    avatar: "/avatars/01.png",
    bio: "Passionate web developer with 5+ years of experience in creating responsive and user-friendly websites.",
    location: "San Francisco, CA",
    joinDate: "January 2020",
    skillCoins: 1250,
    completedProjects: 47,
    rating: 4.8,
    skills: [
      { name: "Web Development", level: 5, progress: 90 },
      { name: "React", level: 4, progress: 75 },
      { name: "Node.js", level: 3, progress: 60 },
    ],
    badges: [
      { name: "Top Performer 2023", icon: Award },
      { name: "Rising Star", icon: TrendingUp },
      { name: "Community Champion", icon: Users },
    ],
    recentProjects: [
      { name: "E-commerce Website Redesign", client: "TechGear Inc.", date: "June 2023" },
      { name: "Portfolio Site Development", client: "Jane Smith", date: "May 2023" },
      { name: "Blog Platform Optimization", client: "BlogCentral", date: "April 2023" },
    ],
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{user.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <badge.icon className="h-3 w-3" />
                  {badge.name}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location}
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                Joined {user.joinDate}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-primary text-primary" />
                {user.rating} ({user.completedProjects} projects)
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" /> Contact {user.name.split(' ')[0]}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SkillCoin Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user.skillCoins} SC</div>
            <p className="text-sm text-muted-foreground">Earned from {user.completedProjects} completed projects</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Transactions</Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Skills & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="skills">
              <TabsList>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Recent Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="skills" className="space-y-4">
                {user.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm font-medium">Level {skill.level}</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="projects">
                <ul className="space-y-4">
                  {user.recentProjects.map((project, index) => (
                    <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                      <p className="text-sm text-muted-foreground">Completed: {project.date}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
