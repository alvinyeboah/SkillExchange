import { useState } from 'react';
import { useServices } from '@/hooks/use-services';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function ServiceForm() {
  const { user } = useAuth();
  const { addService } = useServices();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addService({
        user_id: user.id,
        title: formData.get('title'),
        description: formData.get('description'),
        skillcoin_price: Number(formData.get('price')),
        delivery_time: Number(formData.get('delivery_time')),
        tags: formData.get('tags')?.toString().split(','),
        requirements: formData.get('requirements'),
        revisions: Number(formData.get('revisions'))
      });
      
      toast.success('Service created successfully!');
      e.currentTarget.reset();
    } catch (error) {
      toast.error('Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      
      <div>
        <Label htmlFor="price">Price (SkillCoins)</Label>
        <Input id="price" name="price" type="number" min="0" required />
      </div>
      
      <div>
        <Label htmlFor="delivery_time">Delivery Time (days)</Label>
        <Input id="delivery_time" name="delivery_time" type="number" min="1" required />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" placeholder="web,design,marketing" />
      </div>
      
      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea id="requirements" name="requirements" />
      </div>
      
      <div>
        <Label htmlFor="revisions">Number of Revisions</Label>
        <Input id="revisions" name="revisions" type="number" min="1" defaultValue="1" />
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Service'}
      </Button>
    </form>
  );
} 