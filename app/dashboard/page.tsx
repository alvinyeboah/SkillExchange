"use client";

import { useState, useRef, useEffect } from "react";
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
import { ServiceForm } from "@/components/forms/service-form";
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

export default function UserDashboard() {
  const { user, isLoading, error } = useAuth();
  const { addSubmission } = useChallengeSubmissions();
  const { editService } = useMarketplace();

  const [submitting, setSubmitting] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

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
    challengeId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFiles((prev) => ({ ...prev, [challengeId]: file }));
  };

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);

  const handleSubmit = async (challengeId: number) => {
    if (!user) {
      toast.error("Please log in to submit challenges");
      return;
    }

    try {
      setSubmitting(challengeId);

      await addSubmission({
        challenge_id: challengeId,
        user_id: user.user_id,
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

 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // if (!isLoading && user && !user.email) {
  //   return (


  //     <div className="container mx-auto py-10">
  //       <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
  //         Please complete your profile with an email address to access the
  //         dashboard.
  //         <Button asChild className="ml-4">
  //           <Link href="/profile">Complete Profile</Link>
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

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
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My SkillCoins</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
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
                <div className="text-2xl font-bold">{user.services.length}</div>
                <p className="text-xs text-muted-foreground">
                  {user.services.length} total services
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
          <TabsTrigger value="requested-services">
            Requested Services
          </TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="my-services" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">My Services</h2>
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user?.services && user.services.length > 0 ? (
                user.services.map((service, index) => (
                  <Card key={service.id || index} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge variant="secondary">
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
                        <span className="text-sm font-medium">{user.name}</span>
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
        <TabsContent value="requested-services" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Requested Services</h2>
          <ScrollArea className="h-[400px]">
            {user?.requestedServices && user?.requestedServices?.length > 0 ? (
              user.requestedServices.map((service) => (
                <Card key={service?.service_id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{service.service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{service.service.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge>{service.status}</Badge>
                      <span className="font-semibold">
                        {service.service.skillcoin_price} SkillCoins
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  No requested services yet
                </p>
                <Button asChild className="mt-4">
                  <Link href="/marketplace">Request Your First Service</Link>
                </Button>
              </div>
            )}
          </ScrollArea>
          {/* <Button onClick={() => setShowRequestForm(true)}>
            Request New Service
          </Button> */}
        </TabsContent>
        <TabsContent value="challenges" className="space-y-6 h-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Participating Challenges</h2>
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
                            challenge.progress === 100 ? "default" : "secondary"
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
                        <span className="text-sm font-medium">
                          Progress(based on no submission)
                        </span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                      <div className="mt-4">
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
                            fileInputRefs.current[challenge.challenge_id] = el;
                          }}
                          className=" border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-auto"
                        />
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
                        onClick={() => handleSubmit(challenge.challenge_id)}
                        disabled={
                          challenge.progress === 100 ||
                          submitting === challenge.challenge_id ||
                          !selectedFiles[challenge.challenge_id]
                        }
                      >
                        {submitting === challenge.challenge_id ? (
                          <>Submitting...</>
                        ) : (
                          <>
                            {challenge.progress === 100
                              ? "Submitted"
                              : "Submit Challenge"}
                            {selectedFiles[challenge.challenge_id] ? (
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
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request New Service</DialogTitle>
              <DialogDescription>
                Fill in the details to request a service
              </DialogDescription>
            </DialogHeader>
            <ServiceRequestForm
              providerId=""
              onClose={() => setShowRequestForm(false)}
            />
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

      {isMobile ? (
        <Drawer open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Service</DrawerTitle>
              <DrawerDescription>
                Make changes to your service here.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <EditServiceContent />
            </div>
            <DrawerFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Make changes to your service here.
              </DialogDescription>
            </DialogHeader>
            <EditServiceContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
    </ProtectedRoute>
  );
}
