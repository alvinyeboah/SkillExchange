'use client'
import { use } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useServices } from "@/hooks/use-services"
import { useAuth } from "@/hooks/use-auth"
import { ServiceRequestForm } from "@/components/forms/service-request"
import Link from "next/link"

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
      <h1 className="text-2xl font-bold mb-6">{service.title}</h1>
      <p className="mb-6">{service.description}</p>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Request This Service</CardTitle>
          <CardDescription>
            {user
              ? "Fill out the form below to request this service."
              : "Sign in to request this service."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <ServiceRequestForm
              serviceId={service.service_id}
              providerId={service.user_id}
            />
          ) : (
            <div className="text-center">
              <p className="mb-4">You need to be signed in to request services.</p>
              <Link href="auth/signin">
                <Button>Sign In</Button>
              </Link>
            </div>
          )}
        </CardContent>
        {!user && (
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

