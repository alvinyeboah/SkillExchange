import { useState } from 'react';
import { useCommunities } from '@/hooks/use-communities';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function CommunityForm() {
  const { user } = useAuth();
  const { addCommunity } = useCommunities();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addCommunity({
        name: formData.get('name'),
        description: formData.get('description'),
        creator_id: user.id
      });
      
      toast.success('Community created successfully!');
      e.currentTarget.reset();
    } catch (error) {
      toast.error('Failed to create community');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Community Name</Label>
        <Input id="name" name="name" required />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Community'}
      </Button>
    </form>
  );
} 