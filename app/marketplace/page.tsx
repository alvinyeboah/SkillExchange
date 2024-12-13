"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMarketplace } from "@/hooks/use-marketplace";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Clock,
  Coins,
  Star,
  TrendingUp,
  Award,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ServiceForm } from "@/components/forms/service-form";
import { useServices } from "@/hooks/use-services";
import Image from "next/image";
import coin from "@/public/coin.png";
import { useAuth } from "@/hooks/use-auth";

export default function Marketplace() {
  const {
    filteredServices,
    isLoading,
    error,
    searchTerm,
    selectedCategory,
    fetchServices,
    createNewService,
    setSearchTerm,
    setSelectedCategory,
  } = useMarketplace();

  const { services, fetchServices: fetchServicesFromServices } = useServices();
  const { user } = useAuth();
  const router = useRouter();
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    skillcoinPrice: "",
    deliveryTime: "",
    category: "",
  });

  useEffect(() => {
    fetchServices();
    fetchServicesFromServices();
  }, [fetchServices, fetchServicesFromServices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewService({
        ...newListing,
        skillcoinPrice: Number(newListing.skillcoinPrice),
      });
      setNewListing({
        title: "",
        description: "",
        skillcoinPrice: "",
        deliveryTime: "",
        category: "",
      });
      toast.success("Service created successfully");
    } catch (error) {
      toast.error("Failed to create service");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Skill Marketplace</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Discover, share, and grow your skills
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Marketplace Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Top Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Web Development</span>
                  <Badge>Hot</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>Data Science</span>
                  <Badge variant="outline">Trending</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>UI/UX Design</span>
                  <Badge variant="secondary">Popular</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Top Earners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  {
                    name: "Alice Smith",
                    coins: 5000,
                    avatar: "/avatars/alice.jpg",
                  },
                  {
                    name: "Bob Johnson",
                    coins: 4500,
                    avatar: "/avatars/bob.jpg",
                  },
                  {
                    name: "Carol Williams",
                    coins: 4000,
                    avatar: "/avatars/carol.jpg",
                  },
                ].map((user, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {user.coins} SC
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-500" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Users</span>
                  <span className="font-semibold">10,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Services Offered</span>
                  <span className="font-semibold">5,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Skills Exchanged</span>
                  <span className="font-semibold">25,000+</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  Post a Service
                </Button>
                <Button className="w-full" variant="outline">
                  Find a Mentor
                </Button>
                <Button className="w-full" variant="outline">
                  Join a Skill Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Services</TabsTrigger>
          <TabsTrigger value="post">Post a Service</TabsTrigger>
        </TabsList>
        <TabsContent value="browse">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 w-full sm:w-64"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <Card key={service.service_id || index} className="flex flex-col">
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
                        className="w-8 h-8"
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
                      <AvatarImage src={service?.user.avatar_url} />
                      <AvatarFallback>{service?.user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {service?.user?.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="ml-auto flex items-center"
                    >
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {service?.user?.rating}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push(`/marketplace/${service.service_id}`)
                    }
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="post">
          <Card>
            <CardHeader>
              <CardTitle>Post a New Service</CardTitle>
              <CardDescription>
                Share your skills with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newListing.title}
                    onChange={(e) =>
                      setNewListing({ ...newListing, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newListing.description}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewListing({ ...newListing, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skillCoins">SkillCoins</Label>
                    <Input
                      id="skillCoins"
                      type="number"
                      value={newListing.skillcoinPrice}
                      onChange={(e) =>
                        setNewListing({
                          ...newListing,
                          skillcoinPrice: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                    <Input
                      id="deliveryTime"
                      value={newListing.deliveryTime}
                      onChange={(e) =>
                        setNewListing({
                          ...newListing,
                          deliveryTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!user}
                onMouseOver={() =>
                  !user && toast.info("You need to sign in to post a service")
                }
              >
                Post Service
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  1
                </div>
                Browse Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Explore a wide range of skills and services offered by our
                community members. Use filters to find exactly what you need.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  2
                </div>
                Request or Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Request services that match your needs or offer your own skills
                to help others. Negotiate terms directly with other users.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  3
                </div>
                Exchange Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Complete the service exchange, rate your experience, and earn or
                spend SkillCoins. Build your reputation in the community.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
