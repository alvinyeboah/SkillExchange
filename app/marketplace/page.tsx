"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMarketplace } from '@/hooks/use-marketplace'
import { toast } from 'sonner'
import { Search, Filter, Clock, Coins, Star } from 'lucide-react'

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
    setSelectedCategory
  } = useMarketplace()
  
  const [newListing, setNewListing] = useState({ 
    title: '', 
    description: '', 
    skillcoinPrice: '', 
    deliveryTime: '', 
    category: '' 
  })

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createNewService({
        ...newListing,
        skillcoinPrice: Number(newListing.skillcoinPrice)
      })
      setNewListing({ 
        title: '', 
        description: '', 
        skillcoinPrice: '', 
        deliveryTime: '', 
        category: '' 
      })
      toast.success("Service created successfully")
    } catch (error) {
      toast.error("Failed to create service")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Skill Marketplace</h1>
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
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Card key={service.service_id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <Badge variant="secondary">{service.category}</Badge>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="flex items-center">
                      <Coins className="w-4 h-4 mr-1" />
                      {service.skillcoin_price} SkillCoins
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.delivery_time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={service?.user?.avatar} />
                      <AvatarFallback>{service?.user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{service?.user?.username}</span>
                    <Badge variant="secondary" className="ml-auto flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {service?.user?.rating}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Request Service</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="post">
          <Card>
            <CardHeader>
              <CardTitle>Post a New Service</CardTitle>
              <CardDescription>Share your skills with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setNewListing({ ...newListing, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
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
                      onChange={(e) => setNewListing({ ...newListing, skillcoinPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                    <Input
                      id="deliveryTime"
                      value={newListing.deliveryTime}
                      onChange={(e) => setNewListing({ ...newListing, deliveryTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Post Service</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

