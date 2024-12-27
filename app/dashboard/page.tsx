"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { Loader2, Briefcase, Award, ArrowRight, Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { ServiceRequestForm } from "@/components/forms/service-request";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ServiceForm } from "@/components/forms/service-form";
import { Progress } from "@/components/ui/progress";
import { createChallengeSubmission } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserDashboard() {
  const { stats, isLoading, error, fetchDashboardStats } = useDashboardStore();
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const handleFileChange = (
    challengeId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFiles((prev) => ({ ...prev, [challengeId]: file }));
  };
  const { user } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardStats(user.id);
    }
  }, [fetchDashboardStats, user?.id]);

  console.log(stats);

  const handleSubmit = async (challengeId: number) => {
    if (!user) {
      toast.error("Please log in to submit challenges");
      return;
    }

    try {
      setSubmitting(challengeId.toString());

      await createChallengeSubmission({
        challenge_id: challengeId,
        user_id: user.id,
        content: "",
        submission_url: "",
      });

      toast.success("Challenge submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit challenge");
    } finally {
      setSubmitting(null);
    }
  };

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
            <CardTitle className="text-sm font-medium">My SkillCoins</CardTitle>
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
            <div className="text-2xl font-bold">
              {stats?.active_services || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.my_services?.length || 0} total services
            </p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-md h-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
              Challenge Progress
            </CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-3xl font-bold">
                  {stats?.participating_challenges?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">

                  Participating Challenges
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-primary">
                  {stats?.completed_challenges || 0}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            {/* <Progress value={100} className="h-2 mt-2" /> */}
          </CardContent>
          {/* <CardFooter>
            <Button className="w-full" onClick={() => {}}>
              Submit Challenge
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter> */}
        </Card>
      </div>

      <Tabs defaultValue="my-services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-services">My Services</TabsTrigger>
          <TabsTrigger value="requested-services">
            Requested Services
          </TabsTrigger>
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
                    <span className="font-semibold">
                      {service.price} SkillCoins
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <Button onClick={() => setShowServiceForm(true)}>
            Add New Service
          </Button>
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
                    <span className="font-semibold">
                      {service.price} SkillCoins
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <Button onClick={() => setShowRequestForm(true)}>
            Request New Service
          </Button>
        </TabsContent>
        <TabsContent value="challenges" className="space-y-6 h-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Participating Challenges</h2>
            <Link href="/challenges">
              <Button variant="outline">Find New Challenges</Button>
            </Link>
          </div>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {stats?.participating_challenges?.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">
                        {challenge.title}
                      </CardTitle>
                      <Badge
                        variant={
                          challenge.status === "Completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {challenge.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {challenge.description}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress(based on no submission)</span>
                      <span className="text-sm font-medium">
                        15%
                      </span>
                    </div>
                    <Progress value={15} className="h-2" />
                    <div className="mt-4">
                      <Label
                        htmlFor={`file-${challenge.id}`}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Upload your submission
                      </Label>
                      <Input
                        id={`file-${challenge.id}`}
                        type="file"
                        onChange={(e) => handleFileChange(challenge.id, e)}
                        ref={(el) => {
                          fileInputRefs.current[challenge.id] = el;
                        }}
                        className=" border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-auto"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-2" />
                      <span className="font-semibold">
                        {challenge.reward} SkillCoins
                      </span>
                    </div>
                    <Button
                      onClick={() => handleSubmit(challenge.id)}
                      disabled={
                        challenge.status === "Completed" ||
                        submitting === challenge.id.toString() ||
                        !selectedFiles[challenge.id]
                      }
                    >
                      {submitting === challenge.id.toString() ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          {challenge.status === "Completed"
                            ? "Submitted"
                            : "Submit Challenge"}
                          {selectedFiles[challenge.id] ? (
                            <Upload className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowRight className="ml-2 h-4 w-4" />
                          )}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {showRequestForm && (
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request New Service</DialogTitle>
              <DialogDescription>
                Fill in the details to request a service
              </DialogDescription>
            </DialogHeader>
            <ServiceRequestForm onClose={() => setShowRequestForm(false)} />
          </DialogContent>
        </Dialog>
      )}

      {showServiceForm && (
        <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Fill in the details to create your new service
              </DialogDescription>
            </DialogHeader>
            <ServiceForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
