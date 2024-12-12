import { useState } from 'react';
import { useServiceRequests } from '@/hooks/use-service-requests';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ServiceRequestFormProps {
  serviceId: number;
  providerId: number;
}

export function ServiceRequestForm({ serviceId, providerId }: ServiceRequestFormProps) {
  const { user } = useAuth();
  const { addRequest } = useServiceRequests();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addRequest({
        service_id: serviceId,
        requester_id: user.id,
        provider_id: providerId,
        requirements: formData.get('requirements')
      });
      
      toast.success('Request sent successfully!');
      e.currentTarget.reset();
    } catch (error) {
      toast.error('Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="requirements">Project Requirements</Label>
        <Textarea 
          id="requirements" 
          name="requirements" 
          placeholder="Please describe your specific requirements..."
          required 
        />
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Request'}
      </Button>
    </form>
  );
} 