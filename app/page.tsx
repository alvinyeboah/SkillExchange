"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Star,
  Zap,
  Trophy,
  Users,
  Clock,
  ArrowRight,
  Search,
  Mail,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useServices } from "@/hooks/use-services";
import { useChallenges } from "@/hooks/use-challenges";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
export default function Home() {
  const { user } = useAuth();
  const { services, isLoading: servicesLoading } = useServices();
  const {  isLoading: challengesLoading } = useChallenges();

  if (servicesLoading || challengesLoading) {
    return <LoadingSpinner />;
  }

  console.log("🚀 ~ Home ~ services:", services)
  console.log("🚀 ~ Home ~ user:", user)
  
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to SkillExchange
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Trade services, earn SkillCoins, and grow your skills in our
                vibrant community!
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/challenges">View Challenges</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                  Offer Your Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                Post your services and showcase your talents to the community.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/marketplace">
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  Earn SkillCoins
                </CardTitle>
              </CardHeader>
              <CardContent>
                Complete tasks and challenges to earn our platform's currency.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/wallet">
                    View Wallet <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                  Grow Your Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                Learn from others and take on challenges to improve your
                abilities.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/challenges">
                    Join Challenges <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            Featured Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service) => (
              <Card key={service.service_id}>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      {service.skillcoin_price}{" "}
                      <span className="text-sm font-normal">SkillCoins</span>
                    </span>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={service?.profile_image}
                          alt={service?.provider_name}
                        />
                        <AvatarFallback>{service?.provider_name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{service?.provider_name}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Request Service</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/marketplace">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            Active Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "30-Day Coding Challenge",
                description: "Complete 30 coding tasks in 30 days",
                participants: 250,
                reward: 500,
                timeLeft: "15 days",
              },
              {
                title: "Design Sprint",
                description: "Create a landing page in 48 hours",
                participants: 100,
                reward: 300,
                timeLeft: "2 days",
              },
            ].map((challenge, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.participants} participants
                    </span>
                    <span className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      {challenge.reward} SkillCoins
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{challenge.timeLeft} left</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Join Challenge</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/challenges">
                View All Challenges <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            Community Highlights
          </h2>
          <Tabs defaultValue="topProviders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="topProviders">Top Providers</TabsTrigger>
              <TabsTrigger value="recentReviews">Recent Reviews</TabsTrigger>
              <TabsTrigger value="skillLeaderboard">
                Skill Leaderboard
              </TabsTrigger>
            </TabsList>
            <TabsContent value="topProviders">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Alice",
                    skill: "Web Development",
                    rating: 4.9,
                    completedTasks: 50,
                  },
                  {
                    name: "Bob",
                    skill: "Graphic Design",
                    rating: 4.8,
                    completedTasks: 45,
                  },
                  {
                    name: "Charlie",
                    skill: "Content Writing",
                    rating: 4.7,
                    completedTasks: 40,
                  },
                  {
                    name: "David",
                    skill: "Video Editing",
                    rating: 4.9,
                    completedTasks: 55,
                  },
                  {
                    name: "Emma",
                    skill: "Data Analysis",
                    rating: 4.8,
                    completedTasks: 48,
                  },
                  {
                    name: "Frank",
                    skill: "Mobile App Development",
                    rating: 4.7,
                    completedTasks: 42,
                  },
                ].map((provider, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={`/avatars/0${index + 1}.png`}
                            alt={provider.name}
                          />
                          <AvatarFallback>{provider.name[0]}</AvatarFallback>
                        </Avatar>
                        {provider.name}
                      </CardTitle>
                      <CardDescription>{provider.skill}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {provider.rating}
                        </span>
                        <span>{provider.completedTasks} tasks completed</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="recentReviews">
              <ScrollArea className="h-[400px] w-full">
                {[
                  {
                    reviewer: "John",
                    provider: "Alice",
                    service: "Web Development",
                    rating: 5,
                    comment:
                      "Excellent work! Alice delivered the project ahead of schedule and exceeded my expectations.",
                  },
                  {
                    reviewer: "Sarah",
                    provider: "Bob",
                    service: "Graphic Design",
                    rating: 4,
                    comment:
                      "Great designs, but took a bit longer than expected. Overall, I'm satisfied with the results.",
                  },
                  {
                    reviewer: "Mike",
                    provider: "Charlie",
                    service: "Content Writing",
                    rating: 5,
                    comment:
                      "Charlie's writing is top-notch. The articles were engaging and well-researched.",
                  },
                  {
                    reviewer: "Emily",
                    provider: "David",
                    service: "Video Editing",
                    rating: 5,
                    comment:
                      "David transformed my raw footage into a professional-looking video. Highly recommended!",
                  },
                  {
                    reviewer: "Alex",
                    provider: "Emma",
                    service: "Data Analysis",
                    rating: 4,
                    comment:
                      "Emma provided valuable insights from our data. The presentation could have been more polished.",
                  },
                  {
                    reviewer: "Lisa",
                    provider: "Frank",
                    service: "Mobile App Development",
                    rating: 5,
                    comment:
                      "Frank built an amazing app for our startup. Great communication throughout the process.",
                  },
                ].map((review, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">
                        {review.reviewer} reviewed {review.provider}
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {review.service}
                    </p>
                    <p className="text-sm">{review.comment}</p>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="skillLeaderboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    skill: "Web Development",
                    topUser: "Alice",
                    skillLevel: 95,
                  },
                  { skill: "Graphic Design", topUser: "Bob", skillLevel: 92 },
                  {
                    skill: "Content Writing",
                    topUser: "Charlie",
                    skillLevel: 90,
                  },
                  { skill: "Video Editing", topUser: "David", skillLevel: 93 },
                  { skill: "Data Analysis", topUser: "Emma", skillLevel: 91 },
                  {
                    skill: "Mobile App Development",
                    topUser: "Frank",
                    skillLevel: 89,
                  },
                ].map((leaderboard, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{leaderboard.skill}</CardTitle>
                      <CardDescription>
                        Top performer: {leaderboard.topUser}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="w-full bg-secondary rounded-full h-2.5 mr-2">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${leaderboard.skillLevel}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {leaderboard.skillLevel}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {user ? (
        ""
      ) : (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Get Started Today
            </h2>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Join SkillExchange</CardTitle>
                <CardDescription>
                  Create your account and start trading skills!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost">Sign In</Button>
                <Button>Create Account</Button>
              </CardFooter>
            </Card>
          </div>
        </section> 
      )}
    </div>
  );
}
