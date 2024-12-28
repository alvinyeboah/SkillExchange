"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ArrowUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useServices } from "@/hooks/use-services";
import { useChallenges } from "@/hooks/use-challenges";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ReminderCheck } from "@/components/reminder-check";
import { useCommunityStore } from "@/hooks/useCommunityStore";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { FeatureCards } from "@/components/feature-cards";
import { ParticleBackground } from "@/components/particlebackground";
import { GlowingButton } from "@/components/glowingButton";
import { SkillCoinCounter } from "@/components/skillcoinCounter";
import { useRouter } from "next/navigation";
import { useChallengesStore } from "@/hooks/use-challenges-store";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import coin from "@/public/coin.png";

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
  console.log(user, "suer")
  const router = useRouter();
  const { services, isLoading: servicesLoading, fetchServices } = useServices();
  const renderSkillsBadges = (skills: string[] | string | undefined) => {
    if (!skills) return null;

    const skillsArray = Array.isArray(skills)
      ? skills
      : skills.split(",").map((skill) => skill.trim());

    return (
      <div className="flex flex-wrap gap-2">
        {skillsArray.map((skill, index) => (
          <Badge key={index} variant="outline">
            {skill}
          </Badge>
        ))}
      </div>
    );
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      toast.error("Please login to join challenges");
      return;
    }

    try {
      await participateInChallenge(challengeId, user.id);
      console.log("Successfully joined the challenge!");
    } catch (error) {
      console.log("Failed to join challenge. Please try again.");
    }
  };
  const {
    activeChallenges,
    isLoading: challengesLoading,
    error,
    fetchChallenges,
    participateInChallenge,
  } = useChallengesStore();
  const {
    communityStats,
    isLoading: communityLoading,
    fetchCommunityStats,
  } = useCommunityStore();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80">
      <ParticleBackground />
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12">
            <div className="space-y-8 text-center lg:text-left lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                  Exchange Your <RotatingText items={rotatingItems} />
                </h1>
                <p className="mx-auto lg:mx-0 max-w-[700px] text-muted-foreground md:text-xl">
                  Join SkillExchange: Trade services, earn SkillCoins, and grow
                  in our vibrant community!
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <GlowingButton asChild>
                  <Link href="/marketplace">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </GlowingButton>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="bg-background/50 backdrop-blur-sm text-foreground border-primary/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Link href="/challenges">View Challenges</Link>
                </Button>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <FeatureCards />
            </div>
          </div>
          <motion.div
            className="mt-12 flex justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { label: "Services", value: services?.length },
              { label: "Active Challenges", value: activeChallenges.length },
              { label: "Users", value: communityStats.activeUsers?.length },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="text-lg py-2 px-4 bg-primary/10 backdrop-blur-sm text-primary border border-primary/20"
                >
                  {stat.value}+ {stat.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Offer Your Skills",
                description:
                  "Post your services and showcase your talents to the community.",
                link: "/marketplace",
                linkText: "Get Started",
              },
              {
                icon: Zap,
                title: "Earn SkillCoins",
                description:
                  "Complete tasks and challenges to earn our platform's currency.",
                link: "/wallet",
                linkText: "View Wallet",
              },
              {
                icon: TrendingUp,
                title: "Grow Your Skills",
                description:
                  "Learn from others and take on challenges to improve your abilities.",
                link: "/challenges",
                linkText: "Join Challenges",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <item.icon className="w-6 h-6 mr-2" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {item.description}
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href={item.link}>
                        {item.linkText}{" "}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Featured Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex justify-between items-center">
                      <SkillCoinCounter
                        amount={service.skillcoin_price}
                        duration={2}
                      />
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={service?.user.avatar_url}
                            alt={service?.provider_name}
                          />
                          <AvatarFallback>
                            {service?.user.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {service?.provider_name}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-primary/80 hover:bg-primary"
                      disabled={!user}
                      onClick={() =>
                        router.push(`/marketplace/${service.service_id}`)
                      }
                    >
                      Request Service
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <GlowingButton variant="outline" size="lg" asChild>
              <Link href="/marketplace">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </GlowingButton>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Active Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeChallenges.slice(0, 2).map((challenge) => (
              <Card key={challenge.challenge_id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {challenge.title}
                    <Badge variant="secondary">{challenge.category}</Badge>
                  </CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <Badge
                      variant={
                        challenge.difficulty === "Hard"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.participantsCount} participants
                    </span>
                  </div>
                  <Progress value={challenge.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    {challenge.progress}% completed
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center">
                      <Image
                        alt="skillcoin-image"
                        src={coin}
                        className="w-8 h-8"
                      />
                      {challenge.reward_skillcoins} SkillCoins
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(challenge.end_date).toUTCString()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Required Skills:</h4>
                    {renderSkillsBadges(challenge.skills)}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Top Participants:</h4>
                    <div className="flex justify-between">
                      {challenge.topParticipants?.map((participant, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <Avatar className="h-10 w-10 mb-1">
                            <AvatarImage
                              src={participant.avatar_url}
                              alt={participant.username}
                            />
                            <AvatarFallback>
                              {participant.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {participant.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {participant.progress}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={!user}
                    onClick={() => handleJoinChallenge(challenge.challenge_id)}
                  >
                    Join Challenge
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <GlowingButton variant="outline" size="lg" asChild>
              <Link href="/challenges">
                View All Challenges <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </GlowingButton>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
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
                  <motion.div
                    key={provider.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={provider.avatar_url}
                              alt={provider.username}
                            />
                            <AvatarFallback>
                              {provider.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          {provider.name}
                        </CardTitle>
                        <CardDescription>{provider.username}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {provider.avg_rating ?? "No ratings"}
                          </span>
                          <span>{provider.skillcoins} skillcoins</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
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

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            What Our Users Say
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {!user && (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              Get Started Today
            </h2>
            <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border-primary/20">
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
                <GlowingButton>Create Account</GlowingButton>
              </CardFooter>
            </Card>
          </div>
        </section>
      )}

      <ReminderCheck />
      <motion.button
        className="fixed bottom-8 right-8 p-2 bg-primary text-primary-foreground rounded-full shadow-lg"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
