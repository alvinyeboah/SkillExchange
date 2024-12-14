'use client'

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Globe, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useServices } from "@/hooks/use-services"
import { useAuth } from "@/hooks/use-auth"
import { ServiceRequestForm } from "@/components/forms/service-request"

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ServiceDetailsPage(props: ServiceDetailsPageProps) {
  const params = use(props.params)
  const { id } = params
  const { services } = useServices()
  const { user } = useAuth()
  const service = services.find((s) => s.service_id === Number(id))

  if (!service) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
          <div className="flex items-center mb-6">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={service.user.avatar_url} alt={service.user.name} />
              <AvatarFallback>{service.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{service.user.name}</p>
              <p className="text-sm text-muted-foreground">Service Provider</p>
            </div>
          </div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-lg mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{service.category}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{service.delivery_time} days delivery</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Request this service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-2xl font-bold">{service.skillcoin_price} SkillCoins</p>
                <Badge variant="secondary" className="mt-2">
                  {service.category}
                </Badge>
              </div>
              {user ? (
                <ServiceRequestForm
                  serviceId={service.service_id}
                  providerId={service.user_id}
                />
              ) : (
                <div className="text-center">
                  <p className="mb-4">You need to be signed in to request services.</p>
                  <Link href="/auth/signin">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </div>
              )}
            </CardContent>
            {!user && (
              <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

