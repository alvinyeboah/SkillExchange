"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
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
import {
  Loader2,
  Briefcase,
  Award,
  ArrowRight,
  Upload,
  Clock,
  Star,
  Edit,
  Zap,
  Coins,
  FileText,
  LinkIcon,
  Download,
  Eye,
} from "lucide-react";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ServiceForm } from "@/components/forms/service-add";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import coin from "@/public/coin.png";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useChallengeSubmissions } from "@/hooks/use-challenge-submissions";
import { ProtectedRoute } from "@/components/protected-route";
import { useServiceRequests } from "@/hooks/use-service-requests";
import ServiceSubmissionForm from "@/components/forms/ServiceSubmissionForm";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  skillcoin_price: z.number().min(1, {
    message: "Price must be at least 1 SkillCoin.",
  }),
  delivery_time: z.number().min(1, {
    message: "Please specify a delivery time.",
  }),
});

interface DialogOrDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
}

export default function UserDashboard() {
  const { user, isLoading, error, refreshUserData } = useAuth();
  const { editService, fetchServices } = useMarketplace();
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const [submissionLinks, setSubmissionLinks] = useState<{
    [key: string]: string;
  }>({});
  const [submissionType, setSubmissionType] = useState<{
    [key: string]: "file" | "link";
  }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewRequestsDialogOpen, setIsViewRequestsDialogOpen] =
    useState(false);
  const [selectedServiceRequests, setSelectedServiceRequests] = useState<any[]>(
    []
  );
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { submitChallenge } = useChallengeSubmissions();
  const { submitServiceRequest } = useServiceRequests();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      skillcoin_price: 0,
      delivery_time: 0,
    },
  });

  const handleFileChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFiles((prev) => ({ ...prev, [id]: file }));
  };

  const handleLinkChange = (id: number, link: string) => {
    setSubmissionLinks((prev) => ({ ...prev, [id]: link }));
  };

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);

  const handleSubmit = async (
    id: number,
    type: "challenge" | "service" = "service"
  ) => {
    if (type === "challenge") {
      await handleChallengeSubmission(id);
    } else {
      await handleServiceSubmission(id);
    }
  };

  const DialogOrDrawer = ({
    isOpen,
    onClose,
    title,
    description,
    children,
  }: DialogOrDrawerProps) => {
    if (isMobile) {
      return (
        <Drawer open={isOpen} onOpenChange={onClose}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">{children}</div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  };

  const RequestsDialogContent = () => (
    <ScrollArea className="h-[600px] pr-4">
      {selectedServiceRequests && selectedServiceRequests.length > 0 ? (
        <div className="space-y-4">
          {selectedServiceRequests.map((request) => (
            <ServiceRequestContent key={request.request_id} request={request} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">
            No requests for this service yet
          </p>
        </div>
      )}
    </ScrollArea>
  );

  const ServiceRequestContent = ({ request }: { request: any }) => {
    return (
      <Card key={request.request_id}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              Request #{request.request_id}
            </CardTitle>
            <Badge variant={request.status === "pending" ? "secondary" : "default"}>
              {request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Requirements: {request.requirements}
          </p>
          <div className="flex items-center space-x-2 mb-4">
            <img
              src={request.requester.avatar_url}
              alt={request.requester.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{request.requester.username}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Created: {new Date(request.created_at).toLocaleString()}
          </div>
          {request.status === "pending" && (
            <ServiceSubmissionForm
              requestId={request.request_id}
              onSubmit={handleSubmit}
              isSubmitting={submitting === request.request_id}
              status={request.status}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  const submitServiceWork = async (
    requestId: number,
    submissionType: "file" | "link",
    submissionContent: File | string
  ) => {
    // This is a placeholder function. In a real application, you would send this data to your backend API.
    console.log(`Submitting work for request ${requestId}`);
    console.log(`Submission type: ${submissionType}`);
    console.log(`Submission content:`, submissionContent);

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real application, you would update the request status on the server
    // and then update the local state based on the server response.
    setSelectedServiceRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.request_id === requestId
          ? { ...request, status: "submitted" }
          : request
      )
    );
  };

  const handleServiceAdded = async () => {
    await fetchServices();
    setShowServiceForm(false);
  };

  const handleEditService = (service: any) => {
    setEditingService({
      service_id: service.id,
      user_id: user?.user_id,
      ...service,
    });
    form.reset({
      title: service.title,
      description: service.description,
      category: service.category,
      skillcoin_price: service.skillcoin_price,
      delivery_time: service.delivery_time,
    });
    setIsEditDialogOpen(true);
  };

  const onSubmitEdit = async (values: z.infer<typeof formSchema>) => {
    if (!editingService) return;

    try {
      await editService(editingService.id, values);
      toast.success("Service updated successfully");
      setIsEditDialogOpen(false);
      // Refresh the services list or update the local state
    } catch (error) {
      toast.error("Failed to update service");
    }
  };

  const handleViewRequests = (serviceId: number) => {
    const service = user?.services?.find((s) => s.service_id === serviceId);

    if (service) {
      const requestsWithSubmissionType =
        service.requests?.map((request: any) => ({
          ...request,
          submissionType: "file",
        })) || [];

      setSelectedServiceRequests(requestsWithSubmissionType);
    } else {
      toast.error("Service not found");
    }

    setIsViewRequestsDialogOpen(true);
  };

  const handleServiceSubmission = async (requestId: number) => {
    if (!user) {
      toast.error("Please log in to submit");
      return;
    }

    try {
      setSubmitting(requestId);
      const submissionType = selectedFiles[requestId] ? "file" : "link";
      const submissionContent =
        submissionType === "file"
          ? selectedFiles[requestId]
          : submissionLinks[requestId];

      if (!submissionContent) {
        toast.error("Please provide a file or link for submission");
        return;
      }

      // Find the current service request
      const currentRequest = selectedServiceRequests.find(
        (request) => request.request_id === requestId
      );

      if (!currentRequest) {
        throw new Error("Service request not found");
      }

      // Submit the service request using the hook
      await submitServiceRequest({
        service_id: currentRequest.service_id,
        requester_id: currentRequest.requester_id,
        provider_id: user.user_id,
        requirements: currentRequest.requirements,
        budget: currentRequest.budget,
        deadline: currentRequest.deadline,
      });

      toast.success("Work submitted successfully!");

      // Update local state to reflect the submission
      setSelectedServiceRequests((prev) =>
        prev.map((request) =>
          request.request_id === requestId
            ? { ...request, status: "submitted" }
            : request
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to submit work");
    } finally {
      setSubmitting(null);
    }
  };

  const handleChallengeSubmission = async (challengeId: number) => {
    if (!user) {
      toast.error("Please log in to submit");
      return;
    }

    try {
      setSubmitting(challengeId);
      const submissionType = selectedFiles[challengeId] ? "file" : "link";
      const submissionContent =
        submissionType === "file"
          ? selectedFiles[challengeId]
          : submissionLinks[challengeId];

      if (!submissionContent) {
        toast.error("Please provide a file or link for submission");
        return;
      }

      // Convert File to URL if it's a file submission
      let submissionUrl = "";
      let content = "";

      if (submissionType === "file") {
        submissionUrl = URL.createObjectURL(submissionContent as File);
      } else {
        content = submissionContent as string;
      }

      // Use the submitChallenge function from the hook
      await submitChallenge({
        challenge_id: challengeId,
        user_id: user.user_id,
        content: content,
        submission_url: submissionUrl,
      });

      toast.success("Challenge submitted successfully!");

      // Update local state to reflect submission
      const updatedChallenges =
        user?.challengeParticipation?.map((challenge) =>
          challenge.challenge_id === challengeId
            ? { ...challenge, progress: 100 }
            : challenge
        ) || [];

      // Update user state with new challenge progress
      // Note: You'll need to implement this update in your user context/state management
      // refetch user challenges
      refreshUserData();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit challenge");
    } finally {
      setSubmitting(null);
    }
  };
  const handleSubmissionTypeChange = (id: number, type: "file" | "link") => {
    setSubmissionType((prev) => ({
      ...prev,
      [id]: type,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const EditServiceContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Service title" {...field} />
              </FormControl>
              <FormDescription>
                Give your service a clear and concise title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your service in detail"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of your service.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best fits your service.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skillcoin_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (SkillCoins)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Set the price for your service in SkillCoins.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="delivery_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Time</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3 days" {...field} />
              </FormControl>
              <FormDescription>
                Specify how long it will take to deliver the service.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Service</Button>
      </form>
    </Form>
  );

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-primary/10 to-primary/30 p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl mb-6 text-primary-foreground">
            Manage your services, track your challenges, and grow your skills
            all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="default">
              <Link href="/marketplace">
                <Briefcase className="mr-2 h-5 w-5" />
                Explore Marketplace
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/challenges">
                <Award className="mr-2 h-5 w-5" />
                Join Challenges
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                My SkillCoins
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {user?.skillcoins !== undefined ? (
                <>
                  <div className="text-2xl font-bold">{user.skillcoins}</div>
                  <p className="text-xs text-muted-foreground">
                    Available to spend
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Loading SkillCoins...
                  </p>
                </div>
              )}
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
              {user?.services !== undefined ? (
                <>
                  <div className="text-2xl font-bold">
                    {user?.services?.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user?.services?.length} total services
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-20">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    No active services
                  </p>
                </div>
              )}
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
              {user?.challengeParticipation !== undefined ? (
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-3xl font-bold">
                      {user.challengeParticipation.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Participating Challenges
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-primary">
                      {user.completedChallengesCount || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-20">
                  <Award className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    No challenges yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-services">My Services</TabsTrigger>
            <TabsTrigger value="services-requested">
              Services I Requested
            </TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          <TabsContent value="my-services" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">My Services</h2>
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user?.services && user.services.length > 0 ? (
                  user.services.map((service, index) => (
                    <Card
                      key={service.service_id || index}
                      className="flex flex-col"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">
                            {service.title}
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                            onClick={() =>
                              handleViewRequests(service.service_id)
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {service.requests?.length || 0} Requests
                          </Button>
                        </div>
                        <Badge variant="outline">
                          {service.category.charAt(0).toUpperCase() +
                            service.category.slice(1).toLowerCase()}
                        </Badge>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                          {service.description}
                        </p>
                        <div className="flex justify-between items-center mb-4 text-sm">
                          <span className="flex items-center">
                            <Image
                              alt="skillcoin-image"
                              src={coin}
                              className="w-8 h-8 mr-2"
                              width={32}
                              height={32}
                            />
                            {service.skillcoin_price} SkillCoins
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.delivery_time}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {user.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className="ml-auto flex items-center"
                          >
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {user.rating}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Service
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center h-[300px]">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">
                      No services created yet
                    </p>
                    <Button
                      onClick={() => setShowServiceForm(true)}
                      className="mt-4"
                    >
                      Create Your First Service
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
            <Button onClick={() => setShowServiceForm(true)}>
              Add New Service
            </Button>
          </TabsContent>
          <TabsContent value="services-requested" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">
              Services I Requested
            </h2>
            <ScrollArea className="h-[400px]">
              {user?.requestedServices && user?.requestedServices.length > 0 ? (
                user?.requestedServices.map((request) => (
                  <Card key={request.request_id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{request.service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{request.service.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <Badge>{request.status}</Badge>
                        <span className="font-semibold">
                          {request.service.skillcoin_price} SkillCoins
                        </span>
                      </div>
                      {request.status === "completed" && (
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    You haven't requested any services yet
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/marketplace">Request a Service</Link>
                  </Button>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="challenges" className="space-y-6 h-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">
                Participating Challenges
              </h2>
            </div>
            <ScrollArea className="h-[600px] pr-4">
              {user?.challengeParticipation &&
              user.challengeParticipation.length > 0 ? (
                <div className="space-y-4">
                  {user.challengeParticipation.map((challenge) => (
                    <Card key={challenge.challenge_id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl">
                            {challenge.challenge.title}
                          </CardTitle>
                          <Badge
                            variant={
                              challenge.progress === 100
                                ? "default"
                                : "secondary"
                            }
                          >
                            {challenge.progress === 100
                              ? "Completed"
                              : "In Progress"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {challenge.challenge.description}
                        </p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">
                            {challenge.progress}%
                          </span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSubmissionTypeChange(
                                  challenge.challenge_id,
                                  "file"
                                )
                              }
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              File Upload
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSubmissionTypeChange(
                                  challenge.challenge_id,
                                  "link"
                                )
                              }
                            >
                              <LinkIcon className="w-4 h-4 mr-2" />
                              Submit Link
                            </Button>
                          </div>
                          {submissionType[challenge.challenge_id] === "file" ? (
                            <div>
                              <Label
                                htmlFor={`file-${challenge.challenge_id}`}
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Upload your submission
                              </Label>
                              <Input
                                id={`file-${challenge.challenge_id}`}
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(challenge.challenge_id, e)
                                }
                                ref={(el) => {
                                  fileInputRefs.current[
                                    challenge.challenge_id
                                  ] = el;
                                }}
                                className="border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-auto"
                              />
                            </div>
                          ) : (
                            <div>
                              <Label
                                htmlFor={`link-${challenge.challenge_id}`}
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Submit link to your work
                              </Label>
                              <Input
                                id={`link-${challenge.challenge_id}`}
                                type="url"
                                placeholder="https://example.com/your-work"
                                onChange={(e) =>
                                  handleLinkChange(
                                    challenge.challenge_id,
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-primary mr-2" />
                          <span className="font-semibold">
                            {challenge.challenge.reward_skillcoins} SkillCoins
                          </span>
                        </div>
                        <Button
                          onClick={() =>
                            handleSubmit(challenge.challenge_id, "challenge")
                          }
                          disabled={
                            challenge.progress === 100 ||
                            submitting === challenge.challenge_id ||
                            (!selectedFiles[challenge.challenge_id] &&
                              !submissionLinks[challenge.challenge_id])
                          }
                        >
                          {submitting === challenge.challenge_id ? (
                            <>Submitting...</>
                          ) : (
                            <>
                              {challenge.progress === 100
                                ? "Submitted"
                                : "Submit Challenge"}
                              {selectedFiles[challenge.challenge_id] ||
                              submissionLinks[challenge.challenge_id] ? (
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
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <Award className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No active challenges
                  </p>
                  <Link href="/challenges">
                    <Button className="mt-4">Find Your First Challenge</Button>
                  </Link>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {showRequestForm && (
          <DialogOrDrawer
            isOpen={showRequestForm}
            onClose={() => setShowRequestForm(false)}
            title="Request New Service"
            description="Fill in the details to request a service"
          >
            <ServiceRequestForm
              providerId=""
              onClose={() => setShowRequestForm(false)}
            />
          </DialogOrDrawer>
        )}

        {showServiceForm && (
          <DialogOrDrawer
            isOpen={showServiceForm}
            onClose={() => setShowServiceForm(false)}
            title="Create New Service"
            description="Fill in the details to create your new service"
          >
            <ServiceForm serviceAdded={handleServiceAdded} />
          </DialogOrDrawer>
        )}

        <DialogOrDrawer
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit Service"
          description="Make changes to your service here."
        >
          <EditServiceContent />
        </DialogOrDrawer>

        <DialogOrDrawer
          isOpen={isViewRequestsDialogOpen}
          onClose={() => setIsViewRequestsDialogOpen(false)}
          title="Service Requests"
          description="View and manage requests for your service"
        >
          <RequestsDialogContent />
        </DialogOrDrawer>
      </div>
    </ProtectedRoute>
  );
}
