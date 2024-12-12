"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

import { ErrorDisplay } from "@/components/ui/error-display";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useCommunityStore } from "@/hooks/useCommunityStore";
import { CommunityForm } from "@/components/forms/community-form";
import { useCommunities } from "@/hooks/use-communities";

export default function CommunityPage() {
  const { communityStats, isLoading, error, fetchCommunityStats } =
    useCommunityStore();
  const { communities, fetchCommunities } = useCommunities();

  useEffect(() => {
    fetchCommunityStats();
    fetchCommunities();
  }, [fetchCommunityStats, fetchCommunities]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Communities</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Community</h2>
          <CommunityForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Communities</h2>
          {communities.map((community) => (
            <div key={community.community_id} className="mb-4">
              <h3 className="font-bold">{community.name}</h3>
              <p>{community.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
