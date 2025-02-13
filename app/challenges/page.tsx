"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useChallengesStore } from "@/hooks/use-challenges-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Clock, Flame, Lightbulb, Trophy, Users, Zap } from 'lucide-react';
import { toast } from "sonner";
import Link from "next/link";
import { useReminders } from "@/hooks/use-reminders-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import coin from "@/public/coin.png";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Challenges() {
  const { user } = useAuth();
  const {
    activeChallenges,
    upcomingChallenges,
    completedChallenges,
    isLoading,
    error,
    fetchChallenges,
    createChallenge,
    participateInChallenge,
  } = useChallengesStore();
  const { setReminder } = useReminders();

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    reward_skillcoins: "",
    difficulty: "",
    category: "",
    skills: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // const handleNewChallengeSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await createChallenge({
  //       ...newChallenge,
  //       reward_skillcoins: parseInt(newChallenge.reward_skillcoins),
  //       skills: newChallenge.skills.split(",").map((skill) => skill.trim()),
  //     });

  //     setNewChallenge({
  //       title: "",
  //       description: "",
  //       reward_skillcoins: "",
  //       difficulty: "",
  //       category: "",
  //       skills: "",
  //       start_date: "",
  //       end_date: "",
  //     });
  //     toast.success("New challenge proposed successfully!");
  //   } catch (error) {
  //     toast.error("Failed to propose new challenge. Please try again.");
  //   }
  // };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      toast.error("Please login to join challenges");
      return;
    }

    try {
      await participateInChallenge(challengeId, user?.user_id);
      console.log("Successfully joined the challenge!");
    } catch (error) {
      console.log("Failed to join challenge. Please try again.");
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">SkillCoin Challenges</h1>
        <p className="text-xl mb-6">
          Participate in exciting challenges to earn SkillCoins and improve your
          skills!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-6 w-6 text-yellow-500" />
                Weekly Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                New challenges are released every week, offering fresh
                opportunities to test your skills and earn rewards.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                SkillCoin Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Complete challenges to earn SkillCoins, which can be used to
                access premium features and services on our platform.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flame className="mr-2 h-6 w-6 text-yellow-500" />
                Skill Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Each challenge is designed to help you improve specific skills,
                enhancing your overall expertise and marketability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs  defaultValue="active" className="mb-12">
        <TooltipProvider>
          <div className="container mx-auto px-4">
            <TabsList className="mb-8 inline-flex h-auto flex-wrap justify-center space-x-2 rounded-md bg-muted p-1">
              <TabsTrigger
                value="active"
                className="px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Active Challenges
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Upcoming Challenges
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Completed Challenges
              </TabsTrigger>
            </TabsList>
          </div>
        </TooltipProvider>

        <div className="container mx-auto px-4">
          <TabsContent value="active">
            {activeChallenges.length > 0 ? (
              <ScrollArea className="h-[600px] w-full rounded-md border-none p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {activeChallenges.map((challenge) => (
                    <Card key={challenge.challenge_id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          {challenge.title}
                          <Badge variant="secondary">{challenge.category}</Badge>
                        </CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                        <div className="flex flex-wrap justify-between items-center gap-2">
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
                        <Progress value={challenge.progress} className="w-full" />
                        <p className="text-sm text-muted-foreground">
                          {challenge.progress}% completed
                        </p>
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <span className="flex items-center">
                            <Image
                              alt="skillcoin-image"
                              src={coin}
                              className="w-8 h-8 mr-2"
                              width={32}
                              height={32}
                            />
                            {challenge.reward_skillcoins} SkillCoins
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(challenge.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Required Skills:</h4>
                          {renderSkillsBadges(challenge.skills)}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Top Participants:</h4>
                          <div className="flex flex-wrap justify-between gap-2">
                            {challenge.topParticipants?.map(
                              (participant, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col items-center"
                                >
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
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() =>
                            handleJoinChallenge(challenge.challenge_id)
                          }
                        >
                          Join Challenge
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Card className="w-full p-6">
                <CardHeader>
                  <CardTitle className="text-center">No Active Challenges</CardTitle>
                  <CardDescription className="text-center">
                    There are currently no active challenges. New challenges are released weekly!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Bell className="w-4 h-4" />
                    <span>Don't miss out on upcoming challenges.</span>
                  </div>
                  <div className="flex justify-center">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Set Reminder for New Challenges
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Want to be notified when new challenges are available?
                  </p>
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Enable Notifications
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </div>

        <div className="container mx-auto px-4">
          <TabsContent value="upcoming">
            <ScrollArea className="h-[600px] w-full rounded-md border-none p-4">
              {upcomingChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {upcomingChallenges.map((challenge) => (
                    <Card key={challenge.challenge_id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          {challenge.title}
                          <Badge variant="secondary">{challenge.category}</Badge>
                        </CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
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
                            {challenge.participantsCount} est. participants
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="flex items-center">
                            <Image
                              alt="skillcoin-image"
                              src={coin}
                              className="w-8 h-8"
                              width={32}
                              height={32}
                            />
                            {challenge.reward_skillcoins} SkillCoins
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Starts: {challenge.start_date}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Required Skills:</h4>
                          {renderSkillsBadges(challenge.skills)}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={async () => {
                            if (!user) {
                              toast.error("Please login to set reminders");
                              return;
                            }
                            try {
                              await setReminder({
                                user_id: user?.user_id,
                                type: "Challenge",
                                reference_id: challenge.challenge_id,
                                title: challenge.title,
                                datetime: challenge.start_date,
                              });
                              toast.success("Reminder set successfully!");
                            } catch (error) {
                              console.error("Error setting reminder:", error);
                              toast.error("Failed to set reminder. Please try again.");
                            }
                          }}
                          disabled={!user}
                        >
                          {user ? "Set Reminder" : "Please login to set reminders"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="w-full p-6">
                  <CardHeader>
                    <CardTitle className="text-center">No Upcoming Challenges</CardTitle>
                    <CardDescription className="text-center">
                      There are currently no upcoming challenges. Check back soon for new opportunities!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Bell className="w-4 h-4" />
                      <span>We're always working on exciting new challenges. Stay tuned!</span>
                    </div>
                    <div className="flex justify-center">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Get Notified About New Challenges
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Want to be the first to know about new challenges?
                    </p>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      Enable Notifications
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </ScrollArea>
          </TabsContent>
        </div>

        <div className="container mx-auto px-4">
          <TabsContent value="completed">
            <ScrollArea className="h-[600px] w-full rounded-md border-none p-4">
              {completedChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {completedChallenges.map((challenge) => (
                    <Card key={challenge.challenge_id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          {challenge.title}
                          <Badge variant="secondary">{challenge.category}</Badge>
                        </CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
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
                        <div className="flex justify-between items-center mb-4">
                          <span className="flex items-center">
                            <Image
                              alt="skillcoin-image"
                              src={coin}
                              className="w-8 h-8"
                              width={32}
                              height={32}
                            />
                            {challenge.reward_skillcoins} SkillCoins
                          </span>
                          <div className="flex items-center">
                            <span className="mr-2">Winner:</span>
                            <Avatar className="h-6 w-6 mr-1">
                              <AvatarImage
                                src={challenge.winner?.avatar}
                                alt={challenge.winner?.name}
                              />
                              <AvatarFallback>
                                {challenge.winner?.name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>{challenge.winner?.name}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Required Skills:</h4>
                          {renderSkillsBadges(challenge.skills)}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Results
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="w-full p-6">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Lightbulb className="w-16 h-16 text-yellow-400 mb-4" />
                    <h3 className="text-2xl font-bold text-center mb-2">
                      No Completed Challenges Yet
                    </h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Ready to showcase your skills? Start a challenge and see
                      your accomplishments here!
                    </p>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      Explore Challenges
                    </Button>
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

