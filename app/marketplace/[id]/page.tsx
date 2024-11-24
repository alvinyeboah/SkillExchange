"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMarketplace } from '@/hooks/use-marketplace'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Clock, Coins, MessageSquare, Star, ThumbsUp, Award } from 'lucide-react'

export default function ServiceDetails() {
  const params = useParams()
  const router = useRouter()
  const { fetchServiceById } = useMarketplace()
  const [service, setService] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  
  
  useEffect(() => {
    const serviceId = params?.id as string
    
    if (serviceId) {
      setIsLoading(true)
      fetchServiceById(serviceId)
        .then(setService)
        .catch(() => toast.error("Failed to load service details"))
        .finally(() => setIsLoading(false))
    } else {
      router.push('/marketplace')
    }
  }, [params?.id, fetchServiceById, router])
  console.log(service, "here")

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
        <p>The requested service could not be found. It may have been removed or you may have followed an invalid link.</p>
        <Button className="mt-4" onClick={() => router.push('/marketplace')}>Return to Marketplace</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
      <Badge variant="secondary" className="mb-8">{service.category}</Badge>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Service Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={service.user?.avatar_url} />
                  <AvatarFallback>{service.user?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{service.user?.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{service.user?.rating} ({service.user?.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">{service.user?.bio}</p>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {service.reviews?.map((review: any, index: number) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={review.user.avatar_url} />
                      <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{review.user.name}</span>
                    <div className="ml-auto flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-500" />
                  <span className="font-semibold">{service.skillcoin_price} SkillCoins</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Delivery in {service.delivery_time}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                  <span>{service.order_count} orders in queue</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-5 h-5 mr-2 text-purple-500" />
                  <span>{service.satisfaction_rate}% satisfaction rate</span>
                </div>
                {service.badges?.map((badge: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-indigo-500" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Request This Service</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}