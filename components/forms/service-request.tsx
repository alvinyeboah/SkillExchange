"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useServiceRequests } from "@/hooks/use-service-requests";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

const formSchema = z.object({
  requirements: z
    .string()
    .min(5, { message: "Requirements must be at least 5 characters." })
    .max(500, { message: "Requirements must not exceed 500 characters." })
    .optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

interface ServiceRequestFormProps {
  serviceId?: number;
  providerId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ServiceRequestForm({
  serviceId,
  providerId,
  isOpen,
  onClose,
}: ServiceRequestFormProps) {
  const { user } = useAuth();
  const { addRequest } = useServiceRequests();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requirements: "",
      deadline: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await addRequest({
        service_id: serviceId,
        requester_id: user.id,
        provider_id: providerId,
        requirements: values.requirements,
        deadline: new Date(values.deadline).toISOString(),
      });

      toast.success("Request sent successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to send request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your specific requirements..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Be as specific as possible to help the service provider
                understand your needs.
              </FormDescription>
              <FormMessage />
              <div className="text-sm text-muted-foreground mt-2">
                {field?.value?.length}/500 characters
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Choose a date you'd like the project completed by.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Request
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
