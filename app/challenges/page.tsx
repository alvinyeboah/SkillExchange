"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useChallengesStore } from '@/hooks/use-challenges-store'
import { useReminders } from '@/hooks/use-reminders-store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Clock, Trophy, Users, Zap } from 'lucide-react'
import { toast } from 'sonner'

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
    participateInChallenge
  } = useChallengesStore();
  const { setReminder } = useReminders();

  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    reward_skillcoins: '',
    difficulty: '',
    category: '',
    skills: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleNewChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createChallenge({
        ...newChallenge,
        reward_skillcoins: parseInt(newChallenge.reward_skillcoins),
        skills: newChallenge.skills.split(',').map(skill => skill.trim()),
        status: 'upcoming'
      });
      
      setNewChallenge({
        title: '',
        description: '',
        reward_skillcoins: '',
        difficulty: '',
        category: '',
        skills: '',
        start_date: '',
        end_date: '',
      });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleJoinChallenge = async (challengeId: number) => {
    if (!user) {
      toast.error('Please login to join challenges');
      return;
    }

    try {
      await participateInChallenge(challengeId, user.id);
    } catch (error) {
      // Error is handled by the store
    }
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
      <h1 className="text-4xl font-bold mb-8">SkillCoin Challenges</h1>
      <p className="text-xl mb-8">Participate in exciting challenges to earn SkillCoins and improve your skills!</p>
      
      <Tabs defaultValue="active" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Challenges</TabsTrigger>
          <TabsTrigger value="completed">Completed Challenges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeChallenges.map((challenge) => (
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
                    <Badge variant={challenge.difficulty === 'Hard' ? 'destructive' : 'default'}>
                      {challenge.difficulty}
                    </Badge>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.participants} participants
                    </span>
                  </div>
                  <Progress value={challenge.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">{challenge.progress}% completed</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      {challenge.reward_skillcoins} SkillCoins
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(challenge.end_date).toUTCString()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Top Participants:</h4>
                    <div className="flex justify-between">
                      {challenge.topParticipants?.map((participant, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <Avatar className="h-10 w-10 mb-1">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{participant.name}</span>
                          <span className="text-xs text-muted-foreground">{participant.progress}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleJoinChallenge(challenge.challenge_id)}>Join Challenge</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
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
                    <Badge variant={challenge.difficulty === 'Hard' ? 'destructive' : 'default'}>
                      {challenge.difficulty}
                    </Badge>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.participants} est. participants
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      {challenge.reward_skillcoins} SkillCoins
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Starts: {challenge.start_date}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge?.skills?.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={async () => {
                      if (!user) {
                        toast.error('Please login to set reminders');
                        return;
                      }
                      try {
                        await setReminder({
                          userId: user.id,
                          type: 'challenge',
                          referenceId: challenge.challenge_id,
                          title: challenge.title,
                          datetime: challenge.start_date,
                        });
                      } catch (error) {
                        console.error('Error setting reminder:', error);
                      }
                    }}
                  >
                    Set Reminder
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
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
                    <Badge variant={challenge.difficulty === 'Hard' ? 'destructive' : 'default'}>
                      {challenge.difficulty}
                    </Badge>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {challenge.participants} participants
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      {challenge.reward_skillcoins} SkillCoins
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">Winner:</span>
                      <Avatar className="h-6 w-6 mr-1">
                        <AvatarImage src={challenge.winner?.avatar} alt={challenge.winner?.name} />
                        <AvatarFallback>{challenge.winner?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span>{challenge.winner?.name}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Results</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Propose a New Challenge</h2>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleNewChallengeSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input 
                    id="title" 
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reward">Reward (SkillCoins)</Label>
                  <Input 
                    id="reward" 
                    type="number"
                    value={newChallenge.reward_skillcoins}
                    onChange={(e) => setNewChallenge({...newChallenge, reward_skillcoins: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Input 
                    id="difficulty" 
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={newChallenge.category}
                    onChange={(e) => setNewChallenge({...newChallenge, category: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                  <Input 
                    id="skills" 
                    value={newChallenge.skills}
                    onChange={(e) => setNewChallenge({...newChallenge, skills: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    value={newChallenge.start_date}
                    onChange={(e) => setNewChallenge({...newChallenge, start_date: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    type="date"
                    value={newChallenge.end_date}
                    onChange={(e) => setNewChallenge({...newChallenge, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="mt-4">Propose Challenge</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

