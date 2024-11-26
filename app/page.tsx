"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useServices } from "@/hooks/use-services";
import { useChallenges } from "@/hooks/use-challenges";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ReminderCheck } from "@/components/reminder-check";
import { useCommunityStore } from "@/hooks/useCommunityStore";
import { ShimmerText } from "@/components/shimmer-text";

const RotatingText = ({ items }: { items: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="h-20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-primary font-bold"
        >
          {items[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


export default function Home() {
  const { user } = useAuth();
  const { services, isLoading: servicesLoading, fetchServices } = useServices();
  const {
    challenges,
    isLoading: challengesLoading,
    fetchChallenges,
  } = useChallenges();
  const { communityStats, isLoading: communityLoading, fetchCommunityStats } = useCommunityStore();

  useEffect(() => {
    fetchServices();
    fetchChallenges();
    fetchCommunityStats();
  }, [fetchServices, fetchChallenges, fetchCommunityStats]);

  if (servicesLoading || challengesLoading || communityLoading) {
    return <LoadingSpinner />;
  }

  const rotatingItems = ["Skills", "Knowledge", "Experiences", "Talents"];


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-background via-background to-primary/10 dark:from-background dark:via-background dark:to-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5" />
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12">
            <div className="space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  <ShimmerText>
                    Exchange Your <RotatingText items={rotatingItems} />
                  </ShimmerText>
                </h1>
                <p className="mx-auto lg:mx-0 max-w-[700px] text-muted-foreground md:text-xl">
                  Join SkillExchange: Trade services, earn SkillCoins, and grow in our vibrant community!
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Link href="/marketplace">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Link href="/challenges">View Challenges</Link>
                </Button>
              </motion.div>
            </div>
            <div className="w-full max-w-md">
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {[
                  { icon: Zap, title: "Earn SkillCoins", description: "Complete tasks and challenges to earn our platform's currency." },
                  { icon: Users, title: "Join Community", description: "Connect with skilled individuals and expand your network." },
                  { icon: Trophy, title: "Win Challenges", description: "Showcase your skills and compete in exciting challenges." },
                  { icon: TrendingUp, title: "Grow Skills", description: "Learn from others and improve your abilities continuously." },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out floating"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <item.icon className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          <motion.div
            className="mt-12 flex justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { label: "Services", value: communityStats.activeUsers?.length },
              { label: "Active Challenges", value: challenges.length },
              { label: "Users", value: communityStats.activeUsers?.length },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Badge variant="secondary" className="text-lg py-2 px-4">
                  {stat.value}+ {stat.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-primary" />
                  Offer Your Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
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
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-primary" />
                  Earn SkillCoins
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
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
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                  Grow Your Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
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
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            Featured Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service) => (
              <Card key={service.service_id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.title}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="mb-4 text-sm">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      {service.skillcoin_price}{" "}
                      <span className="text-sm font-normal">SkillCoins</span>
                    </span>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={service?.avatar_url}
                          alt={service?.provider_name}
                        />
                        <AvatarFallback>
                          {service?.provider_name}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{service?.provider_name}</span>
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
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            Active Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {challenges.slice(0, 2).map((challenge) => (
              <Card
                key={challenge.challenge_id}
                className="flex flex-col h-full"
              >
                <CardHeader>
                  <CardTitle>{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
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
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
            Community Highlights
          </h2>
          <Tabs defaultValue="topProviders" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="topProviders">Top Providers</TabsTrigger>
              <TabsTrigger value="recentReviews">Recent Reviews</TabsTrigger>
              <TabsTrigger value="skillLeaderboard">
                Skill Leaderboard
              </TabsTrigger>
            </TabsList>
            <TabsContent value="topProviders">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communityStats.topProviders?.map((provider, index) => (
                  <Card key={index} className="flex flex-col h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={provider.avatar_url}
                            alt={provider.username}
                          />
                          <AvatarFallback>{provider.username[0]}</AvatarFallback>
                        </Avatar>
                        {provider.username}
                      </CardTitle>
                      <CardDescription>{provider.skill}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {provider.avg_rating}
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
                {/* Recent reviews will be displayed here */}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="skillLeaderboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Skill leaderboard will be displayed here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {!user && (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
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

      <ReminderCheck />
    </div>
  );
}
