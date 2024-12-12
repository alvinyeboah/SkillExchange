"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  Coins,
  MessageSquare,
  Star,
  ThumbsUp,
  Award,
} from "lucide-react";
import { ServiceRequestForm } from "@/components/forms/service-request";
import { useServices } from "@/hooks/use-services";
import { useAuth } from "@/hooks/use-auth";

interface ServiceDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = params;
  const { services } = useServices();
  const { user } = useAuth();
  const service = services.find((s) => s.service_id === Number(id));

  if (!service) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{service.title}</h1>
      <p>{service.description}</p>

      {user && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Request This Service</h2>
          <ServiceRequestForm
            serviceId={service.service_id}
            providerId={service.user_id}
          />
        </div>
      )}
    </div>
  );
}
