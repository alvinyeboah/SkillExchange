import { useState } from "react";
import { useChallengeSubmissions } from "@/hooks/use-challenge-submissions";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ChallengeSubmissionFormProps {
  challengeId: number;
}

export function ChallengeSubmissionForm({
  challengeId,
}: ChallengeSubmissionFormProps) {
  const { user } = useAuth();
  const { addSubmission } = useChallengeSubmissions();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await addSubmission({
        challenge_id: challengeId,
        user_id: user?.user_id,
        content: formData.get("content"),
        submission_url: formData.get("submission_url"),
      });

      toast.success("Submission created successfully!");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Failed to create submission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="content">Submission Details</Label>
        <Textarea id="content" name="content" required />
      </div>

      <div>
        <Label htmlFor="submission_url">Project URL (optional)</Label>
        <Input id="submission_url" name="submission_url" type="url" />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Challenge"}
      </Button>
    </form>
  );
}
